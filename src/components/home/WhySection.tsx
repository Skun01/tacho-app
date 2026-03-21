import { CheckCircleIcon } from '@phosphor-icons/react'
import { HOME_WHY } from '@/constants/home'
import teaIllustrationUrl from '@/assets/illustrations/tea-illustration.svg'

export function WhySection() {
  return (
    <section id="features" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <TeaIllustration />

          <div className="flex flex-col gap-10">
            <h2 className="font-kiwi text-4xl font-medium text-primary">
              {HOME_WHY.heading}
            </h2>
            <div className="flex flex-col gap-8">
              {HOME_WHY.items.map((item) => (
                <div key={item.title} className="flex gap-5">
                  <CheckCircleIcon size={24} weight="fill" className="mt-0.5 shrink-0 text-secondary" />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeaIllustration() {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-3xl bg-surface-container-highest lg:h-[480px]">
      <img src={teaIllustrationUrl} alt="" className="h-full w-full object-cover" />
      <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary/80">
        <span className="font-kiwi text-lg text-background">和</span>
      </div>
    </div>
  )
}
