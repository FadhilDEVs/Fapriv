import React, { useState } from 'react'
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext.tsx'
import { Sidebar } from './components/layout/Sidebar.tsx'
import { Topbar } from './components/layout/Topbar.tsx'
import { BottomNav } from './components/layout/BottomNav.tsx'
import { MobileMenuDrawer } from './components/layout/MobileMenuDrawer.tsx'
import { ToastContainer } from './components/common/ToastContainer.tsx'

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal.tsx'
import { QuickAddModal } from './components/modals/QuickAddModal.tsx'
import { ShortcutModal } from './components/modals/ShortcutModal.tsx'
import { NoteEditorModal } from './components/modals/NoteEditorModal.tsx'
import { ImportantDataModal } from './components/modals/ImportantDataModal.tsx'
import { ProfileModal } from './components/modals/ProfileModal.tsx'
import { MasterLockScreen } from './components/common/MasterLockScreen.tsx'

// Views
import { DashboardView } from './components/views/DashboardView.tsx'
import { ShortcutsView } from './components/views/ShortcutsView.tsx'
import { NotesView } from './components/views/NotesView.tsx'
import { ImportantDataView } from './components/views/ImportantDataView.tsx'
import { FavoritesView } from './components/views/FavoritesView.tsx'
import { RecentlyDeletedView } from './components/views/RecentlyDeletedView.tsx'
import { ActivityHistoryView } from './components/views/ActivityHistoryView.tsx'
import { SettingsView } from './components/views/SettingsView.tsx'

const MainWorkspaceContent: React.FC = () => {
  const { currentView, profile, isLocked, unlockWorkspace, isProfileModalOpen, setIsProfileModalOpen } =
    useWorkspace()
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'shortcuts':
        return <ShortcutsView />
      case 'notes':
        return <NotesView />
      case 'important_data':
        return <ImportantDataView />
      case 'favorites':
        return <FavoritesView />
      case 'trash':
        return <RecentlyDeletedView />
      case 'activity':
        return <ActivityHistoryView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen flex w-full relative bg-[#16080B] text-white overflow-x-hidden">
      {/* Subtle ambient luxury crimson lighting */}
      <div className="pointer-events-none fixed -top-40 -left-20 w-[600px] h-[600px] bg-rose-950/20 blur-[160px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-950/15 blur-[180px] rounded-full z-0" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 relative z-10">
        <Topbar onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <BottomNav onOpenMenuDrawer={() => setIsMobileDrawerOpen(true)} />
      <MobileMenuDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <QuickAddModal />
      <ShortcutModal />
      <NoteEditorModal />
      <ImportantDataModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ToastContainer />

      {/* Master Security PIN Lock for Sovereign Single-User Access */}
      <MasterLockScreen
        profile={profile}
        isLocked={isLocked}
        onUnlock={unlockWorkspace}
        securityPin={profile.securityPin}
      />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <WorkspaceProvider>
      <MainWorkspaceContent />
    </WorkspaceProvider>
  )
}

export default App
