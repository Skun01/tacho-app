import { HOME_FEATURES } from '@/constants/home'

export function FeaturesSection() {
  return (
    <section id="knowledge" className="bg-surface-container-low py-24">
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-16 font-['Kiwi_Maru'] text-4xl font-medium text-primary">
          {HOME_FEATURES.heading}
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {HOME_FEATURES.cards.map((card) =>
            card.featured ? (
              <div
                key={card.title}
                className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-background"
              >
                {card.label && (
                  <span className="absolute top-6 right-6 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-background">
                    {card.label}
                  </span>
                )}
                <span className="font-['Kiwi_Maru'] text-5xl font-medium text-background/20">
                  {card.kanji}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-background">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-background/70">{card.description}</p>
                </div>
              </div>
            ) : (
              <div
                key={card.title}
                className="flex flex-col gap-6 rounded-3xl bg-background p-8 transition-shadow hover:shadow-[0_8px_32px_0_rgba(29,28,19,0.06)]"
              >
                <span className="font-['Kiwi_Maru'] text-5xl font-medium text-primary/15">
                  {card.kanji}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
