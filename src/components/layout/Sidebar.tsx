import React from 'react'
import {
  Home,
  Link2,
  FileText,
  Database,
  Star,
  Trash2,
  Clock,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { Logo } from '../common/Logo.tsx'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, profile, stats, deletedItems, lockWorkspace, setIsProfileModalOpen, theme } =
    useWorkspace()

  const isLight = theme === 'light'

  const navItems: {
    id: NavView
    label: string
    icon: React.ElementType
    badge?: number
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'shortcuts', label: 'Shortcut', icon: Link2, badge: stats.shortcuts },
    { id: 'notes', label: 'Notes', icon: FileText, badge: stats.notes },
    { id: 'important_data', label: 'Important Data', icon: Database, badge: stats.importantData },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: stats.favorites },
    { id: 'trash', label: 'Recently Deleted', icon: Trash2, badge: deletedItems.length },
    { id: 'activity', label: 'Activity History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={`hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r z-30 select-none transition-colors duration-250 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-r'
      }`}
      style={
        isLight
          ? undefined
          : {
              backgroundColor: '#16080B',
              borderColor: 'rgba(101, 10, 18, 0.4)',
            }
      }
    >
      {/* Brand header */}
      <div
        className="p-6 border-b"
        style={isLight ? { borderColor: '#f1f5f9' } : { borderColor: 'rgba(101, 10, 18, 0.3)' }}
      >
        <Logo size="md" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? isLight
                    ? 'text-blue-600 bg-blue-50/80 font-bold shadow-sm'
                    : 'text-white shadow-lg shadow-rose-950/30'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
              style={
                isActive
                  ? isLight
                    ? {
                        borderLeft: '3px solid #2563EB',
                        borderTop: '1px solid rgba(37, 99, 235, 0.15)',
                        borderRight: '1px solid rgba(37, 99, 235, 0.15)',
                        borderBottom: '1px solid rgba(37, 99, 235, 0.15)',
                      }
                    : {
                        background:
                          'linear-gradient(90deg, rgba(163, 14, 27, 0.45) 0%, rgba(101, 10, 18, 0.15) 100%)',
                        borderLeft: '3px solid #D51F2B',
                        borderTop: '1px solid rgba(213, 31, 43, 0.25)',
                        borderRight: '1px solid rgba(213, 31, 43, 0.15)',
                        borderBottom: '1px solid rgba(213, 31, 43, 0.15)',
                      }
                  : { borderLeft: '3px solid transparent' }
              }
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? isLight
                        ? 'text-blue-600'
                        : 'text-rose-400'
                      : isLight
                      ? 'text-slate-400'
                      : 'text-zinc-400'
                  }`}
                />
                <span className={isActive ? 'font-semibold tracking-wide' : 'tracking-normal'}>
                  {item.label}
                </span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? isLight
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isLight
                      ? 'bg-slate-100 text-slate-500 border border-slate-200'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User profile footer */}
      <div
        className="p-3.5 border-t space-y-2 mt-auto"
        style={
          isLight
            ? { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }
            : { borderColor: 'rgba(101, 10, 18, 0.35)', backgroundColor: 'rgba(33, 9, 13, 0.4)' }
        }
      >
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left group cursor-pointer ${
            isLight ? 'hover:bg-slate-200/60' : 'hover:bg-zinc-900/60'
          }`}
          title="Kustomisasi Profil Pengguna"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl || '/assets/avatar.jpg'}
                alt={profile.name}
                className={`w-9 h-9 rounded-full object-cover border ${
                  isLight ? 'border-blue-400' : 'border-rose-600/40'
                }`}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }}
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ${
                  isLight ? 'ring-white' : 'ring-[#16080B]'
                }`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p
                  className={`text-xs font-semibold truncate transition-colors ${
                    isLight
                      ? 'text-slate-800 group-hover:text-blue-600'
                      : 'text-white group-hover:text-rose-300'
                  }`}
                >
                  {profile.name}
                </p>
                <span
                  className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                    isLight
                      ? 'bg-blue-100 border border-blue-200 text-blue-700'
                      : 'bg-rose-950/80 border border-rose-800/40 text-rose-300'
                  }`}
                >
                  {profile.badge || 'OWNER'}
                </span>
              </div>
              <p
                className={`text-[10px] truncate font-mono ${
                  isLight ? 'text-slate-500' : 'text-zinc-400'
                }`}
              >
                @{profile.nickname || 'fadhil'}
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-all shrink-0 ${
              isLight
                ? 'text-slate-400 group-hover:text-slate-700'
                : 'text-zinc-400 group-hover:text-white'
            } group-hover:translate-x-0.5`}
          />
        </button>

        <button
          onClick={lockWorkspace}
          className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              : 'text-zinc-400 hover:text-rose-300 hover:bg-rose-950/30 border-transparent'
          }`}
          title="Kunci Workspace (Alt + L)"
        >
          <LogOut className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
          <span>Kunci Workspace</span>
        </button>
      </div>
    </aside>
  )
}
