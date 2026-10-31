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
  X,
  LogOut,
} from 'lucide-react'
import { Logo } from '../common/Logo.tsx'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const MobileMenuDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentView, setCurrentView, profile, stats, deletedItems } = useWorkspace()

  if (!isOpen) return null

  const navItems: { id: NavView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'shortcuts', label: 'Shortcut', icon: Link2, badge: stats.shortcuts },
    { id: 'notes', label: 'Notes', icon: FileText, badge: stats.notes },
    { id: 'important_data', label: 'Important Data', icon: Database, badge: stats.importantData },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: stats.favorites },
    { id: 'trash', label: 'Recently Deleted', icon: Trash2, badge: deletedItems.length },
    { id: 'activity', label: 'Activity History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleSelect = (id: NavView) => {
    setCurrentView(id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="relative flex-1 max-w-xs w-full h-full flex flex-col border-r z-10 animate-in slide-in-from-left duration-250 select-none"
        style={{
          backgroundColor: '#16080B',
          borderColor: 'rgba(101, 10, 18, 0.5)',
        }}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-rose-950/40">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-rose-950/60 border border-rose-600/40 shadow-lg shadow-rose-950/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-rose-950/40 bg-zinc-950/60">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={profile.avatarUrl || '/assets/avatar.jpg'}
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover border border-rose-600/40"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
              <p className="text-xs text-zinc-500 truncate">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={() => handleSelect('settings')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Pengaturan Akun</span>
          </button>
        </div>
      </div>
    </div>
  )
}
