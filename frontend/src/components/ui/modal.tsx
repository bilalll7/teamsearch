import type { ComponentProps } from 'react'
import { cn } from './cn'

export const Modal = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const ModalOverlay = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm', className)}
      {...props}
    />
  )
}

export const ModalContent = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const ModalHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
  )
}

export const ModalTitle = ({
  className,
  ...props
}: ComponentProps<'h3'>) => {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export const ModalDescription = ({
  className,
  ...props
}: ComponentProps<'p'>) => {
  return (
    <p className={cn('text-sm text-neutral-500', className)} {...props} />
  )
}

export const ModalBody = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('py-4', className)} {...props} />
}

export const ModalFooter = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  )
}
