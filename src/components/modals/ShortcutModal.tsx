import React, { useState, useEffect } from 'react'
import { X, Star, Pin, Globe, Link2 } from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { ShortcutItem } from '../../types/fapriv.ts'

export const ShortcutModal: React.FC = () => {
  const {
    editingShortcut,
    setEditingShortcut,
    addShortcut,
    updateShortcut,
    categories,
  } = useWorkspace()

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Work')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    if (editingShortcut) {
      setTitle(editingShortcut.title || '')
      setUrl(editingShortcut.url || 'https://')
      setDescription(editingShortcut.description || '')
      setCategory(editingShortcut.category || (categories[0]?.name ?? 'Work'))
      setTags(editingShortcut.tags || [])
      setIsFavorite(editingShortcut.isFavorite || false)
      setIsPinned(editingShortcut.isPinned || false)
    }
  }, [editingShortcut, categories])

  if (!editingShortcut) return null

  const isEditing = Boolean(editingShortcut.id)

  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase().replace(/^#/, '')
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean])
      setTagInput('')
    }
  }

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    // Auto-detect brand icon if available
    let detectedIcon = 'globe'
    const lowUrl = url.toLowerCase()
    if (lowUrl.includes('drive.google')) detectedIcon = 'gdrive'
    else if (lowUrl.includes('mail.google')) detectedIcon = 'gmail'
    else if (lowUrl.includes('chatgpt') || lowUrl.includes('openai')) detectedIcon = 'chatgpt'
    else if (lowUrl.includes('canva')) detectedIcon = 'canva'
    else if (lowUrl.includes('notion')) detectedIcon = 'notion'
    else if (lowUrl.includes('youtube')) detectedIcon = 'youtube'
    else if (lowUrl.includes('github')) detectedIcon = 'github'
    else if (lowUrl.includes('figma')) detectedIcon = 'figma'

    const shortcutPayload: Omit<ShortcutItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      category,
      tags,
      isFavorite,
      isPinned,
      icon: detectedIcon,
    }

    if (isEditing) {
      updateShortcut(editingShortcut.id, shortcutPayload)
    } else {
      addShortcut(shortcutPayload)
    }

    setEditingShortcut(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in"
        onClick={() => setEditingShortcut(null)}
      />

      <div
        className="relative w-full max-w-lg rounded-2xl border backdrop-blur-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95"
        style={{
          backgroundColor: '#16080B',
          borderColor: 'rgba(213, 31, 43, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-rose-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-600/30 flex items-center justify-center text-rose-400">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {isEditing ? 'Edit Shortcut' : 'Tambah Shortcut Baru'}
            </h3>
          </div>
          <button
            onClick={() => setEditingShortcut(null)}
            className="p-1 rounded-lg text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Judul Shortcut *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: GitHub, ChatGPT, Google Drive..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              URL Website / Aplikasi *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-rose-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Deskripsi Singkat
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Cloud storage & files"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-white focus:outline-none focus:border-rose-500/80"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-zinc-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="#tag"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-rose-950/40 border border-rose-800/40 text-rose-300"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Pin and Favorite Toggles */}
          <div className="flex items-center justify-between pt-2 border-t border-rose-950/40">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isPinned ? 'bg-rose-600 border-rose-500 text-white' : 'border-zinc-700'
                  }`}
                >
                  <Pin className="w-2.5 h-2.5" />
                </div>
                <span>Sematkan ke Atas (Pin)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isFavorite ? 'bg-amber-500 border-amber-400 text-zinc-950' : 'border-zinc-700'
                  }`}
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                </div>
                <span>Favorit</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditingShortcut(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-rose-950/50"
              style={{
                background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
              }}
            >
              {isEditing ? 'Simpan Perubahan' : 'Buat Shortcut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
