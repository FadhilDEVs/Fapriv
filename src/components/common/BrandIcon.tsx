import React from 'react'

export interface BrandIconProps {
  name?: string
  className?: string
}

export const BrandIcon: React.FC<BrandIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name?.toLowerCase()) {
    case 'gdrive':
    case 'google drive':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M8.2 3.5L2.5 13.5L5.4 18.5L11.1 8.5L8.2 3.5Z" fill="#0066DA" />
          <path d="M15.8 3.5H8.2L11.1 8.5H18.7L15.8 3.5Z" fill="#00AC47" />
          <path d="M18.7 8.5L13 18.5H21.5L24 13.5L18.7 8.5Z" fill="#EA4335" />
          <path d="M5.4 18.5L8.2 23.5H18.7L15.8 18.5H5.4Z" fill="#FFBA00" />
        </svg>
      )
    case 'gmail':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" fill="#EA4335" fillOpacity="0.15" />
          <path d="M20 4H4C2.9 4 2 4.9 2 6L12 13L22 6C22 4.9 21.1 4 20 4Z" fill="#EA4335" />
          <path d="M2 18V6L12 13L22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18Z" fill="#D93025" />
          <path d="M2 6L12 13L22 6" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      )
    case 'chatgpt':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2a4 4 0 0 0-4 4v1H7a4 4 0 0 0-4 4 4 4 0 0 0 1.5 3.1A4 4 0 0 0 6 18v1a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-1a4 4 0 0 0 3.5-3.9 4 4 0 0 0-1.5-3.1A4 4 0 0 0 17 7h-1V6a4 4 0 0 0-4-4z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'canva':
      return (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-white text-[11px]">
          C
        </div>
      )
    case 'notion':
      return (
        <div className="w-full h-full rounded-md bg-white text-black font-extrabold flex items-center justify-center text-xs">
          N
        </div>
      )
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      )
    case 'figma':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M8.5 24C10.9853 24 13 21.9853 13 19.5V15H8.5C6.01472 15 4 17.0147 4 19.5C4 21.9853 6.01472 24 8.5 24Z" fill="#0ACF83" />
          <path d="M4 10.5C4 8.01472 6.01472 6 8.5 6H13V15H8.5C6.01472 15 4 12.9853 4 10.5Z" fill="#A259FF" />
          <path d="M4 1.5C4 3.98528 6.01472 6 8.5 6H13V-3H8.5C6.01472 -3 4 -0.985281 4 1.5Z" fill="#F24E1E" />
          <path d="M13 -3H17.5C19.9853 -3 22 -0.985281 22 1.5C22 3.98528 19.9853 6 17.5 6H13V-3Z" fill="#FF7262" />
          <path d="M22 10.5C22 12.9853 19.9853 15 17.5 15C15.0147 15 13 12.9853 13 10.5C13 8.01472 15.0147 6 17.5 6C19.9853 6 22 8.01472 22 10.5Z" fill="#1ABCFE" />
        </svg>
      )
    default:
      return (
        <div className="w-full h-full rounded-lg bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center text-xs">
          {name ? name.slice(0, 2).toUpperCase() : '🔗'}
        </div>
      )
  }
}
