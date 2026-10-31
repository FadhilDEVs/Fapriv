import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '../config/env.ts'
import type { Database } from '../types/database.ts'

/**
 * Singleton Supabase client instance.
 * If Supabase environment variables are missing, client will be null
 * and helpers will indicate that configuration is pending.
 */
let clientInstance: SupabaseClient<Database> | null = null

if (env.supabase.isConfigured) {
  try {
    clientInstance = createClient<Database>(
      env.supabase.url,
      env.supabase.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    )
  } catch (error) {
    console.error('[Supabase] Failed to initialize client:', error)
  }
} else if (env.isDevelopment) {
  console.info(
    '[Supabase] Environment variables VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are not configured yet. See .env.example.'
  )
}

export const supabase = clientInstance

/**
 * Helper to safely get the Supabase client or throw an instructive error.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    )
  }
  return supabase
}

/**
 * Test connectivity to the Supabase endpoint.
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean
  message: string
}> {
  if (!env.supabase.isConfigured || !supabase) {
    return {
      ok: false,
      message: 'Supabase credentials not configured yet (.env).',
    }
  }

  try {
    // Quick ping to Supabase Auth health endpoint
    const { error } = await supabase.auth.getSession()
    if (error) {
      return { ok: false, message: error.message }
    }
    return { ok: true, message: 'Connected to Supabase successfully' }
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Unknown connection error',
    }
  }
}
