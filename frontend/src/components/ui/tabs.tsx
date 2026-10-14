import type { ComponentProps, ForwardedRef } from 'react'
import { cn } from './cn'

export const Tabs = ({
  className,
  defaultValue,
  children,
  ref,
  ...props
}: ComponentProps<'div'> & { defaultValue?: string } & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const TabsList = ({
  className,
  children,
  ref,
  ...props
}: ComponentProps<'div'> & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const TabsTrigger = ({
  className,
  value,
  children,
  ref,
  ...props
}: ComponentProps<'button'> & { value?: string } & { ref?: ForwardedRef<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'bg-white text-neutral-950 shadow-sm',
        'data-[state=active]:text-blue-600 data-[state=active]:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({
  className,
  value,
  children,
  ref,
  ...props
}: ComponentProps<'div'> & { value?: string } & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'mt-2 rounded-md border border-neutral-200 bg-white p-4',
        'data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
