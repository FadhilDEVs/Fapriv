/**
 * Base service layer for API calls and Supabase queries.
 * Expand this file or add dedicated service modules as business requirements are introduced.
 */

import { supabase } from '../lib/supabase.ts'

export const baseService = {
  /**
   * Healthcheck function for backend connectivity.
   */
  async checkHealth() {
    if (!supabase) {
      return { status: 'idle', message: 'Supabase client not configured yet' }
    }
    const { error } = await supabase.auth.getSession()
    return {
      status: error ? 'error' : 'ok',
      error: error?.message,
    }
  },
}
