import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { MariaDBClient, DatabaseConfig } from '@/types/database';

// Database configuration type
export type DatabaseType = 'supabase' | 'mariadb';

// Default configuration
const defaultConfig: DatabaseConfig = {
  type: 'mariadb',
  mariadbHost: import.meta.env.VITE_MARIADB_HOST,
  mariadbPort: import.meta.env.VITE_MARIADB_PORT,
  mariadbUser: import.meta.env.VITE_MARIADB_USER,
  mariadbPassword: import.meta.env.VITE_MARIADB_PASSWORD,
  mariadbDatabase: import.meta.env.VITE_MARIADB_DATABASE
};

const API_URL = import.meta.env.VITE_MARIADB_API_URL;

// Load configuration from localStorage or use default
export const loadDatabaseConfig = (): DatabaseConfig => {
  try {
    const storedConfig = localStorage.getItem('databaseConfig');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      return { ...defaultConfig, ...parsedConfig };
    }
    return defaultConfig;
  } catch (error) {
    console.error('Erro ao carregar configuração do banco de dados:', error);
    return defaultConfig;
  }
};

// Save configuration to localStorage
export const saveDatabaseConfig = (config: DatabaseConfig): void => {
  try {
    localStorage.setItem('databaseConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Erro ao salvar configuração do banco de dados:', error);
  }
};

// Get Supabase client with current configuration
export const getSupabaseClient = () => {
  const config = loadDatabaseConfig();
  
  if (config.type === 'supabase') {
    // Default Supabase configuration
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Use custom URL and API key if provided
    const url = config.url || SUPABASE_URL;
    const apiKey = config.apiKey || SUPABASE_PUBLISHABLE_KEY;
    
    return createClient<Database>(url, apiKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: localStorage
      }
    });
  }
  
  // Return a mock client that simulates Supabase client behavior but uses MariaDB backend
  return createMariaDBCompatibleClient(config);
};

