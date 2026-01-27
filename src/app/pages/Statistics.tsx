import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type RangeMode = "today" | "week" | "month" | "custom";

interface TeamMemberStats {
  id: string;
  username: string;
  totalDeals: number;
  completedDeals: number;
  appeals: number;
  checks: number;
  lastActive: string;
}

interface ActivityItem {
  id: string;
  user: string;
  team: string;
  action: string;
  meta: string;
  time: string;
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-extrabold mt-1">{value}</div>
          {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        </div>
        <div className="h-10 w-10 rounded-xl flex items-center justify-center border"
          style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.15)" }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Statistics() {
  const [rangeMode, setRangeMode] = useState<RangeMode>("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [selectedMember, setSelectedMember] = useState<TeamMemberStats | null>(null);

  // Mock stats (под будущий backend: /api/v1/statistics)
  const myStats = {
    deals: 142,
    completed: 118,
    cancelled: 15,
    appeals: 9,
    checks: 234,
    avgCheck: 128000,
  };

  const teamStats = {
    deals: 487,
    completed: 423,
    cancelled: 38,
    appeals: 26,
    checks: 892,
    avgCheck: 145000,
    lastActivity: "2 минуты назад",
  };

  const teamPerformance: TeamMemberStats[] = [
    { id: "U-10001", username: "@owner_user", totalDeals: 142, completedDeals: 118, appeals: 9, checks: 234, lastActive: "2 мин назад" },
    { id: "U-10002", username: "@team_member1", totalDeals: 185, completedDeals: 170, appeals: 7, checks: 361, lastActive: "12 мин назад" },
    { id: "U-10003", username: "@team_member2", totalDeals: 160, completedDeals: 135, appeals: 10, checks: 297, lastActive: "1 ч назад" },
  ];

  const activity: ActivityItem[] = [
    { id: "a1", user: "@owner_user", team: "Арбитражники", action: "Проверка контрагента", meta: "UID 132465789 (HTX)", time: "2 мин назад" },
    { id: "a2", user: "@team_member1", team: "Арбитражники", action: "Создал сделку", meta: "1500 USDT (ByBit)", time: "12 мин назад" },
    { id: "a3", user: "@team_member2", team: "Арбитражники", action: "Закрыл сделку", meta: "2000 USDT (OKX)", time: "1 ч назад" },
  ];

  // Charts (под future TimescaleDB / analytics)
  const chartData = useMemo(() => {
    // In real API: backend returns points based on rangeMode/from/to
    if (rangeMode === "today") {
      return [
        { label: "10:00", deals: 2, volume: 20 },
        { label: "12:00", deals: 4, volume: 55 },
        { label: "14:00", deals: 3, volume: 38 },
        { label: "16:00", deals: 6, volume: 80 },
        { label: "18:00", deals: 5, volume: 72 },
      ];
    }
    const labels = rangeMode === "week"
      ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
      : ["1", "5", "10", "15", "20", "25", "30"];

    return labels.map((l, i) => ({
      label: l,
      deals: (i + 2) * (rangeMode === "week" ? 3 : 4),
      volume: (i + 1) * (rangeMode === "week" ? 45 : 60),
    }));
  }, [rangeMode, from, to]);

  return (
    <div>
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <BarChart3 className="w-4 h-4" />
          Анализ производительности и метрик
        </div>

        {/* Range selector (mobile-first) */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "today", label: "Сегодня" },
            { id: "week", label: "Неделя" },
            { id: "month", label: "Месяц" },
            { id: "custom", label: "Интервал" },
          ].map((x) => (
            <button
              key={x.id}
              onClick={() => setRangeMode(x.id as RangeMode)}
              className={[
                "px-3 py-2 rounded-xl border text-sm whitespace-nowrap",
                rangeMode === x.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-transparent text-foreground",
              ].join(" ")}
              style={{ borderColor: "var(--border)" }}
            >
              {x.label}
            </button>
          ))}
        </div>

        {rangeMode === "custom" && (
          <div className="mt-3 flex gap-2">
            <input
              type="date"
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        )}
      </div>

