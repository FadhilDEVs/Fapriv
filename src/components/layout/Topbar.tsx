import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Link2,
  FileText,
  Database,
  Menu,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { Logo } from '../common/Logo.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const Topbar: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    currentView,
    setCurrentView,
    theme,
    setTheme,
    profile,
    setIsSearchOpen,
    openQuickAdd,
    activities,
  } = useWorkspace()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Title formatting
  const viewTitles: Record<NavView, string> = {
    dashboard: 'Dashboard',
    shortcuts: 'Shortcuts',
    notes: 'Notes',
    important_data: 'Important Data',
    favorites: 'Favorites',
    trash: 'Recently Deleted',
    activity: 'Activity History',
    settings: 'Settings',
  }

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 w-full h-16 border-b backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 select-none"
      style={{
        backgroundColor: 'rgba(22, 8, 11, 0.85)',
        borderColor: 'rgba(101, 10, 18, 0.4)',
      }}
    >
      {/* Left side: View title on Desktop / Mobile logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/60"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="md:hidden">
          <Logo size="sm" showTagline={false} />
        </div>

        <h1 className="hidden md:block text-base font-bold text-white tracking-tight">
          {viewTitles[currentView]}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-4 sm:mx-8">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-zinc-400 border transition-all duration-200 hover:border-rose-500/40 hover:text-zinc-200 cursor-pointer shadow-inner"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.6)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">Search anything... (shortcuts, notes, data...)</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Create New Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 60%, #650A12 100%)',
              boxShadow: '0 0 20px -3px rgba(213, 31, 43, 0.45)',
            }}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Create New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-2xl border backdrop-blur-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{
                backgroundColor: 'rgba(22, 8, 11, 0.98)',
                borderColor: 'rgba(101, 10, 18, 0.6)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(213, 31, 43, 0.2)',
              }}
            >
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  openQuickAdd('shortcut')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-rose-950/40 transition-colors text-left"
              >
                <Link2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Tambah Shortcut</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  openQuickAdd('note')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-rose-950/40 transition-colors text-left"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>Tambah Catatan</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  openQuickAdd('important_data')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-rose-950/40 transition-colors text-left"
              >
                <Database className="w-3.5 h-3.5 text-rose-400" />
                <span>Tambah Data Penting</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-2xl border backdrop-blur-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{
                backgroundColor: 'rgba(22, 8, 11, 0.98)',
                borderColor: 'rgba(101, 10, 18, 0.6)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(213, 31, 43, 0.2)',
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-xs font-bold text-white">Notifikasi Aktivitas</span>
                <span className="text-[10px] text-zinc-500">{activities.length} item</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-zinc-850/50 py-1">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="py-2 px-1 text-xs space-y-0.5">
                    <p className="font-medium text-zinc-200 truncate">{act.itemName}</p>
                    <p className="text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>{act.detail || act.action}</span>
                      <span className="text-zinc-500 text-[10px]">{act.timestamp}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800"
          title={`Ubah ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Profile Avatar trigger */}
        <button
          onClick={() => setCurrentView('settings')}
          className="relative rounded-full ring-2 ring-rose-900/40 hover:ring-rose-500 transition-all cursor-pointer"
        >
          <img
            src={profile.avatarUrl || '/assets/avatar.jpg'}
            alt={profile.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
            }}
          />
        </button>
      </div>
    </header>
  )
}
