import { NavLink } from "react-router-dom";
import { Home, HandshakeIcon, Users, BarChart3, Settings } from "lucide-react";

export function Footer() {
  const navItems = [
    { to: "/", icon: Home, label: "Главная" },
    { to: "/deals", icon: HandshakeIcon, label: "Сделки" },
    { to: "/team", icon: Users, label: "Команда" },
    { to: "/statistics", icon: BarChart3, label: "Статистика" },
    { to: "/settings", icon: Settings, label: "Настройки" },
  ];

  return (
    <div 
      className="backdrop-blur-xl rounded-2xl border mt-4 md:mt-6 overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
      }}
    >
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex justify-around py-2 md:py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "scale-105 md:scale-110"
                    : "hover:scale-105"
                }`
              }
              style={({ isActive }) => isActive ? {
                background: "var(--gradient-card)",
                boxShadow: "0 0 20px rgba(221, 255, 0, 0.2)",
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className="w-5 h-5 md:w-6 md:h-6" 
                    style={{ 
                      color: isActive ? "var(--color-primary)" : "var(--muted-foreground)" 
                    }}
                  />
                  <span 
                    className="text-[10px] md:text-xs font-medium"
                    style={{ 
                      color: isActive ? "var(--color-primary)" : "var(--muted-foreground)" 
                    }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}