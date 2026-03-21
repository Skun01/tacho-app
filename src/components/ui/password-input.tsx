import { forwardRef, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={show ? 'text' : 'password'}
        className={`w-full border-b border-foreground/20 bg-transparent pb-3 pr-8 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary ${className ?? ''}`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-0 bottom-3 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      >
        {show ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'
