import { useEffect, useRef, useState } from "react";
import { cn } from "./ui/cn";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export const Dropdown = ({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full polished-dropdown">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-surface px-4 text-sm font-medium transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open
            ? "border-primary"
            : "border-border hover:border-muted-foreground",
        )}
      >
        <span
          className={cn(
            "truncate",
            selected ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="polished-dropdown-menu absolute inset-x-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-2xl"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-3 text-left text-sm transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-surface-elevated text-foreground"
                      : "text-muted-foreground hover:bg-surface-elevated/60 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
