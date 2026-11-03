import React from 'react'
import { Home, Link2, Plus, FileText, MoreHorizontal } from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const BottomNav: React.FC<{ onOpenMenuDrawer: () => void }> = ({ onOpenMenuDrawer }) => {
  const { currentView, setCurrentView, openQuickAdd, theme } = useWorkspace()
  const isLight = theme === 'light'

  const tabs: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'shortcuts', label: 'Pintasan', icon: Link2 },
  ]

  const rightTabs: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'notes', label: 'Catatan', icon: FileText },
  ]

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t backdrop-blur-2xl flex items-center justify-around px-2 select-none ${
        isLight ? 'bg-white/95 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]' : ''
      }`}
      style={
        isLight
          ? { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#E2E8F0' }
          : { backgroundColor: 'rgba(22, 8, 11, 0.95)', borderColor: 'rgba(101, 10, 18, 0.5)' }
      }
    >
      {/* Left items */}
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = currentView === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive
                ? isLight ? 'text-blue-600' : 'text-rose-400'
                : isLight ? 'text-slate-400 hover:text-slate-600' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
            {isActive && (
              <span className={`w-4 h-0.5 rounded-full mt-0.5 ${
                isLight ? 'bg-blue-600' : 'bg-rose-500'
              }`} />
            )}
          </button>
        )
      })}

      {/* Floating glowing center plus button */}
      <div className="relative -top-4 px-2">
        <button
          onClick={() => openQuickAdd()}
          className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 cursor-pointer"
          style={
            isLight
              ? {
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4), 0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: '3px solid rgba(255, 255, 255, 0.9)',
                }
              : {
                  background: 'linear-gradient(135deg, #FF303B 0%, #D51F2B 40%, #880B16 100%)',
                  boxShadow: '0 0 25px rgba(255, 48, 59, 0.5), 0 8px 20px rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                }
          }
          aria-label="Tambah Baru"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Right items */}
      {rightTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = currentView === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive
                ? isLight ? 'text-blue-600' : 'text-rose-400'
                : isLight ? 'text-slate-400 hover:text-slate-600' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
            {isActive && (
              <span className={`w-4 h-0.5 rounded-full mt-0.5 ${
                isLight ? 'bg-blue-600' : 'bg-rose-500'
              }`} />
            )}
          </button>
        )
      })}

      {/* Menu / Drawer button */}
      <button
        onClick={onOpenMenuDrawer}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
          isLight ? 'text-slate-400 hover:text-slate-600' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Lainnya</span>
      </button>
    </div>
  )
}
