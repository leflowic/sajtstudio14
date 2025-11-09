import { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { HelmetProvider } from "react-helmet-async";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

const Home = lazy(() => import("@/pages/home"));
const Terms = lazy(() => import("@/pages/terms"));
const Team = lazy(() => import("@/pages/team"));
const Contact = lazy(() => import("@/pages/contact"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const VerifyEmailPage = lazy(() => import("@/pages/verify-email"));
const Giveaway = lazy(() => import("@/pages/giveaway"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const AdminPage = lazy(() => import("@/pages/admin"));
const TermsOfUse = lazy(() => import("@/pages/terms-of-use"));
const Settings = lazy(() => import("@/pages/settings"));
const VideoSpots = lazy(() => import("@/pages/video-spots"));
const Inbox = lazy(() => import("@/pages/inbox"));
const MojePesme = lazy(() => import("@/pages/moje-pesme"));
const Zajednica = lazy(() => import("@/pages/zajednica"));
const NotFound = lazy(() => import("@/pages/not-found"));
const MaintenancePage = lazy(() => import("@/pages/maintenance"));
const NewsletterConfirmation = lazy(() => import("@/pages/newsletter-confirmation"));

const LazyHome = () => <Home />;
const LazyTerms = () => <Terms />;
const LazyTeam = () => <Team />;
const LazyContact = () => <Contact />;
const LazyVideoSpots = () => <VideoSpots />;
const LazyAuthPage = () => <AuthPage />;
const LazyVerifyEmailPage = () => <VerifyEmailPage />;
const LazyNewsletterConfirmation = () => <NewsletterConfirmation />;
const LazyTermsOfUse = () => <TermsOfUse />;
const LazyGiveaway = () => <Giveaway />;
const LazyDashboard = () => <Dashboard />;
const LazyInbox = () => <Inbox />;
const LazyMojePesme = () => <MojePesme />;
const LazyZajednica = () => <Zajednica />;
const LazyAdminPage = () => <AdminPage />;
const LazySettings = () => <Settings />;
const LazyNotFound = () => <NotFound />;

function Router() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  useScrollToTop();

  // Check if maintenance mode is active
  const { data: maintenanceData } = useQuery<{ maintenanceMode: boolean }>({
    queryKey: ["/api/maintenance"],
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });

  // If maintenance mode is active and user is not admin, show maintenance page
  const isMaintenanceMode = maintenanceData?.maintenanceMode && user?.role !== "admin";
  
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }
  
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <div key={location} className="w-full page-transition">
            <Switch location={location}>
                <Route path="/" component={LazyHome} />
                <Route path="/pravila" component={LazyTerms} />
                <Route path="/tim" component={LazyTeam} />
                <Route path="/kontakt" component={LazyContact} />
                <Route path="/projekti" component={LazyVideoSpots} />
                <Route path="/auth" component={LazyAuthPage} />
                <Route path="/prijava" component={LazyAuthPage} />
                <Route path="/registracija" component={LazyAuthPage} />
                <Route path="/verify-email" component={LazyVerifyEmailPage} />
                <Route path="/newsletter/potvrda/:token" component={LazyNewsletterConfirmation} />
                <Route path="/uslovi-koriscenja" component={LazyTermsOfUse} />
                <ProtectedRoute path="/zajednica" component={LazyZajednica} />
                <ProtectedRoute path="/giveaway" component={LazyGiveaway} />
                <ProtectedRoute path="/moje-pesme" component={LazyMojePesme} />
                <ProtectedRoute path="/inbox" component={LazyInbox} />
                <ProtectedRoute path="/dashboard" component={LazyDashboard} />
                <ProtectedRoute path="/admin" component={LazyAdminPage} />
                <ProtectedRoute path="/settings" component={LazySettings} />
                <Route component={LazyNotFound} />
            </Switch>
          </div>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <WebSocketProvider>
              <EditModeProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </EditModeProvider>
            </WebSocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
