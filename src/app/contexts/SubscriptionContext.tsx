import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Plan = "free" | "light" | "basic";

export interface SubscriptionContextValue {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  // Capabilities (MVP gating, later backed by backend tariffs)
  canWriteGlobalChat: boolean;
  canAccessDeals: boolean;
  canAccessTeam: boolean;
  canAccessStats: boolean;
  maxTeamMembers: number;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<Plan>(() => {
    const stored = localStorage.getItem("loupe-plan");
    return (stored as Plan) || "free";
  });

  useEffect(() => {
    localStorage.setItem("loupe-plan", plan);
  }, [plan]);

  const setPlan = (p: Plan) => setPlanState(p);

  const value = useMemo<SubscriptionContextValue>(() => {
    const canWriteGlobalChat = plan !== "free";
    const canAccessDeals = plan !== "free";
    const canAccessTeam = plan === "basic";
    const canAccessStats = plan !== "free"; // team stats only for basic, but stats page exists
    const maxTeamMembers = plan === "basic" ? 3 : 1;
    return {
      plan,
      setPlan,
      canWriteGlobalChat,
      canAccessDeals,
      canAccessTeam,
      canAccessStats,
      maxTeamMembers,
    };
  }, [plan]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
