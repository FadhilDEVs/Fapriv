import React from 'react'
import { Navbar } from './Navbar.tsx'
import { Footer } from './Footer.tsx'

export interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/15 to-cyan-500/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full" />

      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
