/**
 * Development environment configuration
 */
export const environment = {
  production: false,
  apiUrl: '/api',
  useMockData: false,
  appName: 'Atlas Platform',
  defaultLanguage: 'es',
  pwa: {
    enabled: false,
    updateCheckInterval: 30000
  },
  cache: {
    maxAge: 300000, // 5 minutes
    maxItems: 100
  }
};
