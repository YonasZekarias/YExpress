"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingStateVariant =
  | "fullscreen"
  | "page"
  | "section"
  | "inline"
  | "bare";

export interface LoadingStateProps {
  /** Primary status line, e.g. "Loading products…" */
  message: string;
  /** Optional supporting line under the title */
  description?: string;
  variant?: LoadingStateVariant;
  className?: string;
}

const shell: Record<LoadingStateVariant, string> = {
  fullscreen:
    "min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-6",
  page:
    "flex flex-col items-center justify-center min-h-[65vh] w-full gap-3 px-4 py-12",
  section:
    "flex flex-col items-center justify-center min-h-[180px] w-full gap-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 py-10 px-6",
  inline: "inline-flex flex-row items-center gap-2.5 py-1",
  bare: "flex flex-col items-center justify-center gap-3 w-full py-4",
};

const spinner: Record<LoadingStateVariant, string> = {
  fullscreen: "h-11 w-11",
  page: "h-10 w-10",
  section: "h-9 w-9",
  inline: "h-5 w-5 shrink-0",
  bare: "h-8 w-8",
};

const titleSize: Record<LoadingStateVariant, string> = {
  fullscreen: "text-lg",
  page: "text-base",
  section: "text-base",
  inline: "text-sm font-medium",
  bare: "text-sm font-semibold",
};

/**
 * Consistent loading UI: spinner + contextual message (+ optional description).
 */
export function LoadingState({
  message,
  description,
  variant = "page",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(shell[variant], className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <Loader2
        className={cn(
          "animate-spin text-indigo-600 dark:text-indigo-400",
          spinner[variant]
        )}
      />
      <div
        className={cn(
          "text-center max-w-md",
          variant === "inline" && "text-left"
        )}
      >
        <p
          className={cn(
            "font-semibold text-slate-900 dark:text-slate-100 tracking-tight",
            titleSize[variant]
          )}
        >
          {message}
        </p>
        {description ? (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
