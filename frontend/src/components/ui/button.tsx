import type { ComponentProps, ForwardedRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'bg-transparent border-2 border-border text-foreground hover:bg-surface',
        outline: 'bg-transparent border border-border text-foreground hover:bg-surface',
        ghost: 'bg-transparent text-muted-foreground hover:bg-surface hover:text-foreground',
        accent: 'bg-accent text-white hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  className,
  variant,
  size,
  ref,
  ...props
}: ButtonProps & { ref?: ForwardedRef<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
