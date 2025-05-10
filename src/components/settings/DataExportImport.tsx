
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { Download, Upload, FileUp } from "lucide-react";

export default function DataExportImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { transactions, accounts, categories, creditCards, goals, investments } = useFinance();

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      const data = {
        transactions,
        accounts,
        categories,
        creditCards,
        goals,
        investments,
        exportDate: new Date().toISOString()
      };
      
      // Criando um blob com os dados
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      
      // Criando um link para download e clicando nele
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financify_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Limpando
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Aqui você implementaria a lógica para importar os dados
        // console.log("Dados importados:", importedData);
        
        // Em uma implementação real, você chamaria métodos do FinanceContext para adicionar os dados
        alert("Funcionalidade de importação será implementada em breve!");
      } catch (error) {
        console.error("Erro ao importar dados:", error);
        alert("Erro ao processar o arquivo de importação");
      } finally {
        setIsImporting(false);
        // Resetar o input de arquivo
        event.target.value = '';
      }
    };
    
    reader.onerror = () => {
      setIsImporting(false);
      alert("Erro ao ler o arquivo");
      // Resetar o input de arquivo
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar e Importar Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Exportar Dados</h3>
          <p className="text-sm text-muted-foreground">
            Exporte todos os seus dados para fazer backup ou transferir para outro dispositivo.
          </p>
          <Button 
            onClick={handleExportData} 
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar Todos os Dados"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Importar Dados</h3>
          <p className="text-sm text-muted-foreground">
            Importe dados de um arquivo de backup. Isso irá substituir os dados atuais.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto relative"
              disabled={isImporting}
            >
              <input
                type="file"
                accept=".json"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImportData}
                disabled={isImporting}
              />
              <FileUp className="mr-2 h-4 w-4" />
              {isImporting ? "Importando..." : "Selecionar Arquivo"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
