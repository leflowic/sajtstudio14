import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, User, Edit3, Save, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEditMode } from "@/contexts/EditModeContext";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import leflowLogo from "@/assets/leflow-logo.png";

export function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { isEditMode, toggleEditMode } = useEditMode();
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  // Fetch unread message count (only for verified users)
  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ["/api/messages/unread-count"],
    enabled: !!user && user.emailVerified === true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = unreadData?.count ?? 0;

  // Subscribe to WebSocket events to update unread count in real-time
  useEffect(() => {
    if (!user || !user.emailVerified) return;

    const unsubscribe = subscribe((message) => {
      if (message.type === 'new_message' || message.type === 'message_read') {
        // Invalidate unread count query to refetch
        queryClient.invalidateQueries({ queryKey: ["/api/messages/unread-count"] });
      }
    });

    return unsubscribe;
  }, [user, subscribe, queryClient]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  };

  const navigation = [
    { name: "Početna", href: "/" },
    { name: "Giveaway", href: "/giveaway" },
    { name: "Pravila", href: "/pravila" },
    { name: "Tim", href: "/tim" },
    { name: "Projekti", href: "/projekti" },
    { name: "Kontakt", href: "/kontakt" }
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location === href;
  };

  const scrollToServices = () => {
    if (location !== "/") {
      setLocation("/#usluge");
    } else {
      const element = document.getElementById("usluge");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 -ml-3" 
            data-testid="link-logo"
          >
            <img 
              src={leflowLogo} 
              alt="Studio LeFlow Logo" 
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="h-10 w-auto dark:invert transition-all select-none"
            />
            <span className="text-xl font-bold font-[Montserrat] uppercase">STUDIO LEFLOW</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5">
            {navigation.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="flex items-center">
                <Link 
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate flex items-center min-h-9 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                  data-testid={`link-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            {user?.role === 'admin' && (
              <>
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <Link 
                    href="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate flex items-center min-h-9 ${
                      isActive("/admin")
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                    data-testid="link-nav-admin"
                  >
                    Admin
                  </Link>
                </motion.div>
                {!isActive("/admin") && (
                  <Button
                    variant={isEditMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleEditMode}
                    className="gap-2 min-h-9"
                    data-testid="button-edit-site"
                  >
                    {isEditMode ? (
                      <>
                        <Save className="w-4 h-4" />
                        Završi Izmene
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        Izmeni Sajt
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="flex items-center">
              <button
                onClick={scrollToServices}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate text-foreground flex items-center min-h-9"
                data-testid="link-nav-usluge"
              >
                Usluge
              </button>
            </motion.div>
          </nav>

          <div className="hidden xl:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                {user.emailVerified && (
                  <Button variant="ghost" size="icon" asChild className="relative h-9 w-9">
                    <Link href="/inbox">
                      <MessageCircle className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                      <span className="sr-only">Poruke ({unreadCount} nepročitanih)</span>
                    </Link>
                  </Button>
                )}
                <Link href="/settings" className="hover-elevate rounded-full flex items-center">
                  <Avatar className="h-9 w-9">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="sr-only">Podešavanja</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="h-9 w-9"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Odjavi se</span>
                </Button>
              </>
            ) : (
              <Link href="/prijava">
                <Button variant="outline" className="h-9">
                  Prijava
                </Button>
              </Link>
            )}
            <Link href="/kontakt">
              <Button data-testid="button-header-contact" className="h-9">
                Zakažite Termin
              </Button>
            </Link>
          </div>

          <button
            className="xl:hidden p-2 hover-elevate rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors hover-elevate ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <>
                  <Link 
                    href="/admin"
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors hover-elevate ${
                      isActive("/admin")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-admin"
                  >
                    Admin
                  </Link>
                  {!isActive("/admin") && (
                    <Button
                      variant={isEditMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        toggleEditMode();
                        setMobileMenuOpen(false);
                      }}
                      className="gap-2 mx-4"
                      data-testid="button-mobile-edit-site"
                    >
                      {isEditMode ? (
                        <>
                          <Save className="w-4 h-4" />
                          Završi Izmene
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          Izmeni Sajt
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
              <button
                onClick={scrollToServices}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors hover-elevate text-foreground text-left"
                data-testid="link-mobile-usluge"
              >
                Usluge
              </button>
              <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">Tema</span>
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <Link href="/settings">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Avatar className="h-6 w-6 mr-2">
                          {user.avatarUrl ? (
                            <AvatarImage src={user.avatarUrl} alt={user.username} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-xs">
                              <User className="h-4 w-4 text-primary" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        Podešavanja
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Odjavi se
                    </Button>
                  </>
                ) : (
                  <Link href="/prijava">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Prijava
                    </Button>
                  </Link>
                )}
                <Link href="/kontakt">
                  <Button 
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-contact"
                  >
                    Zakažite Termin
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
