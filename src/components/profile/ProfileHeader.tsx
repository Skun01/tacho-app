import { useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

function getInitials(name: string | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfileHeader() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  return (
    <div
      className="border-b"
      style={{
        backgroundColor: 'var(--surface-container-low)',
        borderColor: 'var(--outline-variant)',
      }}
    >
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 -ml-2 text-sm"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            <ArrowLeftIcon size={16} weight="bold" />
            Quay lại
          </Button>
        </div>

        <div className="flex items-end gap-6 pb-8 pt-4">
          <Avatar className="h-20 w-20 shrink-0 ring-4 ring-surface">
            <AvatarImage
              src={user?.avatarUrl ?? undefined}
              alt={user?.displayName ?? 'User'}
            />
            <AvatarFallback
              className="text-2xl font-bold"
              style={{
                backgroundColor: 'var(--secondary-container)',
                color: 'var(--on-secondary-container)',
              }}
            >
              {getInitials(user?.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="pb-1 min-w-0">
            <h1
              className="font-heading-vn text-2xl leading-tight truncate"
              style={{ color: 'var(--on-surface)' }}
            >
              {user?.displayName}
            </h1>
            <p
              className="mt-1 text-sm truncate"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
