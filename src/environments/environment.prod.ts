/**
 * Production environment configuration
 */
export const environment = {
  production: true,
  apiUrl: '/api',
  useMockData: false,
  appName: 'Atlas Platform',
  defaultLanguage: 'es',
  pwa: {
    enabled: true,
    updateCheckInterval: 60000
  },
  cache: {
    maxAge: 600000, // 10 minutes
    maxItems: 200
  }
};
