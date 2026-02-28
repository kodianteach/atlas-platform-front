/**
 * Production environment configuration
 */
export const environment = {
  production: true,
  apiUrl: '/api',
  useMockData: false,
  appName: 'Atlas Platform',
  defaultLanguage: 'es',
  /** Base URL for generated links - empty string uses window.location.origin in production */
  frontendBaseUrl: '',
  pwa: {
    enabled: true,
    updateCheckInterval: 60000
  },
  cache: {
    maxAge: 600000, // 10 minutes
    maxItems: 200
  }
};
