import React from 'react'
import { cn } from '../../lib/utils.ts'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300',
        hoverEffect && 'hover:border-zinc-700 hover:bg-zinc-900/90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
