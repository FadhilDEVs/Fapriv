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
  ShieldCheck,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { useSupabaseStatus } from '../../hooks/useSupabaseStatus.ts'

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
  } = useWorkspace()

  const { isConfigured, urlPreview, message: supabaseMsg } = useSupabaseStatus()

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
        <div className="flex items-center gap-2.5 pb-4 border-b border-rose-950/40">
          <User className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Profil Pengguna</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={profile.avatarUrl || '/assets/avatar.jpg'}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-600/40"
            />
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <p className="text-sm font-bold text-white">{profile.name}</p>
              <p className="text-xs text-zinc-400">{profile.email}</p>
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

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950/40"
            >
              Simpan Profil
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

      {/* 5. Cloud Integration Info (Supabase) */}
      <div className="p-4 rounded-2xl bg-zinc-950/60 border border-rose-950/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Supabase Cloud Engine</p>
            <p className="text-[11px] text-zinc-400">
              {isConfigured ? `Endpoint: ${urlPreview}` : supabaseMsg}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
            isConfigured
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
          }`}
        >
          {isConfigured ? 'Ready' : 'Local Storage Mode'}
        </span>
      </div>
    </div>
  )
}
