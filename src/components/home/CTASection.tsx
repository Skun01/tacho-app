import { useState } from 'react'
import { HOME_CTA } from '@/constants/home'

export function CTASection() {
  const [email, setEmail] = useState('')

  return (
    <section id="about" className="bg-gradient-to-br from-primary to-primary-container py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-8 text-center">
        <span className="font-kiwi text-8xl font-medium text-background/10">
          {HOME_CTA.kanjiDecor}
        </span>
        <h2 className="font-kiwi -mt-16 text-5xl font-medium text-background">
          {HOME_CTA.heading}
        </h2>
        <p className="max-w-md text-base leading-relaxed text-background/70">
          {HOME_CTA.subheading}
        </p>
        <div className="mt-2 flex w-full max-w-md overflow-hidden rounded-xl bg-background/10 p-1.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={HOME_CTA.emailPlaceholder}
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-background outline-none placeholder:text-background/40"
          />
          <button className="rounded-lg bg-background px-6 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
            {HOME_CTA.button}
          </button>
        </div>
      </div>
    </section>
  )
}
