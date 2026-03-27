import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import {
  ArrowLeftIcon,
  ListChecksIcon,
  TextTIcon,
  SpeakerHighIcon,
} from '@phosphor-icons/react'
import { QUIZ_TYPE_OPTIONS, QUIZ_CONFIG_COPY, type QuizForceType } from '@/constants/quiz'

type QuizConfigLocationState = {
  batchIds?: string[]
  mode?: 'learn' | 'review'
  type?: 'vocab' | 'grammar'
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ListChecks:  <ListChecksIcon size={24} />,
  TextT:       <TextTIcon size={24} />,
  SpeakerHigh: <SpeakerHighIcon size={24} />,
}

export function QuizConfigPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as QuizConfigLocationState | null

  const [selected, setSelected] = useState<QuizForceType>('C')

  function handleStart() {
    navigate('/quiz', {
      state: {
        batchIds: routeState?.batchIds,
        mode: routeState?.mode ?? 'review',
        type: routeState?.type,
        forceType: selected,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center px-4">
        <button
          onClick={() => navigate(-1)}
          aria-label={QUIZ_CONFIG_COPY.backLabel}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon size={18} />
        </button>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center px-6 pt-4 pb-10">
        <div className="w-full max-w-md">
          <h1 className="mb-1 text-2xl font-bold text-foreground">{QUIZ_CONFIG_COPY.heading}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{QUIZ_CONFIG_COPY.subheading}</p>

          <div className="flex flex-col gap-3">
            {QUIZ_TYPE_OPTIONS.map((opt) => {
              const active = selected === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelected(opt.value)}
                  className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? 'border-primary/30 bg-primary/8 shadow-sm'
                      : 'border-[#1d1c13]/10 bg-surface-container-low hover:border-primary/20 hover:bg-primary/4'
                  }`}
                >
                  {/* Icon box */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active ? 'bg-primary text-background' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {ICON_MAP[opt.icon]}
                  </div>

                  {/* Label + desc */}
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                      active ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}
                  >
                    {active && (
                      <div className="m-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-background" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleStart}
            className="mt-8 w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-background transition-colors hover:bg-primary-container"
          >
            {QUIZ_CONFIG_COPY.startBtn}
          </button>
        </div>
      </main>
    </div>
  )
}
