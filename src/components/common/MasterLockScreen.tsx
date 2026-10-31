import React, { useState, useEffect, useCallback } from 'react'
import { ShieldCheck, Lock, Delete, AlertCircle } from 'lucide-react'
import { Logo } from './Logo.tsx'
import type { UserProfile } from '../../types/fapriv.ts'

interface MasterLockScreenProps {
  profile: UserProfile
  isLocked: boolean
  onUnlock: () => void
  securityPin?: string
}

export const MasterLockScreen: React.FC<MasterLockScreenProps> = ({
  profile,
  isLocked,
  onUnlock,
  securityPin = '123456',
}) => {
  const [pin, setPin] = useState('')
  const [errorShake, setErrorShake] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)

  const targetPin = profile.securityPin || securityPin || '123456'

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length < 6) {
        const nextPin = pin + digit
        setPin(nextPin)
        setErrorMessage('')

        if (nextPin.length === 6) {
          // Check PIN
          if (nextPin === targetPin) {
            if (rememberDevice) {
              try {
                localStorage.setItem('fapriv_device_authorized', 'true')
              } catch (e) {
                // ignore
              }
            }
            onUnlock()
          } else {
            setErrorShake(true)
            setErrorMessage('PIN Keamanan tidak sesuai. Coba lagi.')
            setTimeout(() => {
              setPin('')
              setErrorShake(false)
            }, 600)
          }
        }
      }
    },
    [pin, targetPin, rememberDevice, onUnlock]
  )

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1))
    setErrorMessage('')
  }, [])

  const handleClear = useCallback(() => {
    setPin('')
    setErrorMessage('')
  }, [])

  // Listen to physical keyboard events
  useEffect(() => {
    if (!isLocked) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key)
      } else if (e.key === 'Backspace') {
        handleBackspace()
      } else if (e.key === 'Escape') {
        handleClear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocked, handleDigit, handleBackspace, handleClear])

  if (!isLocked) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none bg-[#0D0406]/95 backdrop-blur-2xl">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 bg-rose-900/20 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 w-96 h-96 bg-red-950/25 blur-[160px] rounded-full" />

      <div
        className={`w-full max-w-sm rounded-3xl border p-6 sm:p-8 text-center relative z-10 transition-transform ${
          errorShake ? 'animate-bounce' : ''
        }`}
        style={{
          backgroundColor: 'rgba(26, 8, 12, 0.85)',
          borderColor: 'rgba(163, 14, 27, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(163, 14, 27, 0.25)',
        }}
      >
        {/* Top Logo & Badge */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo size="md" showTagline={false} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-[10px] font-bold uppercase tracking-wider text-rose-300">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Private Sovereign Workspace</span>
          </div>
        </div>

        {/* User Avatar & Identity */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="relative">
            <img
              src={profile.avatarUrl || '/assets/avatar.jpg'}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-500/60 shadow-xl"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }}
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-rose-950 border border-rose-600/60 text-rose-300 shadow">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">{profile.name}</h2>
            <p className="text-[11px] text-zinc-400">{profile.role || 'Personal Workspace'}</p>
          </div>
        </div>

        {/* PIN Indicators */}
        <div className="mb-6">
          <p className="text-xs text-zinc-300 mb-3 font-medium">Masukkan 6-Digit PIN Keamanan</p>
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = pin.length > idx
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    isFilled
                      ? 'bg-rose-500 scale-125 shadow-lg shadow-rose-500/80 ring-2 ring-rose-400/50'
                      : 'bg-zinc-800 border border-zinc-700/60'
                  }`}
                />
              )
            })}
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Onscreen Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-2xl bg-zinc-900/60 hover:bg-rose-950/50 border border-zinc-800 hover:border-rose-700/50 text-base font-bold text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-zinc-900/60 hover:bg-rose-950/50 border border-zinc-800 hover:border-rose-700/50 text-base font-bold text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            title="Hapus"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Remember Device Checkbox */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-rose-950/40">
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-400 hover:text-zinc-200">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-rose-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Ingat perangkat ini (Tetap login)</span>
          </label>
        </div>

        <p className="text-[10px] text-zinc-500 mt-3 italic">
          PIN bawaan: <span className="font-mono text-rose-300/80">123456</span> (dapat diubah di Kustomisasi Profil)
        </p>
      </div>
    </div>
  )
}
