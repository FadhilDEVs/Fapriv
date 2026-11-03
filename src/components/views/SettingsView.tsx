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
  AlertTriangle,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { useSupabaseStatus } from '../../hooks/useSupabaseStatus.ts'
import { SQL_SCHEMA_INSTRUCTION, GRANT_SQL_SNIPPET } from '../../services/cloudWorkspace.ts'

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

  const isLight = theme === 'light'
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
          <Settings className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-rose-500'}`} />
          <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Pengaturan
          </h2>
        </div>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Konfigurasi preferensi ruang kerja pribadi, tema, kategori, dan cadangan data.
        </p>
      </div>

      {/* 1. Profile Settings */}
      <div
        className={`rounded-3xl border p-6 space-y-6 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : ''
        }`}
        style={
          isLight
            ? undefined
            : {
                backgroundColor: 'rgba(33, 9, 13, 0.7)',
                borderColor: 'rgba(101, 10, 18, 0.5)',
              }
        }
      >
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-rose-950/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <User className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Profil Pengguna
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
            style={
              isLight
                ? {
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                  }
                : {
                    background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 60%, #650A12 100%)',
                    boxShadow: '0 0 20px -3px rgba(213, 31, 43, 0.45)',
                  }
            }
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
              <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded border text-[8px] font-black text-white ${
                isLight ? 'bg-blue-600 border-blue-400' : 'bg-rose-900 border-rose-500'
              }`}>
                {profile.badge || 'OWNER'}
              </span>
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{profile.name}</p>
                <span className={`text-xs font-mono ${isLight ? 'text-blue-600' : 'text-rose-300'}`}>
                  @{profile.nickname || 'fadhil'}
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {profile.email} • {profile.role || 'Personal Workspace'}
              </p>
              <p className={`text-[11px] italic ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>"{profile.quote}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                Nama Pengguna
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                    : 'bg-zinc-900/70 border-zinc-800 text-white focus:border-rose-500/80'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                    : 'bg-zinc-900/70 border-zinc-800 text-white focus:border-rose-500/80'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              Kutipan Inspirasi Harian
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                  : 'bg-zinc-900/70 border-zinc-800 text-white focus:border-rose-500/80'
              }`}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-transform active:scale-95 cursor-pointer ${
                isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              Simpan Profil Cepat
            </button>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className={`text-xs underline cursor-pointer ${
                isLight ? 'text-blue-600 hover:text-blue-700' : 'text-rose-300 hover:text-white'
              }`}
            >
              Ubah Foto, Banner & PIN Keamanan →
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme Preferences */}
      <div
        className={`rounded-3xl border p-6 space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : ''
        }`}
        style={
          isLight
            ? undefined
            : {
                backgroundColor: 'rgba(33, 9, 13, 0.7)',
                borderColor: 'rgba(101, 10, 18, 0.5)',
              }
        }
      >
        <div className={`flex items-center gap-2.5 pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-rose-950/40'
        }`}>
          <Moon className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Tema & Tampilan
          </h3>
        </div>

        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Pilih tema tampilan FAPRIV sesuai kenyamanan Anda (Light Mode bergaya modern soft sky atau Dark Crimson Luxury).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              theme === 'light'
                ? isLight
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                : isLight
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className="w-5 h-5 text-amber-500" />
              {theme === 'light' && <Check className={`w-4 h-4 stroke-[2.5] ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />}
            </div>
            <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Light Mode</p>
            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Tampilan cerah, bersih dengan aksen biru langit
            </p>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              theme === 'dark'
                ? isLight
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                : isLight
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              {theme === 'dark' && <Check className={`w-4 h-4 stroke-[2.5] ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />}
            </div>
            <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Dark Mode</p>
            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Dark Crimson Luxury Workspace
            </p>
          </button>

          {/* System Default */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              theme === 'system'
                ? isLight
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-rose-950/40 border-rose-500/60 ring-2 ring-rose-500/30'
                : isLight
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Laptop className="w-5 h-5 text-indigo-500" />
              {theme === 'system' && <Check className={`w-4 h-4 stroke-[2.5] ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />}
            </div>
            <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>System Default</p>
            <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Mengikuti pengaturan sistem operasi
            </p>
          </button>
        </div>
      </div>

      {/* 3. Category & Tags Management */}
      <div
        className={`rounded-3xl border p-6 space-y-6 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : ''
        }`}
        style={
          isLight
            ? undefined
            : {
                backgroundColor: 'rgba(33, 9, 13, 0.7)',
                borderColor: 'rgba(101, 10, 18, 0.5)',
              }
        }
      >
        <div className={`flex items-center gap-2.5 pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-rose-950/40'
        }`}>
          <FolderTree className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Pengelolaan Kategori & Tags
          </h3>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
            Daftar Kategori ({categories.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border ${
                  isLight
                    ? 'bg-slate-100 text-slate-800 border-slate-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                }`}
              >
                <span>{c.name}</span>
                <button
                  type="button"
                  onClick={() => deleteCategory(c.id)}
                  className={`transition-colors ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'}`}
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
              className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                if (newCatName.trim()) {
                  addCategory(newCatName.trim())
                  setNewCatName('')
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1 transition-transform active:scale-95 ${
                isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className={`space-y-3 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-rose-950/40'}`}>
          <p className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
            <Tag className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} /> Daftar Tags ({tags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${
                  isLight
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-rose-950/50 border-rose-800/40 text-rose-300'
                }`}
              >
                <span>#{t.name}</span>
                <button
                  type="button"
                  onClick={() => deleteTag(t.id)}
                  className={`hover:opacity-75 ${isLight ? 'text-blue-500' : 'text-zinc-500'}`}
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
              className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                if (newTagName.trim()) {
                  addTag(newTagName.trim())
                  setNewTagName('')
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1 transition-transform active:scale-95 ${
                isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Tag
            </button>
          </div>
        </div>
      </div>

      {/* 4. Backup & Restore (JSON) */}
      <div
        className={`rounded-3xl border p-6 space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : ''
        }`}
        style={
          isLight
            ? undefined
            : {
                backgroundColor: 'rgba(33, 9, 13, 0.7)',
                borderColor: 'rgba(101, 10, 18, 0.5)',
              }
        }
      >
        <div className={`flex items-center gap-2.5 pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-rose-950/40'
        }`}>
          <Database className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Cadangan & Pemulihan (Backup & Restore)
          </h3>
        </div>

        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Ekspor seluruh shortcut, catatan, dan data penting ke file JSON mandiri untuk dicadangkan
          atau dipindahkan ke perangkat lain.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Export */}
          <button
            type="button"
            onClick={exportBackup}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-transform active:scale-95 ${
              isLight ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
            }`}
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
              className={`px-2.5 py-2 rounded-xl border text-xs focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <option value="merge">Gabungkan (Merge)</option>
              <option value="replace">Gantikan Semua (Replace)</option>
            </select>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isLight
                  ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                  : 'text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Impor Data JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Universal Cloud Synchronization (Supabase) */}
      <div
        className={`rounded-3xl border p-6 space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : ''
        }`}
        style={
          isLight
            ? undefined
            : {
                backgroundColor: 'rgba(33, 9, 13, 0.7)',
                borderColor: 'rgba(101, 10, 18, 0.5)',
              }
        }
      >
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-rose-950/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <Cloud className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
            <div>
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Sinkronisasi Cloud Universal (Supabase)
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Akses Fapriv dari HP, Laptop, atau PC manapun dengan data yang selalu tersinkronisasi otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-[11px] px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                  : cloudSyncStatus === 'permission_denied'
                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                  : cloudSyncStatus === 'pending_setup'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
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
                  : cloudSyncStatus === 'permission_denied'
                  ? 'Izin Diperlukan (GRANT)'
                  : cloudSyncStatus === 'pending_setup'
                  ? 'Tabel Belum Dibuat'
                  : 'Mode Offline'}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'
          }`}>
            <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Status Koneksi Supabase
            </p>
            <p className={`text-xs font-bold font-mono truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {urlPreview || 'igdddbjlkxqibgmwqitj.supabase.co'}
            </p>
            <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
              Sinkronisasi Terakhir: {lastSyncedAt ? `${lastSyncedAt}` : 'Belum pernah'}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'
          }`}>
            <div>
              <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Tindakan Cepat
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                Tekan untuk mengunggah/mengunduh status workspace secara langsung ke Supabase Cloud.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => syncWithCloud(true)}
                disabled={cloudSyncStatus === 'syncing'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold shadow transition-all cursor-pointer ${
                  isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>Sinkronkan Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlModal(!showSqlModal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}
              >
                <Code className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                <span>{showSqlModal ? 'Tutup Skrip SQL' : 'Skrip SQL Database'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Permission Denied Guide Box (Error 42501) */}
        {cloudSyncStatus === 'permission_denied' && (
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
            isLight
              ? 'bg-rose-50 border-rose-200'
              : 'bg-rose-950/40 border-rose-600/50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-xs font-bold ${isLight ? 'text-rose-900' : 'text-white'}`}>
                  Tabel Supabase Terdeteksi, Namun Perlu Hak Akses Role (Error 42501)
                </h4>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-rose-800' : 'text-zinc-300'}`}>
                  PostgreSQL di Supabase mewajibkan perintah <code className="font-mono font-bold">GRANT</code> agar client diizinkan membaca & menulis data. Salin dan jalankan perintah singkat di bawah ini di SQL Editor Supabase:
                </p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border ${
              isLight ? 'bg-white border-rose-200' : 'bg-black/80 border-rose-800/40'
            }`}>
              <pre className={`text-xs font-mono select-all overflow-x-auto py-1 ${
                isLight ? 'text-rose-800' : 'text-rose-200'
              }`}>
                {GRANT_SQL_SNIPPET}
              </pre>
              <button
                type="button"
                onClick={() => copyToClipboard(GRANT_SQL_SNIPPET, 'Perintah GRANT')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all shrink-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Perintah GRANT</span>
              </button>
            </div>
            <p className={`text-[10px] italic ${isLight ? 'text-rose-600' : 'text-zinc-400'}`}>
              Setelah klik "Run" di SQL Editor Supabase, kembali ke sini dan tekan tombol "Sinkronkan Sekarang".
            </p>
          </div>
        )}

        {/* SQL Schema helper box */}
        {showSqlModal && (
          <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-150 ${
            isLight ? 'bg-slate-900 text-white border-slate-700' : 'bg-black/90 border-rose-900/60'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  Skrip SQL Tabel `fapriv_workspace`
                </p>
                <p className="text-[11px] text-zinc-400">
                  Tempel dan jalankan di Dashboard Supabase → SQL Editor → Run:
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(SQL_SCHEMA_INSTRUCTION, 'Skrip SQL')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin SQL</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-blue-200 font-mono overflow-x-auto max-h-48">
              {SQL_SCHEMA_INSTRUCTION}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
