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
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'

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
        className={`relative w-full max-w-lg rounded-2xl border backdrop-blur-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 ${
          isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-800' : ''
        }`}
        style={
          isLight
            ? undefined
            : {
                backgroundColor: '#16080B',
                borderColor: 'rgba(213, 31, 43, 0.4)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
              }
        }
      >
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isLight ? 'border-slate-200' : 'border-rose-950/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-rose-950/60 border-rose-600/30 text-rose-400'
              }`}
            >
              <Link2 className="w-4 h-4" />
            </div>
            <h3
              className={`text-base font-bold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {isEditing ? 'Edit Shortcut' : 'Tambah Shortcut Baru'}
            </h3>
          </div>
          <button
            onClick={() => setEditingShortcut(null)}
            className={`p-1 rounded-lg ${
              isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}
            >
              Judul Shortcut *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: GitHub, ChatGPT, Google Drive..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                  : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}
            >
              URL Website / Aplikasi *
            </label>
            <div className="relative">
              <Globe
                className={`w-4 h-4 absolute left-3.5 top-3 ${
                  isLight ? 'text-slate-400' : 'text-zinc-500'
                }`}
              />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}
            >
              Deskripsi Singkat
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Cloud storage & files"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                  : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isLight ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    : 'bg-zinc-900/80 border-zinc-800 text-white focus:border-rose-500/80'
                }`}
              >
                {categories.map((c) => (
                  <option
                    key={c.id}
                    value={c.name}
                    className={isLight ? 'bg-white text-slate-800' : 'bg-zinc-900 text-white'}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isLight ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
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
                  className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                      : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={`px-3 py-2 rounded-xl text-xs font-medium ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
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
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${
                    isLight
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                  }`}
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className={isLight ? 'hover:text-blue-900' : 'hover:text-white'}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Pin and Favorite Toggles */}
          <div
            className={`flex items-center justify-between pt-2 border-t ${
              isLight ? 'border-slate-200' : 'border-rose-950/40'
            }`}
          >
            <div className="flex items-center gap-6">
              <label
                className={`flex items-center gap-2 text-xs cursor-pointer select-none ${
                  isLight ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isPinned
                      ? isLight
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-rose-600 border-rose-500 text-white'
                      : isLight
                      ? 'border-slate-300 bg-white'
                      : 'border-zinc-700'
                  }`}
                >
                  <Pin className="w-2.5 h-2.5" />
                </div>
                <span>Sematkan ke Atas (Pin)</span>
              </label>

              <label
                className={`flex items-center gap-2 text-xs cursor-pointer select-none ${
                  isLight ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isFavorite
                      ? 'bg-amber-500 border-amber-400 text-zinc-950'
                      : isLight
                      ? 'border-slate-300 bg-white'
                      : 'border-zinc-700'
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
              className={`px-4 py-2 rounded-xl text-xs font-medium ${
                isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer"
              style={
                isLight
                  ? {
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      boxShadow: '0 4px 14px -2px rgba(37, 99, 235, 0.4)',
                    }
                  : {
                      background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
                      boxShadow: '0 4px 14px -2px rgba(213, 31, 43, 0.4)',
                    }
              }
            >
              {isEditing ? 'Simpan Perubahan' : 'Buat Shortcut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
