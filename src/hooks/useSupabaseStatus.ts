import { useState, useEffect } from 'react'
import { env } from '../config/env.ts'
import { testSupabaseConnection } from '../lib/supabase.ts'
import type { ConnectionStatus } from '../types/index.ts'

export interface SupabaseStatusInfo {
  status: ConnectionStatus
  message: string
  isConfigured: boolean
  urlPreview?: string
}

export function useSupabaseStatus(): SupabaseStatusInfo {
  const [status, setStatus] = useState<ConnectionStatus>(
    env.supabase.isConfigured ? 'checking' : 'not_configured'
  )
  const [message, setMessage] = useState<string>(
    env.supabase.isConfigured
      ? 'Connecting to Supabase...'
      : 'Awaiting configuration in .env'
  )

  useEffect(() => {
    let isMounted = true

    if (!env.supabase.isConfigured) {
      return
    }

    testSupabaseConnection().then((res) => {
      if (!isMounted) return
      if (res.ok) {
        setStatus('connected')
        setMessage(res.message)
      } else {
        setStatus('error')
        setMessage(res.message)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    status,
    message,
    isConfigured: env.supabase.isConfigured,
    urlPreview: env.supabase.url ? env.supabase.url.replace(/^https?:\/\//, '') : undefined,
  }
}
