import { cn } from '@/lib/utils'

interface Props {
  value: number      // 0–100
  className?: string // outer wrapper — consumer controls positioning
}

export function ProgressBar({ value, className }: Props) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none h-1 bg-primary/10', className)}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
