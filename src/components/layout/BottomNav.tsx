import React from 'react'
import { Home, Link2, Plus, FileText, Menu } from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { NavView } from '../../types/fapriv.ts'

export const BottomNav: React.FC<{ onOpenMenuDrawer: () => void }> = ({ onOpenMenuDrawer }) => {
  const { currentView, setCurrentView, openQuickAdd } = useWorkspace()

  const tabs: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'shortcuts', label: 'Shortcut', icon: Link2 },
  ]

  const rightTabs: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'notes', label: 'Notes', icon: FileText },
  ]

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t backdrop-blur-2xl flex items-center justify-around px-2 select-none"
      style={{
        backgroundColor: 'rgba(22, 8, 11, 0.95)',
        borderColor: 'rgba(101, 10, 18, 0.5)',
      }}
    >
      {/* Left items */}
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = currentView === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
          </button>
        )
      })}

      {/* Floating glowing center plus button */}
      <div className="relative -top-4 px-2">
        <button
          onClick={() => openQuickAdd()}
          className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FF303B 0%, #D51F2B 40%, #880B16 100%)',
            boxShadow: '0 0 25px rgba(255, 48, 59, 0.5), 0 8px 20px rgba(0, 0, 0, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
          }}
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
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
          </button>
        )
      })}

      {/* Menu / Drawer button */}
      <button
        onClick={onOpenMenuDrawer}
        className="flex flex-col items-center justify-center flex-1 py-1 text-zinc-500 hover:text-zinc-300 transition-all"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Menu</span>
      </button>
    </div>
  )
}
