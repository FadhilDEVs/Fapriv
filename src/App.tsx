import React, { useState } from 'react'
import {
  Database,
  Cloud,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FolderGit2,
  Code2,
  Cpu,
  RefreshCw,
  Server,
} from 'lucide-react'
import { Layout } from './components/layout/Layout.tsx'
import { Card } from './components/common/Card.tsx'
import { Badge } from './components/common/Badge.tsx'
import { Button } from './components/common/Button.tsx'
import { useSupabaseStatus } from './hooks/useSupabaseStatus.ts'
import { testSupabaseConnection } from './lib/supabase.ts'

export const App: React.FC = () => {
  const { isConfigured, urlPreview, message: initialMessage } = useSupabaseStatus()
  const [copied, setCopied] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [liveStatus, setLiveStatus] = useState<string | null>(null)

  const handleCopyEnv = () => {
    navigator.clipboard.writeText('VITE_SUPABASE_URL=\nVITE_SUPABASE_ANON_KEY=')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCheckConnection = async () => {
    setIsChecking(true)
    const res = await testSupabaseConnection()
    setLiveStatus(res.message)
    setIsChecking(false)
  }

  const stackItems = [
    {
      name: 'Vite 8 + React 19',
      category: 'Frontend Core',
      desc: 'Next-gen HMR & component architecture',
      icon: Cpu,
      accent: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
    },
    {
      name: 'TypeScript',
      category: 'Type Safety',
      desc: 'Strict type validation & auto-complete',
      icon: Code2,
      accent: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    },
    {
      name: 'Tailwind CSS v4',
      category: 'Styling',
      desc: 'Modern CSS framework & theme tokens',
      icon: Layers,
      accent: 'text-teal-400 border-teal-500/20 bg-teal-500/10',
    },
    {
      name: 'Supabase',
      category: 'Backend & DB',
      desc: 'PostgreSQL, Auth & Realtime Ready',
      icon: Database,
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    },
    {
      name: 'Vercel Ready',
      category: 'Deployment',
      desc: 'Edge network & SPA routing preconfigured',
      icon: Cloud,
      accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    },
    {
      name: 'GitHub CI/CD',
      category: 'Version Control',
      desc: 'Protected secrets & clean Git flow',
      icon: FolderGit2,
      accent: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
    },
  ]

  const folderStructure = [
    { path: 'src/components/', desc: 'Komponen reusable (common atoms & layout wrappers)' },
    { path: 'src/config/', desc: 'Konfigurasi env terpusat dan validasi runtime' },
    { path: 'src/hooks/', desc: 'Custom hooks React untuk state & integrasi' },
    { path: 'src/lib/', desc: 'Supabase client instance & utilitas umum (cn)' },
    { path: 'src/services/', desc: 'Layer service query API & Database siap pakai' },
    { path: 'src/types/', desc: 'TypeScript interfaces & skema database Supabase' },
  ]

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" className="py-1 px-3.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
            Fondasi Proyek Siap Digunakan
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Arsitektur Modern{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Fapriv
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Fondasi website telah siap dengan struktur modular terverifikasi.
            Menunggu spesifikasi konsep bisnis untuk mulai mengimplementasikan fitur.
          </p>
        </div>

        {/* Supabase Status Card */}
        <Card className="border-indigo-500/30 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-indigo-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Status Integrasi Supabase
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Konfigurasi Environment Variable via Client Safe Handler
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {isConfigured ? (
                  <Badge variant="success">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Terkonfigurasi ({urlPreview})
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Menunggu Kredensial (.env)
                  </Badge>
                )}

                <span className="text-xs text-zinc-400">
                  • {liveStatus || initialMessage}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEnv}
                className="gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Format .env'}</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isChecking}
                onClick={handleCheckConnection}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Memeriksa...' : 'Cek Ulang Koneksi'}</span>
              </Button>
            </div>
          </div>

          {!isConfigured && (
            <div className="mt-5 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <p className="font-medium text-zinc-300">
                Langkah memasang Supabase saat Anda siap:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                <li>Buat file <code className="text-indigo-300 font-mono">.env</code> di root folder proyek (file ini otomatis diabaikan oleh git).</li>
                <li>Salin template dari <code className="text-indigo-300 font-mono">.env.example</code>.</li>
                <li>Isi <code className="text-indigo-300 font-mono">VITE_SUPABASE_URL</code> dan <code className="text-indigo-300 font-mono">VITE_SUPABASE_ANON_KEY</code> dari dashboard Supabase Anda.</li>
              </ol>
            </div>
          )}
        </Card>

        {/* Tech Stack Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Teknologi & Fondasi Terpasang
            </h2>
            <span className="text-xs text-zinc-500">6 Stack Components</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stackItems.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.name} hoverEffect className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                      {item.category}
                    </span>
                    <div className={`p-2 rounded-xl border ${item.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Modular Folder Blueprint */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Struktur Folder Modular (<code className="text-indigo-400 text-lg">/src</code>)
          </h2>

          <Card className="divide-y divide-zinc-800/80 p-0 overflow-hidden">
            {folderStructure.map((folder) => (
              <div
                key={folder.path}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-2.5 font-mono text-sm text-indigo-300">
                  <span className="text-zinc-500">📂</span>
                  <span>{folder.path}</span>
                </div>
                <p className="text-xs text-zinc-400 sm:text-right">
                  {folder.desc}
                </p>
              </div>
            ))}
          </Card>
        </div>

        {/* Next Step Callout */}
        <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 p-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>Menunggu Konsep Bisnis</span>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Siap Menerima Arahan Fitur Website
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Semua fondasi arsitektur, modul data, dan konfigurasi rahasia telah aman.
            Silakan berikan deskripsi fitur, alur user, atau model data yang ingin Anda bangun.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default App
