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
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'

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
        className={`fixed inset-0 backdrop-blur-sm animate-in fade-in ${
          isLight ? 'bg-slate-900/40' : 'bg-black/85'
        }`}
        onClick={() => setEditingData(null)}
      />

      <div
        className={`relative w-full max-w-lg rounded-2xl border backdrop-blur-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 ${
          isLight ? 'bg-white border-slate-200' : ''
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
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-rose-950/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLight
                ? 'bg-blue-50 border border-blue-200 text-blue-600'
                : 'bg-rose-950/60 border border-rose-600/30 text-rose-400'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {isEditing ? 'Edit Data Penting' : 'Tambah Data Penting'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <div className={`flex items-center gap-1 border rounded-xl p-1 ${
                isLight ? 'border-slate-200 bg-slate-50' : 'border-zinc-800 bg-zinc-900/60'
              }`}>
                <button
                  type="button"
                  onClick={handleCopyValue}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                  }`}
                  title="Salin Nilai"
                >
                  Copy Value
                </button>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    isLight ? 'text-blue-700 bg-blue-100/80' : 'text-rose-300 bg-rose-950/60'
                  }`}
                  title="Salin Seluruh Data"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy All</span>
                </button>
              </div>
            )}
            <button
              onClick={() => setEditingData(null)}
              className={`p-1 rounded-lg transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              Judul Informasi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Nomor Rekening Bank BCA, API Token, NPWP..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                  : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              Tipe Informasi
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataTypeEnum)}
              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  : 'bg-zinc-900/80 border-zinc-800 text-white'
              }`}
            >
              {typeOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className={isLight ? 'bg-white text-slate-900' : 'bg-zinc-900 text-white'}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              Nilai / Isi Informasi *
            </label>
            <textarea
              required
              rows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ketik nilai atau teks yang akan disalin..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono transition-colors focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                  : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              Deskripsi / Catatan Tambahan
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Digunakan untuk transaksi invoice klien luar negeri"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                  : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}>
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    : 'bg-zinc-900/80 border-zinc-800 text-white'
                }`}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className={isLight ? 'bg-white text-slate-900' : 'bg-zinc-900'}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}>
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
                  className={`w-full px-3 py-2 rounded-xl border text-xs transition-colors focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
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
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs ${
                    isLight
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'bg-rose-950/40 border border-rose-800/40 text-rose-300'
                  }`}
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:opacity-75"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Pin and Favorite Toggles */}
          <div className={`flex items-center justify-between pt-2 border-t ${
            isLight ? 'border-slate-100' : 'border-rose-950/40'
          }`}>
            <div className="flex items-center gap-6">
              <label className={`flex items-center gap-2 text-xs cursor-pointer select-none ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isPinned
                      ? isLight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-rose-600 border-rose-500 text-white'
                      : isLight ? 'border-slate-300 bg-slate-50' : 'border-zinc-700'
                  }`}
                >
                  <Pin className="w-2.5 h-2.5" />
                </div>
                <span>Sematkan ke Atas (Pin)</span>
              </label>

              <label className={`flex items-center gap-2 text-xs cursor-pointer select-none ${
                isLight ? 'text-slate-700' : 'text-zinc-300'
              }`}>
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isFavorite
                      ? 'bg-amber-500 border-amber-400 text-zinc-950'
                      : isLight ? 'border-slate-300 bg-slate-50' : 'border-zinc-700'
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
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-transform active:scale-95 shadow-md"
              style={{
                background: isLight
                  ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                  : 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
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
