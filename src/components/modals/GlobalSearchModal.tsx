import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  X,
  Link2,
  FileText,
  Database,
  ExternalLink,
  Copy,
  Star,
  Pin,
  ArrowRight,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    shortcuts,
    notes,
    importantData,
    setCurrentView,
    copyToClipboard,
    setEditingShortcut,
    setEditingNote,
    setEditingData,
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isSearchOpen])

  if (!isSearchOpen) return null

  const q = query.trim().toLowerCase()

  const filteredShortcuts = q
    ? shortcuts.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.description?.toLowerCase().includes(q)
      )
    : shortcuts.slice(0, 3)

  const filteredNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    : notes.slice(0, 3)

  const filteredData = q
    ? importantData.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.value.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.description?.toLowerCase().includes(q)
      )
    : importantData.slice(0, 3)

  const totalResults =
    (q ? filteredShortcuts.length : 0) +
    (q ? filteredNotes.length : 0) +
    (q ? filteredData.length : 0)

  const handleNavigate = (view: NavView) => {
    setCurrentView(view)
    setIsSearchOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 backdrop-blur-md animate-in fade-in duration-150 ${
          isLight ? 'bg-slate-900/40' : 'bg-black/85'
        }`}
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-2xl rounded-2xl border backdrop-blur-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 ${
          isLight ? 'bg-white border-slate-200' : ''
        }`}
        style={
          isLight
            ? {
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.15), 0 0 35px -5px rgba(226, 232, 240, 0.8)',
              }
            : {
                backgroundColor: '#16080B',
                borderColor: 'rgba(213, 31, 43, 0.4)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
              }
        }
      >
        {/* Search Input bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3.5 border-b ${
            isLight ? 'border-slate-100 bg-slate-50/60' : 'border-rose-950/40'
          }`}
        >
          <Search className={`w-5 h-5 shrink-0 ${isLight ? 'text-blue-600' : 'text-rose-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari shortcut, catatan, atau data penting... (ESC untuk batal)"
            className={`flex-1 bg-transparent text-sm focus:outline-none ${
              isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-zinc-500'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 rounded-lg transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className={`hidden sm:inline-block px-2 py-0.5 rounded border text-[10px] font-mono ${
            isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Search Results / Categories */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {q && totalResults === 0 && (
            <div className={`py-12 text-center space-y-2 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
              <p className="text-sm">Tidak ditemukan hasil untuk "{query}"</p>
              <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
                Coba gunakan kata kunci lain atau periksa penulisan tags.
              </p>
            </div>
          )}

          {/* Shortcuts Results */}
          {filteredShortcuts.length > 0 && (
            <div className="space-y-2">
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider px-1 ${
                isLight ? 'text-slate-500' : 'text-zinc-500'
              }`}>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`}>
                  <Link2 className="w-3.5 h-3.5" />
                  Shortcut ({filteredShortcuts.length})
                </span>
                <button
                  onClick={() => handleNavigate('shortcuts')}
                  className={`text-[11px] normal-case flex items-center gap-1 transition-colors ${
                    isLight ? 'hover:text-blue-600 text-slate-500' : 'hover:text-rose-300 text-zinc-400'
                  }`}
                >
                  Lihat Semua <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1">
                {filteredShortcuts.map((sc) => (
                  <div
                    key={sc.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${
                      isLight
                        ? 'hover:bg-blue-50/60 border-transparent hover:border-blue-200'
                        : 'hover:bg-rose-950/20 border-transparent hover:border-rose-900/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        setEditingShortcut(sc)
                        setIsSearchOpen(false)
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isLight ? 'bg-blue-50 text-blue-600' : 'bg-zinc-900 text-rose-400'
                      }`}>
                        🔗
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs font-semibold truncate transition-colors ${
                            isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-rose-300'
                          }`}>
                            {sc.title}
                          </p>
                          {sc.isPinned && (
                            <Pin className={`w-3 h-3 ${isLight ? 'text-blue-500 fill-blue-500' : 'text-rose-400 fill-rose-400'}`} />
                          )}
                          {sc.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                        </div>
                        <p className={`text-[11px] truncate font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{sc.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(sc.url, 'URL Shortcut')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Salin URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={sc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
                        }`}
                        title="Buka Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div className="space-y-2">
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider px-1 ${
                isLight ? 'text-slate-500' : 'text-zinc-500'
              }`}>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`}>
                  <FileText className="w-3.5 h-3.5" />
                  Catatan ({filteredNotes.length})
                </span>
                <button
                  onClick={() => handleNavigate('notes')}
                  className={`text-[11px] normal-case flex items-center gap-1 transition-colors ${
                    isLight ? 'hover:text-blue-600 text-slate-500' : 'hover:text-rose-300 text-zinc-400'
                  }`}
                >
                  Lihat Semua <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${
                      isLight
                        ? 'hover:bg-blue-50/60 border-transparent hover:border-blue-200'
                        : 'hover:bg-rose-950/20 border-transparent hover:border-rose-900/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        setEditingNote(note)
                        setIsSearchOpen(false)
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isLight ? 'bg-blue-50 text-blue-600' : 'bg-zinc-900 text-rose-400'
                      }`}>
                        📝
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs font-semibold truncate transition-colors ${
                            isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-rose-300'
                          }`}>
                            {note.title}
                          </p>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                            isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}>
                            {note.category}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{note.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(note.content, 'Isi Catatan')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Salin Isi Catatan"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Data Results */}
          {filteredData.length > 0 && (
            <div className="space-y-2">
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider px-1 ${
                isLight ? 'text-slate-500' : 'text-zinc-500'
              }`}>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`}>
                  <Database className="w-3.5 h-3.5" />
                  Data Penting ({filteredData.length})
                </span>
                <button
                  onClick={() => handleNavigate('important_data')}
                  className={`text-[11px] normal-case flex items-center gap-1 transition-colors ${
                    isLight ? 'hover:text-blue-600 text-slate-500' : 'hover:text-rose-300 text-zinc-400'
                  }`}
                >
                  Lihat Semua <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1">
                {filteredData.map((data) => (
                  <div
                    key={data.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${
                      isLight
                        ? 'hover:bg-blue-50/60 border-transparent hover:border-blue-200'
                        : 'hover:bg-rose-950/20 border-transparent hover:border-rose-900/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        setEditingData(data)
                        setIsSearchOpen(false)
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isLight ? 'bg-blue-50 text-blue-600' : 'bg-zinc-900 text-rose-400'
                      }`}>
                        🗄️
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate transition-colors ${
                          isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-rose-300'
                        }`}>
                          {data.title}
                        </p>
                        <p className={`text-[11px] truncate font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                          {data.dataType === 'secret' ? '••••••••••••' : data.value}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(data.value, 'Nilai Data')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Salin Nilai"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div
          className={`px-4 py-2.5 border-t flex items-center justify-between text-[11px] ${
            isLight ? 'bg-slate-50/80 border-slate-100 text-slate-500' : 'bg-zinc-950/90 border-rose-950/40 text-zinc-500'
          }`}
        >
          <span>Tekan ESC untuk menutup</span>
          <span className="font-medium">FAPRIV Global Indexer</span>
        </div>
      </div>
    </div>
  )
}
