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
  Sparkles,
  Lock,
} from 'lucide-react'
import { Logo } from '../common/Logo.tsx'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const MobileMenuDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentView,
    setCurrentView,
    profile,
    stats,
    deletedItems,
    setIsProfileModalOpen,
    lockWorkspace,
    theme,
  } = useWorkspace()

  if (!isOpen) return null

  const isLight = theme === 'light'

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
        className={`fixed inset-0 backdrop-blur-sm animate-in fade-in duration-200 ${
          isLight ? 'bg-slate-900/40' : 'bg-black/80'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`relative flex-1 max-w-xs w-full h-full flex flex-col border-r z-10 animate-in slide-in-from-left duration-250 select-none ${
          isLight ? 'bg-white border-slate-200' : ''
        }`}
        style={
          isLight
            ? { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }
            : { backgroundColor: '#16080B', borderColor: 'rgba(101, 10, 18, 0.5)' }
        }
      >
        {/* Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isLight ? 'border-slate-100 bg-slate-50/50' : 'border-rose-950/40'
        }`}>
          <Logo size="sm" />
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60'
            }`}
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
                    ? isLight
                      ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm'
                      : 'text-white bg-rose-950/60 border border-rose-600/40 shadow-lg shadow-rose-950/30'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${
                    isActive
                      ? isLight ? 'text-blue-600' : 'text-rose-400'
                      : isLight ? 'text-slate-400' : 'text-zinc-500'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${
                    isLight
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Profile */}
        <div className={`p-4 border-t space-y-2 ${
          isLight ? 'border-slate-100 bg-slate-50/70' : 'border-rose-950/40 bg-zinc-950/60'
        }`}>
          <div
            onClick={() => {
              setIsProfileModalOpen(true)
              onClose()
            }}
            className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                : 'bg-zinc-900/60 border-zinc-800/80 hover:border-rose-700/60'
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl || '/assets/avatar.jpg'}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover border border-rose-600/40"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded text-[8px] font-bold text-white ${
                isLight ? 'bg-blue-600' : 'bg-rose-900'
              }`}>
                {profile.badge || 'OWNER'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate flex items-center justify-between ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>{profile.name}</span>
                <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-500' : 'text-rose-400'}`} />
              </p>
              <p className={`text-xs truncate font-mono ${
                isLight ? 'text-blue-600' : 'text-rose-300/80'
              }`}>@{profile.nickname || 'fadhil'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              lockWorkspace()
              onClose()
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              isLight
                ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                : 'text-rose-400 hover:text-rose-200 bg-rose-950/40 border border-rose-900/40'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci Workspace</span>
          </button>
        </div>
      </div>
    </div>
  )
}
