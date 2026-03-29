interface ProfileStat {
  label: string
  value: number | null
  unit: string
}

interface ProfileStatGridProps {
  stats: ProfileStat[]
}

/** 4-column grid of stat cards (study days, streak, vocab, grammar) */
export function ProfileStatGrid({ stats }: ProfileStatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, unit }) => (
        <div
          key={label}
          className="flex flex-col gap-1 rounded-2xl bg-background p-4 shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]"
        >
          <span className="text-xs text-muted-foreground">{label}</span>
          <p className="text-2xl font-bold text-primary">{value ?? '—'}</p>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      ))}
    </div>
  )
}
