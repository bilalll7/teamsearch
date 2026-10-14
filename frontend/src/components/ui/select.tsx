import type { ComponentProps } from 'react'
import { cn } from './cn'

export const Select = ({
  className,
  children,
  ...props
}: ComponentProps<'select'>) => {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white appearance-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

export const SelectItem = ({
  className,
  children,
  value,
  ...props
}: ComponentProps<'option'>) => {
  return (
    <option value={value} className={cn('text-sm', className)} {...props}>
      {children}
    </option>
  )
}
