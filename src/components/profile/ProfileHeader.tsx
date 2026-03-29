import type { UserDTO } from '@/types/auth'
import { PROFILE_COPY } from '@/constants/profile'

const C = PROFILE_COPY

interface ProfileHeaderProps {
  user: UserDTO | null
  joinedDate: string
}

/** Avatar + display name + email + join date */
export function ProfileHeader({ user, joinedDate }: ProfileHeaderProps) {
  const displayName = user?.displayName ?? '—'
  const email       = user?.email ?? '—'
  const initials    = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-xl font-bold text-background">
        {initials}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {C.joinedLabel} {joinedDate}
        </p>
      </div>
    </div>
  )
}
