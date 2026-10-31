import React from 'react'

export interface LogoProps {
  showTagline?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  iconOnly?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  showTagline = true,
  className = '',
  size = 'md',
  iconOnly = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const logoImgHeights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  }

  if (iconOnly) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
        <img
          src="/assets/fapriv_app_icon.png"
          alt="Fapriv App Icon"
          className={`${iconSizes[size]} rounded-xl object-contain drop-shadow-[0_0_12px_rgba(213,31,43,0.5)] transition-transform hover:scale-105`}
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* App Icon badge */}
      <img
        src="/assets/fapriv_app_icon.png"
        alt="Fapriv Icon"
        className={`${iconSizes[size]} rounded-xl object-cover shrink-0 drop-shadow-[0_0_10px_rgba(213,31,43,0.4)] border border-rose-600/30`}
      />

      {/* Main Logo Text image & Optional Tagline */}
      <div className="flex flex-col justify-center">
        <img
          src="/assets/fapriv_logo.png"
          alt="Fapriv Logo"
          className={`${logoImgHeights[size]} w-auto object-contain object-left select-none drop-shadow-[0_2px_8px_rgba(213,31,43,0.35)]`}
        />
        {showTagline && (
          <span className="text-[10px] text-zinc-400 font-normal tracking-wide mt-0.5 leading-none">
            Your Private Digital Space.
          </span>
        )}
      </div>
    </div>
  )
}

