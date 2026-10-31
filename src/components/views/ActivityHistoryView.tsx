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
  const { activities } = useWorkspace()
  const [filterAction, setFilterAction] = useState<string>('all')

  const filtered = activities.filter((act) => {
    if (filterAction === 'all') return true
    return act.action === filterAction
  })

  const getActionBadge = (action: ActivityItem['action']) => {
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
            <Clock className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Activity History</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Log riwayat audit lengkap seluruh tindakan dan manipulasi informasi di FAPRIV.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
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
        <div className="py-20 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 space-y-3">
          <Clock className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-semibold text-white">Tidak ada riwayat aktivitas</p>
        </div>
      ) : (
        <div
          className="rounded-3xl border p-6 space-y-6"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
          }}
        >
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-950/70">
            {filtered.map((act) => {
              const badge = getActionBadge(act.action)
              const BadgeIcon = badge.icon

              return (
                <div key={act.id} className="relative flex items-start gap-4">
                  {/* Glowing timeline dot */}
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-[#16080B]" />

                  <div className="flex-1 p-3.5 rounded-2xl bg-zinc-950/60 border border-rose-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                          {act.itemType.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white">
                        {act.itemName}
                        {act.detail && (
                          <span className="font-normal text-zinc-400 text-[11px] ml-2">
                            • {act.detail}
                          </span>
                        )}
                      </p>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">
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
