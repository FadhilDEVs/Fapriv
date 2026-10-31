import React, { useState } from 'react'
import {
  Star,
  Link2,
  FileText,
  Database,
  ExternalLink,
  Copy,
  Search,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { BrandIcon } from '../common/BrandIcon.tsx'

export const FavoritesView: React.FC = () => {
  const {
    shortcuts,
    notes,
    importantData,
    toggleFavoriteShortcut,
    toggleFavoriteNote,
    toggleFavoriteData,
    copyToClipboard,
    setEditingShortcut,
    setEditingNote,
    setEditingData,
  } = useWorkspace()

  const [activeTab, setActiveTab] = useState<'all' | 'shortcuts' | 'notes' | 'data'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const favShortcuts = shortcuts.filter((s) => s.isFavorite)
  const favNotes = notes.filter((n) => n.isFavorite)
  const favData = importantData.filter((d) => d.isFavorite)

  const q = searchQuery.toLowerCase().trim()

  const filteredShortcuts = favShortcuts.filter(
    (s) => !q || s.title.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)
  )
  const filteredNotes = favNotes.filter(
    (n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  )
  const filteredData = favData.filter(
    (d) => !q || d.title.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
  )

  const totalFavs = favShortcuts.length + favNotes.length + favData.length

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Favorites</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Akses langsung seluruh shortcut, catatan, dan data penting yang Anda favoritkan.
          </p>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam favorit..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/70"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-rose-950/40 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Semua ({totalFavs})
        </button>
        <button
          onClick={() => setActiveTab('shortcuts')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'shortcuts'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Shortcut ({favShortcuts.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'notes'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Catatan ({favNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'data'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Data Penting ({favData.length})
        </button>
      </div>

      {totalFavs === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 space-y-3">
          <Star className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-semibold text-white">Belum ada item favorit</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Klik ikon bintang pada shortcut, catatan, atau data penting untuk mengumpulkannya di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Shortcuts section */}
          {(activeTab === 'all' || activeTab === 'shortcuts') && filteredShortcuts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Link2 className="w-4 h-4" /> Shortcut Favorit ({filteredShortcuts.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredShortcuts.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl border border-rose-950/50 bg-zinc-900/60 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-zinc-950 p-1.5 flex items-center justify-center">
                        <BrandIcon name={sc.icon || sc.title} className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => toggleFavoriteShortcut(sc.id)}
                        className="text-amber-400"
                        title="Hapus dari favorit"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                    <div className="my-2 cursor-pointer" onClick={() => setEditingShortcut(sc)}>
                      <p className="text-xs font-bold text-white truncate">{sc.title}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{sc.description || sc.url}</p>
                    </div>
                    <div className="flex items-center gap-1 pt-2 border-t border-rose-950/40">
                      <a
                        href={sc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 rounded-lg text-center text-[10px] font-semibold text-white bg-rose-950/80 hover:bg-rose-900 flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Buka
                      </a>
                      <button
                        onClick={() => copyToClipboard(sc.url, 'URL')}
                        className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes section */}
          {(activeTab === 'all' || activeTab === 'notes') && filteredNotes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Catatan Favorit ({filteredNotes.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl border border-rose-950/50 bg-zinc-900/60 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300">
                        {note.category}
                      </span>
                      <button
                        onClick={() => toggleFavoriteNote(note.id)}
                        className="text-amber-400"
                        title="Hapus dari favorit"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                    <div className="my-2 cursor-pointer" onClick={() => setEditingNote(note)}>
                      <h4 className="text-xs font-bold text-white truncate">{note.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{note.content}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-rose-950/40">
                      <span className="text-[10px] text-zinc-500">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(`${note.title}\n\n${note.content}`, 'Catatan')
                        }
                        className="flex items-center gap-1 text-[11px] text-rose-300 font-semibold"
                      >
                        <Copy className="w-3 h-3" /> Copy All
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important data section */}
          {(activeTab === 'all' || activeTab === 'data') && filteredData.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Data Penting Favorit ({filteredData.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((data) => (
                  <div
                    key={data.id}
                    className="p-4 rounded-2xl border border-rose-950/50 bg-zinc-900/60 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400">
                        {data.category}
                      </span>
                      <button
                        onClick={() => toggleFavoriteData(data.id)}
                        className="text-amber-400"
                        title="Hapus dari favorit"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                    <div className="my-2 cursor-pointer" onClick={() => setEditingData(data)}>
                      <h4 className="text-xs font-bold text-white truncate">{data.title}</h4>
                      <p className="text-[11px] font-mono text-zinc-300 bg-zinc-950/80 p-2 rounded-lg mt-1 truncate">
                        {data.value}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(data.value, 'Nilai Data')}
                      className="w-full py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-950 hover:bg-rose-900 flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Salin Nilai
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
