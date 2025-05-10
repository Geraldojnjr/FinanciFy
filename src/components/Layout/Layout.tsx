import React from 'react';
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, PlusCircle, BarChart3, Wallet, 
  CreditCard, Target, LineChart, Settings, User, Menu, X, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from '@/components/Logo';

// Update the NavItemProps interface to include the missing properties
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const sessionUser = data.session.user;
        const userData = {
          ...sessionUser,
          name: sessionUser.user_metadata?.name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0]
        };
        setUser(userData);
      }
    };
    
    getCurrentUser();
  }, []);
  
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso");
    navigate("/auth");
  };
  
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/transactions", icon: <PlusCircle size={20} />, label: "Transações" },
    { to: "/reports", icon: <BarChart3 size={20} />, label: "Relatórios" },
    { to: "/accounts", icon: <Wallet size={20} />, label: "Contas" },
    { to: "/credit-cards", icon: <CreditCard size={20} />, label: "Cartões" },
    { to: "/goals", icon: <Target size={20} />, label: "Metas" },
    { to: "/investments", icon: <LineChart size={20} />, label: "Investimentos" },
    { to: "/settings", icon: <Settings size={20} />, label: "Configurações" },
  ];
  
  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/95 p-4 backdrop-blur">
        <Logo className="mx-auto" showText={true} />
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="md:hidden"
          >
            <X size={20} />
          </Button>
        )}
      </div>
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              onClick={closeSidebarOnMobile}
            />
          ))}
        </nav>
      </div>
      <div className="sticky bottom-0 border-t bg-card/95 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {user?.name || user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r z-20">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile (Drawer) */}
      {isMobile && sidebarOpen && (
        <>
          {/* Overlay para fechar o menu ao clicar fora */}
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={toggleSidebar}
          />
          <aside className="fixed inset-0 z-30 flex w-64 bg-card border-r shadow-lg md:hidden">
            <div className="flex-1 h-full">
              {sidebarContent}
            </div>
          </aside>
        </>
      )}

      {/* Conteúdo principal - Removendo padding e margens externas */}
      <main className="flex-1 bg-background overflow-y-auto">
        {isMobile && (
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
            <div className="flex items-center gap-2">
              {!sidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar} 
                  className="md:hidden"
                >
                  <Menu size={20} />
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="p-4 md:p-6 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
