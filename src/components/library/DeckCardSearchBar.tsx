import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DECK_COPY } from '@/constants/deck'

interface DeckCardSearchBarProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function DeckCardSearchBar({
  value,
  placeholder,
  onChange,
}: DeckCardSearchBarProps) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-card px-4 shadow-[0_1px_8px_0_rgba(29,28,19,0.08)] dark:bg-surface-container-high dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.24)]">
      <MagnifyingGlassIcon size={14} className="shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
      />
      {value.trim() && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onChange('')}
          aria-label={DECK_COPY.clearSearch}
          title={DECK_COPY.clearSearch}
        >
          <XIcon size={12} />
        </Button>
      )}
    </div>
  )
}
