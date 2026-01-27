import * as React from "react";

import { cn } from "./utils";

/**
 * LOUPE Input
 * Mobile-first, high-contrast in both themes.
 * We intentionally set explicit text/caret colors to avoid theme-token edge cases.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        // Light theme: white input with dark text
        "bg-white text-[#111] caret-[#111] placeholder:text-zinc-500",
        // Dark theme: token-driven background with white text
        "dark:bg-[var(--input-background)] dark:text-white dark:caret-white dark:placeholder:text-zinc-400",
        // Borders / focus
        "border-[var(--border)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/40",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
