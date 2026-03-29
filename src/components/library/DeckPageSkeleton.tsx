/** Skeleton placeholder cho trang DeckViewPage / DeckEditPage */
export function DeckPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
        <div className="h-6 w-2/3 rounded-xl bg-surface-container" />
        <div className="h-4 w-1/2 rounded-xl bg-surface-container-low" />
        <div className="flex gap-3">
          <div className="h-8 w-28 rounded-xl bg-surface-container" />
          <div className="h-8 w-24 rounded-xl bg-surface-container" />
          <div className="h-8 w-24 rounded-xl bg-surface-container" />
        </div>
      </div>

      {/* Card list rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-16 rounded-2xl bg-background shadow-[0_1px_6px_0_rgba(29,28,19,0.06)]"
          style={{ opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  )
}
