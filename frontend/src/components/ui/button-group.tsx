import type { ComponentProps, ForwardedRef } from 'react'
import { cn } from './cn'

export const ButtonGroup = ({
  className,
  children,
  orientation = 'horizontal',
  ref,
  ...props
}: ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' } & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center space-x-1 rounded-md border border-neutral-200 bg-white p-1',
        orientation === 'vertical' && 'flex-col space-y-1 p-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const ButtonGroupItem = ({
  className,
  isActive = false,
  children,
  ref,
  ...props
}: ComponentProps<'button'> & { isActive?: boolean } & { ref?: ForwardedRef<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-neutral-900 text-neutral-50 shadow-sm'
          : 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
      )}
      {...props}
    >
      {children}
    </button>
  )
}
