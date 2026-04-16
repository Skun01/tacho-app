import type { CSSProperties, ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

interface AppLayoutProps {
  children: ReactNode
  mainClassName?: string
  mainStyle?: CSSProperties
}

export function AppLayout({ children, mainClassName, mainStyle }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <main className={mainClassName} style={mainStyle}>
        {children}
      </main>
      <Footer />
    </>
  )
}
