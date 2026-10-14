import { useState } from 'react'
import type { ComponentProps, ReactNode, ForwardedRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const avatarVariants = cva(
  'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-14 w-14',
        xl: 'h-20 w-20',
      },
      variant: {
        default: 'bg-neutral-100',
        primary: 'bg-blue-100',
        secondary: 'bg-emerald-100',
        accent: 'bg-amber-100',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface AvatarProps
  extends ComponentProps<'div'>,
    VariantProps<typeof avatarVariants> {
  src?: string
  fallback?: ReactNode
  alt?: string
  showStatus?: boolean
  status?: 'online' | 'offline' | 'busy'
  ref?: ForwardedRef<HTMLDivElement>
}

export const Avatar = ({
  className,
  size,
  variant,
  src,
  fallback,
  alt = 'User avatar',
  showStatus,
  status = 'offline',
  ref,
  ...props
}: AvatarProps & { ref?: ForwardedRef<HTMLDivElement> }) => {
  const [error, setError] = useState(false)

  let content
  if (src && !error) {
    content = <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setError(true)} />
  } else if (fallback) {
    content = fallback
  } else {
    content = (
      <span className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-500">
        ?
      </span>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(avatarVariants({ size, variant, className }))}
      {...props}
    >
      {content}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white',
            status === 'online' && 'bg-green-500',
            status === 'offline' && 'bg-neutral-400',
            status === 'busy' && 'bg-red-500'
          )}
        />
      )}
    </div>
  )
}
