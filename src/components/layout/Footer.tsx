import React from 'react'
import { Terminal, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 py-8 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Fapriv Foundation • Ready for Business Architecture</span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using Vite, React, TypeScript & Supabase</span>
        </div>
      </div>
    </footer>
  )
}
