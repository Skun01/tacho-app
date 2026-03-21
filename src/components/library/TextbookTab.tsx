import { LIBRARY_COPY, MOCK_TEXTBOOKS } from '@/constants/library'
import { DeckCard } from './DeckCard'

interface Props {
  search: string
}

export function TextbookTab({ search }: Props) {
  const filtered = MOCK_TEXTBOOKS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.textbook ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, deck) => {
    const key = deck.textbook ?? 'Khác'
    if (!acc[key]) acc[key] = []
    acc[key].push(deck)
    return acc
  }, {})

  const groups = Object.entries(grouped)

  if (groups.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">{LIBRARY_COPY.emptyState}</p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map(([textbook, decks]) => (
        <section key={textbook}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {LIBRARY_COPY.textbookGroupLabel}
            </span>
            <h3 className="text-base font-bold text-foreground">{textbook}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
