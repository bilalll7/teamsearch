import type { ComponentProps, ForwardedRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from './cn'

const cardVariants = cva('rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm')

export interface CardProps extends ComponentProps<'div'> {
  ref?: ForwardedRef<HTMLDivElement>
}

export const Card = ({ className, ref, ...props }: CardProps) => {
  return <div ref={ref} className={cn(cardVariants({ className }))} {...props} />
}

export const CardHeader = ({ className, ref, ...props }: ComponentProps<'div'> & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

export const CardTitle = ({ className, ref, ...props }: ComponentProps<'h3'> & { ref?: ForwardedRef<HTMLHeadingElement> }) => {
  return (
    <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  )
}

export const CardDescription = ({ className, ref, ...props }: ComponentProps<'p'> & { ref?: ForwardedRef<HTMLParagraphElement> }) => {
  return <p ref={ref} className={cn('text-sm text-neutral-500', className)} {...props} />
}

export const CardContent = ({ className, ref, ...props }: ComponentProps<'div'> & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
}

export const CardFooter = ({ className, ref, ...props }: ComponentProps<'div'> & { ref?: ForwardedRef<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
}
