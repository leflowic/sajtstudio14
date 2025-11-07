import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Music, ArrowLeft, Mail, Lock, CheckCircle2 } from "lucide-react";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VerificationModal } from "@/components/VerificationModal";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, "Korisničko ime mora imati najmanje 3 karaktera"),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
});

const registerSchema = insertUserSchema.extend({
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Lozinke se ne poklapaju",
  path: ["passwordConfirm"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Unesite validnu email adresu"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Unesite validnu email adresu"),
  token: z.string().length(6, "Kod mora imati tačno 6 cifara"),
  newPassword: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Lozinke se ne poklapaju",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type ViewMode = "auth" | "forgot-password" | "reset-password" | "reset-success";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  const initialTab = location === "/registracija" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [viewMode, setViewMode] = useState<ViewMode>("auth");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{ id: number; email: string } | null>(null);
  const [resetUserEmail, setResetUserEmail] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user !== null) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLoginSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    const { passwordConfirm, ...registerData } = data;
    try {
      const result = await registerMutation.mutateAsync(registerData);
      setRegisteredUser({ id: result.id, email: result.email });
      setShowVerificationModal(true);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setRegisteredUser(null);
    setLocation("/");
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      return await apiRequest("POST", "/api/forgot-password", data);
    },
    onSuccess: () => {
      const email = forgotPasswordForm.getValues("email");
      setResetUserEmail(email);
      // Pre-fill email in reset password form
      resetPasswordForm.setValue("email", email);
      setViewMode("reset-password");
      toast({
        title: "Email poslat",
        description: "Kod za resetovanje lozinke je poslat na vašu email adresu.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Greška",
        description: error.message || "Došlo je do greške. Molimo pokušajte ponovo.",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      return await apiRequest("POST", "/api/reset-password", {
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      setViewMode("reset-success");
      toast({
        title: "Uspešno!",
        description: "Lozinka je uspešno promenjena. Sada se možete prijaviti.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Greška",
        description: error.message || "Došlo je do greške. Molimo pokušajte ponovo.",
      });
    },
  });

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPasswordMutation.mutateAsync(data);
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    await resetPasswordMutation.mutateAsync(data);
  };

  const handleBackToLogin = () => {
    setViewMode("auth");
    setActiveTab("login");
    forgotPasswordForm.reset();
    resetPasswordForm.reset();
  };

  // Forgot Password View
  if (viewMode === "forgot-password") {
    return (
      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Music className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-[Montserrat]">Studio LeFlow</h1>
              </div>
              <p className="text-muted-foreground">
                Zaboravili ste lozinku?
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Resetovanje Lozinke
                </CardTitle>
                <CardDescription>
                  Unesite vašu email adresu i poslaćemo vam kod za resetovanje lozinke.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email adresa</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="vas@email.com"
                              autoComplete="email"
                              data-testid="input-forgot-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={forgotPasswordMutation.isPending}
                      data-testid="button-send-code"
                    >
                      {forgotPasswordMutation.isPending ? "Slanje..." : "Pošalji Kod"}
                    </Button>

                    <div className="text-center">
                      <Button 
                        variant="ghost" 
                        className="gap-2" 
                        onClick={handleBackToLogin}
                        data-testid="button-back-login"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Nazad na Prijavu
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50 grayscale"
            style={{ backgroundImage: "url('/equipment/midi-workstation.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 w-full gap-6">
            <div>
              <Mail className="w-24 h-24 mx-auto" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight font-[Montserrat] max-w-2xl mx-auto">
              Resetovanje Lozinke
            </h2>
            
            <p className="text-xl lg:text-2xl max-w-lg mx-auto leading-relaxed text-white/90">
              Brzo i sigurno vratite pristup svom nalogu pomoću verifikacionog koda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password View
  if (viewMode === "reset-password") {
    return (
      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Music className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-[Montserrat]">Studio LeFlow</h1>
              </div>
              <p className="text-muted-foreground">
                Kreirajte novu lozinku
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Nova Lozinka
                </CardTitle>
                <CardDescription>
                  {resetUserEmail && (
                    <span>
                      Proverite email <strong>{resetUserEmail}</strong> za 6-cifreni kod.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resetPasswordForm}>
                  <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={resetPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email adresa</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="vas@email.com"
                              autoComplete="email"
                              readOnly
                              disabled
                              className="bg-muted"
                              data-testid="input-reset-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetPasswordForm.control}
                      name="token"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verifikacioni Kod</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123456"
                              maxLength={6}
                              data-testid="input-reset-token"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetPasswordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Lozinka</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Unesite novu lozinku"
                              autoComplete="new-password"
                              data-testid="input-new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetPasswordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Potvrda Lozinke</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Ponovite novu lozinku"
                              autoComplete="new-password"
                              data-testid="input-confirm-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={resetPasswordMutation.isPending}
                      data-testid="button-reset-password"
                    >
                      {resetPasswordMutation.isPending ? "Čuvanje..." : "Resetuj Lozinku"}
                    </Button>

                    <div className="text-center">
                      <Button 
                        variant="ghost" 
                        className="gap-2" 
                        onClick={() => setViewMode("forgot-password")}
                        data-testid="button-resend-code"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Pošalji Ponovo Kod
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50 grayscale"
            style={{ backgroundImage: "url('/equipment/midi-workstation.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 w-full gap-6">
            <div>
              <Lock className="w-24 h-24 mx-auto" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight font-[Montserrat] max-w-2xl mx-auto">
              Sigurno Resetovanje
            </h2>
            
            <p className="text-xl lg:text-2xl max-w-lg mx-auto leading-relaxed text-white/90">
              Vaša nova lozinka će biti sigurno šifrovana i zaštićena.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Reset Success View
  if (viewMode === "reset-success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center" data-testid="text-reset-success">
              Lozinka Promenjena!
            </CardTitle>
            <CardDescription className="text-center">
              Vaša lozinka je uspešno resetovana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Sada se možete prijaviti koristeći novu lozinku.
            </p>

            <Button 
              className="w-full" 
              onClick={handleBackToLogin}
              data-testid="button-go-to-login"
            >
              Prijavite se
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Auth View (Login & Register)
  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Music className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold font-[Montserrat]">Studio LeFlow</h1>
            </div>
            <p className="text-muted-foreground">
              Prijavite se ili kreirajte nalog
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">
                Prijava
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">
                Registracija
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Korisničko ime</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Unesite korisničko ime"
                            autoComplete="username"
                            data-testid="input-username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lozinka</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Unesite lozinku"
                            autoComplete="current-password"
                            data-testid="input-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-0 text-sm text-primary hover:text-primary/80"
                      onClick={() => setViewMode("forgot-password")}
                      data-testid="link-forgot-password"
                    >
                      Zaboravili ste lozinku?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending ? "Prijavljivanje..." : "Prijavite se"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Unesite email adresu"
                            autoComplete="email"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Korisničko ime</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Unesite korisničko ime"
                            autoComplete="username"
                            data-testid="input-username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lozinka</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Unesite lozinku"
                            autoComplete="new-password"
                            data-testid="input-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potvrda lozinke</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Ponovite lozinku"
                            autoComplete="new-password"
                            data-testid="input-password-confirm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Registracija..." : "Registrujte se"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 grayscale"
          style={{ backgroundImage: "url('/equipment/midi-workstation.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 w-full gap-6">
          <div>
            <Music className="w-24 h-24 mx-auto" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight font-[Montserrat] max-w-2xl mx-auto">
            Studio LeFlow Community
          </h2>
          
          <p className="text-xl lg:text-2xl max-w-lg mx-auto leading-relaxed text-white/90">
            Pridružite se zajednici muzičkih producenata. Učestvujte u mesečnim giveaway konkursima i osvajajte besplatne studio termine.
          </p>
        </div>
      </div>

      {registeredUser && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          userId={registeredUser.id}
          email={registeredUser.email}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
}
