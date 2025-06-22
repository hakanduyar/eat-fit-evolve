
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Nutrition from "./pages/Nutrition";
import Activity from "./pages/Activity";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:clientId" element={<ClientDetail />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
