import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type {
  NavView,
  ThemeMode,
  ShortcutItem,
  NoteItem,
  ImportantDataItem,
  ActivityItem,
  DeletedItem,
  CategoryItem,
  TagItem,
  UserProfile,
  ToastMessage,
  CloudSyncStatus,
} from '../types/fapriv.ts'
import {
  fetchRemoteWorkspace,
  pushRemoteWorkspace,
  subscribeToWorkspaceChanges,
} from '../services/cloudWorkspace.ts'
import {
  initialProfile,
  initialCategories,
  initialTags,
  initialShortcuts,
  initialNotes,
  initialImportantData,
  initialActivities,
} from '../lib/mockData.ts'

interface WorkspaceContextType {
  // Navigation
  currentView: NavView
  setCurrentView: (view: NavView) => void

  // Theme
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void

  // Profile
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void

  // Shortcuts
  shortcuts: ShortcutItem[]
  addShortcut: (item: Omit<ShortcutItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateShortcut: (id: string, item: Partial<ShortcutItem>) => void
  deleteShortcut: (id: string) => void
  toggleFavoriteShortcut: (id: string) => void
  togglePinShortcut: (id: string) => void

  // Notes
  notes: NoteItem[]
  addNote: (item: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => NoteItem
  updateNote: (id: string, item: Partial<NoteItem>) => void
  deleteNote: (id: string) => void
  toggleFavoriteNote: (id: string) => void
  togglePinNote: (id: string) => void
  autoSaveNote: (id: string, title: string, content: string) => void

  // Important Data
  importantData: ImportantDataItem[]
  addData: (item: Omit<ImportantDataItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateData: (id: string, item: Partial<ImportantDataItem>) => void
  deleteData: (id: string) => void
  toggleFavoriteData: (id: string) => void
  togglePinData: (id: string) => void

  // Trash & Deleted Items
  deletedItems: DeletedItem[]
  restoreItem: (id: string) => void
  permanentDeleteItem: (id: string) => void
  emptyTrash: () => void

  // Activities
  activities: ActivityItem[]
  addActivity: (action: ActivityItem['action'], itemType: ActivityItem['itemType'], itemName: string, detail?: string) => void

  // Categories & Tags
  categories: CategoryItem[]
  addCategory: (name: string, color?: string) => void
  deleteCategory: (id: string) => void
  tags: TagItem[]
  addTag: (name: string) => void
  deleteTag: (id: string) => void

  // Modals
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  isQuickAddOpen: boolean
  setIsQuickAddOpen: (open: boolean) => void
  quickAddType: 'shortcut' | 'note' | 'important_data' | null
  openQuickAdd: (type?: 'shortcut' | 'note' | 'important_data') => void

  // Edit Modals
  editingShortcut: ShortcutItem | null
  setEditingShortcut: (sc: ShortcutItem | null) => void
  editingNote: NoteItem | null
  setEditingNote: (note: NoteItem | null) => void
  editingData: ImportantDataItem | null
  setEditingData: (data: ImportantDataItem | null) => void

  // Toast & Clipboard
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  copyToClipboard: (text: string, label?: string) => Promise<boolean>

  // Backup & Restore
  exportBackup: () => void
  importBackup: (jsonString: string, mode: 'merge' | 'replace') => boolean

  // Stats
  stats: {
    shortcuts: number
    notes: number
    importantData: number
    favorites: number
  }

  // Master Lock
  isLocked: boolean
  lockWorkspace: () => void
  unlockWorkspace: () => void

  // Profile Modal
  isProfileModalOpen: boolean
  setIsProfileModalOpen: (open: boolean) => void

  // Cloud Sync (Universal Access)
  cloudSyncStatus: CloudSyncStatus
  lastSyncedAt: string | null
  syncWithCloud: (forcePush?: boolean) => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

const STORAGE_KEYS = {
  THEME: 'fapriv_theme',
  PROFILE: 'fapriv_profile',
  SHORTCUTS: 'fapriv_shortcuts',
  NOTES: 'fapriv_notes',
  IMPORTANT_DATA: 'fapriv_important_data',
  ACTIVITIES: 'fapriv_activities',
  TRASH: 'fapriv_trash',
  CATEGORIES: 'fapriv_categories',
  TAGS: 'fapriv_tags',
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch (err) {
    console.warn(`[Storage] Failed to read ${key}:`, err)
  }
  return fallback
}

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard')
  const [theme, setThemeState] = useState<ThemeMode>(() => loadStorage(STORAGE_KEYS.THEME, 'dark'))
  const [profile, setProfileState] = useState<UserProfile>(() => loadStorage(STORAGE_KEYS.PROFILE, initialProfile))

  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => loadStorage(STORAGE_KEYS.SHORTCUTS, initialShortcuts))
  const [notes, setNotes] = useState<NoteItem[]>(() => loadStorage(STORAGE_KEYS.NOTES, initialNotes))
  const [importantData, setImportantData] = useState<ImportantDataItem[]>(() => loadStorage(STORAGE_KEYS.IMPORTANT_DATA, initialImportantData))
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>(() => loadStorage(STORAGE_KEYS.TRASH, []))
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadStorage(STORAGE_KEYS.ACTIVITIES, initialActivities))
  const [categories, setCategories] = useState<CategoryItem[]>(() => loadStorage(STORAGE_KEYS.CATEGORIES, initialCategories))
  const [tags, setTags] = useState<TagItem[]>(() => loadStorage(STORAGE_KEYS.TAGS, initialTags))

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickAddType, setQuickAddType] = useState<'shortcut' | 'note' | 'important_data' | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Master Lock state
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const isRemembered = localStorage.getItem('fapriv_device_authorized')
      return isRemembered !== 'true'
    } catch {
      return true
    }
  })

  // Cloud Sync state
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('syncing')
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const isCloudInitializedRef = useRef(false)
  const isRemoteUpdatingRef = useRef(false)
  const saveTimeoutRef = useRef<any>(null)

  const [editingShortcut, setEditingShortcut] = useState<ShortcutItem | null>(null)
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null)
  const [editingData, setEditingData] = useState<ImportantDataItem | null>(null)

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6)
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const copyToClipboard = useCallback(
    async (text: string, label = 'Teks') => {
      try {
        await navigator.clipboard.writeText(text)
        addToast({
          type: 'success',
          title: `${label} berhasil disalin!`,
          description: text.length > 50 ? `${text.slice(0, 48)}...` : text,
        })
        return true
      } catch (err) {
        console.error('Clipboard copy error:', err)
        addToast({
          type: 'error',
          title: 'Gagal menyalin',
          description: 'Browser tidak mengizinkan akses clipboard.',
        })
        return false
      }
    },
    [addToast]
  )

  // Activity logger
  const addActivity = useCallback(
    (action: ActivityItem['action'], itemType: ActivityItem['itemType'], itemName: string, detail?: string) => {
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        action,
        itemType,
        itemName,
        timestamp: 'Baru saja',
        detail,
      }
      setActivities((prev) => [newAct, ...prev.slice(0, 49)])
    },
    []
  )

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme))
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHORTCUTS, JSON.stringify(shortcuts))
  }, [shortcuts])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IMPORTANT_DATA, JSON.stringify(importantData))
  }, [importantData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(deletedItems))
  }, [deletedItems])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags))
  }, [tags])

  // Lock actions
  const unlockWorkspace = useCallback(() => {
    setIsLocked(false)
  }, [])

  const lockWorkspace = useCallback(() => {
    setIsLocked(true)
    try {
      localStorage.removeItem('fapriv_device_authorized')
    } catch {}
    addToast({
      type: 'info',
      title: 'Workspace Terkunci',
      description: 'Masukkan PIN Keamanan untuk membuka kembali.',
    })
  }, [addToast])

  // Global Keyboard Shortcuts (Ctrl+K = Search, Alt+L = Lock)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      } else if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        lockWorkspace()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lockWorkspace])

  // Last saved data tracker to prevent duplicate saves and infinite loops
  const lastSavedDataJsonRef = useRef<string>('')

  // Cloud Sync Handler
  const syncWithCloud = useCallback(
    async (forcePush = false) => {
      setCloudSyncStatus('syncing')
      if (forcePush) {
        const res = await pushRemoteWorkspace({
          profile,
          shortcuts,
          notes,
          importantData,
          categories,
          tags,
          activities,
          deletedItems,
          securityPin: profile.securityPin || '123456',
        })
        if (res.success) {
          setCloudSyncStatus('synced')
          lastSavedDataJsonRef.current = JSON.stringify({
            profile,
            shortcuts,
            notes,
            importantData,
            categories,
            tags,
            activities,
            deletedItems,
          })
          const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          setLastSyncedAt(timeStr)
          addToast({
            type: 'success',
            title: 'Tersinkronisasi ke Cloud!',
            description: 'Data terbaru berhasil diunggah ke Supabase.',
          })
        } else if (res.isPermissionDenied) {
          setCloudSyncStatus('permission_denied')
          addToast({
            type: 'warning',
            title: 'Izin Tabel Ditolak (Error 42501)',
            description: 'Jalankan perintah GRANT di Supabase SQL Editor.',
          })
        } else if (res.isTableMissing) {
          setCloudSyncStatus('pending_setup')
          addToast({
            type: 'warning',
            title: 'Tabel Supabase Belum Ada',
            description: 'Jalankan skrip SQL di Dashboard Supabase untuk mengaktifkan sinkronisasi universal.',
          })
        } else {
          setCloudSyncStatus('error')
          addToast({
            type: 'error',
            title: 'Gagal Sinkronisasi Cloud',
            description: res.error || 'Periksa koneksi Supabase Anda.',
          })
        }
      } else {
        const res = await fetchRemoteWorkspace()
        if (res.success && res.data) {
          isRemoteUpdatingRef.current = true
          setProfileState((prev) => ({ ...prev, ...res.data!.profile }))
          setShortcuts(res.data.shortcuts)
          setNotes(res.data.notes)
          setImportantData(res.data.importantData)
          if (res.data.categories?.length) setCategories(res.data.categories)
          if (res.data.tags?.length) setTags(res.data.tags)
          if (res.data.activities?.length) setActivities(res.data.activities)
          if (res.data.deletedItems) setDeletedItems(res.data.deletedItems)
          setCloudSyncStatus('synced')
          lastSavedDataJsonRef.current = JSON.stringify({
            profile: res.data.profile,
            shortcuts: res.data.shortcuts,
            notes: res.data.notes,
            importantData: res.data.importantData,
            categories: res.data.categories,
            tags: res.data.tags,
            activities: res.data.activities,
            deletedItems: res.data.deletedItems,
          })
          const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          setLastSyncedAt(timeStr)
          setTimeout(() => {
            isRemoteUpdatingRef.current = false
          }, 400)
          addToast({ type: 'success', title: 'Data Cloud Berhasil Diunduh' })
        } else if (res.success && !res.data) {
          // Table exists but is empty -> Push current local workspace
          const pushRes = await pushRemoteWorkspace({
            profile,
            shortcuts,
            notes,
            importantData,
            categories,
            tags,
            activities,
            deletedItems,
            securityPin: profile.securityPin || '123456',
          })
          if (pushRes.success) {
            setCloudSyncStatus('synced')
            lastSavedDataJsonRef.current = JSON.stringify({
              profile,
              shortcuts,
              notes,
              importantData,
              categories,
              tags,
              activities,
              deletedItems,
            })
            const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            setLastSyncedAt(timeStr)
            addToast({
              type: 'success',
              title: 'Tersinkronisasi ke Cloud!',
              description: 'Data awal berhasil disimpan ke Supabase.',
            })
          } else if (pushRes.isPermissionDenied) {
            setCloudSyncStatus('permission_denied')
          } else {
            setCloudSyncStatus('error')
          }
        } else if (res.isPermissionDenied) {
          setCloudSyncStatus('permission_denied')
        } else if (res.isTableMissing) {
          setCloudSyncStatus('pending_setup')
        } else {
          setCloudSyncStatus('offline')
        }
      }
    },
    [profile, shortcuts, notes, importantData, categories, tags, activities, deletedItems, addToast]
  )

  // Initial Cloud Load and Realtime Subscription
  useEffect(() => {
    let isMounted = true

    const loadCloudData = async () => {
      setCloudSyncStatus('syncing')
      const res = await fetchRemoteWorkspace()
      if (!isMounted) return

      if (res.isPermissionDenied) {
        setCloudSyncStatus('permission_denied')
        isCloudInitializedRef.current = true
        return
      }

      if (res.isTableMissing) {
        setCloudSyncStatus('pending_setup')
        isCloudInitializedRef.current = true
        return
      }

      if (res.success) {
        if (res.data) {
          isRemoteUpdatingRef.current = true
          setProfileState((prev) => ({ ...prev, ...res.data!.profile }))
          setShortcuts(res.data.shortcuts)
          setNotes(res.data.notes)
          setImportantData(res.data.importantData)
          if (res.data.categories?.length) setCategories(res.data.categories)
          if (res.data.tags?.length) setTags(res.data.tags)
          if (res.data.activities?.length) setActivities(res.data.activities)
          if (res.data.deletedItems) setDeletedItems(res.data.deletedItems)
          setCloudSyncStatus('synced')
          lastSavedDataJsonRef.current = JSON.stringify({
            profile: res.data.profile,
            shortcuts: res.data.shortcuts,
            notes: res.data.notes,
            importantData: res.data.importantData,
            categories: res.data.categories,
            tags: res.data.tags,
            activities: res.data.activities,
            deletedItems: res.data.deletedItems,
          })
          const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          setLastSyncedAt(timeStr)
          setTimeout(() => {
            isRemoteUpdatingRef.current = false
          }, 400)
        } else {
          // Initialize remote database with current state
          const pushRes = await pushRemoteWorkspace({
            profile,
            shortcuts,
            notes,
            importantData,
            categories,
            tags,
            activities,
            deletedItems,
            securityPin: profile.securityPin || '123456',
          })
          if (pushRes.success) {
            setCloudSyncStatus('synced')
            lastSavedDataJsonRef.current = JSON.stringify({
              profile,
              shortcuts,
              notes,
              importantData,
              categories,
              tags,
              activities,
              deletedItems,
            })
            setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
          } else if (pushRes.isPermissionDenied) {
            setCloudSyncStatus('permission_denied')
          } else if (pushRes.isTableMissing) {
            setCloudSyncStatus('pending_setup')
          }
        }
      } else {
        setCloudSyncStatus('offline')
      }

      isCloudInitializedRef.current = true
    }

    loadCloudData()

    // Realtime cross-device updates listener
    const unsubscribe = subscribeToWorkspaceChanges((incoming) => {
      if (!isMounted) return

      const incomingJson = JSON.stringify({
        profile: incoming.profile,
        shortcuts: incoming.shortcuts,
        notes: incoming.notes,
        importantData: incoming.importantData,
        categories: incoming.categories,
        tags: incoming.tags,
        activities: incoming.activities,
        deletedItems: incoming.deletedItems,
      })

      // If incoming payload is identical to our last saved or current data, ignore it completely!
      if (incomingJson === lastSavedDataJsonRef.current) {
        return
      }

      isRemoteUpdatingRef.current = true
      lastSavedDataJsonRef.current = incomingJson

      setProfileState((prev) => ({ ...prev, ...incoming.profile }))
      setShortcuts(incoming.shortcuts)
      setNotes(incoming.notes)
      setImportantData(incoming.importantData)
      if (incoming.categories?.length) setCategories(incoming.categories)
      if (incoming.tags?.length) setTags(incoming.tags)
      if (incoming.activities?.length) setActivities(incoming.activities)
      if (incoming.deletedItems) setDeletedItems(incoming.deletedItems)
      setCloudSyncStatus('synced')

      setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
      setTimeout(() => {
        isRemoteUpdatingRef.current = false
      }, 500)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // Debounced auto-save to Supabase Cloud ONLY when actual content changes
  useEffect(() => {
    if (!isCloudInitializedRef.current || isRemoteUpdatingRef.current) return
    if (cloudSyncStatus === 'pending_setup' || cloudSyncStatus === 'permission_denied') return

    const currentJson = JSON.stringify({
      profile,
      shortcuts,
      notes,
      importantData,
      categories,
      tags,
      activities,
      deletedItems,
    })

    // Skip if data hasn't changed since last sync
    if (currentJson === lastSavedDataJsonRef.current) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setCloudSyncStatus('syncing')
      const res = await pushRemoteWorkspace({
        profile,
        shortcuts,
        notes,
        importantData,
        categories,
        tags,
        activities,
        deletedItems,
        securityPin: profile.securityPin || '123456',
      })

      if (res.success) {
        lastSavedDataJsonRef.current = currentJson
        setCloudSyncStatus('synced')
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
      } else if (res.isPermissionDenied) {
        setCloudSyncStatus('permission_denied')
      } else if (res.isTableMissing) {
        setCloudSyncStatus('pending_setup')
      } else {
        setCloudSyncStatus('error')
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [profile, shortcuts, notes, importantData, categories, tags, activities, deletedItems])

  // Modals helper
  const openQuickAdd = (type?: 'shortcut' | 'note' | 'important_data') => {
    setQuickAddType(type || null)
    setIsQuickAddOpen(true)
  }

  const setTheme = (t: ThemeMode) => setThemeState(t)

  const updateProfile = (p: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...p }))
  }

  // --- SHORTCUTS ---
  const addShortcut = (item: Omit<ShortcutItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newSc: ShortcutItem = {
      ...item,
      id: `sc-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    setShortcuts((prev) => [newSc, ...prev])
    addActivity('create', 'shortcut', newSc.title, 'Menambahkan shortcut website')
    addToast({ type: 'success', title: 'Shortcut berhasil dibuat!' })
  }

  const updateShortcut = (id: string, item: Partial<ShortcutItem>) => {
    setShortcuts((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, ...item, updatedAt: new Date().toISOString() } : sc))
    )
    addActivity('edit', 'shortcut', item.title || 'Shortcut', 'Memperbarui shortcut')
    addToast({ type: 'success', title: 'Shortcut berhasil diperbarui!' })
  }

  const deleteShortcut = (id: string) => {
    const target = shortcuts.find((sc) => sc.id === id)
    if (!target) return
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const deleted: DeletedItem = {
      id: `del-${Date.now()}`,
      originalId: target.id,
      itemType: 'shortcut',
      data: target,
      deletedAt: now.toISOString(),
      expiresAt,
    }

    setShortcuts((prev) => prev.filter((sc) => sc.id !== id))
    setDeletedItems((prev) => [deleted, ...prev])
    addActivity('delete', 'shortcut', target.title, 'Memindahkan ke Recently Deleted')
    addToast({
      type: 'info',
      title: 'Shortcut dipindahkan ke tong sampah',
      description: 'Dapat dipulihkan dalam 30 hari.',
    })
  }

  const toggleFavoriteShortcut = (id: string) => {
    setShortcuts((prev) =>
      prev.map((sc) => {
        if (sc.id === id) {
          const nextFav = !sc.isFavorite
          addActivity('favorite', 'shortcut', sc.title, nextFav ? 'Ditandai favorit' : 'Dihapus dari favorit')
          return { ...sc, isFavorite: nextFav }
        }
        return sc
      })
    )
  }

  const togglePinShortcut = (id: string) => {
    setShortcuts((prev) =>
      prev.map((sc) => {
        if (sc.id === id) {
          const nextPin = !sc.isPinned
          addActivity('pin', 'shortcut', sc.title, nextPin ? 'Disematkan ke atas' : 'Pin dilepas')
          return { ...sc, isPinned: nextPin }
        }
        return sc
      })
    )
  }

  // --- NOTES ---
  const addNote = (item: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>): NoteItem => {
    const now = new Date().toISOString()
    const newNote: NoteItem = {
      ...item,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    setNotes((prev) => [newNote, ...prev])
    addActivity('create', 'note', newNote.title, 'Membuat catatan baru')
    addToast({ type: 'success', title: 'Catatan berhasil disimpan!' })
    return newNote
  }

  const updateNote = (id: string, item: Partial<NoteItem>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const historyEntry = {
            timestamp: new Date().toISOString(),
            title: n.title,
            content: n.content,
          }
          const history = [historyEntry, ...(n.history || [])].slice(0, 10)
          return { ...n, ...item, history, updatedAt: new Date().toISOString() }
        }
        return n
      })
    )
    addActivity('edit', 'note', item.title || 'Catatan', 'Menyimpan perubahan catatan')
    addToast({ type: 'success', title: 'Perubahan catatan tersimpan' })
  }

  const autoSaveNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n))
    )
  }

  const deleteNote = (id: string) => {
    const target = notes.find((n) => n.id === id)
    if (!target) return
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const deleted: DeletedItem = {
      id: `del-${Date.now()}`,
      originalId: target.id,
      itemType: 'note',
      data: target,
      deletedAt: now.toISOString(),
      expiresAt,
    }

    setNotes((prev) => prev.filter((n) => n.id !== id))
    setDeletedItems((prev) => [deleted, ...prev])
    addActivity('delete', 'note', target.title, 'Memindahkan catatan ke Recently Deleted')
    addToast({
      type: 'info',
      title: 'Catatan dipindahkan ke tong sampah',
      description: 'Dapat dipulihkan dalam 30 hari.',
    })
  }

  const toggleFavoriteNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextFav = !n.isFavorite
          addActivity('favorite', 'note', n.title, nextFav ? 'Ditandai favorit' : 'Dihapus dari favorit')
          return { ...n, isFavorite: nextFav }
        }
        return n
      })
    )
  }

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextPin = !n.isPinned
          addActivity('pin', 'note', n.title, nextPin ? 'Disematkan ke atas' : 'Pin dilepas')
          return { ...n, isPinned: nextPin }
        }
        return n
      })
    )
  }

  // --- IMPORTANT DATA ---
  const addData = (item: Omit<ImportantDataItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newData: ImportantDataItem = {
      ...item,
      id: `imp-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    setImportantData((prev) => [newData, ...prev])
    addActivity('create', 'important_data', newData.title, 'Menambah data penting')
    addToast({ type: 'success', title: 'Data penting berhasil ditambahkan!' })
  }

  const updateData = (id: string, item: Partial<ImportantDataItem>) => {
    setImportantData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...item, updatedAt: new Date().toISOString() } : d))
    )
    addActivity('edit', 'important_data', item.title || 'Data Penting', 'Memperbarui data penting')
    addToast({ type: 'success', title: 'Data penting berhasil diperbarui' })
  }

  const deleteData = (id: string) => {
    const target = importantData.find((d) => d.id === id)
    if (!target) return
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const deleted: DeletedItem = {
      id: `del-${Date.now()}`,
      originalId: target.id,
      itemType: 'important_data',
      data: target,
      deletedAt: now.toISOString(),
      expiresAt,
    }

    setImportantData((prev) => prev.filter((d) => d.id !== id))
    setDeletedItems((prev) => [deleted, ...prev])
    addActivity('delete', 'important_data', target.title, 'Memindahkan ke Recently Deleted')
    addToast({
      type: 'info',
      title: 'Data dipindahkan ke tong sampah',
      description: 'Dapat dipulihkan dalam 30 hari.',
    })
  }

  const toggleFavoriteData = (id: string) => {
    setImportantData((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextFav = !d.isFavorite
          addActivity('favorite', 'important_data', d.title, nextFav ? 'Ditandai favorit' : 'Dihapus dari favorit')
          return { ...d, isFavorite: nextFav }
        }
        return d
      })
    )
  }

  const togglePinData = (id: string) => {
    setImportantData((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextPin = !d.isPinned
          addActivity('pin', 'important_data', d.title, nextPin ? 'Disematkan ke atas' : 'Pin dilepas')
          return { ...d, isPinned: nextPin }
        }
        return d
      })
    )
  }

  // --- TRASH & RESTORE ---
  const restoreItem = (id: string) => {
    const item = deletedItems.find((d) => d.id === id)
    if (!item) return

    if (item.itemType === 'shortcut') {
      setShortcuts((prev) => [item.data as ShortcutItem, ...prev])
    } else if (item.itemType === 'note') {
      setNotes((prev) => [item.data as NoteItem, ...prev])
    } else if (item.itemType === 'important_data') {
      setImportantData((prev) => [item.data as ImportantDataItem, ...prev])
    }

    setDeletedItems((prev) => prev.filter((d) => d.id !== id))
    addActivity('restore', item.itemType, (item.data as { title: string }).title, 'Memulihkan dari sampah')
    addToast({
      type: 'success',
      title: 'Item berhasil dipulihkan!',
      description: (item.data as { title: string }).title,
    })
  }

  const permanentDeleteItem = (id: string) => {
    const item = deletedItems.find((d) => d.id === id)
    setDeletedItems((prev) => prev.filter((d) => d.id !== id))
    if (item) {
      addActivity('delete', item.itemType, (item.data as { title: string }).title, 'Dihapus permanen')
    }
    addToast({ type: 'info', title: 'Item telah dihapus permanen' })
  }

  const emptyTrash = () => {
    setDeletedItems([])
    addActivity('delete', 'system', 'Tong Sampah', 'Mengosongkan semua item yang dihapus')
    addToast({ type: 'info', title: 'Tong sampah berhasil dikosongkan' })
  }

  // --- CATEGORIES & TAGS ---
  const addCategory = (name: string, color = '#a30e1b') => {
    if (!name.trim()) return
    const newCat: CategoryItem = { id: `cat-${Date.now()}`, name: name.trim(), color }
    setCategories((prev) => [...prev, newCat])
    addToast({ type: 'success', title: `Kategori '${name}' ditambahkan` })
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    addToast({ type: 'info', title: 'Kategori dihapus' })
  }

  const addTag = (name: string) => {
    const clean = name.trim().toLowerCase().replace(/^#/, '')
    if (!clean) return
    if (tags.some((t) => t.name === clean)) {
      addToast({ type: 'warning', title: `Tag #${clean} sudah ada` })
      return
    }
    const newTag: TagItem = { id: `tag-${Date.now()}`, name: clean }
    setTags((prev) => [...prev, newTag])
    addToast({ type: 'success', title: `Tag #${clean} ditambahkan` })
  }

  const deleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id))
    addToast({ type: 'info', title: 'Tag dihapus' })
  }

  // --- BACKUP & RESTORE ---
  const exportBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      shortcuts,
      notes,
      importantData,
      categories,
      tags,
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fapriv_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    addActivity('create', 'system', 'Backup Data', 'Mengekspor cadangan sistem JSON')
    addToast({ type: 'success', title: 'File backup JSON berhasil diunduh!' })
  }

  const importBackup = (jsonString: string, mode: 'merge' | 'replace'): boolean => {
    try {
      const data = JSON.parse(jsonString)
      if (!data.shortcuts || !data.notes) {
        throw new Error('Format file cadangan tidak valid.')
      }

      if (mode === 'replace') {
        if (data.profile) setProfileState(data.profile)
        if (Array.isArray(data.shortcuts)) setShortcuts(data.shortcuts)
        if (Array.isArray(data.notes)) setNotes(data.notes)
        if (Array.isArray(data.importantData)) setImportantData(data.importantData)
        if (Array.isArray(data.categories)) setCategories(data.categories)
        if (Array.isArray(data.tags)) setTags(data.tags)
      } else {
        // Merge mode
        if (Array.isArray(data.shortcuts)) {
          setShortcuts((prev) => {
            const existingIds = new Set(prev.map((s) => s.id))
            const newItems = data.shortcuts.filter((s: ShortcutItem) => !existingIds.has(s.id))
            return [...prev, ...newItems]
          })
        }
        if (Array.isArray(data.notes)) {
          setNotes((prev) => {
            const existingIds = new Set(prev.map((n) => n.id))
            const newItems = data.notes.filter((n: NoteItem) => !existingIds.has(n.id))
            return [...prev, ...newItems]
          })
        }
        if (Array.isArray(data.importantData)) {
          setImportantData((prev) => {
            const existingIds = new Set(prev.map((d) => d.id))
            const newItems = data.importantData.filter((d: ImportantDataItem) => !existingIds.has(d.id))
            return [...prev, ...newItems]
          })
        }
      }

      addActivity('restore', 'system', 'Restore Data', `Memulihkan data via JSON (${mode})`)
      addToast({ type: 'success', title: 'Pemulihan data cadangan berhasil!' })
      return true
    } catch (err) {
      console.error('Import error:', err)
      addToast({
        type: 'error',
        title: 'Gagal memulihkan cadangan',
        description: err instanceof Error ? err.message : 'File rusak atau tidak kompatibel.',
      })
      return false
    }
  }

  // Aggregated Stats
  const favCount =
    shortcuts.filter((s) => s.isFavorite).length +
    notes.filter((n) => n.isFavorite).length +
    importantData.filter((d) => d.isFavorite).length

  const stats = {
    shortcuts: shortcuts.length,
    notes: notes.length,
    importantData: importantData.length,
    favorites: favCount,
  }

  return (
    <WorkspaceContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        setTheme,
        profile,
        updateProfile,
        shortcuts,
        addShortcut,
        updateShortcut,
        deleteShortcut,
        toggleFavoriteShortcut,
        togglePinShortcut,
        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleFavoriteNote,
        togglePinNote,
        autoSaveNote,
        importantData,
        addData,
        updateData,
        deleteData,
        toggleFavoriteData,
        togglePinData,
        deletedItems,
        restoreItem,
        permanentDeleteItem,
        emptyTrash,
        activities,
        addActivity,
        categories,
        addCategory,
        deleteCategory,
        tags,
        addTag,
        deleteTag,
        isSearchOpen,
        setIsSearchOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddType,
        openQuickAdd,
        editingShortcut,
        setEditingShortcut,
        editingNote,
        setEditingNote,
        editingData,
        setEditingData,
        toasts,
        addToast,
        removeToast,
        copyToClipboard,
        exportBackup,
        importBackup,
        stats,
        // Master Lock
        isLocked,
        lockWorkspace,
        unlockWorkspace,
        // Profile Modal
        isProfileModalOpen,
        setIsProfileModalOpen,
        // Cloud Sync
        cloudSyncStatus,
        lastSyncedAt,
        syncWithCloud,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
