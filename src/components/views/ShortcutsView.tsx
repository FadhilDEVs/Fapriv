import React, { useState } from 'react'
import {
  Link2,
  Plus,
  Search,
  LayoutGrid,
  List,
  Star,
  Pin,
  ExternalLink,
  Copy,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { BrandIcon } from '../common/BrandIcon.tsx'

export const ShortcutsView: React.FC = () => {
  const {
    shortcuts,
    categories,
    toggleFavoriteShortcut,
    togglePinShortcut,
    deleteShortcut,
    setEditingShortcut,
    openQuickAdd,
    copyToClipboard,
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  // Filter
  const filteredShortcuts = shortcuts.filter((sc) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Favorites'
        ? sc.isFavorite
        : sc.category.toLowerCase() === activeCategory.toLowerCase()

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      sc.title.toLowerCase().includes(q) ||
      sc.url.toLowerCase().includes(q) ||
      sc.description?.toLowerCase().includes(q) ||
      sc.tags.some((t) => t.toLowerCase().includes(q))

    return matchesCategory && matchesSearch
  })

  // Sort: pinned first
  const sortedShortcuts = [...filteredShortcuts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <div className="space-y-6 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-rose-500'}`} />
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Shortcuts
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Kelola dan akses cepat seluruh tautan website dan aplikasi Anda.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('shortcut')}
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
          <span>Tambah Shortcut</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Favorites', ...categories.map((c) => c.name)].map((cat) => {
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
                {cat}
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
              placeholder="Cari shortcut..."
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

      {/* Shortcuts List or Grid */}
      {sortedShortcuts.length === 0 ? (
        <div className={`py-20 text-center rounded-3xl border border-dashed space-y-3 ${
          isLight ? 'border-slate-300 bg-white/70' : 'border-zinc-800 bg-zinc-950/40'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
            isLight ? 'bg-blue-50 text-blue-600' : 'bg-zinc-900 text-rose-500'
          }`}>
            <Link2 className="w-6 h-6" />
          </div>
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Tidak ada shortcut ditemukan
          </p>
          <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            Coba ubah filter kategori atau tambahkan shortcut baru untuk mulai menyimpan website penting.
          </p>
          <button
            onClick={() => openQuickAdd('shortcut')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-transform active:scale-95 ${
              isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-500'
            }`}
          >
            + Tambah Sekarang
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedShortcuts.map((sc) => (
            <div
              key={sc.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300' : ''
              }`}
              style={
                isLight
                  ? undefined
                  : {
                      backgroundColor: 'rgba(33, 9, 13, 0.75)',
                      borderColor: sc.isPinned ? 'rgba(213, 31, 43, 0.6)' : 'rgba(101, 10, 18, 0.45)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    }
              }
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl border p-2 flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-50 border-slate-100' : 'bg-zinc-950/80 border-zinc-800'
                }`}>
                  <BrandIcon name={sc.icon || sc.title} className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePinShortcut(sc.id)}
                    className={`p-1 rounded-lg transition-colors ${
                      isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
                    }`}
                    title={sc.isPinned ? 'Lepas Pin' : 'Sematkan ke atas'}
                  >
                    <Pin
                      className={`w-3.5 h-3.5 ${
                        sc.isPinned
                          ? isLight ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'
                          : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => toggleFavoriteShortcut(sc.id)}
                    className={`p-1 rounded-lg transition-colors ${
                      isLight ? 'text-slate-400 hover:text-amber-500' : 'text-zinc-500 hover:text-amber-400'
                    }`}
                    title="Favorit"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        sc.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === sc.id ? null : sc.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {menuOpenId === sc.id && (
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
                            setEditingShortcut(sc)
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
                            deleteShortcut(sc.id)
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

              <div className="my-3 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className={`text-xs font-bold truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-rose-300'
                  }`}>
                    {sc.title}
                  </h4>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border ${
                    isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}>
                    {sc.category}
                  </span>
                </div>
                <p className={`text-[11px] truncate mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {sc.description || sc.url}
                </p>
              </div>

              <div className={`flex items-center gap-1.5 pt-2 border-t ${
                isLight ? 'border-slate-100' : 'border-rose-950/40'
              }`}>
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-white transition-colors ${
                    isLight
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                      : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40'
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka</span>
                </a>

                <button
                  onClick={() => copyToClipboard(sc.url, 'URL')}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isLight
                      ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                      : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
                  }`}
                  title="Salin URL"
                >
                  <Copy className="w-3 h-3" />
                </button>
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
              : { backgroundColor: 'rgba(33, 9, 13, 0.7)', borderColor: 'rgba(101, 10, 18, 0.5)' }
          }
        >
          {sortedShortcuts.map((sc) => (
            <div
              key={sc.id}
              className={`flex items-center justify-between p-3.5 transition-colors ${
                isLight ? 'hover:bg-slate-50/80' : 'hover:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-xl border p-1.5 flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <BrandIcon name={sc.icon || sc.title} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {sc.title}
                    </p>
                    {sc.isPinned && (
                      <Pin className={`w-3 h-3 ${isLight ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'}`} />
                    )}
                    {sc.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      isLight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    }`}>
                      {sc.category}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {sc.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(sc.url, 'URL')}
                  className={`p-2 rounded-xl transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/60'
                  }`}
                  title="Salin URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors ${
                    isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40'
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka</span>
                </a>
                <button
                  onClick={() => setEditingShortcut(sc)}
                  className={`p-2 rounded-xl transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-zinc-400 hover:text-white bg-zinc-900/60'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteShortcut(sc.id)}
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
