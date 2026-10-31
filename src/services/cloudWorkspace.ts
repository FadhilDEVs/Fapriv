import { supabase } from '../lib/supabase.ts'
import type {
  UserProfile,
  ShortcutItem,
  NoteItem,
  ImportantDataItem,
  CategoryItem,
  TagItem,
  ActivityItem,
  DeletedItem,
} from '../types/fapriv.ts'

export const PRIMARY_WORKSPACE_ID = 'fadhil_primary_workspace'

export interface CloudWorkspacePayload {
  profile: UserProfile
  shortcuts: ShortcutItem[]
  notes: NoteItem[]
  importantData: ImportantDataItem[]
  categories: CategoryItem[]
  tags: TagItem[]
  activities: ActivityItem[]
  deletedItems: DeletedItem[]
  securityPin?: string
}

export const GRANT_SQL_SNIPPET = `GRANT ALL ON TABLE public.fapriv_workspace TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;`

export const SQL_SCHEMA_INSTRUCTION = `-- Jalankan SQL ini di Dashboard Supabase > SQL Editor > Run:
CREATE TABLE IF NOT EXISTS public.fapriv_workspace (
  id text PRIMARY KEY,
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  shortcuts jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  important_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  activities jsonb NOT NULL DEFAULT '[]'::jsonb,
  deleted_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  security_pin text DEFAULT '123456',
  updated_at timestamptz DEFAULT now()
);

-- Berikan izin akses penuh ke role anon & authenticated
GRANT ALL ON TABLE public.fapriv_workspace TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Buka izin akses untuk aplikasi personal Fapriv
ALTER TABLE public.fapriv_workspace ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon full access to fapriv_workspace" ON public.fapriv_workspace;
CREATE POLICY "Allow anon full access to fapriv_workspace"
  ON public.fapriv_workspace
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Aktifkan Supabase Realtime agar sinkronisasi antar perangkat berjalan otomatis seketika
ALTER PUBLICATION supabase_realtime ADD TABLE public.fapriv_workspace;
`

/**
 * Fetch remote workspace from Supabase
 */
export async function fetchRemoteWorkspace(): Promise<{
  success: boolean
  data?: CloudWorkspacePayload
  error?: string
  isTableMissing?: boolean
  isPermissionDenied?: boolean
}> {
  if (!supabase) {
    return { success: false, error: 'Supabase client belum terkonfigurasi (.env)' }
  }

  try {
    const { data, error } = await (supabase.from('fapriv_workspace') as any)
      .select('*')
      .eq('id', PRIMARY_WORKSPACE_ID)
      .maybeSingle()

    if (error) {
      if (error.code === '42501' || error.message?.includes('permission denied')) {
        return { success: false, error: error.message, isPermissionDenied: true }
      }
      if (error.code === '42P01' || error.message?.includes('relation "public.fapriv_workspace" does not exist')) {
        return { success: false, error: error.message, isTableMissing: true }
      }
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: true, data: undefined }
    }

    const payload: CloudWorkspacePayload = {
      profile: (data.profile || {}) as UserProfile,
      shortcuts: (data.shortcuts || []) as ShortcutItem[],
      notes: (data.notes || []) as NoteItem[],
      importantData: (data.important_data || []) as ImportantDataItem[],
      categories: (data.categories || []) as CategoryItem[],
      tags: (data.tags || []) as TagItem[],
      activities: (data.activities || []) as ActivityItem[],
      deletedItems: (data.deleted_items || []) as DeletedItem[],
      securityPin: (data.security_pin || '123456') as string,
    }

    return { success: true, data: payload }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown sync error'
    return { success: false, error: msg }
  }
}

// Unique tab session ID to prevent echo/feedback loops
export const CLIENT_SESSION_ID =
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36)

/**
 * Push current local workspace to Supabase Cloud
 */
export async function pushRemoteWorkspace(payload: CloudWorkspacePayload): Promise<{
  success: boolean
  error?: string
  isTableMissing?: boolean
  isPermissionDenied?: boolean
}> {
  if (!supabase) {
    return { success: false, error: 'Supabase client belum terkonfigurasi' }
  }

  try {
    // Embed _originClientId inside profile object so Realtime listener knows who sent it
    const profileWithOrigin = {
      ...(payload.profile || {}),
      _originClientId: CLIENT_SESSION_ID,
    }

    const { error } = await (supabase.from('fapriv_workspace') as any).upsert(
      {
        id: PRIMARY_WORKSPACE_ID,
        profile: profileWithOrigin as any,
        shortcuts: payload.shortcuts as any,
        notes: payload.notes as any,
        important_data: payload.importantData as any,
        categories: payload.categories as any,
        tags: payload.tags as any,
        activities: payload.activities as any,
        deleted_items: payload.deletedItems as any,
        security_pin: payload.securityPin || '123456',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    if (error) {
      if (error.code === '42501' || error.message?.includes('permission denied')) {
        return { success: false, error: error.message, isPermissionDenied: true }
      }
      if (error.code === '42P01' || error.message?.includes('relation "public.fapriv_workspace" does not exist')) {
        return { success: false, error: error.message, isTableMissing: true }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown save error'
    return { success: false, error: msg }
  }
}

/**
 * Realtime listener for cross-device updates
 */
export function subscribeToWorkspaceChanges(onRemoteUpdate: (payload: CloudWorkspacePayload) => void) {
  if (!supabase) return () => {}

  try {
    const channel = supabase
      .channel('fapriv_cloud_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fapriv_workspace',
          filter: `id=eq.${PRIMARY_WORKSPACE_ID}`,
        },
        (payload: any) => {
          if (payload.new) {
            const row = payload.new
            const incomingProfile = (row.profile || {}) as any

            // CRITICAL FIX: Ignore events that originated from THIS browser tab/session!
            // This stops the infinite loop / rollback where an edit immediately gets overwritten
            // by its own incoming echo before the user can finish typing or saving.
            if (incomingProfile._originClientId === CLIENT_SESSION_ID) {
              return
            }

            // Clean internal flag before applying to local state
            const cleanedProfile = { ...incomingProfile }
            delete cleanedProfile._originClientId

            const incomingData: CloudWorkspacePayload = {
              profile: cleanedProfile as UserProfile,
              shortcuts: (row.shortcuts || []) as ShortcutItem[],
              notes: (row.notes || []) as NoteItem[],
              importantData: (row.important_data || []) as ImportantDataItem[],
              categories: (row.categories || []) as CategoryItem[],
              tags: (row.tags || []) as TagItem[],
              activities: (row.activities || []) as ActivityItem[],
              deletedItems: (row.deleted_items || []) as DeletedItem[],
              securityPin: (row.security_pin || '123456') as string,
            }
            onRemoteUpdate(incomingData)
          }
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  } catch (err) {
    console.warn('[Realtime] Failed to subscribe to cloud updates:', err)
    return () => {}
  }
}
