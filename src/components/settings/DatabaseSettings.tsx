
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/contexts/DatabaseContext";
import { DatabaseType, DatabaseConfig } from "@/lib/databaseConfig";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, DatabaseIcon } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const databaseSchema = z.object({
  type: z.enum(['supabase', 'mariadb']),
  url: z.string().optional(),
  apiKey: z.string().optional(),
  mariadbHost: z.string().min(1, "Host é obrigatório").optional().or(z.literal('')),
  mariadbPort: z.string().optional(),
  mariadbUser: z.string().min(1, "Usuário é obrigatório").optional().or(z.literal('')),
  mariadbPassword: z.string().optional(),
  mariadbDatabase: z.string().min(1, "Nome do banco é obrigatório").optional().or(z.literal('')),
});

type DatabaseFormValues = z.infer<typeof databaseSchema>;

const DatabaseSettings: React.FC = () => {
  const { config, switchDatabase, isMariaDBSupported, testConnection } = useDatabase();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const form = useForm<DatabaseFormValues>({
    resolver: zodResolver(databaseSchema),
    defaultValues: {
      type: config.type,
      url: config.url || '',
      apiKey: config.apiKey || '',
      mariadbHost: config.mariadbHost || 'mariadb',
      mariadbPort: config.mariadbPort || '3306',
      mariadbUser: config.mariadbUser || '',
      mariadbPassword: config.mariadbPassword || '',
      mariadbDatabase: config.mariadbDatabase || '',
    },
  });

  // Handle testing connection
  const handleTestConnection = async () => {
    const values = form.getValues();
    setIsTestingConnection(true);
    
    try {
      const testConfig: DatabaseConfig = {
        type: values.type,
        mariadbHost: values.mariadbHost,
        mariadbPort: values.mariadbPort,
        mariadbUser: values.mariadbUser,
        mariadbPassword: values.mariadbPassword,
        mariadbDatabase: values.mariadbDatabase,
      };
      
      await testConnection(testConfig);
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error(`Erro ao testar conexão: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Handle form submission
  function onSubmit(values: DatabaseFormValues) {
    try {
      switchDatabase(
        values.type, 
        values.url, 
        values.apiKey,
        values.mariadbHost,
        values.mariadbPort,
        values.mariadbUser,
        values.mariadbPassword,
        values.mariadbDatabase
      );
    } catch (error) {
      console.error("Error saving database configuration:", error);
      toast.error("Erro ao salvar configurações de banco de dados.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Banco de Dados</CardTitle>
        <CardDescription>
          Escolha e configure o banco de dados que deseja utilizar
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Banco de Dados</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="supabase" id="supabase" />
                        </FormControl>
                        <FormLabel htmlFor="supabase" className="font-normal cursor-pointer">
                          Supabase (PostgreSQL)
                        </FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem 
                            value="mariadb" 
                            id="mariadb" 
                            disabled={!isMariaDBSupported} 
                          />
                        </FormControl>
                        <FormLabel htmlFor="mariadb" className="font-normal cursor-pointer">
                          MariaDB
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Escolha entre Supabase (PostgreSQL) ou MariaDB para armazenar seus dados
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {form.watch("type") === 'supabase' && (
              <>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Supabase</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://your-project.supabase.co" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Deixe em branco para usar a configuração padrão
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave Anônima do Supabase</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Chave anon/public do Supabase" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Deixe em branco para usar a configuração padrão
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Conexão Supabase</AlertTitle>
                  <AlertDescription>
                    A conexão com Supabase está configurada e funcional por padrão.
                  </AlertDescription>
                </Alert>
              </>
            )}
            
            {form.watch("type") === 'mariadb' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mariadbHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host*</FormLabel>
                        <FormControl>
                          <Input placeholder="mariadb" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mariadbPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porta</FormLabel>
                        <FormControl>
                          <Input placeholder="3306" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="mariadbDatabase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Banco*</FormLabel>
                      <FormControl>
                        <Input placeholder="financify" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mariadbUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuário*</FormLabel>
                        <FormControl>
                          <Input placeholder="root" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mariadbPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Configuração do Backend</AlertTitle>
                  <AlertDescription>
                    Para utilizar o MariaDB, você pode usar a API de middleware incluída no projeto.
                    Configure a URL da API no arquivo .env com VITE_MARIADB_API_URL.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="w-full"
                >
                  {isTestingConnection ? 'Testando...' : 'Testar Conexão MariaDB'}
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
            >
              Salvar Configuração
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DatabaseSettings;

