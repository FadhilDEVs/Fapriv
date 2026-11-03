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
  const { deletedItems, restoreItem, permanentDeleteItem, emptyTrash, theme } = useWorkspace()
  const isLight = theme === 'light'
  const [confirmEmpty, setConfirmEmpty] = useState(false)

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className={`w-6 h-6 ${isLight ? 'text-rose-500' : 'text-rose-500'}`} />
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Recently Deleted
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Item yang dihapus sementara akan disimpan selama 30 hari sebelum dimusnahkan permanen.
          </p>
        </div>

        {deletedItems.length > 0 && (
          <div>
            {!confirmEmpty ? (
              <button
                onClick={() => setConfirmEmpty(true)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isLight
                    ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100'
                    : 'text-rose-300 bg-rose-950/60 border-rose-800/40 hover:bg-rose-900/60'
                }`}
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
                  className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${
                    isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 30-Day Retention Alert Box */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        isLight
          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
          : 'bg-zinc-950/60 border-rose-950/50 text-zinc-400'
      }`}>
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className={`font-semibold ${isLight ? 'text-amber-950' : 'text-zinc-200'}`}>
            Kebijakan Retensi 30 Hari
          </p>
          <p className={isLight ? 'text-amber-800' : 'text-zinc-400'}>
            Semua catatan, shortcut, dan data penting yang dihapus dapat dipulihkan kapan saja ke
            tempat asalnya. Setelah 30 hari, data akan otomatis dibersihkan dari penyimpanan.
          </p>
        </div>
      </div>

      {deletedItems.length === 0 ? (
        <div className={`py-20 text-center rounded-3xl border border-dashed space-y-3 ${
          isLight ? 'border-slate-300 bg-white/70' : 'border-zinc-800 bg-zinc-950/40'
        }`}>
          <Trash2 className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-300' : 'text-zinc-600'}`} />
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Tong sampah kosong
          </p>
          <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            Tidak ada item yang sedang dihapus sementara saat ini.
          </p>
        </div>
      ) : (
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
          {deletedItems.map((item) => {
            const isSc = item.itemType === 'shortcut'
            const isNote = item.itemType === 'note'
            const Icon = isSc ? Link2 : isNote ? FileText : Database
            const title = (item.data as { title: string }).title

            return (
              <div
                key={item.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-rose-950/15'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-zinc-950 border-zinc-800 text-rose-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {title}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded capitalize border ${
                        isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        {item.itemType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      isLight
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        : 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/50'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pulihkan</span>
                  </button>

                  <button
                    onClick={() => permanentDeleteItem(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      isLight
                        ? 'text-rose-600 hover:bg-rose-50'
                        : 'text-rose-400 hover:text-white hover:bg-rose-950'
                    }`}
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
