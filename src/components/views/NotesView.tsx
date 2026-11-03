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
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'
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
            <FileText className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-rose-500'}`} />
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Catatan
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Kelola seluruh catatan pribadi, rangkuman, dan ide Anda.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('note')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer self-start sm:self-auto transition-transform active:scale-95"
          style={
            isLight
              ? {
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                }
              : {
                  background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
                  boxShadow: '0 0 20px -3px rgba(213, 31, 43, 0.4)',
                }
          }
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
                    ? isLight
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-950/40 border border-rose-500/50'
                    : isLight
                    ? 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'All' ? 'Semua' : cat}
              </button>
            )
          })}
        </div>

        {/* Search & Grid/List view controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari catatan atau tags..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none transition-colors ${
                isLight
                  ? 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-sm'
                  : 'bg-zinc-900/70 border border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/70'
              }`}
            />
          </div>

          <div className={`flex items-center border rounded-xl p-0.5 ${
            isLight ? 'border-slate-200 bg-white' : 'border-zinc-800 bg-zinc-900/70'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? isLight ? 'bg-blue-50 text-blue-600' : 'bg-rose-950/80 text-rose-300'
                  : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list'
                  ? isLight ? 'bg-blue-50 text-blue-600' : 'bg-rose-950/80 text-rose-300'
                  : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes List or Grid */}
      {sortedNotes.length === 0 ? (
        <div className={`py-20 text-center rounded-3xl border border-dashed space-y-3 ${
          isLight ? 'border-slate-300 bg-white/70' : 'border-zinc-800 bg-zinc-950/40'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
            isLight ? 'bg-blue-50 text-blue-600' : 'bg-zinc-900 text-rose-500'
          }`}>
            <FileText className="w-6 h-6" />
          </div>
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Tidak ada catatan ditemukan
          </p>
          <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            Mulai tuliskan pemikiran, ringkasan buku, atau konsep proyek baru Anda.
          </p>
          <button
            onClick={() => openQuickAdd('note')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-transform active:scale-95 ${
              isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-500'
            }`}
          >
            + Tulis Catatan Baru
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`group relative flex flex-col justify-between rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' : ''
              }`}
              style={
                isLight
                  ? undefined
                  : {
                      backgroundColor: 'rgba(33, 9, 13, 0.75)',
                      borderColor: note.isPinned ? 'rgba(213, 31, 43, 0.6)' : 'rgba(101, 10, 18, 0.45)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                    }
              }
            >
              {/* Optional Cover Image */}
              {note.image && (
                <div className="h-36 w-full overflow-hidden relative">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isLight ? 'from-white/80 via-transparent to-transparent' : 'from-[#21090D] via-transparent to-transparent'
                  }`} />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      isLight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                    }`}>
                      {note.category}
                    </span>
                    {note.isPinned && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                        isLight ? 'text-blue-600' : 'text-rose-400'
                      }`}>
                        <Pin className="w-3 h-3 fill-current" /> Pinned
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavoriteNote(note.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        isLight ? 'text-slate-400 hover:text-amber-500' : 'text-zinc-500 hover:text-amber-400'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          note.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                        }`}
                      />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === note.id ? null : note.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
                        }`}
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {menuOpenId === note.id && (
                        <div
                          className={`absolute right-0 mt-1 w-32 rounded-xl border backdrop-blur-xl shadow-xl p-1 z-30 animate-in fade-in ${
                            isLight ? 'bg-white border-slate-200' : ''
                          }`}
                          style={
                            isLight
                              ? undefined
                              : {
                                  backgroundColor: '#16080B',
                                  borderColor: 'rgba(101, 10, 18, 0.6)',
                                }
                          }
                        >
                          <button
                            onClick={() => {
                              setMenuOpenId(null)
                              setEditingNote(note)
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              isLight
                                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                                : 'text-zinc-300 hover:text-white hover:bg-rose-950/40'
                            }`}
                          >
                            <Edit2 className={`w-3 h-3 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpenId(null)
                              deleteNote(note.id)
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              isLight
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/60'
                            }`}
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
                  <h3 className={`text-sm font-bold truncate transition-colors line-clamp-1 ${
                    isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-rose-300'
                  }`}>
                    {note.title}
                  </h3>
                  <p className={`text-xs mt-1.5 line-clamp-3 leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-zinc-400'
                  }`}>
                    {note.excerpt || note.content}
                  </p>
                </div>

                {/* Tags row */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((t) => (
                      <span key={t} className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card footer with Date & 3 Copy options */}
                <div className={`flex items-center justify-between pt-3 mt-4 border-t ${
                  isLight ? 'border-slate-100' : 'border-rose-950/40'
                }`}>
                  <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                    {new Date(note.updatedAt).toLocaleDateString('id-ID', {
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
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-colors ${
                        isLight
                          ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                          : 'text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border-rose-800/40'
                      }`}
                      title="Pilihan Salin Cepat"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>

                    {copyDropdownId === note.id && (
                      <div
                        className={`absolute right-0 bottom-full mb-1 w-36 rounded-xl border backdrop-blur-xl shadow-xl p-1 z-30 animate-in fade-in ${
                          isLight ? 'bg-white border-slate-200' : ''
                        }`}
                        style={
                          isLight
                            ? { boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
                            : {
                                backgroundColor: '#16080B',
                                borderColor: 'rgba(101, 10, 18, 0.7)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                              }
                        }
                      >
                        <button
                          onClick={() => handleCopyOption(note, 'title')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                            isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-zinc-300 hover:text-white hover:bg-rose-950/40'
                          }`}
                        >
                          Copy Title
                        </button>
                        <button
                          onClick={() => handleCopyOption(note, 'content')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                            isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-zinc-300 hover:text-white hover:bg-rose-950/40'
                          }`}
                        >
                          Copy Content
                        </button>
                        <button
                          onClick={() => handleCopyOption(note, 'all')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            isLight ? 'text-blue-600 hover:bg-blue-50' : 'text-rose-300 hover:bg-rose-900/50'
                          }`}
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
          className={`rounded-2xl border overflow-hidden ${
            isLight
              ? 'bg-white border-slate-200 divide-y divide-slate-100 shadow-sm'
              : 'divide-y divide-rose-950/30'
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
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`flex items-center justify-between p-3.5 transition-colors ${
                isLight ? 'hover:bg-slate-50/80' : 'hover:bg-rose-950/20'
              }`}
            >
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => setEditingNote(note)}
              >
                {note.image ? (
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-rose-950/40 border-rose-800/30 text-rose-400'
                  }`}>
                    📝
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {note.title}
                    </p>
                    {note.isPinned && (
                      <Pin className={`w-3 h-3 ${isLight ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'}`} />
                    )}
                    {note.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      isLight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    }`}>
                      {note.category}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {note.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(`${note.title}\n\n${note.content}`, 'Seluruh Catatan')
                  }
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    isLight
                      ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                      : 'text-rose-300 bg-rose-950/60 hover:bg-rose-900 border-rose-800/40'
                  }`}
                  title="Copy All"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy All</span>
                </button>
                <button
                  onClick={() => setEditingNote(note)}
                  className={`p-2 rounded-xl transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/60'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    isLight ? 'text-rose-600 hover:bg-rose-100 bg-rose-50' : 'text-rose-500 hover:text-rose-400 bg-rose-950/40'
                  }`}
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
