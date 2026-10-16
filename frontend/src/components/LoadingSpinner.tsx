import { cn } from './ui/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<SpinnerSize, number> = {
  sm: 18,
  md: 28,
  lg: 44,
};

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  label?: string;
  text?: string;
  className?: string;
}

/**
 * Reusable loading spinner — TeamSearch primary blue (#3B82F6).
 * Uses CSS animation only, no new deps.
 * ponytail: no delay/overlay logic here; add when a global pending-tracker is needed.
 */
export const LoadingSpinner = ({ size = 'md', label, text, className }: LoadingSpinnerProps) => {
  const dimension = sizeMap[size];
  return (
    <span
      role="status"
      aria-label={label || text || 'Loading'}
      aria-live="polite"
      className={cn('inline-flex items-center gap-3', className)}
    >
      <svg
        className="animate-spin text-primary motion-reduce:animate-none"
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {text && <span className="text-[15px] text-muted-foreground">{text}</span>}
    </span>
  );
};

interface FullScreenLoadingProps {
  text?: string;
}

/**
 * Full-screen variant for app init / session check only.
 * No layout shift, no horizontal scroll.
 */
export const FullScreenLoading = ({ text }: FullScreenLoadingProps) => {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="flex min-h-screen w-full items-center justify-center px-6 pt-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <LoadingSpinner size="lg" label={text || 'Memuat TeamSearch...'} />
          <p className="text-sm text-muted-foreground">{text || 'Memuat TeamSearch...'}</p>
        </div>
      </main>
    </div>
  );
};
