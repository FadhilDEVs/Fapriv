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
} from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'
import { BrandIcon } from '../common/BrandIcon.tsx'

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
  } = useWorkspace()

  // Format today's date
  const now = new Date()
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Filter Quick Access shortcuts (pinned or top favorites)
  const quickAccessList = shortcuts.slice(0, 6)
  const recentNotesList = notes.slice(0, 4)
  const recentActivitiesList = activities.slice(0, 6)

  return (
    <div className="space-y-8 select-none">
      {/* 1. Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #21090D 0%, #16080B 60%, #390509 100%)',
          borderColor: 'rgba(101, 10, 18, 0.5)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(163, 14, 27, 0.25)',
        }}
      >
        {/* Ambient background image */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 sm:opacity-55 mix-blend-screen pointer-events-none overflow-hidden">
          <img
            src="/assets/hero_banner.jpg"
            alt="Fapriv Crimson Banner"
            className="w-full h-full object-cover object-right"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#21090D] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-[11px] font-bold uppercase tracking-wider text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Good morning, {profile.name.split(' ')[0]}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back.
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Everything you need, organized in one private space.
          </p>

          {/* Date & Inspirational Quote Card */}
          <div
            className="mt-6 inline-flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(22, 8, 11, 0.7)',
              borderColor: 'rgba(101, 10, 18, 0.6)',
            }}
          >
            <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-700/30 text-rose-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{dateFormatted}</p>
              <p className="text-[11px] text-zinc-400 italic mt-0.5">
                "{profile.quote || 'A more organized you, a more focused tomorrow.'}"
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
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 transition-colors">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-rose-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Shortcuts</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats.shortcuts}</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-1">Saved website links</p>

          {/* Sparkline curve preview */}
          <div className="mt-3 h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-700 to-rose-400 w-3/4 rounded-full" />
          </div>
        </div>

        {/* Notes stat */}
        <div
          onClick={() => setCurrentView('notes')}
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Notes</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats.notes}</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +6%
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-1">Personal notes</p>

          <div className="mt-3 h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-700 to-rose-400 w-2/3 rounded-full" />
          </div>
        </div>

        {/* Important Data stat */}
        <div
          onClick={() => setCurrentView('important_data')}
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 transition-colors">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Important Data</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats.importantData}</span>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-400 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3%
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-1">Saved information</p>

          <div className="mt-3 h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-700 to-rose-400 w-1/2 rounded-full" />
          </div>
        </div>

        {/* Favorites stat */}
        <div
          onClick={() => setCurrentView('favorites')}
          className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 transition-colors">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Favorites</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats.favorites}</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-1">Favorite items</p>

          <div className="mt-3 h-1.5 w-full bg-rose-950/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-4/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. Quick Access Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Quick Access</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Your frequently used websites, all in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('shortcuts')}
              className="text-xs font-medium text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => openQuickAdd('shortcut')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:scale-102"
              style={{
                background: 'linear-gradient(135deg, #D51F2B 0%, #A30E1B 100%)',
              }}
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
              className="group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'rgba(33, 9, 13, 0.75)',
                borderColor: 'rgba(101, 10, 18, 0.5)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Card top icons */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-800 p-2 flex items-center justify-center shrink-0">
                  <BrandIcon name={sc.icon || sc.title} className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavoriteShortcut(sc.id)}
                    className="p-1 rounded-lg text-zinc-500 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        sc.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setEditingShortcut(sc)}
                    className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="my-3 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-300 transition-colors">
                    {sc.title}
                  </h4>
                  {sc.isPinned && <Pin className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {sc.description || sc.category}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-rose-950/40">
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open</span>
                </a>

                <button
                  onClick={() => copyToClipboard(sc.url, 'URL')}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 transition-colors"
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
          className="rounded-3xl border p-5 sm:p-6 space-y-4"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Recent Notes</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Your latest notes and ideas.</p>
            </div>

            <button
              onClick={() => setCurrentView('notes')}
              className="text-xs font-medium text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentNotesList.map((note) => (
              <div
                key={note.id}
                className="group flex items-center gap-3.5 p-3 rounded-2xl border border-rose-950/30 bg-zinc-950/40 hover:bg-rose-950/20 hover:border-rose-900/40 transition-all cursor-pointer"
                onClick={() => setEditingNote(note)}
              >
                {/* Note image thumbnail or placeholder */}
                <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                  {note.image ? (
                    <img
                      src={note.image}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-400 text-lg bg-rose-950/40">
                      📝
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-300 transition-colors">
                      {note.title}
                    </h4>
                    {note.isPinned && (
                      <Pin className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 truncate mt-0.5 leading-relaxed">
                    {note.excerpt || note.content}
                  </p>

                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-rose-950/60 text-rose-300 border border-rose-800/40">
                      {note.category}
                    </span>
                    <span className="text-[10px] text-zinc-500">
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
                    className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 transition-colors"
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
          className="rounded-3xl border p-5 sm:p-6 space-y-4"
          style={{
            backgroundColor: 'rgba(33, 9, 13, 0.7)',
            borderColor: 'rgba(101, 10, 18, 0.5)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Recent Activity</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Your latest actions in FAPRIV.</p>
            </div>

            <button
              onClick={() => setCurrentView('activity')}
              className="text-xs font-medium text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-950/60">
            {recentActivitiesList.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3">
                {/* Glowing timeline dot */}
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-[#16080B]" />

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-200">
                    <span className="text-zinc-400">{act.detail || 'Melakukan aktivitas'}: </span>
                    <span className="font-semibold text-white">{act.itemName}</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{act.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
