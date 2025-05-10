export interface MariaDBClient {
  get: (path: string) => Promise<Response>;
  post: (path: string, data: any) => Promise<Response>;
  put: (path: string, data: any) => Promise<Response>;
  delete: (path: string) => Promise<Response>;
  patch: (path: string, data: any) => Promise<Response>;
  query: (sql: string, params?: any[]) => Promise<any[]>;
}

export interface MariaDBResponse<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<T>;
  data?: T;
  error?: string;
} 