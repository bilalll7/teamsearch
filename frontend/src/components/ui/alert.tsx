import type { ComponentProps, ForwardedRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-white text-neutral-950',
        destructive:
          'border-red-500/50 text-red-700 dark:text-red-100 [&>svg]:text-red-700 dark:[&>svg]:text-red-100',
        success:
          'border-emerald-500/50 text-emerald-700 dark:text-emerald-100 [&>svg]:text-emerald-700 dark:[&>svg]:text-emerald-100',
        warning:
          'border-amber-500/50 text-amber-700 dark:text-amber-100 [&>svg]:text-amber-700 dark:[&>svg]:text-amber-100',
        info:
          'border-blue-500/50 text-blue-700 dark:text-blue-100 [&>svg]:text-blue-700 dark:[&>svg]:text-blue-100',
        error:
          'border-red-500/50 text-red-700 dark:text-red-100 [&>svg]:text-red-700 dark:[&>svg]:text-red-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps
  extends ComponentProps<'div'>,
    VariantProps<typeof alertVariants> {
  title?: string
  description?: string
  onClose?: () => void
  ref?: ForwardedRef<HTMLDivElement>
}

export const Alert = ({
  className,
  variant,
  title,
  description,
  onClose,
  children,
  ref,
  ...props
}: AlertProps & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {variant === 'success' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
        {variant === 'warning' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        )}
        {variant === 'error' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" x2="9" y1="9" y2="15" />
            <line x1="9" x2="15" y1="9" y2="15" />
          </svg>
        )}
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          {description && <div className="text-sm text-neutral-500">{description}</div>}
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export const AlertDescription = ({
  className,
  children,
  ref,
  ...props
}: ComponentProps<'div'> & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('text-sm text-neutral-500', className)} {...props}>{children}</div>
}
