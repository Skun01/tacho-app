import { HOME_TESTIMONIALS } from '@/constants/home'

export function TestimonialsSection() {
  return (
    <section id="feels" className="bg-surface-container-low py-24">
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-16 font-['Kiwi_Maru'] text-4xl font-medium text-primary">
          {HOME_TESTIMONIALS.heading}
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {HOME_TESTIMONIALS.items.map((item) => (
            <div key={item.name} className="flex flex-col gap-8 rounded-3xl bg-background p-8">
              <p className="text-base leading-relaxed text-foreground">{item.quote}</p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container">
                  <span className="text-xs font-bold text-background">{item.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
