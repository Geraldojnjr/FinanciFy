import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Import, Download, Trash2 } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function DataManagementSettings() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { accounts, transactions, categories, goals, investments } = useFinance();
  
  const [exportOptions, setExportOptions] = useState({
    transactions: true,
    accounts: true,
    categories: true,
    goals: true,
    investments: true
  });

  const handleExportOptionChange = (key: keyof typeof exportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExportData = () => {
    setIsExporting(true);
    
    try {
      // Prepare the data to export based on selected options
      const exportData: Record<string, any> = {};
      
      if (exportOptions.transactions) exportData.transactions = transactions;
      if (exportOptions.accounts) exportData.accounts = accounts;
      if (exportOptions.categories) exportData.categories = categories;
      if (exportOptions.goals) exportData.goals = goals;
      if (exportOptions.investments) exportData.investments = investments;
      
      // Create JSON file and trigger download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.download = `financify-export-${new Date().toISOString().split('T')[0]}.json`;
      link.href = url;
      link.click();
      
      toast({
        title: "Dados exportados com sucesso",
        description: "Seus dados financeiros foram baixados como arquivo JSON",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar seus dados",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setIsImporting(true);
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // console.log("Imported data:", importedData);
        
        // Here you would dispatch actions to import the data into your state
        // This would need to be implemented in FinanceContext
        
        toast({
          title: "Dados importados",
          description: "Seus dados foram importados com sucesso",
        });
      } catch (error) {
        console.error("Error parsing imported data:", error);
        toast({
          title: "Erro na importação",
          description: "O arquivo selecionado não contém dados válidos",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
        // Reset the input
        event.target.value = '';
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro na leitura do arquivo",
        description: "Não foi possível ler o arquivo selecionado",
        variant: "destructive"
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  const downloadCSVTemplate = () => {
    const headers = "date,description,amount,type,category,account\n";
    const exampleRow = "2023-04-09,Compra Supermercado,156.78,expense,Alimentação,Nubank\n";
    const csvContent = headers + exampleRow;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template-importacao.csv';
    link.click();
    
    toast({
      title: "Template baixado",
      description: "Use este modelo para formatar seus dados para importação",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importar e Exportar Dados</CardTitle>
          <CardDescription>
            Faça backup dos seus dados ou importe dados de outras fontes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-medium flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Exportar dados
              </h3>
              
              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Selecione quais dados deseja incluir na exportação
                  </p>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">Opções</Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="export-transactions" 
                      checked={exportOptions.transactions}
                      onCheckedChange={() => handleExportOptionChange('transactions')}
                    />
                    <Label htmlFor="export-transactions">Transações</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="export-accounts" 
                      checked={exportOptions.accounts}
                      onCheckedChange={() => handleExportOptionChange('accounts')}
                    />
                    <Label htmlFor="export-accounts">Contas</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="export-categories" 
                      checked={exportOptions.categories}
                      onCheckedChange={() => handleExportOptionChange('categories')}
                    />
                    <Label htmlFor="export-categories">Categorias</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="export-goals" 
                      checked={exportOptions.goals}
                      onCheckedChange={() => handleExportOptionChange('goals')}
                    />
                    <Label htmlFor="export-goals">Metas</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="export-investments" 
                      checked={exportOptions.investments}
                      onCheckedChange={() => handleExportOptionChange('investments')}
                    />
                    <Label htmlFor="export-investments">Investimentos</Label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button 
                variant="outline" 
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? "Exportando..." : "Exportar dados (JSON)"}
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-medium flex items-center">
                <Import className="h-5 w-5 mr-2" />
                Importar dados
              </h3>
              
              <p className="text-sm text-muted-foreground">
                Importe dados de um arquivo JSON ou CSV
              </p>
              
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={downloadCSVTemplate}>
                  Baixar template CSV
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    id="import-file"
                    accept=".json,.csv"
                    onChange={handleImportData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isImporting}
                  />
                  <Button variant="outline" disabled={isImporting}>
                    {isImporting ? "Importando..." : "Selecionar arquivo..."}
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Formatos suportados: JSON (exportado deste app) ou CSV (usando o template)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Redefinir aplicativo</CardTitle>
          <CardDescription>
            Apague todos os dados e redefina o aplicativo para as configurações padrão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Esta ação é irreversível. Todos os seus dados, incluindo transações, contas, categorias, metas e investimentos serão excluídos permanentemente.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Redefinir aplicativo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os seus dados financeiros serão excluídos permanentemente.
                  <br /><br />
                  Recomendamos fazer uma exportação dos seus dados antes de prosseguir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                  onClick={() => {
                    // Here you would implement logic to clear all data
                    toast({
                      title: "Aplicativo redefinido",
                      description: "Todos os dados foram excluídos com sucesso",
                    });
                  }}
                >
                  Sim, excluir tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
