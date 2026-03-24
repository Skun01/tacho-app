export function StudyLoadingSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="h-48 rounded-3xl bg-surface-container" />
        <div className="h-32 rounded-2xl bg-surface-container" />
      </div>
      <div className="flex flex-col gap-3 lg:col-span-1">
        <div className="h-36 rounded-2xl bg-surface-container" />
        <div className="h-10 rounded-2xl bg-surface-container" />
        <div className="h-10 rounded-2xl bg-surface-container" />
      </div>
    </div>
  )
}
