import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  X,
  Star,
  Pin,
  FileText,
  Copy,
  History,
  Check,
  Image as ImageIcon,
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
  } = useWorkspace()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Personal')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const [showHistory, setShowHistory] = useState(false)
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

  const availableImages = [
    { label: 'Laptop Crimson', src: '/assets/note_laptop.jpg' },
    { label: 'Book Crimson', src: '/assets/note_book.jpg' },
    { label: 'Japan Torii', src: '/assets/note_japan.jpg' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in"
        onClick={() => setEditingNote(null)}
      />

      <div
        className="relative w-full max-w-3xl rounded-2xl border backdrop-blur-2xl shadow-2xl flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 overflow-hidden"
        style={{
          backgroundColor: '#16080B',
          borderColor: 'rgba(213, 31, 43, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
        }}
      >
        {/* Header bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-rose-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-600/30 flex items-center justify-center text-rose-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isEditing ? 'Editor Catatan' : 'Catatan Baru'}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                {isEditing && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    {saveStatus === 'saving' ? (
                      <span className="text-amber-400 animate-pulse">● Menyimpan...</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
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
            <div className="flex items-center gap-1 border border-zinc-800 rounded-xl p-1 bg-zinc-900/60">
              <button
                type="button"
                onClick={handleCopyTitle}
                className="px-2 py-1 rounded-lg text-[10px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Salin Judul"
              >
                Copy Title
              </button>
              <button
                type="button"
                onClick={handleCopyContent}
                className="px-2 py-1 rounded-lg text-[10px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Salin Seluruh Isi"
              >
                Copy Content
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 transition-colors"
                title="Salin Judul & Seluruh Isi"
              >
                <Copy className="w-3 h-3" />
                <span>Copy All</span>
              </button>
            </div>

            {/* History Toggle */}
            {editingNote.history && editingNote.history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-xl text-xs transition-colors ${
                  showHistory ? 'bg-rose-950/80 text-rose-300' : 'text-zinc-400 hover:text-white'
                }`}
                title="Riwayat Perubahan"
              >
                <History className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setEditingNote(null)}
              className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* History Drawer if toggled */}
          {showHistory && editingNote.history && (
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-rose-900/40 text-xs space-y-2 mb-4">
              <p className="font-bold text-rose-300">Riwayat Perubahan ({editingNote.history.length}):</p>
              <div className="max-h-32 overflow-y-auto space-y-1.5 divide-y divide-zinc-850">
                {editingNote.history.map((hist, idx) => (
                  <div key={idx} className="pt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-mono">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-zinc-300 truncate max-w-xs">{hist.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle(hist.title)
                        setContent(hist.content)
                      }}
                      className="text-rose-400 hover:underline"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Title input */}
          <div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Judul Catatan..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-lg font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
            />
          </div>

          {/* Metadata Controls: Category, Image thumbnail, Pin, Fav */}
          <div className="flex flex-wrap items-center gap-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Kategori:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Image thumbnail selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Cover:
                </span>
                <select
                  value={selectedImage || ''}
                  onChange={(e) => setSelectedImage(e.target.value || undefined)}
                  className="px-2 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="">Tanpa Cover</option>
                  {availableImages.map((img) => (
                    <option key={img.src} value={img.src}>
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pin */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                  isPinned ? 'bg-rose-950/80 text-rose-300 border border-rose-600/40' : 'text-zinc-500 hover:text-white'
                }`}
                title="Sematkan catatan"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>

              {/* Favorite */}
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                  isFavorite ? 'bg-amber-950/80 text-amber-400 border border-amber-600/40' : 'text-zinc-500 hover:text-white'
                }`}
                title="Tandai favorit"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
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
                placeholder="Tambahkan tag (tekan enter)..."
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
              >
                + Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-rose-950/40 border border-rose-800/40 text-rose-300"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white ml-0.5"
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
              className="w-full p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 leading-relaxed font-sans focus:outline-none focus:border-rose-500/60 resize-y"
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-rose-950/40 bg-zinc-950/80 flex items-center justify-between shrink-0">
          <p className="text-xs text-zinc-500 hidden sm:block">
            {content.split(/\s+/).filter(Boolean).length} kata • {content.length} karakter
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => handleSaveManual()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-rose-950/50"
              style={{
                background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
              }}
            >
              {isEditing ? 'Selesai & Simpan' : 'Simpan Catatan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
