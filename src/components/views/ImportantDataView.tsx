import React, { useState } from 'react'
import {
  Database,
  Plus,
  Search,
  Star,
  Pin,
  Copy,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  FileCode,
  Mail,
  Phone,
  Hash,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { DataTypeEnum } from '../../types/fapriv.ts'

export const ImportantDataView: React.FC = () => {
  const {
    importantData,
    toggleFavoriteData,
    togglePinData,
    deleteData,
    setEditingData,
    openQuickAdd,
    copyToClipboard,
  } = useWorkspace()

  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({})

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Filter
  const filteredData = importantData.filter((d) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Favorites'
        ? d.isFavorite
        : d.category.toLowerCase() === activeCategory.toLowerCase()

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.value.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))

    return matchesCategory && matchesSearch
  })

  // Sort pinned first
  const sortedData = [...filteredData].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  const getDataTypeBadge = (type: DataTypeEnum) => {
    switch (type) {
      case 'secret':
        return { label: 'Rahasia', icon: Shield, color: 'text-rose-400 bg-rose-950/60 border-rose-800/40' }
      case 'account':
        return { label: 'Akun Bank', icon: Shield, color: 'text-amber-400 bg-amber-950/60 border-amber-800/40' }
      case 'template':
        return { label: 'Template', icon: Mail, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/40' }
      case 'code':
        return { label: 'Konfigurasi', icon: FileCode, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40' }
      case 'contact':
        return { label: 'Kontak', icon: Phone, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40' }
      default:
        return { label: 'Data', icon: Hash, color: 'text-zinc-400 bg-zinc-900 border-zinc-800' }
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Important Data</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pusat penyimpanan informasi penting terstruktur, kredensial, dan template.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('important_data')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer self-start sm:self-auto"
          style={{
            background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
            boxShadow: '0 0 20px -3px rgba(213, 31, 43, 0.4)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data Penting</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Favorites', 'Keuangan', 'Konfigurasi', 'Work', 'Personal'].map((cat) => {
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

        {/* Search Bar */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari data penting atau nilai..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/70"
          />
        </div>
      </div>

      {/* Grid of Important Data Cards */}
      {sortedData.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-rose-500 mx-auto">
            <Database className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">Tidak ada data penting ditemukan</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Simpan nomor rekening, token, kode proyek, atau template pesan untuk kemudahan salin cepat.
          </p>
          <button
            onClick={() => openQuickAdd('important_data')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
          >
            + Tambah Data Penting
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedData.map((data) => {
            const badge = getDataTypeBadge(data.dataType)
            const BadgeIcon = badge.icon
            const isSecret = data.dataType === 'secret'
            const isRevealed = Boolean(revealedSecrets[data.id])

            return (
              <div
                key={data.id}
                className="group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(33, 9, 13, 0.75)',
                  borderColor: data.isPinned ? 'rgba(213, 31, 43, 0.6)' : 'rgba(101, 10, 18, 0.45)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Header row */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {data.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePinData(data.id)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-white"
                        title={data.isPinned ? 'Lepas Pin' : 'Sematkan'}
                      >
                        <Pin
                          className={`w-3.5 h-3.5 ${
                            data.isPinned ? 'text-rose-500 fill-rose-500' : ''
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => toggleFavoriteData(data.id)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-amber-400"
                        title="Favorit"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            data.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => setEditingData(data)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-white"
                        title="Edit Data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteData(data.id)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-rose-400"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                      {data.title}
                    </h3>
                    {data.description && (
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {data.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Value Box */}
                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 relative">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-mono text-zinc-200 break-all select-all leading-relaxed whitespace-pre-wrap">
                      {isSecret && !isRevealed ? '••••••••••••••••••••' : data.value}
                    </p>

                    {isSecret && (
                      <button
                        onClick={() => toggleReveal(data.id)}
                        className="shrink-0 p-1 text-zinc-500 hover:text-white"
                        title={isRevealed ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags row */}
                {data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {data.tags.map((t) => (
                      <span key={t} className="text-[10px] text-zinc-500">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Copy Buttons */}
                <div className="flex items-center gap-2 pt-3 mt-4 border-t border-rose-950/40">
                  <button
                    onClick={() => copyToClipboard(data.value, 'Nilai Data')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Value</span>
                  </button>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${data.title}\n${data.description ? data.description + '\n' : ''}${data.value}`,
                        'Seluruh Data'
                      )
                    }
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800"
                    title="Salin Judul, Deskripsi & Nilai"
                  >
                    Copy All
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
