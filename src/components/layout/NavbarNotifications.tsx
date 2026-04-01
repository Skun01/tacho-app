import { BellSimpleIcon } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { NAVBAR_COPY } from '@/constants/navbar'

/**
 * Notification bell + dropdown trong Navbar.
 * Self-contained — không cần props.
 * Khi có notification API: thêm useQuery ở đây.
 */
export function NavbarNotifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-secondary hover:text-primary"
          aria-label={NAVBAR_COPY.notifications}
        >
          <BellSimpleIcon size={20} weight="duotone" />
          {/* Notification dot — ẩn khi không có thông báo */}
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--tertiary)' }}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72"
        style={{ backgroundColor: 'var(--surface-container-low)' }}
      >
        <DropdownMenuLabel
          className="font-heading-vn font-semibold"
          style={{ color: 'var(--on-surface)' }}
        >
          {NAVBAR_COPY.notifications}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          className="px-4 py-6 text-center text-sm"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          {NAVBAR_COPY.noNotifications}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
