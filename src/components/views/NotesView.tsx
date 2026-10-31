import React, { useState } from 'react'
import {
  FileText,
  Plus,
  Search,
  LayoutGrid,
  List,
  Star,
  Pin,
  Copy,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NoteItem } from '../../types/fapriv.ts'

export const NotesView: React.FC = () => {
  const {
    notes,
    toggleFavoriteNote,
    deleteNote,
    setEditingNote,
    openQuickAdd,
    copyToClipboard,
  } = useWorkspace()

  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [copyDropdownId, setCopyDropdownId] = useState<string | null>(null)

  // Filter
  const filteredNotes = notes.filter((n) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Favorites'
        ? n.isFavorite
        : n.category.toLowerCase() === activeCategory.toLowerCase()

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))

    return matchesCategory && matchesSearch
  })

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  const handleCopyOption = (note: NoteItem, type: 'title' | 'content' | 'all') => {
    setCopyDropdownId(null)
    if (type === 'title') {
      copyToClipboard(note.title, 'Judul Catatan')
    } else if (type === 'content') {
      copyToClipboard(note.content, 'Isi Catatan')
    } else {
      copyToClipboard(`${note.title}\n\n${note.content}`, 'Judul & Seluruh Catatan')
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Notes</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Capture and organize your thoughts, ideas, and knowledge.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('note')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer self-start sm:self-auto"
          style={{
            background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
            boxShadow: '0 0 20px -3px rgba(213, 31, 43, 0.4)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Personal', 'Work', 'Learning', 'Travel'].map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40 border border-rose-500/50'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Search & Grid/List view controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari catatan atau tags..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/70"
            />
          </div>

          <div className="flex items-center border border-zinc-800 rounded-xl p-0.5 bg-zinc-900/70">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-rose-950/80 text-rose-300' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-rose-950/80 text-rose-300' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes List or Grid */}
      {sortedNotes.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-rose-500 mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">Tidak ada catatan ditemukan</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Mulai tuliskan pemikiran, ringkasan buku, atau konsep proyek baru Anda.
          </p>
          <button
            onClick={() => openQuickAdd('note')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
          >
            + Tulis Catatan Baru
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="group relative flex flex-col justify-between rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'rgba(33, 9, 13, 0.75)',
                borderColor: note.isPinned ? 'rgba(213, 31, 43, 0.6)' : 'rgba(101, 10, 18, 0.45)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Optional Cover Image */}
              {note.image && (
                <div className="h-36 w-full overflow-hidden relative">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21090D] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-rose-950/80 text-rose-300 border border-rose-800/40">
                      {note.category}
                    </span>
                    {note.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
                        <Pin className="w-3 h-3 fill-rose-500" /> Pinned
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavoriteNote(note.id)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          note.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === note.id ? null : note.id)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-white"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {menuOpenId === note.id && (
                        <div
                          className="absolute right-0 mt-1 w-32 rounded-xl border backdrop-blur-xl shadow-xl p-1 z-30 animate-in fade-in"
                          style={{
                            backgroundColor: '#16080B',
                            borderColor: 'rgba(101, 10, 18, 0.6)',
                          }}
                        >
                          <button
                            onClick={() => {
                              setMenuOpenId(null)
                              setEditingNote(note)
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-rose-950/40"
                          >
                            <Edit2 className="w-3 h-3 text-rose-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpenId(null)
                              deleteNote(note.id)
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/60"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content body */}
                <div
                  className="mt-3 flex-1 cursor-pointer"
                  onClick={() => setEditingNote(note)}
                >
                  <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {note.excerpt || note.content}
                  </p>
                </div>

                {/* Tags row */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((t) => (
                      <span key={t} className="text-[10px] text-zinc-500">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card footer with Date & 3 Copy options */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-rose-950/40">
                  <span className="text-[10px] text-zinc-500">
                    {new Date(note.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  {/* 3 Copy Options Menu */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setCopyDropdownId(copyDropdownId === note.id ? null : note.id)
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/40 transition-colors"
                      title="Pilihan Salin Cepat"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>

                    {copyDropdownId === note.id && (
                      <div
                        className="absolute right-0 bottom-full mb-1 w-36 rounded-xl border backdrop-blur-xl shadow-xl p-1 z-30 animate-in fade-in"
                        style={{
                          backgroundColor: '#16080B',
                          borderColor: 'rgba(101, 10, 18, 0.7)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                        }}
                      >
                        <button
                          onClick={() => handleCopyOption(note, 'title')}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-rose-950/40 rounded-lg"
                        >
                          Copy Title
                        </button>
                        <button
                          onClick={() => handleCopyOption(note, 'content')}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-rose-950/40 rounded-lg"
                        >
                          Copy Content
                        </button>
                        <button
                          onClick={() => handleCopyOption(note, 'all')}
                          className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/50 rounded-lg"
                        >
                          Copy All
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div
          className="rounded-2xl border divide-y divide-rose-950/30 overflow-hidden"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
          }}
        >
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between p-3.5 hover:bg-rose-950/20 transition-colors"
            >
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => setEditingNote(note)}
              >
                {note.image ? (
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-zinc-800"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-800/30 flex items-center justify-center text-rose-400 shrink-0">
                    📝
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white truncate">{note.title}</p>
                    {note.isPinned && <Pin className="w-3 h-3 text-rose-500 fill-rose-500" />}
                    {note.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/40">
                      {note.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{note.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(`${note.title}\n\n${note.content}`, 'Seluruh Catatan')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40"
                  title="Copy All"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy All</span>
                </button>
                <button
                  onClick={() => setEditingNote(note)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900/60"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-400 bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
