import { TrendingUp, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Button } from "@/app/components/ui/button";
import logoWhite from "@/assets/logo-white.png";
import logoBlack from "@/assets/logo-black.png";

interface HeaderProps {
  title?: string;
  exchangeRate?: number;
}

export function Header({ 
  title = "LOUPE", 
  exchangeRate = 85.64 
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const logoSrc = isLight ? logoBlack : logoWhite;

  return (
    <div 
      className="backdrop-blur-xl rounded-2xl border mb-4 md:mb-6 overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
      }}
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: isLight ? "#0a0a0f" : "#ffffff" }}>
              {title}
            </h1>
            <img
              src={logoSrc}
              alt="LOUPE"
              className="h-9 w-9 md:h-11 md:w-11 object-contain"
              style={{ imageRendering: "-webkit-optimize-contrast" as any }}
            />
            <div className="hidden sm:block w-px h-6 bg-border" />
            <p className="hidden sm:block text-xs md:text-sm text-muted-foreground">
              P2P Экосистема
            </p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:scale-110 transition-transform"
              style={{ background: "var(--glass-bg)" }}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Sun className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>

            {/* Exchange Rate */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-card)" }}
              >
                <TrendingUp className="w-4 h-4 text-[var(--success)]" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] md:text-sm font-semibold leading-tight"><span style={{background:"linear-gradient(90deg,#22d3ee 0%,#3b82f6 100%)",WebkitBackgroundClip:"text",color:"transparent"}}>Рапиры</span><span className="text-muted-foreground"> • </span><span className="text-[var(--color-primary)] font-bold">USDT</span></div>
                <div className="text-base md:text-lg font-black text-white">{exchangeRate.toFixed(2)} ₽</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}