      <Tabs defaultValue="my">
        <TabsList className="w-full">
          <TabsTrigger value="my">Моя статистика</TabsTrigger>
          <TabsTrigger value="team">Статистика команды</TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <MetricCard icon={<Eye className="w-5 h-5" />} label="Проверки" value={String(myStats.checks)} sub="за выбранный период" />
            <MetricCard icon={<Users className="w-5 h-5" />} label="Мои сделки" value={String(myStats.deals)} />
            <MetricCard icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />} label="Завершенные" value={String(myStats.completed)} />
            <MetricCard icon={<XCircle className="w-5 h-5 text-[var(--destructive)]" />} label="Отмененные" value={String(myStats.cancelled)} />
            <MetricCard icon={<AlertTriangle className="w-5 h-5 text-[var(--warning)]" />} label="Апелляции" value={String(myStats.appeals)} />
            <MetricCard icon={<DollarSign className="w-5 h-5 text-[var(--success)]" />} label="Средний чек" value={`${Math.round(myStats.avgCheck / 1000)}K ₽`} />
          </div>

          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="font-semibold mb-2">Динамика сделок</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="deals" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="font-semibold mb-2">Объёмы</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <MetricCard icon={<Users className="w-5 h-5" />} label="Сделки команды" value={String(teamStats.deals)} sub={`Последняя активность: ${teamStats.lastActivity}`} />
            <MetricCard icon={<Eye className="w-5 h-5" />} label="Проверки" value={String(teamStats.checks)} />
            <MetricCard icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />} label="Завершенные" value={String(teamStats.completed)} />
            <MetricCard icon={<XCircle className="w-5 h-5 text-[var(--destructive)]" />} label="Отмененные" value={String(teamStats.cancelled)} />
            <MetricCard icon={<AlertTriangle className="w-5 h-5 text-[var(--warning)]" />} label="Апелляции" value={String(teamStats.appeals)} />
            <MetricCard icon={<DollarSign className="w-5 h-5 text-[var(--success)]" />} label="Средний чек" value={`${Math.round(teamStats.avgCheck / 1000)}K ₽`} />
          </div>

          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="font-semibold mb-2">Динамика команды</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.map((p) => ({ ...p, deals: Math.round(p.deals * 2.6) }))}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="deals" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="font-semibold mb-3">Производительность команды</div>
            <div className="space-y-2">
              {teamPerformance.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="w-full text-left rounded-xl border p-3 flex items-center justify-between gap-3"
                  style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.12)" }}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{m.username}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      ID: {m.id} • активность: {m.lastActive}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {m.completedDeals}/{m.totalDeals} • ап: {m.appeals}
                  </div>
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Нажми на участника, чтобы увидеть детали.
            </div>
          </div>

          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="font-semibold mb-3">Последняя активность</div>
            <div className="space-y-3">
              {activity.map((x) => (
                <div key={x.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      <span className="text-[var(--color-primary)]">{x.user}</span>{" "}
                      <span className="text-muted-foreground">• {x.team}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{x.time}</div>
                  </div>
                  <div className="mt-1 text-foreground">{x.action}</div>
                  <div className="text-xs text-muted-foreground">{x.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Drawer open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Статистика участника</DrawerTitle>
          </DrawerHeader>
          {selectedMember && (
            <div className="px-4 pb-6 space-y-3">
              <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="text-lg font-extrabold">{selectedMember.username}</div>
                <div className="text-xs text-muted-foreground">ID: {selectedMember.id}</div>
                <div className="text-xs text-muted-foreground">Последняя активность: {selectedMember.lastActive}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard icon={<Users className="w-5 h-5" />} label="Всего сделок" value={String(selectedMember.totalDeals)} />
                <MetricCard icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />} label="Завершено" value={String(selectedMember.completedDeals)} />
                <MetricCard icon={<AlertTriangle className="w-5 h-5 text-[var(--warning)]" />} label="Апелляции" value={String(selectedMember.appeals)} />
                <MetricCard icon={<Eye className="w-5 h-5" />} label="Проверки" value={String(selectedMember.checks)} />
              </div>

              <Button onClick={() => setSelectedMember(null)} variant="outline" className="w-full">
                Закрыть
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
