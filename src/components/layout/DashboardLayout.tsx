import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { FooterSection } from '@/components/home/FooterSection'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <DashboardNavbar />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      <FooterSection />
    </div>
  )
}
