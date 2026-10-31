/**
 * Environment variables configuration and validation.
 * Reads environment variables exposed via Vite (VITE_*).
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const hasValidSupabaseUrl = Boolean(
  supabaseUrl &&
  supabaseUrl.trim() !== '' &&
  !supabaseUrl.includes('your-project-ref') &&
  supabaseUrl.startsWith('https://')
)

const hasValidSupabaseAnonKey = Boolean(
  supabaseAnonKey &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseAnonKey.includes('your-anon-public-key')
)

export const env = {
  appName: (import.meta.env.VITE_APP_NAME as string) || 'Fapriv',
  appUrl: (import.meta.env.VITE_APP_URL as string) || 'http://localhost:5173',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  supabase: {
    url: supabaseUrl || '',
    anonKey: supabaseAnonKey || '',
    isConfigured: hasValidSupabaseUrl && hasValidSupabaseAnonKey,
  },
} as const