// Create a Supabase-compatible client that uses MariaDB
const createMariaDBCompatibleClient = (config: DatabaseConfig) => {
  // Base URL for our MariaDB API middleware
  const baseApiUrl = window.location.origin + '/api';
  
  const getHeaders = () => {
    const session = localStorage.getItem('sb-session');
    let token = null;
    
    try {
      if (session) {
        const sessionData = JSON.parse(session);
        token = sessionData.access_token;
      }
    } catch (error) {
      console.error('Erro ao parsear sessão:', error);
    }

    if (!token) {
      console.warn('Token não encontrado na sessão');
    }

    const dbConfig = {
      host: config.mariadbHost || '',
      port: config.mariadbPort || '3306',
      user: config.mariadbUser || '',
      password: config.mariadbPassword || '',
      database: config.mariadbDatabase || ''
    };

    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-DB-Config': JSON.stringify(dbConfig)
    };
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData
      });
      throw new Error(
        errorData.message || 
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }
    return response;
  };

  // Create a client that implements both MariaDBClient and auth methods
  return {
    get: async (path: string) => {
      try {
        const response = await fetch(`${baseApiUrl}${path}`, {
          method: 'GET',
          headers: getHeaders()
        });
        return handleResponse(response);
      } catch (error) {
        console.error('GET request failed:', error);
        throw error;
      }
    },
    post: async (path: string, data: any) => {
      try {
        const response = await fetch(`${baseApiUrl}${path}`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        return handleResponse(response);
      } catch (error) {
        console.error('POST request failed:', error);
        throw error;
      }
    },
    put: async (path: string, data: any) => {
      try {
        const response = await fetch(`${baseApiUrl}${path}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        return handleResponse(response);
      } catch (error) {
        console.error('PUT request failed:', error);
        throw error;
      }
    },
    delete: async (path: string) => {
      try {
        const response = await fetch(`${baseApiUrl}${path}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        return handleResponse(response);
      } catch (error) {
        console.error('DELETE request failed:', error);
        throw error;
      }
    },
    auth: {
      getSession: async () => {
        try {
          const session = localStorage.getItem('sb-session');
          return { data: { session: session ? JSON.parse(session) : null }, error: null };
        } catch (error) {
          console.error('Error getting session:', error);
          return { data: { session: null }, error };
        }
      },
      onAuthStateChange: (callback) => {
        try {
          // Listen for storage events to detect auth changes
          const handler = (event) => {
            if (event.key === 'sb-session') {
              try {
                const session = event.newValue ? JSON.parse(event.newValue) : null;
                callback('SIGNED_IN', { session });
              } catch (error) {
                console.error('Error parsing session:', error);
                callback('SIGNED_OUT', { session: null });
              }
            }
          };
          
          window.addEventListener('storage', handler);
          
          // Also check initial state
          const initialSession = localStorage.getItem('sb-session');
          if (initialSession) {
            try {
              callback('SIGNED_IN', { session: JSON.parse(initialSession) });
            } catch (error) {
              console.error('Error parsing initial session:', error);
              callback('SIGNED_OUT', { session: null });
            }
          }
          
          // Return unsubscribe function
          return {
            data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handler) } },
            error: null
          };
        } catch (error) {
          console.error('Error setting up auth state change listener:', error);
          return { data: null, error };
        }
      },
      signInWithPassword: async ({ email, password }) => {
        try {
          const response = await fetch(`${baseApiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              password,
              dbConfig: {
                host: config.mariadbHost,
                port: config.mariadbPort,
                user: config.mariadbUser,
                password: config.mariadbPassword,
                database: config.mariadbDatabase
              }
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Falha no login');
          }
          
          // Save session to localStorage on successful login
          if (data.userId && data.token) {
            localStorage.setItem('sb-session', JSON.stringify({
              user: { 
                id: data.userId, 
                email,
                user_metadata: {
                  name: data.name,
                  full_name: data.name
                }
              },
              access_token: data.token,
              expires_at: Date.now() + 3600 * 1000 // 1 hour from now
            }));
          }
          
          return { data, error: null };
        } catch (error) {
          console.error("MariaDB Auth login error:", error);
          return { data: null, error };
        }
      },
      signUp: async ({ email, password, name }) => {
        try {
          const response = await fetch(`${baseApiUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email, 
              password,
              name,
              dbConfig: {
                host: config.mariadbHost,
                port: config.mariadbPort,
                user: config.mariadbUser,
                password: config.mariadbPassword,
                database: config.mariadbDatabase
              } 
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Falha no registro');
          }
          
          // Save session to localStorage
          localStorage.setItem('sb-session', JSON.stringify({
            user: { 
              id: data.userId, 
              email,
              user_metadata: {
                name: data.name,
                full_name: data.name
              }
            },
            access_token: data.token,
            expires_at: Date.now() + 3600 * 1000
          }));
          
          return { data, error: null };
        } catch (error) {
          console.error("MariaDB Auth signup error:", error);
          return { data: null, error };
        }
      },
      signOut: async () => {
        localStorage.removeItem('sb-session');
        return { error: null };
      }
    }
  };
};

export const getDatabaseClient = (): MariaDBClient => {
  const config = loadDatabaseConfig();
  if (!config) {
    throw new Error('Configuração do banco de dados não encontrada');
  }

  return {
    host: config.mariadbHost || '',
    port: parseInt(config.mariadbPort || '3306'),
    user: config.mariadbUser || '',
    password: config.mariadbPassword || '',
    database: config.mariadbDatabase || '',
    get: async (endpoint: string) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return response.json();
    },
    post: async (endpoint: string, data: any) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return response.json();
    },
    put: async (endpoint: string, data: any) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return response.json();
    },
    delete: async (endpoint: string) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return response.json();
    },
    patch: async (endpoint: string, data: any) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return response.json();
    },
    query: async (sql: string, params?: any[]) => {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, params })
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return response.json();
    }
  };
};

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = getDatabaseClient();
    await client.get('/health');
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão com o banco de dados:', error);
    return false;
  }
};

// Test MariaDB connection
export const testMariaDBConnection = async (config: DatabaseConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host: config.mariadbHost,
        port: config.mariadbPort,
        user: config.mariadbUser,
        password: config.mariadbPassword,
        database: config.mariadbDatabase
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao testar conexão');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
};
