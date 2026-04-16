import { Skeleton } from '@/components/ui/skeleton'

export function DeckListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_2px_12px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_10px_24px_0_rgba(0,0,0,0.24)]">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-5 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-4/5 rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-14 rounded-2xl" />
              <Skeleton className="h-14 rounded-2xl" />
            </div>
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
