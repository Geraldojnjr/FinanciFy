export interface MariaDBClient {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  get: (endpoint: string) => Promise<any>;
  post: (endpoint: string, data: any) => Promise<any>;
  put: (endpoint: string, data: any) => Promise<any>;
  delete: (endpoint: string) => Promise<any>;
  patch: (endpoint: string, data: any) => Promise<any>;
  query: (sql: string, params?: any[]) => Promise<any>;
}

export interface DatabaseConfig {
  type: 'supabase' | 'mariadb';
  url?: string;
  apiKey?: string;
  mariadbHost?: string;
  mariadbPort?: string;
  mariadbUser?: string;
  mariadbPassword?: string;
  mariadbDatabase?: string;
} 