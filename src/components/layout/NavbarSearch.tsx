import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { NAVBAR_COPY } from '@/constants/navbar'

/**
 * Search bar trong Navbar.
 * Khi nhấn Enter → navigate đến /search?q=...
 */
export function NavbarSearch() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = searchText.trim()
      if (trimmed) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`)
        setSearchText('')
        setSearchOpen(false)
        searchRef.current?.blur()
      }
    }
  }

  return (
    <div className="flex-1 max-w-md mx-auto">
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300 cursor-text ${
          searchOpen ? 'ring-1 ring-primary/40' : ''
        }`}
        style={{ backgroundColor: 'var(--surface-container)' }}
        onClick={() => setSearchOpen(true)}
      >
        <MagnifyingGlassIcon
          size={15}
          weight="bold"
          style={{ color: 'var(--on-surface-variant)', flexShrink: 0 }}
        />
        <input
          ref={searchRef}
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={NAVBAR_COPY.searchPlaceholder}
          onBlur={() => setSearchOpen(false)}
          className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          style={{ color: 'var(--on-surface)' }}
          aria-label={NAVBAR_COPY.searchPlaceholder}
        />
      </div>
    </div>
  )
}
