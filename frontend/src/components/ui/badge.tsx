import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full border px-2.5 py-0.5',
    'text-xs font-semibold transition-colors focus:outline-none',
    'focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: 'border-transparent bg-neutral-900 text-neutral-50',
        secondary: 'border-transparent bg-neutral-100 text-neutral-900',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'text-neutral-950',
        success:
          'border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
        warning:
          'border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200',
        info: 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends ComponentProps<'div'>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Badge = ({
  className,
  variant,
  leftIcon,
  rightIcon,
  children,
  ...props
}: BadgeProps) => {
  return (
    <div
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    >
      {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1.5">{rightIcon}</span>}
    </div>
  )
}
