import { useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MyDecksTab } from '@/components/library/MyDecksTab'
import { AppDecksTab } from '@/components/library/AppDecksTab'
import { TextbookTab } from '@/components/library/TextbookTab'
import { CommunityTab } from '@/components/library/CommunityTab'
import { LIBRARY_COPY, type LibraryMainTab } from '@/constants/library'

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryMainTab>('Bộ thẻ của tôi')
  const [search, setSearch] = useState('')

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground">{LIBRARY_COPY.heading}</h1>

          <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-[0_1px_8px_0_rgba(29,28,19,0.08)] sm:w-72">
            <MagnifyingGlassIcon size={15} className="shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={LIBRARY_COPY.searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto rounded-xl bg-surface-container p-1">
          {LIBRARY_COPY.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'Bộ thẻ của tôi' && <MyDecksTab search={search} />}
          {activeTab === 'Bộ thẻ của app' && <AppDecksTab search={search} />}
          {activeTab === 'Sách giáo khoa' && <TextbookTab search={search} />}
          {activeTab === 'Cộng đồng' && <CommunityTab search={search} />}
        </div>
      </div>
    </DashboardLayout>
  )
}
