interface Props {
  label: string
  value: number
  color?: string
}

export function QuizStatCard({ label, value, color = 'text-foreground' }: Props) {
  return (
    <div className="rounded-2xl bg-surface-container-low px-2 py-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
