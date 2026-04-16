import { MagnifyingGlassIcon, FunnelIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LIBRARY_COPY, type LibraryTabKey } from '@/constants/library'
import type { DeckTypeResponse, DeckVisibility } from '@/types/deck'

interface LibraryFiltersProps {
  activeTab: LibraryTabKey
  search: string
  typeId: string
  officialOnly: boolean
  visibility: '' | DeckVisibility
  deckTypes: DeckTypeResponse[]
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onOfficialOnlyChange: (value: boolean) => void
  onVisibilityChange: (value: '' | DeckVisibility) => void
  onClear: () => void
}

export function LibraryFilters({
  activeTab,
  search,
  typeId,
  officialOnly,
  visibility,
  deckTypes,
  onSearchChange,
  onTypeChange,
  onOfficialOnlyChange,
  onVisibilityChange,
  onClear,
}: LibraryFiltersProps) {
  const showOfficialFilter = activeTab === 'explore'
  const showVisibilityFilter = activeTab === 'myDecks'

  return (
    <div className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-5">
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={LIBRARY_COPY.searchPlaceholder}
          className="h-11 rounded-2xl bg-background pl-10"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">{LIBRARY_COPY.filters.type}</span>
          <select
            value={typeId}
            onChange={(event) => onTypeChange(event.target.value)}
            className="h-11 rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">{LIBRARY_COPY.allTypes}</option>
            {deckTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </label>

        {showVisibilityFilter && (
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
            <span className="font-medium text-foreground">{LIBRARY_COPY.filters.visibility}</span>
            <select
              value={visibility}
              onChange={(event) => onVisibilityChange(event.target.value as '' | DeckVisibility)}
              className="h-11 rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">{LIBRARY_COPY.allVisibilities}</option>
              <option value="Private">{LIBRARY_COPY.privateLabel}</option>
              <option value="Public">{LIBRARY_COPY.publicLabel}</option>
            </select>
          </label>
        )}

        {showOfficialFilter && (
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-input bg-background px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={officialOnly}
              onChange={(event) => onOfficialOnlyChange(event.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="font-medium text-foreground">{LIBRARY_COPY.officialOnly}</span>
          </label>
        )}

        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-2xl"
          onClick={onClear}
        >
          <FunnelIcon size={16} />
          {LIBRARY_COPY.clearFilters}
        </Button>
      </div>
    </div>
  )
}

