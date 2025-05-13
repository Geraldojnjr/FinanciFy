
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  DatabaseConfig, DatabaseType, loadDatabaseConfig, 
  saveDatabaseConfig, testMariaDBConnection
} from '@/lib/databaseConfig';

interface DatabaseContextType {
  config: DatabaseConfig;
  switchDatabase: (
    type: DatabaseType, 
    url?: string, 
    apiKey?: string,
    mariadbHost?: string,
    mariadbPort?: string,
    mariadbUser?: string,
    mariadbPassword?: string,
    mariadbDatabase?: string
  ) => void;
  isMariaDBSupported: boolean;
  testConnection: (config: DatabaseConfig) => Promise<boolean>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<DatabaseConfig>(loadDatabaseConfig());
  
  // Enable MariaDB support
  const isMariaDBSupported = true;

  useEffect(() => {
    // Load initial config
    const savedConfig = loadDatabaseConfig();
    setConfig(savedConfig);
  }, []);

  // Test connection function
  const testConnection = async (configToTest: DatabaseConfig): Promise<boolean> => {
    if (configToTest.type === 'mariadb') {
      if (!configToTest.mariadbHost || !configToTest.mariadbUser || !configToTest.mariadbDatabase) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return false;
      }

      try {
        const result = await testMariaDBConnection(
          configToTest.mariadbHost || 'mariadb',
          configToTest.mariadbPort || "3306",
          configToTest.mariadbDatabase,
          configToTest.mariadbUser,
          configToTest.mariadbPassword || ""
        );
        
        if (result) {
          toast.success("Conexão com MariaDB estabelecida com sucesso!");
        } else {
          toast.error("Não foi possível conectar ao MariaDB. Verifique as credenciais.");
        }
        
        return result;
      } catch (error) {
        console.error("Error testing MariaDB connection:", error);
        toast.error(`Erro ao testar conexão: ${error.message}`);
        return false;
      }
    }
    
    // For Supabase, we assume connection is OK
    return true;
  };

  const switchDatabase = async (
    type: DatabaseType, 
    url?: string, 
    apiKey?: string,
    mariadbHost?: string,
    mariadbPort?: string,
    mariadbUser?: string,
    mariadbPassword?: string,
    mariadbDatabase?: string
  ) => {
    const newConfig: DatabaseConfig = {
      type,
      url,
      apiKey,
      mariadbHost,
      mariadbPort,
      mariadbUser,
      mariadbPassword,
      mariadbDatabase,
    };

    // Test connection before saving
    if (type === 'mariadb') {
      const isConnected = await testConnection(newConfig);
      if (!isConnected) return;
    }

    // Save to localStorage
    saveDatabaseConfig(newConfig);
    
    // Update state
    setConfig(newConfig);
    
    toast.success(`Configuração de ${type === 'supabase' ? 'Supabase' : 'MariaDB'} salva com sucesso`);
    
    // Reload the page to apply the new configuration
    window.location.reload();
  };

  return (
    <DatabaseContext.Provider value={{ config, switchDatabase, isMariaDBSupported, testConnection }}>
      {children}
    </DatabaseContext.Provider>
  );
};

