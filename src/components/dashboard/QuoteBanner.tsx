import { DASHBOARD_QUOTE } from '@/constants/dashboard'

export function QuoteBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container px-8 py-6">
      <span className="pointer-events-none absolute -top-4 right-4 select-none font-kiwi text-8xl font-medium leading-none text-foreground/[0.06]">
        {DASHBOARD_QUOTE.kanjiDecor}
      </span>
      <p className="mb-2 text-xs font-semibold tracking-wide text-secondary">
        {DASHBOARD_QUOTE.label}
      </p>
      <p className="font-kiwi text-xl font-medium italic leading-relaxed text-primary max-w-lg">
        {DASHBOARD_QUOTE.text}
      </p>
    </div>
  )
}
