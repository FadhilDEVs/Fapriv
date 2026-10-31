import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useWorkspace } from '../../context/WorkspaceContext.tsx'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspace()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'
        const isWarning = toast.type === 'warning'

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
            style={{
              backgroundColor: 'rgba(22, 8, 11, 0.95)',
              borderColor: isSuccess
                ? 'rgba(213, 31, 43, 0.6)'
                : isError
                ? 'rgba(244, 63, 94, 0.7)'
                : isWarning
                ? 'rgba(245, 158, 11, 0.6)'
                : 'rgba(101, 10, 18, 0.5)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(213, 31, 43, 0.25)',
            }}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-500" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-indigo-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white tracking-wide">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
