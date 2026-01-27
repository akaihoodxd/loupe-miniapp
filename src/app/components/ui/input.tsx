import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // NOTE: We set explicit text/caret colors to avoid low-contrast issues
        // when CSS variables (foreground/input-background) are misconfigured.
        "flex h-10 w-full min-w-0 rounded-xl border px-3 py-2 text-sm outline-none transition",
        "bg-white text-[#111] placeholder:text-zinc-500 caret-[#111]",
        "dark:bg-[var(--input-background)] dark:text-white dark:placeholder:text-zinc-400 dark:caret-white",
        "border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
