import React from 'react'
import {
  Link2,
  FileText,
  Database,
  Star,
  ExternalLink,
  Copy,
  Plus,
  Pin,
  MoreVertical,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Edit3,
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { BrandIcon } from '../common/BrandIcon.tsx'
import { BANNER_THEMES } from '../modals/ProfileModal.tsx'

export const DashboardView: React.FC = () => {
  const {
    profile,
    stats,
    shortcuts,
    notes,
    activities,
    setCurrentView,
    copyToClipboard,
    toggleFavoriteShortcut,
    setEditingShortcut,
    setEditingNote,
    openQuickAdd,
    setIsProfileModalOpen,
    theme,
  } = useWorkspace()

  const isLight = theme === 'light'

  // Format today's date
  const now = new Date()
  const hour = now.getHours()
  const greetingTime =
    hour < 12 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 19 ? 'Selamat Sore' : 'Selamat Malam'

  const dateFormatted = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Determine Banner Gradient
  const bannerBackground =
    profile.bannerTheme === 'custom' && profile.customBannerUrl
      ? `url(${profile.customBannerUrl}) center/cover no-repeat`
      : isLight
      ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 60%, #BFDBFE 100%)'
      : BANNER_THEMES.find((b) => b.id === profile.bannerTheme)?.gradient ||
        'linear-gradient(135deg, #21090D 0%, #16080B 60%, #390509 100%)'

  // Filter Quick Access shortcuts (pinned or top favorites)
  const quickAccessList = shortcuts.slice(0, 6)
  const recentNotesList = notes.slice(0, 4)
  const recentActivitiesList = activities.slice(0, 6)

  return (
    <div className="space-y-8 select-none">
      {/* 1. Welcome Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-300 ${
          isLight ? 'border-blue-200/80 shadow-blue-500/5' : ''
        }`}
        style={{
          background: bannerBackground,
          borderColor: isLight ? 'rgba(191, 219, 254, 0.8)' : 'rgba(101, 10, 18, 0.5)',
          boxShadow: isLight
            ? '0 10px 30px -5px rgba(37, 99, 235, 0.08)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(163, 14, 27, 0.25)',
        }}
      >
        {/* Ambient background image */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 sm:opacity-55 mix-blend-multiply pointer-events-none overflow-hidden">
          <img
            src={isLight ? '/assets/light_hero_banner.jpg' : '/assets/hero_banner.jpg'}
            alt="Fapriv Banner"
            className="w-full h-full object-cover object-right"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              isLight
                ? 'from-[#EFF6FF] via-transparent to-transparent'
                : 'from-[#21090D] via-transparent to-transparent'
            }`}
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm border ${
                isLight
                  ? 'bg-blue-100/90 border-blue-200 text-blue-700'
                  : 'bg-rose-950/70 border-rose-800/40 text-rose-300'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              <span>
                {greetingTime}, {profile.nickname || profile.name.split(' ')[0]} ✨
              </span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all cursor-pointer backdrop-blur-sm ${
                isLight
                  ? 'bg-white/90 hover:bg-white text-slate-700 border-slate-300/80 shadow-xs'
                  : 'bg-zinc-900/60 hover:bg-rose-950/60 border-zinc-700/60 hover:border-rose-600/50 text-zinc-300 hover:text-white'
              }`}
            >
              <Edit3 className={`w-3 h-3 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              <span>Edit Profil</span>
            </button>
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Selamat Datang di Fapriv.
          </h2>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-zinc-300'
            }`}
          >
            {profile.bio || 'Ruang kerja digital pribadi yang aman, teratur, dan eksklusif untuk Anda.'}
          </p>

          {/* Social Links if present */}
          {(profile.socials?.github || profile.socials?.telegram || profile.socials?.website) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                    isLight
                      ? 'bg-white/80 border-slate-200 text-slate-700 hover:text-blue-600'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  GitHub ↗
                </a>
              )}
              {profile.socials.telegram && (
                <a
                  href={
                    profile.socials.telegram.startsWith('http')
                      ? profile.socials.telegram
                      : `https://t.me/${profile.socials.telegram.replace('@', '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                    isLight
                      ? 'bg-white/80 border-slate-200 text-slate-700 hover:text-blue-600'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  Telegram ↗
                </a>
              )}
              {profile.socials.website && (
                <a
                  href={profile.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                    isLight
                      ? 'bg-white/80 border-slate-200 text-slate-700 hover:text-blue-600'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  Website ↗
                </a>
              )}
            </div>
          )}

          {/* Date & Inspirational Quote Card */}
          <div
            className={`mt-6 inline-flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md ${
              isLight ? 'bg-white/85 border-blue-200/80 shadow-xs' : ''
            }`}
            style={
              isLight
                ? undefined
                : {
                    backgroundColor: 'rgba(22, 8, 11, 0.7)',
                    borderColor: 'rgba(101, 10, 18, 0.6)',
                  }
            }
          >
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-rose-950/60 border-rose-700/30 text-rose-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {dateFormatted}
              </p>
              <p className={`text-[11px] italic mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                "{profile.quote || 'Kejelasan pikiran dimulai dari ruang kerja digital yang teratur dan aman.'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Shortcuts stat */}
        <div
          onClick={() => setCurrentView('shortcuts')}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                }
          }
        >
          <div
            className={`flex items-center justify-between transition-colors ${
              isLight
                ? 'text-slate-500 group-hover:text-blue-600'
                : 'text-zinc-400 group-hover:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Link2 className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Shortcuts</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-black ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {stats.shortcuts}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>

          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Saved website links
          </p>

          {/* Sparkline curve preview */}
          <div
            className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${
              isLight ? 'bg-slate-100' : 'bg-rose-950/60'
            }`}
          >
            <div
              className={`h-full w-3/4 rounded-full ${
                isLight
                  ? 'bg-gradient-to-r from-blue-600 to-sky-400'
                  : 'bg-gradient-to-r from-rose-700 to-rose-400'
              }`}
            />
          </div>
        </div>

        {/* Notes stat */}
        <div
          onClick={() => setCurrentView('notes')}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                }
          }
        >
          <div
            className={`flex items-center justify-between transition-colors ${
              isLight
                ? 'text-slate-500 group-hover:text-blue-600'
                : 'text-zinc-400 group-hover:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Notes</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-black ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {stats.notes}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +6%
            </span>
          </div>

          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Personal notes
          </p>

          <div
            className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${
              isLight ? 'bg-slate-100' : 'bg-rose-950/60'
            }`}
          >
            <div
              className={`h-full w-2/3 rounded-full ${
                isLight
                  ? 'bg-gradient-to-r from-blue-600 to-sky-400'
                  : 'bg-gradient-to-r from-rose-700 to-rose-400'
              }`}
            />
          </div>
        </div>

        {/* Important Data stat */}
        <div
          onClick={() => setCurrentView('important_data')}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                }
          }
        >
          <div
            className={`flex items-center justify-between transition-colors ${
              isLight
                ? 'text-slate-500 group-hover:text-blue-600'
                : 'text-zinc-400 group-hover:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Important Data</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-black ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {stats.importantData}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-500 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3%
            </span>
          </div>

          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Saved information
          </p>

          <div
            className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${
              isLight ? 'bg-slate-100' : 'bg-rose-950/60'
            }`}
          >
            <div
              className={`h-full w-1/2 rounded-full ${
                isLight
                  ? 'bg-gradient-to-r from-blue-600 to-sky-400'
                  : 'bg-gradient-to-r from-rose-700 to-rose-400'
              }`}
            />
          </div>
        </div>

        {/* Favorites stat */}
        <div
          onClick={() => setCurrentView('favorites')}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                }
          }
        >
          <div
            className={`flex items-center justify-between transition-colors ${
              isLight
                ? 'text-slate-500 group-hover:text-blue-600'
                : 'text-zinc-400 group-hover:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Favorites</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-black ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {stats.favorites}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-500 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
            </span>
          </div>

          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Favorite items
          </p>

          <div
            className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${
              isLight ? 'bg-slate-100' : 'bg-rose-950/60'
            }`}
          >
            <div
              className={`h-full w-4/5 rounded-full ${
                isLight
                  ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                  : 'bg-gradient-to-r from-amber-600 to-amber-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. Quick Access Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link2 className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
              <h3
                className={`text-lg font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Quick Access
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Your frequently used websites, all in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('shortcuts')}
              className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                isLight ? 'text-slate-500 hover:text-blue-600' : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => openQuickAdd('shortcut')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:scale-102 cursor-pointer"
              style={
                isLight
                  ? {
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      boxShadow: '0 4px 14px -2px rgba(37, 99, 235, 0.4)',
                    }
                  : {
                      background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
                      boxShadow: '0 4px 14px -2px rgba(213, 31, 43, 0.4)',
                    }
              }
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shortcut</span>
            </button>
          </div>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {quickAccessList.map((sc) => (
            <div
              key={sc.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'
                  : ''
              }`}
              style={
                isLight
                  ? undefined
                  : {
                      backgroundColor: 'rgba(33, 9, 13, 0.75)',
                      borderColor: 'rgba(101, 10, 18, 0.5)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    }
              }
            >
              {/* Card top icons */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl border p-2 flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/80 border-zinc-800'
                  }`}
                >
                  <BrandIcon name={sc.icon || sc.title} className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavoriteShortcut(sc.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        sc.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setEditingShortcut(sc)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="my-3 min-w-0">
                <div className="flex items-center gap-1">
                  <h4
                    className={`text-xs font-bold truncate transition-colors ${
                      isLight
                        ? 'text-slate-800 group-hover:text-blue-600'
                        : 'text-white group-hover:text-rose-300'
                    }`}
                  >
                    {sc.title}
                  </h4>
                  {sc.isPinned && (
                    <Pin
                      className={`w-3 h-3 shrink-0 ${
                        isLight ? 'text-blue-600 fill-blue-600' : 'text-rose-400 fill-rose-400'
                      }`}
                    />
                  )}
                </div>
                <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {sc.description || sc.category}
                </p>
              </div>

              {/* Action buttons */}
              <div
                className={`flex items-center gap-1.5 pt-2 border-t ${
                  isLight ? 'border-slate-100' : 'border-rose-950/40'
                }`}
              >
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-colors ${
                    isLight
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40'
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open</span>
                </a>

                <button
                  onClick={() => copyToClipboard(sc.url, 'URL')}
                  className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                    isLight
                      ? 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'
                      : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
                  }`}
                  title="Salin URL"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom 2 Columns: Recent Notes & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes Column */}
        <div
          className={`rounded-3xl border p-5 sm:p-6 space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                }
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                <h3
                  className={`text-base font-bold tracking-tight ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Recent Notes
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Your latest notes and ideas.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('notes')}
              className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                isLight ? 'text-slate-500 hover:text-blue-600' : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentNotesList.map((note) => (
              <div
                key={note.id}
                className={`group flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                  isLight
                    ? 'border-slate-200/80 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300'
                    : 'border-rose-950/30 bg-zinc-950/40 hover:bg-rose-950/20 hover:border-rose-900/40'
                }`}
                onClick={() => setEditingNote(note)}
              >
                {/* Note image thumbnail or placeholder */}
                <div
                  className={`w-14 h-14 rounded-xl border overflow-hidden shrink-0 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  {note.image ? (
                    <img
                      src={note.image}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center text-lg ${
                        isLight ? 'bg-blue-50 text-blue-600' : 'bg-rose-950/40 text-rose-400'
                      }`}
                    >
                      📝
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isLight
                          ? 'text-slate-800 group-hover:text-blue-600'
                          : 'text-white group-hover:text-rose-300'
                      }`}
                    >
                      {note.title}
                    </h4>
                    {note.isPinned && (
                      <Pin
                        className={`w-3 h-3 shrink-0 ${
                          isLight ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'
                        }`}
                      />
                    )}
                  </div>

                  <p
                    className={`text-[11px] truncate mt-0.5 leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-zinc-400'
                    }`}
                  >
                    {note.excerpt || note.content}
                  </p>

                  <div className="flex items-center gap-2.5 mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                        isLight
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                      }`}
                    >
                      {note.category}
                    </span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                      {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Direct quick copy button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(`${note.title}\n\n${note.content}`, 'Catatan Lengkap')
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isLight
                        ? 'text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 border border-slate-200'
                        : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                    title="Salin Seluruh Catatan"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Column */}
        <div
          className={`rounded-3xl border p-5 sm:p-6 space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : ''
          }`}
          style={
            isLight
              ? undefined
              : {
                  backgroundColor: 'rgba(33, 9, 13, 0.7)',
                  borderColor: 'rgba(101, 10, 18, 0.5)',
                }
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-rose-400'}`} />
                <h3
                  className={`text-base font-bold tracking-tight ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Recent Activity
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Your latest actions in FAPRIV.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('activity')}
              className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                isLight ? 'text-slate-500 hover:text-blue-600' : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline */}
          <div
            className={`relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] ${
              isLight ? 'before:bg-blue-100' : 'before:bg-rose-950/60'
            }`}
          >
            {recentActivitiesList.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3">
                {/* Glowing timeline dot */}
                <span
                  className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ${
                    isLight
                      ? 'bg-blue-500 ring-white'
                      : 'bg-rose-500 ring-[#16080B]'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium ${
                      isLight ? 'text-slate-700' : 'text-zinc-200'
                    }`}
                  >
                    <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>
                      {act.detail || 'Melakukan aktivitas'}:{' '}
                    </span>
                    <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {act.itemName}
                    </span>
                  </p>
                  <p
                    className={`text-[10px] font-mono mt-0.5 ${
                      isLight ? 'text-slate-400' : 'text-zinc-500'
                    }`}
                  >
                    {act.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
