import React from 'react'
import { X, Link2, FileText, Database } from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    setEditingShortcut,
    setEditingNote,
    setEditingData,
  } = useWorkspace()

  if (!isQuickAddOpen) return null

  const handleOpenShortcut = () => {
    setIsQuickAddOpen(false)
    setEditingShortcut({
      id: '',
      title: '',
      url: 'https://',
      description: '',
      category: 'Work',
      tags: [],
      isFavorite: false,
      isPinned: false,
      createdAt: '',
      updatedAt: '',
    })
  }

  const handleOpenNote = () => {
    setIsQuickAddOpen(false)
    setEditingNote({
      id: '',
      title: '',
      content: '',
      category: 'Personal',
      tags: [],
      isFavorite: false,
      isPinned: false,
      createdAt: '',
      updatedAt: '',
    })
  }

  const handleOpenData = () => {
    setIsQuickAddOpen(false)
    setEditingData({
      id: '',
      title: '',
      value: '',
      description: '',
      dataType: 'text',
      category: 'Keuangan',
      tags: [],
      isFavorite: false,
      isPinned: false,
      createdAt: '',
      updatedAt: '',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in"
        onClick={() => setIsQuickAddOpen(false)}
      />

      <div
        className="relative w-full max-w-md rounded-2xl border backdrop-blur-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95"
        style={{
          backgroundColor: '#16080B',
          borderColor: 'rgba(213, 31, 43, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(213, 31, 43, 0.3)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-rose-950/40">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Quick Add</h3>
            <p className="text-xs text-zinc-400">Pilih jenis informasi yang ingin disimpan</p>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 rounded-lg text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-5">
          {/* Shortcut option */}
          <button
            onClick={handleOpenShortcut}
            className="flex items-center gap-4 p-4 rounded-xl border border-rose-950/40 bg-zinc-900/40 hover:bg-rose-950/30 hover:border-rose-600/40 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-900/50 to-red-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                Tambah Shortcut
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Simpan tautan website atau aplikasi penting
              </p>
            </div>
          </button>

          {/* Note option */}
          <button
            onClick={handleOpenNote}
            className="flex items-center gap-4 p-4 rounded-xl border border-rose-950/40 bg-zinc-900/40 hover:bg-rose-950/30 hover:border-rose-600/40 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-900/50 to-red-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                Tambah Catatan
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tulis ide, rencana, rangkuman teks bebas
              </p>
            </div>
          </button>

          {/* Important data option */}
          <button
            onClick={handleOpenData}
            className="flex items-center gap-4 p-4 rounded-xl border border-rose-950/40 bg-zinc-900/40 hover:bg-rose-950/30 hover:border-rose-600/40 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-900/50 to-red-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                Tambah Data Penting
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Nomor akun, token rahasia, template, kode konfigurasi
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
