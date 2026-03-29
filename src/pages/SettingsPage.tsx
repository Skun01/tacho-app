import { useSearchParams } from 'react-router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AccountTab, DisplayTab, NotificationsTab } from '@/components/settings/SettingsTabs'
import { SETTINGS_COPY, type SettingsTab } from '@/constants/settings'

const C = SETTINGS_COPY

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabIndex = Math.min(
    parseInt(searchParams.get('tab') ?? '0', 10),
    C.tabs.length - 1,
  )
  const activeTab: SettingsTab = C.tabs[tabIndex] ?? C.tabs[0]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-16">
        <h1 className="text-2xl font-bold text-foreground">{C.heading}</h1>

        <div className="flex gap-1 overflow-x-auto rounded-xl bg-surface-container p-1">
          {C.tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setSearchParams({ tab: String(idx) }, { replace: false })}
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

        <div className="max-w-xl">
          {activeTab === 'Tài khoản'  && <AccountTab />}
          {activeTab === 'Hiển thị'   && <DisplayTab />}
          {activeTab === 'Thông báo'  && <NotificationsTab />}
        </div>
      </div>
    </DashboardLayout>
  )
}
