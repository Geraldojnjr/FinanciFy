import { getSupabase } from '@/lib/supabase';

// Export the client with database configuration
export const supabase = getSupabase();

// Export function to reinitialize the client
export const refreshClient = () => {
  return getSupabase();
};

// Function to check if database is initialized and accessible
export const checkDatabaseConnection = async () => {
  try {
    // For Supabase, we'll use a simple API call to test the connection
    const client = getSupabase();
    
    // For database clients that have the "from" method (Supabase)
    if ('from' in client) {
      const { data, error } = await client.from('accounts').select('count').limit(1);
      if (error) {
        throw new Error(error.message || 'Failed to connect to database');
      }
    } 
    // For MariaDB client which uses the "get" method
    else if ('get' in client) {
      const response = await client.get('/accounts?limit=1');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect to database');
      }
    }
    
    return { success: true, message: 'Connected to database successfully' };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      success: false, 
      message: `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
