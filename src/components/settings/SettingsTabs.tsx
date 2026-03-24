import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore, type ThemeMode } from '@/stores/themeStore'
import { authService } from '@/services/authService'
import { gooeyToast } from 'goey-toast'
import { SETTINGS_COPY } from '@/constants/settings'
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal'
import { SunIcon, MoonIcon, DesktopIcon } from '@phosphor-icons/react'

const C = SETTINGS_COPY

// ─────────────────────────── Account tab ───────────────────────────

export function AccountTab() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.login)
  const token = useAuthStore((state) => state.token)
  const [showModal, setShowModal] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [saving, setSaving] = useState(false)

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    setSaving(true)
    try {
      await authService.updateDisplayName(displayName.trim())
      const updated = authService.getCurrentUser()
      if (updated && token) setUser(token, updated)
      gooeyToast.success(C.account.savedToast)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + quick info */}
      <div className="flex items-center gap-4 rounded-2xl bg-background p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-lg font-bold text-background">
          {(displayName || user?.displayName || '?').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-foreground">{user?.displayName ?? '—'}</p>
          <p className="text-sm text-muted-foreground">{user?.email ?? '—'}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {C.account.joinedLabel}: {joinedDate}
          </p>
        </div>
      </div>

      {/* Change display name */}
      <form onSubmit={handleSaveName} className="flex flex-col gap-3 rounded-2xl bg-background p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            {C.account.displayNameLabel}
          </span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={C.account.displayNamePlaceholder}
            className="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition focus:ring-primary"
          />
        </label>
        <button
          type="submit"
          disabled={saving || !displayName.trim()}
          className="self-start rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-40"
        >
          {saving ? '...' : C.account.saveNameBtn}
        </button>
      </form>

      {/* Change password */}
      <div className="rounded-2xl bg-background p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Mật khẩu</p>
            <p className="text-xs text-muted-foreground">••••••••</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-container-highest"
          >
            {C.account.changePasswordBtn}
          </button>
        </div>
      </div>

      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

// ─────────────────────────── Display tab ───────────────────────────

export function DisplayTab() {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-background p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]">
      <p className="text-sm font-semibold text-foreground">{C.display.themeLabel}</p>

      <div className="flex flex-col gap-2">
        {C.display.themes.map(({ value, label }) => {
          const Icon = value === 'light' ? SunIcon : value === 'dark' ? MoonIcon : DesktopIcon
          const active = mode === value
          return (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors ${
                active
                  ? 'bg-primary/8 ring-1 ring-primary/20'
                  : 'hover:bg-surface-container'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={value}
                checked={active}
                onChange={() => setMode(value as ThemeMode)}
                className="sr-only"
              />
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                active ? 'bg-primary text-background' : 'bg-surface-container text-secondary'
              }`}>
                <Icon size={16} weight={active ? 'fill' : 'regular'} />
              </div>
              <span className={`text-sm font-medium transition-colors ${
                active ? 'text-primary' : 'text-foreground'
              }`}>{label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
