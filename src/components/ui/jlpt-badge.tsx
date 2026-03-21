interface JlptBadgeProps {
  level: string
}

export function JlptBadge({ level }: JlptBadgeProps) {
  return (
    <span className="shrink-0 rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
      {level}
    </span>
  )
}
