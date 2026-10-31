export type NavView =
  | 'dashboard'
  | 'shortcuts'
  | 'notes'
  | 'important_data'
  | 'favorites'
  | 'trash'
  | 'activity'
  | 'settings'

export type ThemeMode = 'dark' | 'light' | 'system'

export interface ShortcutItem {
  id: string
  title: string
  url: string
  description?: string
  category: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  icon?: string
  order?: number
  createdAt: string
  updatedAt: string
}

export interface NoteItem {
  id: string
  title: string
  content: string
  excerpt?: string
  category: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  image?: string
  createdAt: string
  updatedAt: string
  history?: { timestamp: string; title: string; content: string }[]
}

export type DataTypeEnum =
  | 'text'
  | 'secret'
  | 'account'
  | 'reference'
  | 'template'
  | 'code'
  | 'contact'

export interface ImportantDataItem {
  id: string
  title: string
  value: string
  description?: string
  dataType: DataTypeEnum
  category: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface ActivityItem {
  id: string
  action: 'create' | 'edit' | 'delete' | 'restore' | 'copy' | 'favorite' | 'pin'
  itemType: 'shortcut' | 'note' | 'important_data' | 'system'
  itemName: string
  timestamp: string
  detail?: string
}

export interface DeletedItem {
  id: string
  originalId: string
  itemType: 'shortcut' | 'note' | 'important_data'
  data: ShortcutItem | NoteItem | ImportantDataItem
  deletedAt: string
  expiresAt: string
}

export interface CategoryItem {
  id: string
  name: string
  color?: string
}

export interface TagItem {
  id: string
  name: string
}

export type BannerTheme =
  | 'crimson_silk'
  | 'cyber_velvet'
  | 'obsidian_gold'
  | 'tokyo_midnight'
  | 'custom'

export interface UserSocials {
  github?: string
  linkedin?: string
  telegram?: string
  website?: string
}

export interface UserProfile {
  name: string
  nickname?: string
  email: string
  role?: string
  bio?: string
  quote?: string
  avatarUrl?: string
  avatarType?: 'preset' | 'upload' | 'url'
  bannerTheme?: BannerTheme
  customBannerUrl?: string
  badge?: string
  location?: string
  socials?: UserSocials
  securityPin?: string
}

export type CloudSyncStatus =
  | 'synced'
  | 'syncing'
  | 'offline'
  | 'error'
  | 'pending_setup'
  | 'permission_denied'

export interface ToastMessage {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  description?: string
}
