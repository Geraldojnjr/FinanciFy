import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Trash2, UserCircle, BellRing } from "lucide-react";
import { UserProfileSettings } from "@/components/settings/UserProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DataExportImport from "@/components/settings/DataExportImport";
import { useIsMobile } from "@/hooks/use-mobile";
import { TabButton } from "@/components/ui/tab-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { loadDatabaseConfig } from "@/lib/databaseConfig";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isResetting, setIsResetting] = useState(false);
  const { user_id } = useFinance();
  const isMobile = useIsMobile();

  const handleResetApp = async () => {
    try {
      setIsResetting(true);
      const dbConfigRaw = loadDatabaseConfig();
      const dbConfig = {
        host: dbConfigRaw.mariadbHost,
        port: dbConfigRaw.mariadbPort,
        user: dbConfigRaw.mariadbUser,
        password: dbConfigRaw.mariadbPassword,
        database: dbConfigRaw.mariadbDatabase
      };
      console.log('dbConfig enviado:', dbConfig);
      const response = await fetch('/api/auth/reset-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DB-Config': JSON.stringify(dbConfig)
        },
        body: JSON.stringify({ user_id })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        window.localStorage.removeItem('sb-session');
        window.location.href = '/auth';
      } else {
        alert(data.error || 'Erro ao redefinir conta');
      }
    } catch (error) {
      alert('Erro ao redefinir conta');
    } finally {
      setIsResetting(false);
    }
  };

  const tabs = [
    { id: "profile", icon: <UserCircle className="h-4 w-4" />, label: "Perfil" },
    { id: "notifications", icon: <BellRing className="h-4 w-4" />, label: "Notificações" },
    { id: "data", icon: <Download className="h-4 w-4" />, label: "Dados" }
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações do aplicativo.
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 border-b md:border-r md:border-b-0">
            <div className="flex flex-col">
              {tabs.map(tab => (
                <TabButton
                  key={tab.id}
                  value={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {activeTab === 'profile' && 'Perfil'}
                {activeTab === 'notifications' && 'Notificações'}
                {activeTab === 'data' && 'Dados'}
              </h3>
            </div>
            <div className="p-4">
              {activeTab === 'profile' && <UserProfileSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'data' && (
                <>
                  <DataExportImport />
                  {/* App Reset Section */}
                  <Card className="mt-6 border-destructive/20">
                    <CardHeader className={isMobile ? "p-4" : ""}>
                      <CardTitle className="text-destructive">Redefinir Aplicativo</CardTitle>
                      <CardDescription>
                        Esta ação apagará todos os seus dados. Esta ação não pode ser desfeita.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className={isMobile ? "p-4 pt-0" : ""}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full sm:w-auto" disabled={isResetting}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Redefinir Aplicativo
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá apagar todos os seus dados, incluindo transações, categorias, contas e configurações. 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetApp} className="bg-destructive text-destructive-foreground">
                              Sim, redefinir aplicativo
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
