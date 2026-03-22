import { CheckSquareIcon } from '@phosphor-icons/react'
import { SEARCH_COPY } from '@/constants/search'
import type { JlptLevel } from '@/types/card'

export type TypeFilter = 'all' | 'vocab' | 'grammar'

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

interface Props {
  typeFilter: TypeFilter
  onTypeChange: (t: TypeFilter) => void
  jlptFilter: Set<JlptLevel>
  onJlptToggle: (level: JlptLevel) => void
  selectMode: boolean
  onToggleSelectMode: () => void
}

export function SearchFiltersBar({
  typeFilter,
  onTypeChange,
  jlptFilter,
  onJlptToggle,
  selectMode,
  onToggleSelectMode,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Type — single-select segment */}
      <div className="flex items-center gap-0.5 rounded-full bg-surface-container p-1">
        {SEARCH_COPY.typeOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTypeChange(value as TypeFilter)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 ${
              typeFilter === value
                ? 'bg-background text-primary shadow-sm'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <span className="h-5 w-px bg-surface-container-highest" />

      {/* JLPT — multi-select chips */}
      <div className="flex items-center gap-1">
        {JLPT_LEVELS.map((level) => {
          const active = jlptFilter.has(level)
          return (
            <button
              key={level}
              onClick={() => onJlptToggle(level)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 ${
                active
                  ? 'bg-primary text-background'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-highest hover:text-foreground'
              }`}
            >
              {level}
            </button>
          )
        })}
      </div>

      {/* Select mode toggle — push to right */}
      <button
        onClick={onToggleSelectMode}
        className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
          selectMode
            ? 'bg-primary text-background'
            : 'bg-surface-container text-secondary hover:bg-surface-container-highest hover:text-foreground'
        }`}
      >
        <CheckSquareIcon size={13} weight={selectMode ? 'fill' : 'regular'} />
        {selectMode ? SEARCH_COPY.selectModeExit : SEARCH_COPY.selectModeEnter}
      </button>
    </div>
  )
}
