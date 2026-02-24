/**
 * AWS environment configuration
 * Used when deploying to AWS (S3 + CloudFront)
 *
 * La API URL se reemplaza en el script de deploy con el valor real
 * del API Gateway de Terraform.
 */
export const environment = {
  production: true,
  apiUrl: '${API_URL}/api',
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
