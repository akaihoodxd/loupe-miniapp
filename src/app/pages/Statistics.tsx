import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface TeamMemberStats {
  id: string;
  username: string;
  totalDeals: number;
  completedDeals: number;
  appeals: number;
  checks: number;
}

const myStats = {
  myDeals: 142,
  completedDeals: 118,
  cancelledDeals: 15,
  appeals: 9,
  checks: 234,
  averageCheck: 127500,
  growth: {
    deals: 12,
    checks: 8,
    revenue: 15,
  },
};

const teamStats = {
  myDeals: 487,
  completedDeals: 423,
  cancelledDeals: 38,
  appeals: 26,
  checks: 892,
  averageCheck: 145000,
  lastActivity: "2 минуты назад",
};

const teamPerformance: TeamMemberStats[] = [
  { id: "1", username: "@owner_user", totalDeals: 142, completedDeals: 118, appeals: 9, checks: 234 },
  { id: "2", username: "@team_member1", totalDeals: 198, completedDeals: 176, appeals: 11, checks: 387 },
  { id: "3", username: "@team_member2", totalDeals: 147, completedDeals: 129, appeals: 6, checks: 271 },
];

export function Statistics() {
  const [activeTab, setActiveTab] = useState<"me" | "team">("me");
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const currentStats = activeTab === "me" ? myStats : teamStats;

  const periods = [
    { id: "week", label: "Неделя" },
    { id: "month", label: "Месяц" },
    { id: "year", label: "Год" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black mb-1">Статистика</h2>
        <p className="text-sm text-muted-foreground">
          Анализ производительности и метрик
        </p>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id as typeof period)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            style={
              period === p.id
                ? {
                    background: "var(--gradient-primary)",
                    color: "#000",
                    fontWeight: "bold",
                  }
                : {
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="me">Моя статистика</TabsTrigger>
          <TabsTrigger value="team">Статистика команды</TabsTrigger>
        </TabsList>

        {/* My Statistics */}
        <TabsContent value="me" className="space-y-4">
          {/* Main Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-[var(--info)]" />
                <p className="text-xs text-muted-foreground">Мои сделки</p>
              </div>
              <p className="text-2xl md:text-3xl font-black mb-1">{currentStats.myDeals}</p>
              <div className="flex items-center gap-1 text-xs text-[var(--success)]">
                <TrendingUp className="w-3 h-3" />
                <span>+{myStats.growth.deals}%</span>
              </div>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                <p className="text-xs text-muted-foreground">Завершённые</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{currentStats.completedDeals}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((currentStats.completedDeals / currentStats.myDeals) * 100).toFixed(1)}% успеха
              </p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-[var(--destructive)]" />
                <p className="text-xs text-muted-foreground">Отменённые</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{currentStats.cancelledDeals}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((currentStats.cancelledDeals / currentStats.myDeals) * 100).toFixed(1)}%
              </p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                <p className="text-xs text-muted-foreground">Апелляции</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{currentStats.appeals}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((currentStats.appeals / currentStats.myDeals) * 100).toFixed(1)}%
              </p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-[var(--color-primary)]" />
                <p className="text-xs text-muted-foreground">Проверки</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{currentStats.checks}</p>
              <div className="flex items-center gap-1 text-xs text-[var(--success)]">
                <TrendingUp className="w-3 h-3" />
                <span>+{myStats.growth.checks}%</span>
              </div>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-[var(--success)]" />
                <p className="text-xs text-muted-foreground">Средний чек</p>
              </div>
              <p className="text-xl md:text-2xl font-black">
                {(currentStats.averageCheck / 1000).toFixed(0)}K ₽
              </p>
              <div className="flex items-center gap-1 text-xs text-[var(--success)]">
                <TrendingUp className="w-3 h-3" />
                <span>+{myStats.growth.revenue}%</span>
              </div>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div
            className="backdrop-blur-xl rounded-xl p-6 border"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
            }}
          >
            <h3 className="text-lg font-bold mb-4">Динамика за {period === "week" ? "неделю" : period === "month" ? "месяц" : "год"}</h3>
            <div className="h-48 flex items-center justify-center border border-dashed rounded-xl" style={{ borderColor: "var(--border)" }}>
              <p className="text-muted-foreground">График сделок</p>
            </div>
          </div>
        </TabsContent>

        {/* Team Statistics */}
        <TabsContent value="team" className="space-y-4">
          {/* Team Main Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-[var(--info)]" />
                <p className="text-xs text-muted-foreground">Все сделки</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{teamStats.myDeals}</p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                <p className="text-xs text-muted-foreground">Завершённые</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{teamStats.completedDeals}</p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-[var(--destructive)]" />
                <p className="text-xs text-muted-foreground">Отменённые</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{teamStats.cancelledDeals}</p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                <p className="text-xs text-muted-foreground">Апелляции</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{teamStats.appeals}</p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-[var(--color-primary)]" />
                <p className="text-xs text-muted-foreground">Проверки</p>
              </div>
              <p className="text-2xl md:text-3xl font-black">{teamStats.checks}</p>
            </div>

            <div
              className="backdrop-blur-xl rounded-xl p-4 border"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-[var(--success)]" />
                <p className="text-xs text-muted-foreground">Средний чек</p>
              </div>
              <p className="text-xl md:text-2xl font-black">
                {(teamStats.averageCheck / 1000).toFixed(0)}K ₽
              </p>
            </div>
          </div>

          {/* Last Activity */}
          <div
            className="backdrop-blur-xl rounded-xl p-4 border flex items-center justify-between"
            style={{
              background: "var(--gradient-card)",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-sm font-bold">Последняя активность</p>
                <p className="text-xs text-muted-foreground">{teamStats.lastActivity}</p>
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div
            className="backdrop-blur-xl rounded-xl p-4 md:p-6 border"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="text-lg font-bold">Производительность команды</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2 text-xs font-bold text-muted-foreground pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="col-span-1">Ник</div>
                <div className="text-center">Сделок</div>
                <div className="text-center">Завершено</div>
                <div className="text-center">Апелляций</div>
                <div className="text-center">Проверок</div>
              </div>

              {teamPerformance.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-5 gap-2 text-sm items-center p-3 rounded-xl hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="col-span-1 font-bold text-[var(--color-primary)] truncate">
                    {member.username}
                  </div>
                  <div className="text-center font-bold">{member.totalDeals}</div>
                  <div className="text-center text-[var(--success)]">{member.completedDeals}</div>
                  <div className="text-center text-[var(--warning)]">{member.appeals}</div>
                  <div className="text-center">{member.checks}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Statistics;
