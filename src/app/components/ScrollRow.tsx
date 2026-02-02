import { ReactNode, useRef, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface ScrollRowProps {
  children: ReactNode;
  hint?: string;
  className?: string;
}

/**
 * Mobile-first horizontal scroll row with a subtle fade on the right edge
 * and a small "swipe" hint that disappears after first interaction.
 */
export function ScrollRow({ children, hint = "Свайп →", className = "" }: ScrollRowProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollLeft > 8) setShowHint(false);
    };

    const onTouchStart = () => setShowHint(false);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <div className={"relative " + className}>
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto no-scrollbar pr-10"
        style={{ WebkitOverflowScrolling: "touch" as any }}
      >
        {children}
      </div>

      {/* right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-12"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--background) 75%)",
        }}
      />

      {showHint && (
        <div
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted-foreground)" }}
        >
          <span>{hint}</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}
