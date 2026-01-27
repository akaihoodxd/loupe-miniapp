import { TrendingUp, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Button } from "@/app/components/ui/button";
import logo from "@/assets/loupe-logo.png";

interface HeaderProps {
  title?: string;
  exchangeRate?: number;
}

export function Header({ title = "LOUPE", exchangeRate = 85.64 }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="backdrop-blur-xl rounded-2xl border mb-4 md:mb-6 overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
      }}
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-white text-xl md:text-2xl font-black tracking-tight truncate">
              {title}
            </h1>
            <img
              src={logo}
              alt="LOUPE"
              className="h-5 w-5 md:h-6 md:w-6 shrink-0"
              draggable={false}
            />

            <div className="hidden sm:block w-px h-6 bg-border mx-2" />
            <p className="hidden sm:block text-xs md:text-sm text-muted-foreground">
              P2P Экосистема
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Exchange Rate (Rapira) */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{
                background: "rgba(0,0,0,0.25)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
              </div>

              <div className="leading-tight">
                <div className="text-[10px] md:text-xs text-muted-foreground">
                  Курс Рапиры
                </div>
                <div className="text-sm md:text-base font-extrabold text-white whitespace-nowrap">
                  {exchangeRate.toFixed(2)} ₽ <span className="text-muted-foreground font-semibold">/ USDT</span>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:scale-110 transition-transform"
              style={{ background: "rgba(0,0,0,0.25)" }}
              aria-label="Переключить тему"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Sun className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
