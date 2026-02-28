/**
 * Development environment configuration
 */
export const environment = {
  production: false,
  apiUrl: '/api',
  useMockData: false,
  appName: 'Atlas Platform',
  defaultLanguage: 'es',
  /** Base URL for generated links (for tunneler testing) - set to empty string to use window.location.origin */
  frontendBaseUrl: 'https://8q5djhhd-4200.use2.devtunnels.ms',
  pwa: {
    enabled: false,
    updateCheckInterval: 30000
  },
  cache: {
    maxAge: 300000, // 5 minutes
    maxItems: 100
  }
};
