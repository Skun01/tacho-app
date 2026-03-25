import {
  ShuffleIcon,
  ListChecksIcon,
  TextTIcon,
  SpeakerHighIcon,
  CardsIcon,
} from '@phosphor-icons/react'
import { QUIZ_TYPE_OPTIONS, type QuizForceType } from '@/constants/quiz'
import { QUICK_STUDY_COPY } from '@/constants/quickStudy'

const ICON_MAP: Record<string, React.ReactNode> = {
  Shuffle:     <ShuffleIcon size={20} />,
  ListChecks:  <ListChecksIcon size={20} />,
  TextT:       <TextTIcon size={20} />,
  SpeakerHigh: <SpeakerHighIcon size={20} />,
  Cards:       <CardsIcon size={20} />,
}

interface Props {
  selected: QuizForceType
  onChange: (type: QuizForceType) => void
}

export function QuizTypePicker({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {QUICK_STUDY_COPY.typeSectionTitle}
      </p>
      {QUIZ_TYPE_OPTIONS.map((opt) => {
        const active = selected === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 ${
              active
                ? 'bg-primary/8 shadow-[0_1px_6px_0_rgba(0,36,83,0.10)]'
                : 'bg-background shadow-[0_1px_4px_0_rgba(29,28,19,0.06)] hover:bg-primary/4'
            }`}
          >
            {/* Icon box */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
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
              <p className="text-[11px] leading-snug text-muted-foreground">{opt.desc}</p>
            </div>

            {/* Radio dot */}
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                active ? 'border-primary bg-primary' : 'border-muted-foreground/25'
              }`}
            >
              {active && (
                <div className="mx-auto mt-[3px] h-1.5 w-1.5 rounded-full bg-background" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
