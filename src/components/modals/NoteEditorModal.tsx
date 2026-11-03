import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  X,
  Star,
  Pin,
  FileText,
  Copy,
  Check,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NoteItem } from '../../types/fapriv.ts'

export const NoteEditorModal: React.FC = () => {
  const {
    editingNote,
    setEditingNote,
    addNote,
    updateNote,
    categories,
    copyToClipboard,
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Personal')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '')
      setContent(editingNote.content || '')
      setCategory(editingNote.category || (categories[0]?.name ?? 'Personal'))
      setTags(editingNote.tags || [])
      setIsFavorite(editingNote.isFavorite || false)
      setIsPinned(editingNote.isPinned || false)
      setSelectedImage(editingNote.image)
      setActiveNoteId(editingNote.id || null)
      setSaveStatus('saved')
    }
  }, [editingNote, categories])

  // Debounced auto-save when editing an existing note
  const triggerAutoSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (!activeNoteId) return
      setSaveStatus('saving')
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)

      autoSaveTimerRef.current = setTimeout(() => {
        updateNote(activeNoteId, {
          title: newTitle,
          content: newContent,
          excerpt: newContent.slice(0, 100),
        })
        setSaveStatus('saved')
      }, 800)
    },
    [activeNoteId, updateNote]
  )

  if (!editingNote) return null

  const isEditing = Boolean(activeNoteId)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (isEditing) triggerAutoSave(val, content)
  }

  const handleContentChange = (val: string) => {
    setContent(val)
    if (isEditing) triggerAutoSave(title, val)
  }

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

  const handleSaveManual = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!title.trim()) return

    const payload: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      content: content.trim(),
      excerpt: content.trim().slice(0, 120),
      category,
      tags,
      isFavorite,
      isPinned,
      image: selectedImage,
    }

    if (isEditing && activeNoteId) {
      updateNote(activeNoteId, payload)
    } else {
      const created = addNote(payload)
      setActiveNoteId(created.id)
    }

    setEditingNote(null)
  }

  // Quick Copy options
  const handleCopyTitle = () => copyToClipboard(title, 'Judul Catatan')
  const handleCopyContent = () => copyToClipboard(content, 'Isi Catatan')
  const handleCopyAll = () => copyToClipboard(`${title}\n\n${content}`, 'Judul & Seluruh Catatan')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
      <div
        className={`fixed inset-0 backdrop-blur-sm animate-in fade-in ${
          isLight ? 'bg-slate-900/40' : 'bg-black/85'
        }`}
        onClick={() => setEditingNote(null)}
      />

      <div
        className={`relative w-full max-w-3xl rounded-2xl border backdrop-blur-2xl shadow-2xl flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 overflow-hidden ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : ''
        }`}
        style={
          isLight
            ? {
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                boxShadow: '0 20px 45px -10px rgba(37, 99, 235, 0.12), 0 0 20px rgba(0, 0, 0, 0.05)',
              }
            : {
                backgroundColor: '#16080B',
                borderColor: 'rgba(213, 31, 43, 0.4)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
              }
        }
      >
        {/* Header bar */}
        <div
          className={`p-4 sm:p-5 flex items-center justify-between border-b shrink-0 ${
            isLight ? 'border-slate-200 bg-slate-50/50' : 'border-rose-950/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-rose-950/60 border-rose-600/30 text-rose-400'
              }`}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`text-base font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {isEditing ? 'Editor Catatan' : 'Catatan Baru'}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                {isEditing && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    {saveStatus === 'saving' ? (
                      <span className="text-amber-500 animate-pulse">● Menyimpan...</span>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Tersimpan
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Copy dropdown / button bar */}
            <div
              className={`flex items-center gap-1 border rounded-xl p-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <button
                type="button"
                onClick={handleCopyTitle}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                title="Salin Judul"
              >
                Copy Title
              </button>
              <button
                type="button"
                onClick={handleCopyContent}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                title="Salin Seluruh Isi"
              >
                Copy Content
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                  isLight
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/60'
                }`}
                title="Salin Judul & Seluruh Isi"
              >
                <Copy className="w-3 h-3" />
                <span>Salin Semua</span>
              </button>
            </div>

            <button
              onClick={() => setEditingNote(null)}
              className={`p-1.5 rounded-xl transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note Body Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Title input */}
          <div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Judul Catatan..."
              className={`w-full px-4 py-3 rounded-xl border text-base font-bold focus:outline-none transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  : 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
              }`}
            />
          </div>

          {/* Controls bar: Category, Pin, Favorite */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Category select */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Kategori:
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`px-2.5 py-1 rounded-lg border text-xs focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:border-rose-500/80'
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

              {/* Pin toggle */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                  isPinned
                    ? isLight
                      ? 'bg-blue-100 border-blue-200 text-blue-700'
                      : 'bg-rose-950/60 border-rose-700 text-rose-300'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                }`}
              >
                <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                <span>{isPinned ? 'Dipin' : 'Pin'}</span>
              </button>

              {/* Favorite toggle */}
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-100 border-amber-300 text-amber-700'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                }`}
              >
                <Star className={`w-3 h-3 ${isFavorite ? 'fill-current text-amber-500' : ''}`} />
                <span>{isFavorite ? 'Favorit' : 'Favoritkan'}</span>
              </button>
            </div>
          </div>

          {/* Tags bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
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
                placeholder="Tambah tag (#kuliah)..."
                className={`w-full sm:w-64 px-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    : 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                }`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={`px-3 py-1.5 rounded-xl text-xs cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                + Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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
                      className={isLight ? 'hover:text-blue-900 ml-0.5 cursor-pointer' : 'hover:text-white ml-0.5 cursor-pointer'}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Editor Textarea */}
          <div>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Tuliskan catatan, ide, atau dokumen di sini... Format bebas."
              className={`w-full p-4 rounded-xl border text-sm leading-relaxed font-sans focus:outline-none resize-y ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-rose-500/60'
              }`}
            />
          </div>
        </div>

        {/* Footer controls */}
        <div
          className={`p-4 border-t flex items-center justify-between shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/80 border-rose-950/40'
          }`}
        >
          <p className={`text-xs hidden sm:block ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            {content.split(/\s+/).filter(Boolean).length} kata • {content.length} karakter
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => handleSaveManual()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer transition-transform active:scale-95"
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
              {isEditing ? 'Selesai & Simpan' : 'Simpan Catatan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
