import React, { useState } from 'react'
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Link2,
  FileText,
  Database,
  Calendar,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'

export const RecentlyDeletedView: React.FC = () => {
  const { deletedItems, restoreItem, permanentDeleteItem, emptyTrash } = useWorkspace()
  const [confirmEmpty, setConfirmEmpty] = useState(false)

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Recently Deleted</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Item yang dihapus sementara akan disimpan selama 30 hari sebelum dimusnahkan permanen.
          </p>
        </div>

        {deletedItems.length > 0 && (
          <div>
            {!confirmEmpty ? (
              <button
                onClick={() => setConfirmEmpty(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/40 hover:bg-rose-900/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Tong Sampah</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    emptyTrash()
                    setConfirmEmpty(false)
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
                >
                  Ya, Hapus Semua
                </button>
                <button
                  onClick={() => setConfirmEmpty(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 30-Day Retention Alert Box */}
      <div className="p-4 rounded-2xl bg-zinc-950/60 border border-rose-950/50 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-200">Kebijakan Retensi 30 Hari</p>
          <p>
            Semua catatan, shortcut, dan data penting yang dihapus dapat dipulihkan kapan saja ke
            tempat asalnya. Setelah 30 hari, data akan otomatis dibersihkan dari penyimpanan.
          </p>
        </div>
      </div>

      {deletedItems.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 space-y-3">
          <Trash2 className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-semibold text-white">Tong sampah kosong</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Tidak ada item yang sedang dihapus sementara saat ini.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border divide-y divide-rose-950/30 overflow-hidden" style={{ backgroundColor: 'rgba(33, 9, 13, 0.7)', borderColor: 'rgba(101, 10, 18, 0.5)' }}>
          {deletedItems.map((item) => {
            const isSc = item.itemType === 'shortcut'
            const isNote = item.itemType === 'note'
            const Icon = isSc ? Link2 : isNote ? FileText : Database
            const title = (item.data as { title: string }).title

            return (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-rose-950/15 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-rose-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{title}</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 capitalize">
                        {item.itemType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Dihapus:{' '}
                        {new Date(item.deletedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => restoreItem(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pulihkan</span>
                  </button>

                  <button
                    onClick={() => permanentDeleteItem(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-950 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen</span>
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
