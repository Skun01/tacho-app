import { HOME_FOOTER } from '@/constants/home'

export function FooterSection() {
  return (
    <footer className="bg-surface-container-low py-16">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <span className="font-bold italic text-primary">{HOME_FOOTER.brand}</span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {HOME_FOOTER.description}
            </p>
          </div>
          {HOME_FOOTER.columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground">{col.heading}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-xs text-muted-foreground">{HOME_FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
