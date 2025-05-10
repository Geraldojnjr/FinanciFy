
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell, Target, CreditCard, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    dueDates: true,
    goalsAchieved: true,
    expenseLimit: false,
    monthlyReport: true,
    newFeatures: true
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate saving to API/localStorage
    setTimeout(() => {
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
      
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de notificação foram atualizadas",
        variant: "success",
      });
    }, 1000);
  };

  React.useEffect(() => {
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      try {
        setNotifications(JSON.parse(savedPreferences));
      } catch (e) {
        console.error("Error parsing saved notification preferences", e);
      }
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
        <CardDescription>
          Personalize como e quando deseja ser notificado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alertas Financeiros</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="dueDates" className="cursor-pointer">
                Alertas de vencimentos
                <p className="text-sm text-muted-foreground">
                  Receba lembretes sobre contas e faturas de cartão
                </p>
              </Label>
            </div>
            <Switch
              id="dueDates"
              checked={notifications.dueDates}
              onCheckedChange={() => handleToggle('dueDates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="goalsAchieved" className="cursor-pointer">
                Atingimento de metas
                <p className="text-sm text-muted-foreground">
                  Seja notificado quando atingir ou se aproximar de suas metas
                </p>
              </Label>
            </div>
            <Switch
              id="goalsAchieved"
              checked={notifications.goalsAchieved}
              onCheckedChange={() => handleToggle('goalsAchieved')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="expenseLimit" className="cursor-pointer">
                Gastos acima do limite
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando seus gastos ultrapassarem limites definidos
                </p>
              </Label>
            </div>
            <Switch
              id="expenseLimit"
              checked={notifications.expenseLimit}
              onCheckedChange={() => handleToggle('expenseLimit')}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outras Notificações</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="monthlyReport" className="cursor-pointer">
              Relatório mensal
              <p className="text-sm text-muted-foreground">
                Receba um relatório mensal com seu resumo financeiro
              </p>
            </Label>
            <Switch
              id="monthlyReport"
              checked={notifications.monthlyReport}
              onCheckedChange={() => handleToggle('monthlyReport')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="newFeatures" className="cursor-pointer">
              Novos recursos e dicas
              <p className="text-sm text-muted-foreground">
                Seja notificado sobre novos recursos e dicas financeiras
              </p>
            </Label>
            <Switch
              id="newFeatures"
              checked={notifications.newFeatures}
              onCheckedChange={() => handleToggle('newFeatures')}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? "Salvando..." : (
            <>
              <Check className="h-4 w-4" /> 
              Salvar preferências
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
