import { Outlet } from "react-router-dom";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export function Layout() {
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      {/* Animated background with gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div 
          className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div 
          className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: "var(--gradient-info)" }}
        />
      </div>

      {/* Main Content with Header and Footer as part of content */}
      <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <Header />
        
        <main>
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}