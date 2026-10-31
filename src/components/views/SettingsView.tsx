import React, { useState, useRef } from 'react'
import {
  Settings,
  User,
  Moon,
  Sun,
  Laptop,
  FolderTree,
  Tag,
  Download,
  Upload,
  Database,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Cloud,
  RefreshCw,
  Copy,
  Code,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { useSupabaseStatus } from '../../hooks/useSupabaseStatus.ts'
import { SQL_SCHEMA_INSTRUCTION } from '../../services/cloudWorkspace.ts'

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    theme,
    setTheme,
    categories,
    addCategory,
    deleteCategory,
    tags,
    addTag,
    deleteTag,
    exportBackup,
    importBackup,
    setIsProfileModalOpen,
    cloudSyncStatus,
    lastSyncedAt,
    syncWithCloud,
    copyToClipboard,
  } = useWorkspace()

  const [showSqlModal, setShowSqlModal] = useState(false)

  const { urlPreview } = useSupabaseStatus()

  // Profile local state
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [quote, setQuote] = useState(profile.quote || '')

  // Categories & Tags local inputs
  const [newCatName, setNewCatName] = useState('')
  const [newTagName, setNewTagName] = useState('')

  // Import file ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, email, quote })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        importBackup(content, importMode)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="max-w-4xl space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Settings</h2>
        </div>
        <p className="text-xs text-zinc-400 mt-0.5">
          Konfigurasi preferensi ruang kerja pribadi, tema, kategori, dan cadangan data.
        </p>
      </div>

      {/* 1. Profile Settings */}
      <div
        className="rounded-3xl border p-6 space-y-6"
        style={{
          backgroundColor: 'rgba(33, 9, 13, 0.7)',
          borderColor: 'rgba(101, 10, 18, 0.5)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-rose-950/40">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Profil Pengguna</h3>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 60%, #650A12 100%)',
              boxShadow: '0 0 20px -3px rgba(213, 31, 43, 0.45)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kustomisasi Profil Lengkap</span>
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl || '/assets/avatar.jpg'}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-rose-600/40"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-rose-900 border border-rose-500 text-[8px] font-black text-white">
                {profile.badge || 'OWNER'}
              </span>
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className="text-sm font-bold text-white">{profile.name}</p>
                <span className="text-xs text-rose-300 font-mono">@{profile.nickname || 'fadhil'}</span>
              </div>
              <p className="text-xs text-zinc-400">{profile.email} • {profile.role || 'Personal Workspace'}</p>
              <p className="text-[11px] text-zinc-500 italic">"{profile.quote}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nama Pengguna
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white focus:outline-none focus:border-rose-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white focus:outline-none focus:border-rose-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Kutipan Inspirasi Harian
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white focus:outline-none focus:border-rose-500/80"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950/40 cursor-pointer"
            >
              Simpan Profil Cepat
            </button>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="text-xs text-rose-300 hover:text-white underline cursor-pointer"
            >
              Ubah Foto, Banner & PIN Keamanan →
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme Preferences */}
      <div
        className="rounded-3xl border p-6 space-y-4"
        style={{
          backgroundColor: 'rgba(33, 9, 13, 0.7)',
          borderColor: 'rgba(101, 10, 18, 0.5)',
        }}
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-rose-950/40">
          <Moon className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Tema & Tampilan</h3>
        </div>

        <p className="text-xs text-zinc-400">
          Pilih tema tampilan FAPRIV. Dark Crimson Luxury Workspace direkomendasikan untuk pengalaman optimal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'dark'
                ? 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-rose-400" />
              {theme === 'dark' && <Check className="w-4 h-4 text-rose-400" />}
            </div>
            <p className="text-xs font-bold text-white">Dark Mode (Utama)</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Dark Crimson Luxury Workspace</p>
          </button>

          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'light'
                ? 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className="w-5 h-5 text-amber-400" />
              {theme === 'light' && <Check className="w-4 h-4 text-rose-400" />}
            </div>
            <p className="text-xs font-bold text-white">Light Mode</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Tampilan terang dengan aksen crimson</p>
          </button>

          {/* System Default */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'system'
                ? 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Laptop className="w-5 h-5 text-indigo-400" />
              {theme === 'system' && <Check className="w-4 h-4 text-rose-400" />}
            </div>
            <p className="text-xs font-bold text-white">System Default</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Mengikuti pengaturan sistem operasi</p>
          </button>
        </div>
      </div>

      {/* 3. Category & Tags Management */}
      <div
        className="rounded-3xl border p-6 space-y-6"
        style={{
          backgroundColor: 'rgba(33, 9, 13, 0.7)',
          borderColor: 'rgba(101, 10, 18, 0.5)',
        }}
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-rose-950/40">
          <FolderTree className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Pengelolaan Kategori & Tags</h3>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-zinc-300">Daftar Kategori ({categories.length})</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-zinc-200"
              >
                <span>{c.name}</span>
                <button
                  type="button"
                  onClick={() => deleteCategory(c.id)}
                  className="text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nama kategori baru..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (newCatName.trim()) {
                  addCategory(newCatName.trim())
                  setNewCatName('')
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3 pt-4 border-t border-rose-950/40">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-rose-400" /> Daftar Tags ({tags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-rose-950/50 border border-rose-800/40 text-rose-300"
              >
                <span>#{t.name}</span>
                <button
                  type="button"
                  onClick={() => deleteTag(t.id)}
                  className="text-zinc-500 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Nama tag baru..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (newTagName.trim()) {
                  addTag(newTagName.trim())
                  setNewTagName('')
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Tag
            </button>
          </div>
        </div>
      </div>

      {/* 4. Backup & Restore (JSON) */}
      <div
        className="rounded-3xl border p-6 space-y-4"
        style={{
          backgroundColor: 'rgba(33, 9, 13, 0.7)',
          borderColor: 'rgba(101, 10, 18, 0.5)',
        }}
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-rose-950/40">
          <Database className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Cadangan & Pemulihan (Backup & Restore)</h3>
        </div>

        <p className="text-xs text-zinc-400">
          Ekspor seluruh shortcut, catatan, dan data penting ke file JSON mandiri untuk dicadangkan
          atau dipindahkan ke perangkat lain.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Export */}
          <button
            type="button"
            onClick={exportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Seluruh Data (JSON)</span>
          </button>

          {/* Import file input hidden */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <select
              value={importMode}
              onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="merge">Gabungkan (Merge)</option>
              <option value="replace">Gantikan Semua (Replace)</option>
            </select>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
            >
              <Upload className="w-4 h-4" />
              <span>Impor Data JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Universal Cloud Synchronization (Supabase) */}
      <div
        className="rounded-3xl border p-6 space-y-5"
        style={{
          backgroundColor: 'rgba(33, 9, 13, 0.7)',
          borderColor: 'rgba(101, 10, 18, 0.5)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-950/40">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-bold text-white">Sinkronisasi Cloud Universal (Supabase)</h3>
              <p className="text-[11px] text-zinc-400">
                Akses Fapriv dari HP, Laptop, atau PC manapun dengan data yang selalu tersinkronisasi otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-[11px] px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : cloudSyncStatus === 'pending_setup'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              {cloudSyncStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-current" />
              )}
              <span>
                {cloudSyncStatus === 'synced'
                  ? 'Tersinkronisasi'
                  : cloudSyncStatus === 'syncing'
                  ? 'Sedang Menyinkronkan...'
                  : cloudSyncStatus === 'pending_setup'
                  ? 'Tabel Belum Dibuat'
                  : 'Mode Offline'}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <p className="text-[11px] text-zinc-400 font-medium">Status Koneksi Supabase</p>
            <p className="text-xs font-bold text-white font-mono truncate">
              {urlPreview || 'igdddbjlkxqibgmwqitj.supabase.co'}
            </p>
            <p className="text-[10px] text-zinc-500">
              Sinkronisasi Terakhir: {lastSyncedAt ? `${lastSyncedAt}` : 'Belum pernah'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between gap-3">
            <div>
              <p className="text-[11px] text-zinc-400 font-medium">Tindakan Cepat</p>
              <p className="text-[11px] text-zinc-300">
                Tekan untuk mengunggah/mengunduh status workspace secara langsung ke Supabase Cloud.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => syncWithCloud(true)}
                disabled={cloudSyncStatus === 'syncing'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>Sinkronkan Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlModal(!showSqlModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-all cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-rose-400" />
                <span>{showSqlModal ? 'Tutup Skrip SQL' : 'Skrip SQL Database'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SQL Schema helper box */}
        {showSqlModal && (
          <div className="p-4 rounded-2xl bg-black/90 border border-rose-900/60 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-rose-400" />
                  Skrip SQL Tabel `fapriv_workspace`
                </p>
                <p className="text-[11px] text-zinc-400">
                  Tempel dan jalankan di Dashboard Supabase → SQL Editor → Run:
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(SQL_SCHEMA_INSTRUCTION, 'Skrip SQL')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-700/60 hover:bg-rose-900 text-xs font-semibold text-rose-200 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin SQL</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-rose-200 font-mono overflow-x-auto max-h-48">
              {SQL_SCHEMA_INSTRUCTION}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
