import type { ComponentProps, ReactNode, ForwardedRef } from 'react'
import { cn } from './cn'

export interface DropdownMenuProps {
  children: ReactNode
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <div className="relative inline-block text-left">{children}</div>
}

export interface DropdownMenuTriggerProps {
  children: ReactNode
  asChild?: boolean
}

export const DropdownMenuTrigger = ({ children, asChild }: DropdownMenuTriggerProps) => {
  if (asChild) {
    return children as React.ReactElement
  }
  return <div className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 text-sm focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">{children}</div>
}

export interface DropdownMenuContentProps extends ComponentProps<'div'> {
  align?: 'start' | 'center' | 'end'
}

export const DropdownMenuContent = ({
  className,
  children,
  align = 'center',
  ref,
  ...props
}: DropdownMenuContentProps & { ref?: ForwardedRef<HTMLDivElement> }) => {
  const alignClass = {
    start: 'start-0',
    center: 'start-1/2 -translate-x-1/2',
    end: 'end-0',
  }[align]

  return (
    <div
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md',
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DropdownMenuItemProps extends ComponentProps<'div'> {
  disabled?: boolean
}

export const DropdownMenuItem = ({
  className,
  children,
  disabled,
  ref,
  ...props
}: DropdownMenuItemProps & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        disabled
          ? 'pointer-events-none text-neutral-500'
          : 'text-neutral-900 hover:bg-neutral-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DropdownMenuSeparatorProps extends ComponentProps<'div'> {}

export const DropdownMenuSeparator = ({
  className,
  ref,
  ...props
}: DropdownMenuSeparatorProps & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('-mx-1 my-1 h-px bg-neutral-200', className)} {...props} />
}

export interface DropdownMenuLabelProps extends ComponentProps<'div'> {
  inset?: boolean
}

export const DropdownMenuLabel = ({
  className,
  children,
  inset,
  ref,
  ...props
}: DropdownMenuLabelProps & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
      {...props}
    >
      {children}
    </div>
  )
}
