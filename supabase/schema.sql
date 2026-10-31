-- ========================================================
-- FAPRIV: Universal Cloud Workspace SQL Schema for Supabase
-- ========================================================
-- Jalankan skrip ini sekali di Supabase Dashboard:
-- 1. Buka https://supabase.com/dashboard/project/igdddbjlkxqibgmwqitj
-- 2. Pilih menu "SQL Editor" di bilah kiri
-- 3. Tempel SQL di bawah ini lalu klik tombol "Run"
-- ========================================================

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

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.fapriv_workspace ENABLE ROW LEVEL SECURITY;

-- Berikan izin akses baca & tulis untuk client web app Fapriv
DROP POLICY IF EXISTS "Allow anon full access to fapriv_workspace" ON public.fapriv_workspace;
CREATE POLICY "Allow anon full access to fapriv_workspace"
  ON public.fapriv_workspace
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Aktifkan Realtime agar setiap perubahan di HP langsung muncul di Laptop seketika
ALTER PUBLICATION supabase_realtime ADD TABLE public.fapriv_workspace;
