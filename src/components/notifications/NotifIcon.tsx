import {
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ChatCircleIcon,
  HeartIcon,
  CopyIcon,
  SpeakerHighIcon,
} from '@phosphor-icons/react'
import type { NotificationType } from '@/types/notification'

interface NotifIconProps {
  type: NotificationType
  size?: 'sm' | 'md'
}

/**
 * Icon tròn màu theo từng loại notification.
 * sm: h-8 w-8 (dùng trong dropdown panel)
 * md: h-10 w-10 (dùng trong full-page list)
 */
export function NotifIcon({ type, size = 'sm' }: NotifIconProps) {
  const dim = size === 'md' ? 'h-10 w-10' : 'h-8 w-8'
  const iconSize = size === 'md' ? 18 : 15
  const base = `flex ${dim} shrink-0 items-center justify-center rounded-full`

  switch (type) {
    case 'review_reminder':
      return <span className={`${base} bg-primary/10`}><ClockIcon size={iconSize} weight="fill" className="text-primary" /></span>
    case 'streak_warning':
      return <span className={`${base} bg-orange-100`}><FireIcon size={iconSize} weight="fill" className="text-orange-500" /></span>
    case 'milestone':
      return <span className={`${base} bg-emerald-100`}><TrophyIcon size={iconSize} weight="fill" className="text-emerald-600" /></span>
    case 'card_burned':
      return <span className={`${base} bg-amber-100`}><TrophyIcon size={iconSize} weight="fill" className="text-amber-500" /></span>
    case 'comment_reply':
      return <span className={`${base} bg-blue-100`}><ChatCircleIcon size={iconSize} weight="fill" className="text-blue-500" /></span>
    case 'comment_like':
      return <span className={`${base} bg-rose-100`}><HeartIcon size={iconSize} weight="fill" className="text-rose-500" /></span>
    case 'deck_cloned':
      return <span className={`${base} bg-violet-100`}><CopyIcon size={iconSize} weight="fill" className="text-violet-500" /></span>
    case 'system':
    default:
      return <span className={`${base} bg-surface-container`}><SpeakerHighIcon size={iconSize} weight="fill" className="text-muted-foreground" /></span>
  }
}
