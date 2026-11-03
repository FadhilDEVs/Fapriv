import React, { useState } from 'react'
import {
  Clock,
  Filter,
  PlusCircle,
  Edit,
  Trash,
  RotateCcw,
  Copy,
  Star,
  Pin,
  CheckCircle,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { ActivityItem } from '../../types/fapriv.ts'

export const ActivityHistoryView: React.FC = () => {
  const { activities, theme } = useWorkspace()
  const isLight = theme === 'light'
  const [filterAction, setFilterAction] = useState<string>('all')

  const filtered = activities.filter((act) => {
    if (filterAction === 'all') return true
    return act.action === filterAction
  })

  const getActionBadge = (action: ActivityItem['action']) => {
    if (isLight) {
      switch (action) {
        case 'create':
          return { label: 'Dibuat', icon: PlusCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
        case 'edit':
          return { label: 'Diubah', icon: Edit, color: 'text-blue-700 bg-blue-50 border-blue-200' }
        case 'delete':
          return { label: 'Dihapus', icon: Trash, color: 'text-rose-700 bg-rose-50 border-rose-200' }
        case 'restore':
          return { label: 'Dipulihkan', icon: RotateCcw, color: 'text-teal-700 bg-teal-50 border-teal-200' }
        case 'copy':
          return { label: 'Disalin', icon: Copy, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
        case 'favorite':
          return { label: 'Favorit', icon: Star, color: 'text-amber-700 bg-amber-50 border-amber-200' }
        case 'pin':
          return { label: 'Pin', icon: Pin, color: 'text-purple-700 bg-purple-50 border-purple-200' }
        default:
          return { label: 'Sistem', icon: CheckCircle, color: 'text-slate-600 bg-slate-100 border-slate-200' }
      }
    }

    switch (action) {
      case 'create':
        return { label: 'Dibuat', icon: PlusCircle, color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40' }
      case 'edit':
        return { label: 'Diubah', icon: Edit, color: 'text-cyan-400 bg-cyan-950/50 border-cyan-800/40' }
      case 'delete':
        return { label: 'Dihapus', icon: Trash, color: 'text-rose-400 bg-rose-950/50 border-rose-800/40' }
      case 'restore':
        return { label: 'Dipulihkan', icon: RotateCcw, color: 'text-teal-400 bg-teal-950/50 border-teal-800/40' }
      case 'copy':
        return { label: 'Disalin', icon: Copy, color: 'text-indigo-400 bg-indigo-950/50 border-indigo-800/40' }
      case 'favorite':
        return { label: 'Favorit', icon: Star, color: 'text-amber-400 bg-amber-950/50 border-amber-800/40' }
      case 'pin':
        return { label: 'Pin', icon: Pin, color: 'text-purple-400 bg-purple-950/50 border-purple-800/40' }
      default:
        return { label: 'Sistem', icon: CheckCircle, color: 'text-zinc-400 bg-zinc-900 border-zinc-800' }
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-rose-500'}`} />
            <h2 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Activity History
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Log riwayat audit lengkap seluruh tindakan dan manipulasi informasi di FAPRIV.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 shadow-sm'
                : 'bg-zinc-900 border-zinc-800 text-white'
            }`}
          >
            <option value="all">Semua Aktivitas</option>
            <option value="create">Penambahan (Create)</option>
            <option value="edit">Perubahan (Edit)</option>
            <option value="copy">Penyalinan (Copy)</option>
            <option value="favorite">Favorit</option>
            <option value="delete">Penghapusan (Delete)</option>
            <option value="restore">Pemulihan (Restore)</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`py-20 text-center rounded-3xl border border-dashed space-y-3 ${
          isLight ? 'border-slate-300 bg-white/70' : 'border-zinc-800 bg-zinc-950/40'
        }`}>
          <Clock className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-300' : 'text-zinc-600'}`} />
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Tidak ada riwayat aktivitas</p>
        </div>
      ) : (
        <div
          className={`rounded-3xl border p-6 space-y-6 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                }
          }
        >
          <div className={`relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] ${
            isLight ? 'before:bg-blue-100' : 'before:bg-rose-950/70'
          }`}>
            {filtered.map((act) => {
              const badge = getActionBadge(act.action)
              const BadgeIcon = badge.icon

              return (
                <div key={act.id} className="relative flex items-start gap-4">
                  {/* Glowing timeline dot */}
                  <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${
                    isLight
                      ? 'bg-blue-600 ring-4 ring-white'
                      : 'bg-rose-500 ring-4 ring-[#16080B]'
                  }`} />

                  <div className={`flex-1 p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-zinc-950/60 border-rose-950/40'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider font-mono ${
                          isLight ? 'text-slate-500' : 'text-zinc-500'
                        }`}>
                          {act.itemType.replace('_', ' ')}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {act.itemName}
                        {act.detail && (
                          <span className={`font-normal text-[11px] ml-2 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            • {act.detail}
                          </span>
                        )}
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono shrink-0 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
