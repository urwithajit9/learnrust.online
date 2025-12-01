import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Loader2 } from "lucide-react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import StartDateSetup from "./pages/StartDateSetup";
import NotFound from "./pages/NotFound";

const Index = lazy(() => import("./pages/Index"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const Progress = lazy(() => import("./pages/Progress"));
const Settings = lazy(() => import("./pages/Settings"));
const DailyLesson = lazy(() => import("./pages/DailyLesson"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Setup route - requires auth but not start date */}
            <Route path="/setup" element={
              <ProtectedRoute requireStartDate={false}>
                <StartDateSetup />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - requireStartDate=false allows access without schedule */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireStartDate={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <Index />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/curriculum" element={
              <ProtectedRoute requireStartDate={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <Curriculum />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute requireStartDate={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <Progress />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireStartDate={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute requireStartDate={true}>
                <Suspense fallback={<LoadingFallback />}>
                  <CalendarPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/lesson" element={
              <ProtectedRoute requireStartDate={true}>
                <Suspense fallback={<LoadingFallback />}>
                  <DailyLesson />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/lesson/:day" element={
              <ProtectedRoute requireStartDate={true}>
                <Suspense fallback={<LoadingFallback />}>
                  <DailyLesson />
                </Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
