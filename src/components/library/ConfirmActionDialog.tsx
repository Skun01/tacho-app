import { WarningCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DECK_COPY } from '@/constants/deck'

interface ConfirmActionDialogProps {
  open: boolean
  title: string
  description: string
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmActionDialog({
  open,
  title,
  description,
  isPending = false,
  onOpenChange,
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm overflow-hidden p-0" showCloseButton={false}>
        <DialogHeader className="gap-3 px-6 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <WarningCircleIcon size={24} className="text-rose-500" weight="fill" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-base font-bold">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-3 px-6 pb-6 pt-2 sm:grid sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full rounded-xl py-2.5 text-sm font-semibold"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {DECK_COPY.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full rounded-xl py-2.5 text-sm font-semibold"
            onClick={onConfirm}
            disabled={isPending}
          >
            {DECK_COPY.confirmAction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
