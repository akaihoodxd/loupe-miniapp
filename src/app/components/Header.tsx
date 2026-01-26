import { TrendingUp, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Button } from "@/app/components/ui/button";

interface HeaderProps {
  title?: string;
  exchangeRate?: number;
}

export function Header({ 
  title = "LOUPE", 
  exchangeRate = 85.64 
}: HeaderProps) {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 
              className="text-xl md:text-2xl font-black tracking-tight"
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </h1>
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
              className="flex items-center gap-2 text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-[var(--success)]" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                <span className="text-muted-foreground text-[10px] sm:text-xs">Курс Рапиры:</span>
                <span className="font-bold text-[var(--color-primary)] text-xs sm:text-sm">
                  {exchangeRate.toFixed(2)} ₽
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}