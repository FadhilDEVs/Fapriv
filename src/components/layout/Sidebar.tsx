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
  const { currentView, setCurrentView, profile, stats, deletedItems } = useWorkspace()

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
      className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r z-30 select-none"
      style={{
        backgroundColor: '#16080B',
        borderColor: 'rgba(101, 10, 18, 0.4)',
      }}
    >
      {/* Brand header */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(101, 10, 18, 0.3)' }}>
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
                  ? 'text-white shadow-lg shadow-rose-950/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
              style={
                isActive
                  ? {
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
                    isActive ? 'text-rose-400' : 'text-zinc-400'
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
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
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
        style={{ borderColor: 'rgba(101, 10, 18, 0.35)', backgroundColor: 'rgba(33, 9, 13, 0.4)' }}
      >
        <button
          onClick={() => setCurrentView('settings')}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-900/60 transition-all text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={profile.avatarUrl || '/assets/avatar.jpg'}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border border-rose-600/40 shrink-0"
              onError={(e) => {
                // Fallback if image fails
                ;(e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }}
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate group-hover:text-rose-300 transition-colors">
                {profile.name}
              </p>
              <p className="text-[10px] text-zinc-400 truncate font-mono">{profile.email}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-rose-300 text-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Session</span>
        </button>
      </div>
    </aside>
  )
}
