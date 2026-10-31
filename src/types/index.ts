export * from './database.ts'
export * from './fapriv.ts'

export interface AppConfig {
  appName: string
  appUrl: string
  isProduction: boolean
  supabase: {
    url?: string
    anonKey?: string
    isConfigured: boolean
  }
}

export type ConnectionStatus = 'checking' | 'connected' | 'not_configured' | 'error'
