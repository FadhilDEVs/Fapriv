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
      // Check if table missing (Postgres error code 42P01)
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

/**
 * Push current local workspace to Supabase Cloud
 */
export async function pushRemoteWorkspace(payload: CloudWorkspacePayload): Promise<{
  success: boolean
  error?: string
  isTableMissing?: boolean
}> {
  if (!supabase) {
    return { success: false, error: 'Supabase client belum terkonfigurasi' }
  }

  try {
    const { error } = await (supabase.from('fapriv_workspace') as any).upsert(
      {
        id: PRIMARY_WORKSPACE_ID,
        profile: payload.profile as any,
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
            const incomingData: CloudWorkspacePayload = {
              profile: (row.profile || {}) as UserProfile,
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
