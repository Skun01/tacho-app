import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

interface PageHelmetProps {
  title: string
  description?: string
}

/**
 * Reusable SEO head component.
 * Dùng cho mọi page — quản lý <title> và meta description tập trung.
 */
export function PageHelmet({ title, description }: PageHelmetProps) {
  const fullTitle = `${title} — Tacho`

  useEffect(() => {
    document.title = fullTitle

    if (!description) return

    let metaDescription = document.querySelector('meta[name="description"]')

    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }

    metaDescription.setAttribute('content', description)
  }, [description, fullTitle])

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}
