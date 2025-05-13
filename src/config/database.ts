export type DatabaseType = 'mariadb' | 'supabase';

export interface DatabaseConfig {
  type: DatabaseType;
  mariadb: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    apiUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const databaseConfig: DatabaseConfig = {
  type: (import.meta.env.VITE_DATABASE_TYPE || 'mariadb') as DatabaseType,
  mariadb: {
    host: import.meta.env.VITE_MARIADB_HOST || 'mariadb',
    port: parseInt(import.meta.env.VITE_MARIADB_PORT || '3306'),
    user: import.meta.env.VITE_MARIADB_USER || '',
    password: import.meta.env.VITE_MARIADB_PASSWORD || '',
    database: import.meta.env.VITE_MARIADB_DATABASE || '',
    apiUrl: import.meta.env.VITE_MARIADB_API_URL || 'http://localhost:3000/api'
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  }
};

export const isUsingSupabase = () => databaseConfig.type === 'supabase';
export const isUsingMariaDB = () => databaseConfig.type === 'mariadb'; 