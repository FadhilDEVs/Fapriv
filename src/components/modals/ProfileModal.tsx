import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  User,
  Camera,
  Sparkles,
  Shield,
  Palette,
  Quote,
  Upload,
  Check,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import type { UserProfile, BannerTheme } from '../../types/fapriv.ts'

// Preset avatars curated for aesthetic styling
export const PRESET_AVATARS = [
  { id: 'avatar-1', name: 'Original Crimson', url: '/assets/avatar.jpg' },
  {
    id: 'avatar-2',
    name: 'Cyber Samurai',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    name: 'Obsidian Minimal',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    name: 'Neon Velvet',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-5',
    name: 'Midnight Rose',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-6',
    name: 'Dark Architect',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
]

export const BANNER_THEMES: { id: BannerTheme; name: string; gradient: string; previewColor: string }[] = [
  {
    id: 'crimson_silk',
    name: 'Crimson Silk (Original)',
    gradient: 'linear-gradient(135deg, #21090D 0%, #16080B 60%, #390509 100%)',
    previewColor: '#A30E1B',
  },
  {
    id: 'cyber_velvet',
    name: 'Cyber Velvet',
    gradient: 'linear-gradient(135deg, #2D082A 0%, #14051B 60%, #4D0932 100%)',
    previewColor: '#9333EA',
  },
  {
    id: 'obsidian_gold',
    name: 'Obsidian Gold',
    gradient: 'linear-gradient(135deg, #1C180E 0%, #0F0E0B 60%, #332B10 100%)',
    previewColor: '#D97706',
  },
  {
    id: 'tokyo_midnight',
    name: 'Tokyo Midnight',
    gradient: 'linear-gradient(135deg, #091326 0%, #080C14 60%, #1A0D28 100%)',
    previewColor: '#2563EB',
  },
  {
    id: 'custom',
    name: 'Custom Wallpaper',
    gradient: 'linear-gradient(135deg, #1C080B 0%, #110507 100%)',
    previewColor: '#F43F5E',
  },
]

export const BADGE_OPTIONS = ['OWNER', 'CREATOR', 'ARCHITECT', 'SOLO DEV', 'MASTER', 'VIP', 'SYSTEM']

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, addToast, theme } = useWorkspace()
  const isLight = theme === 'light'

  // Local state
  const [activeTab, setActiveTab] = useState<'identity' | 'avatar' | 'banner' | 'bio' | 'security'>('identity')

  const [name, setName] = useState(profile.name)
  const [nickname, setNickname] = useState(profile.nickname || profile.name)
  const [email, setEmail] = useState(profile.email)
  const [role, setRole] = useState(profile.role || '')
  const [badge, setBadge] = useState(profile.badge || 'OWNER')
  const [location, setLocation] = useState(profile.location || 'Indonesia')

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '/assets/avatar.jpg')
  const [bannerTheme, setBannerTheme] = useState<BannerTheme>(profile.bannerTheme || 'crimson_silk')
  const [customBannerUrl, setCustomBannerUrl] = useState(profile.customBannerUrl || '')

  const [quote, setQuote] = useState(profile.quote || '')
  const [bio, setBio] = useState(profile.bio || '')

  const [github, setGithub] = useState(profile.socials?.github || '')
  const [telegram, setTelegram] = useState(profile.socials?.telegram || '')
  const [linkedin, setLinkedin] = useState(profile.socials?.linkedin || '')
  const [website, setWebsite] = useState(profile.socials?.website || '')

  const [securityPin, setSecurityPin] = useState(profile.securityPin || '123456')
  const [showPin, setShowPin] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)

  // Sync state with profile prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(profile.name)
      setNickname(profile.nickname || profile.name)
      setEmail(profile.email)
      setRole(profile.role || '')
      setBadge(profile.badge || 'OWNER')
      setLocation(profile.location || 'Indonesia')
      setAvatarUrl(profile.avatarUrl || '/assets/avatar.jpg')
      setBannerTheme(profile.bannerTheme || 'crimson_silk')
      setCustomBannerUrl(profile.customBannerUrl || '')
      setQuote(profile.quote || '')
      setBio(profile.bio || '')
      setGithub(profile.socials?.github || '')
      setTelegram(profile.socials?.telegram || '')
      setLinkedin(profile.socials?.linkedin || '')
      setWebsite(profile.socials?.website || '')
      setSecurityPin(profile.securityPin || '123456')
    }
  }, [isOpen, profile])

  if (!isOpen) return null

  // Handle local avatar file upload
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      addToast({
        type: 'warning',
        title: 'Ukuran Foto Terlalu Besar',
        description: 'Maksimum ukuran foto avatar adalah 2MB.',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        setAvatarUrl(base64)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle local banner file upload
  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        setCustomBannerUrl(base64)
        setBannerTheme('custom')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate 6 digit PIN
    if (securityPin && (securityPin.length !== 6 || !/^\d+$/.test(securityPin))) {
      addToast({
        type: 'error',
        title: 'Format PIN Tidak Valid',
        description: 'PIN Keamanan harus terdiri dari 6 angka.',
      })
      setActiveTab('security')
      return
    }

    const updated: Partial<UserProfile> = {
      name: name.trim() || 'Fadhil',
      nickname: nickname.trim() || name.trim() || 'Fadhil',
      email: email.trim(),
      role: role.trim(),
      badge,
      location: location.trim(),
      avatarUrl,
      bannerTheme,
      customBannerUrl,
      quote: quote.trim(),
      bio: bio.trim(),
      socials: {
        github: github.trim(),
        telegram: telegram.trim(),
        linkedin: linkedin.trim(),
        website: website.trim(),
      },
      securityPin: securityPin.trim() || '123456',
    }

    updateProfile(updated)
    addToast({
      type: 'success',
      title: 'Profil Berhasil Disimpan',
      description: 'Perubahan tersimpan dan disinkronkan ke seluruh perangkat.',
    })
    onClose()
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none backdrop-blur-md ${
      isLight ? 'bg-slate-900/40' : 'bg-black/80'
    }`}>
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
          isLight ? 'bg-white border-slate-200' : ''
        }`}
        style={
          isLight
            ? {
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.15), 0 0 40px rgba(226, 232, 240, 0.8)',
              }
            : {
                backgroundColor: '#16080B',
                borderColor: 'rgba(101, 10, 18, 0.6)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(163, 14, 27, 0.25)',
              }
        }
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'border-slate-100 bg-slate-50/70' : 'border-rose-950/60 bg-zinc-950/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-rose-950/60 border-rose-700/40 text-rose-400'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Kustomisasi Profil Pengguna
              </h2>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Personalisasi tampilan ruang kerja digital Fapriv Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className={`p-4 sm:p-5 border-b ${
          isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-gradient-to-b from-zinc-950/80 to-transparent border-rose-950/30'
        }`}>
          <div
            className="relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300"
            style={{
              background:
                bannerTheme === 'custom' && customBannerUrl
                  ? `url(${customBannerUrl}) center/cover no-repeat`
                  : BANNER_THEMES.find((b) => b.id === bannerTheme)?.gradient || BANNER_THEMES[0].gradient,
              borderColor: isLight ? '#E2E8F0' : 'rgba(101, 10, 18, 0.5)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-rose-500/80 shadow-2xl"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/assets/avatar.jpg'
                  }}
                />
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-900 border border-rose-500 text-[9px] font-black tracking-widest text-white shadow">
                  {badge}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-black text-white truncate">{name || 'Nama Anda'}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-700/50 text-[10px] text-rose-300 font-medium">
                    @{nickname || 'fadhil'}
                  </span>
                  {location && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-300">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {location}
                    </span>
                  )}
                </div>

                <p className="text-xs text-rose-200/90 font-medium mt-0.5">{role || 'Architect & Creator'}</p>
                <p className="text-[11px] text-zinc-200 italic mt-1 line-clamp-1">"{quote || 'Motto hidup Anda...'}"</p>

                {bio && <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2">{bio}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-1 px-6 pt-3 border-b overflow-x-auto ${
          isLight ? 'border-slate-100 bg-slate-50/50' : 'border-rose-950/40 bg-zinc-950/20'
        }`}>
          {[
            { id: 'identity', label: 'Identitas', icon: User },
            { id: 'avatar', label: 'Avatar & Foto', icon: Camera },
            { id: 'banner', label: 'Tema Banner', icon: Palette },
            { id: 'bio', label: 'Bio & Quote', icon: Quote },
            { id: 'security', label: 'Keamanan PIN', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer shrink-0 ${
                  isActive
                    ? isLight
                      ? 'text-blue-600 border-blue-600 bg-blue-50/60'
                      : 'text-rose-400 border-rose-500 bg-rose-950/30'
                    : isLight
                    ? 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
                    : 'text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Contents Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: IDENTITAS */}
          {activeTab === 'identity' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Fadhil"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                        : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Nama Panggilan (Sapaan Dashboard)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Contoh: Fadhil (utk 'Selamat Malam, Fadhil')"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                        : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Email Pribadi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@fapriv.workspace"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                        : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Peran / Judul Profesional
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Contoh: Creator & Architect"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                        : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Lokasi / Asal
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Indonesia"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                        : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Status Badge
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                        : 'bg-zinc-900/70 border-zinc-800 text-white focus:border-rose-500/80'
                    }`}
                  >
                    {BADGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className={isLight ? 'bg-white text-slate-900' : 'bg-zinc-900 text-white'}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVATAR & FOTO */}
          {activeTab === 'avatar' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Preset Avatar Estetika Mewah
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarUrl(av.url)}
                      className={`group relative rounded-2xl overflow-hidden border-2 transition-all p-1 cursor-pointer ${
                        avatarUrl === av.url
                          ? isLight
                            ? 'border-blue-600 ring-2 ring-blue-500/40 scale-105'
                            : 'border-rose-500 ring-2 ring-rose-500/50 scale-105'
                          : isLight
                          ? 'border-slate-200 hover:border-blue-300'
                          : 'border-zinc-800 hover:border-rose-800/60'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="w-full aspect-square rounded-xl object-cover" />
                      {avatarUrl === av.url && (
                        <div className={`absolute top-2 right-2 p-1 rounded-full text-white shadow ${
                          isLight ? 'bg-blue-600' : 'bg-rose-600'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <p className={`text-[9px] text-center mt-1 truncate ${
                        isLight ? 'text-slate-500 group-hover:text-slate-900' : 'text-zinc-400 group-hover:text-white'
                      }`}>
                        {av.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Photo */}
              <div className={`pt-2 border-t ${isLight ? 'border-slate-100' : 'border-rose-950/40'}`}>
                <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Upload Foto dari Perangkat
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFile}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
                    }`}
                  >
                    <Upload className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                    <span>Pilih Foto dari Galeri / File</span>
                  </button>
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    JPG, PNG, WebP (maks. 2MB)
                  </span>
                </div>
              </div>

              {/* Custom Image URL */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Atau Masukkan URL Gambar
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: BANNER THEME */}
          {activeTab === 'banner' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Pilihan Preset Warna Banner
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BANNER_THEMES.map((bTheme) => (
                    <button
                      key={bTheme.id}
                      type="button"
                      onClick={() => setBannerTheme(bTheme.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                        bannerTheme === bTheme.id
                          ? isLight
                            ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50'
                            : 'border-rose-500 ring-2 ring-rose-500/40 bg-zinc-900/80'
                          : isLight
                          ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-lg shadow-inner shrink-0"
                          style={{ background: bTheme.gradient, borderColor: bTheme.previewColor }}
                        />
                        <div>
                          <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{bTheme.name}</p>
                          <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {bTheme.id === 'custom' ? 'Gunakan gambar kustom' : 'Gradasi atmosferik luxury'}
                          </p>
                        </div>
                      </div>

                      {bannerTheme === bTheme.id && (
                        <Check className={`w-4 h-4 stroke-[3] ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom banner image file/url */}
              <div className={`pt-2 border-t space-y-3 ${isLight ? 'border-slate-100' : 'border-rose-950/40'}`}>
                <label className={`block text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Gambar Banner Kustom
                </label>
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  onChange={handleBannerFile}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
                    }`}
                  >
                    <Upload className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                    <span>Upload Banner Kustom</span>
                  </button>
                </div>

                <div>
                  <input
                    type="url"
                    value={customBannerUrl}
                    onChange={(e) => {
                      setCustomBannerUrl(e.target.value)
                      if (e.target.value) setBannerTheme('custom')
                    }}
                    placeholder="Atau tautkan URL gambar banner (https://...)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BIO & SOCIALS */}
          {activeTab === 'bio' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Kutipan Inspirasi Harian (Tampil di Dashboard)
                </label>
                <textarea
                  rows={2}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Contoh: Kejelasan pikiran dimulai dari ruang kerja digital yang teratur."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                      : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Bio Pribadi Singkat
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tulis deskripsi ringkas tentang diri atau fokus saat ini..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                      : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                  }`}
                />
              </div>

              <div className={`pt-2 border-t ${isLight ? 'border-slate-100' : 'border-rose-950/40'}`}>
                <label className={`block text-xs font-semibold mb-3 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Tautan Eksternal & Sosial
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Telegram Link
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="https://t.me/... atau @username"
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Website Pribadi
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          : 'bg-zinc-900/70 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500/80'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEAMANAN & MASTER PIN */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-rose-950/30 border border-rose-800/40 text-rose-200'
              }`}>
                <p className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-blue-900' : 'text-white'}`}>
                  <Shield className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                  Kunci Keamanan Akses Universal
                </p>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                  Karena aplikasi ini dapat Anda buka dari HP, Laptop, atau komputer manapun di internet, PIN ini
                  melindungi seluruh data dan catatan pribadi agar hanya Anda sendiri yang dapat membukanya.
                </p>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Master Security PIN (6 Digit Angka)
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setSecurityPin(val)
                    }}
                    placeholder="123456"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-mono tracking-widest focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                        : 'bg-zinc-900/70 border-zinc-800 text-white focus:border-rose-500/80'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className={`absolute right-3 top-2.5 transition-colors ${
                      isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  PIN saat ini terdiri dari {securityPin.length}/6 angka.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
            isLight ? 'border-slate-100' : 'border-rose-950/50'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
              style={
                isLight
                  ? {
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                    }
                  : {
                      background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 60%, #650A12 100%)',
                      boxShadow: '0 0 25px -4px rgba(213, 31, 43, 0.5)',
                    }
              }
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Simpan Profil & Sinkronkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
