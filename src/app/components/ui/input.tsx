import * as React from "react";
import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        "border-[var(--border)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        "bg-white text-[#111] placeholder:text-zinc-500 caret-[#111]",
        "dark:bg-[var(--input-background)] dark:text-white dark:placeholder:text-zinc-400 dark:caret-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
