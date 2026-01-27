import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

type Props = {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

/**
 * Mobile-first горизонтальный скролл с подсказкой "свайп".
 * Всегда добавляет правый fade + стрелку. Как только пользователь проскроллит — подсказка пропадает.
 */
export function ScrollRow({ className, contentClassName, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollLeft > 8) setTouched(true);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className={cn(
          "flex gap-2 overflow-x-auto pb-2 pr-10 [-webkit-overflow-scrolling:touch] scrollbar-none",
          contentClassName,
        )}
      >
        {children}
      </div>

      {!touched && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          <div
            className="h-full w-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--background) 70%, var(--background) 100%)",
            }}
          />
          <div className="absolute right-2 flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>свайп</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}
