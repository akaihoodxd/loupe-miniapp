
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Telegram Mini App bootstrap (safe to run in browser too)
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        themeParams?: Record<string, unknown>;
        initDataUnsafe?: Record<string, unknown>;
      };
    };
  }
}

try {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.("#1c1c1c");
    tg.setBackgroundColor?.("#1c1c1c");
  }
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
  