import React, { useState, useEffect } from 'react'
import { X, Star, Pin, Database, Copy, Shield, FileCode, Mail, Phone, Hash } from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { ImportantDataItem, DataTypeEnum } from '../../types/fapriv.ts'

export const ImportantDataModal: React.FC = () => {
  const {
    editingData,
    setEditingData,
    addData,
    updateData,
    categories,
    copyToClipboard,
  } = useWorkspace()

  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [dataType, setDataType] = useState<DataTypeEnum>('text')
  const [category, setCategory] = useState('Keuangan')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    if (editingData) {
      setTitle(editingData.title || '')
      setValue(editingData.value || '')
      setDescription(editingData.description || '')
      setDataType(editingData.dataType || 'text')
      setCategory(editingData.category || (categories[0]?.name ?? 'Keuangan'))
      setTags(editingData.tags || [])
      setIsFavorite(editingData.isFavorite || false)
      setIsPinned(editingData.isPinned || false)
    }
  }, [editingData, categories])

  if (!editingData) return null

  const isEditing = Boolean(editingData.id)

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
    if (!title.trim() || !value.trim()) return

    const payload: Omit<ImportantDataItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      value: value.trim(),
      description: description.trim(),
      dataType,
      category,
      tags,
      isFavorite,
      isPinned,
    }

    if (isEditing) {
      updateData(editingData.id, payload)
    } else {
      addData(payload)
    }

    setEditingData(null)
  }

  const handleCopyValue = () => copyToClipboard(value, 'Nilai Data')
  const handleCopyAll = () => copyToClipboard(`${title}\n${description ? description + '\n' : ''}${value}`, 'Seluruh Data Penting')

  const typeOptions: { id: DataTypeEnum; label: string; icon: React.ElementType }[] = [
    { id: 'text', label: 'Teks Biasa', icon: Hash },
    { id: 'account', label: 'Rekening/Akun', icon: Shield },
    { id: 'secret', label: 'Kunci Rahasia/Token', icon: Shield },
    { id: 'reference', label: 'Nomor Referensi/ID', icon: Hash },
    { id: 'template', label: 'Template Pesan', icon: Mail },
    { id: 'code', label: 'Kode Konfigurasi', icon: FileCode },
    { id: 'contact', label: 'Kontak Darurat', icon: Phone },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in"
        onClick={() => setEditingData(null)}
      />

      <div
        className="relative w-full max-w-lg rounded-2xl border backdrop-blur-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95"
        style={{
          backgroundColor: '#16080B',
          borderColor: 'rgba(213, 31, 43, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-rose-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-600/30 flex items-center justify-center text-rose-400">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {isEditing ? 'Edit Data Penting' : 'Tambah Data Penting'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <div className="flex items-center gap-1 border border-zinc-800 rounded-xl p-1 bg-zinc-900/60">
                <button
                  type="button"
                  onClick={handleCopyValue}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium text-zinc-300 hover:text-white"
                  title="Salin Nilai"
                >
                  Copy Value
                </button>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-300 bg-rose-950/60"
                  title="Salin Seluruh Data"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy All</span>
                </button>
              </div>
            )}
            <button
              onClick={() => setEditingData(null)}
              className="p-1 rounded-lg text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Judul Informasi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Nomor Rekening Bank BCA, API Token, NPWP..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tipe Informasi
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataTypeEnum)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-white focus:outline-none"
            >
              {typeOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Nilai / Isi Informasi *
            </label>
            <textarea
              required
              rows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ketik nilai atau teks yang akan disalin..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-rose-500/80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Deskripsi / Catatan Tambahan
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Digunakan untuk transaksi invoice klien luar negeri"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
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
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
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
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-rose-950/40 border border-rose-800/40 text-rose-300"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Pin and Favorite Toggles */}
          <div className="flex items-center justify-between pt-2 border-t border-rose-950/40">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isPinned ? 'bg-rose-600 border-rose-500 text-white' : 'border-zinc-700'
                  }`}
                >
                  <Pin className="w-2.5 h-2.5" />
                </div>
                <span>Sematkan ke Atas (Pin)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isFavorite ? 'bg-amber-500 border-amber-400 text-zinc-950' : 'border-zinc-700'
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
              onClick={() => setEditingData(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-rose-950/50"
              style={{
                background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
              }}
            >
              {isEditing ? 'Simpan Perubahan' : 'Buat Data Penting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
