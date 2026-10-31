import React from 'react'

export interface LogoProps {
  showTagline?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Logo: React.FC<LogoProps> = ({ showTagline = true, className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized Red F Logo icon */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl relative flex items-center justify-center font-black tracking-tighter text-white overflow-hidden shadow-lg shadow-rose-950/40`}
        style={{
          background: 'linear-gradient(135deg, #FF303B 0%, #D51F2B 35%, #650A12 100%)',
        }}
      >
        <span className="relative z-10 font-sans tracking-tight font-black text-white drop-shadow-md select-none">
          F
        </span>
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col">
        <span className={`${titleSizes[size]} tracking-tight font-extrabold text-white leading-none`}>
          FAPRIV
        </span>
        {showTagline && (
          <span className="text-[10px] text-zinc-400 font-normal tracking-wide mt-0.5 leading-none">
            Your Private Digital Space.
          </span>
        )}
      </div>
    </div>
  )
}
