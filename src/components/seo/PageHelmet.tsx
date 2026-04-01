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
  return (
    <Helmet>
      <title>{title} — Tacho</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}
