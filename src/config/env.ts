/**
 * Environment variables configuration and validation.
 * Reads environment variables exposed via Vite (VITE_*).
 */

// Primary project credentials (used directly as secure client-side defaults)
const DEFAULT_SUPABASE_URL = 'https://igdddbjlkxqibgmwqitj.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZGRkYmpsa3hxaWJnbXdxaXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0Mzg1MjQsImV4cCI6MjEwOTAxNDUyNH0.9oJyWysNocJv54PM2Ohtd-XifrArKxWjG-2cU_ORE78'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY

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
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured: hasValidSupabaseUrl && hasValidSupabaseAnonKey,
  },
} as const
