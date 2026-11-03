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
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'
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
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Favorit
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Akses langsung seluruh shortcut, catatan, dan data penting yang Anda favoritkan.
          </p>
        </div>

        <div className="relative sm:w-64">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam favorit..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none transition-colors ${
              isLight
                ? 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-sm'
                : 'bg-zinc-900/70 border border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/70'
            }`}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-2 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-rose-950/40'}`}>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-md'
              : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Semua ({totalFavs})
        </button>
        <button
          onClick={() => setActiveTab('shortcuts')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'shortcuts'
              ? isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-md'
              : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Shortcut ({favShortcuts.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'notes'
              ? isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-md'
              : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Catatan ({favNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'data'
              ? isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-md'
              : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/50'
          }`}
        >
          Data Penting ({favData.length})
        </button>
      </div>

      {totalFavs === 0 ? (
        <div className={`py-20 text-center rounded-3xl border border-dashed space-y-3 ${
          isLight ? 'border-slate-300 bg-white/70' : 'border-zinc-800 bg-zinc-950/40'
        }`}>
          <Star className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-300' : 'text-zinc-600'}`} />
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Belum ada item favorit</p>
          <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            Klik ikon bintang pada shortcut, catatan, atau data penting untuk mengumpulkannya di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Shortcuts section */}
          {(activeTab === 'all' || activeTab === 'shortcuts') && filteredShortcuts.length > 0 && (
            <div className="space-y-3">
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-blue-600' : 'text-rose-400'
              }`}>
                <Link2 className="w-4 h-4" /> Shortcut Favorit ({filteredShortcuts.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredShortcuts.map((sc) => (
                  <div
                    key={sc.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-1 ${
                      isLight
                        ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'
                        : 'border-rose-950/50 bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-9 h-9 rounded-xl p-1.5 flex items-center justify-center border ${
                        isLight ? 'bg-slate-50 border-slate-100' : 'bg-zinc-950 border-zinc-800'
                      }`}>
                        <BrandIcon name={sc.icon || sc.title} className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => toggleFavoriteShortcut(sc.id)}
                        className="text-amber-500"
                        title="Hapus dari favorit"
                      >
                        <Star className="w-4 h-4 fill-amber-500" />
                      </button>
                    </div>
                    <div className="my-2 cursor-pointer" onClick={() => setEditingShortcut(sc)}>
                      <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{sc.title}</p>
                      <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{sc.description || sc.url}</p>
                    </div>
                    <div className={`flex items-center gap-1 pt-2 border-t ${isLight ? 'border-slate-100' : 'border-rose-950/40'}`}>
                      <a
                        href={sc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 py-1 rounded-lg text-center text-[10px] font-semibold text-white flex items-center justify-center gap-1 transition-colors ${
                          isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-950/80 hover:bg-rose-900'
                        }`}
                      >
                        <ExternalLink className="w-3 h-3" /> Buka
                      </a>
                      <button
                        onClick={() => copyToClipboard(sc.url, 'URL')}
                        className={`p-1 rounded-lg transition-colors ${
                          isLight ? 'text-slate-500 hover:text-slate-900 bg-slate-100' : 'text-zinc-400 hover:text-white bg-zinc-900'
                        }`}
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
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-blue-600' : 'text-rose-400'
              }`}>
                <FileText className="w-4 h-4" /> Catatan Favorit ({filteredNotes.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-1 ${
                      isLight
                        ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'
                        : 'border-rose-950/50 bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isLight
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                      }`}>
                        {note.category}
                      </span>
                      <button
                        onClick={() => toggleFavoriteNote(note.id)}
                        className="text-amber-500"
                        title="Hapus dari favorit"
                      >
                        <Star className="w-4 h-4 fill-amber-500" />
                      </button>
                    </div>
                    <div className="my-2 cursor-pointer" onClick={() => setEditingNote(note)}>
                      <h4 className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{note.title}</h4>
                      <p className={`text-[11px] line-clamp-2 mt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{note.content}</p>
                    </div>
                    <div className={`flex items-center justify-between pt-2 border-t ${isLight ? 'border-slate-100' : 'border-rose-950/40'}`}>
                      <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(`${note.title}\n\n${note.content}`, 'Catatan')
                        }
                        className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                          isLight ? 'text-blue-600 hover:text-blue-700' : 'text-rose-300'
                        }`}
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
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-blue-600' : 'text-rose-400'
              }`}>
                <Database className="w-4 h-4" /> Data Penting Favorit ({filteredData.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((data) => (
                  <div
                    key={data.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-1 ${
                      isLight
                        ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'
                        : 'border-rose-950/50 bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isLight
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        {data.category}
                      </span>
                      <button
                        onClick={() => toggleFavoriteData(data.id)}
                        className="text-amber-500"
                        title="Hapus dari favorit"
                      >
                        <Star className="w-4 h-4 fill-amber-500" />
                      </button>
                    </div>
                    <div className="my-2 cursor-pointer" onClick={() => setEditingData(data)}>
                      <h4 className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{data.title}</h4>
                      <p className={`text-[11px] font-mono p-2 rounded-lg mt-1 truncate ${
                        isLight ? 'bg-slate-50 text-slate-800 border border-slate-200' : 'bg-zinc-950/80 text-zinc-300'
                      }`}>
                        {data.value}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(data.value, 'Nilai Data')}
                      className={`w-full py-1.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1 transition-colors ${
                        isLight ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' : 'bg-rose-950 hover:bg-rose-900'
                      }`}
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
