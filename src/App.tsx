import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TransactionsPage from "./pages/TransactionsPage";
import ReportsPage from "./pages/ReportsPage";
import AccountsPage from "./pages/AccountsPage";
import CreditCardsPage from "./pages/CreditCardsPage";
import GoalsPage from "./pages/GoalsPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);
  
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DatabaseProvider>
          <FinanceProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                
                <Route path="/" element={<AuthenticatedRoute><Index /></AuthenticatedRoute>} />
                <Route path="/transactions" element={<AuthenticatedRoute><TransactionsPage /></AuthenticatedRoute>} />
                <Route path="/reports" element={<AuthenticatedRoute><ReportsPage /></AuthenticatedRoute>} />
                <Route path="/accounts" element={<AuthenticatedRoute><AccountsPage /></AuthenticatedRoute>} />
                <Route path="/credit-cards" element={<AuthenticatedRoute><CreditCardsPage /></AuthenticatedRoute>} />
                <Route path="/goals" element={<AuthenticatedRoute><GoalsPage /></AuthenticatedRoute>} />
                <Route path="/investments" element={<AuthenticatedRoute><InvestmentsPage /></AuthenticatedRoute>} />
                <Route path="/settings" element={<AuthenticatedRoute><SettingsPage /></AuthenticatedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FinanceProvider>
        </DatabaseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
