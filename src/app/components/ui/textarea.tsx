import * as React from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[96px] w-full rounded-xl border px-3 py-2 text-sm outline-none transition resize-none",
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

export { Textarea };
