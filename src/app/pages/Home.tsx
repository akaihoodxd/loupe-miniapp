import { useState } from "react";
import { Search, Shield, TrendingUp, Eye, CheckCircle } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { DetailedCounterpartyCard } from "@/app/components/DetailedCounterpartyCard";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { parseSearchQuery, getSearchTypeLabel } from "@/app/utils/counterpartySearch";

interface CounterpartyData {
  uid: string;
  nickname: string;
  score: number;
  dealsCount: number;
  complaintsCount: number;
  accountAge: string;
  risk: "low" | "medium" | "high";
  activeDeals: Array<{ teamName: string; status: string; date?: string }>;
  tags?: string[];
}

type Exchange = "htx" | "bybit";

export function Home() {
  const [exchange, setExchange] = useState<Exchange>("htx");
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Today's stats
  const todayStats = {
    checks: 47,
    deals: 23,
    risks: 5,
  };

  const handleCheck = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    // Parse search query
    const parsed = parseSearchQuery(searchQuery);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock detailed data
    const mockDetailedData = {
      uid: parsed.type === "uid" ? parsed.normalized : "132465789",
      nickname: "billigans",
      score: 23,
      dealsCount: 47,
      complaintsCount: 12,
      accountAge: "5 дней",
      risk: "high" as const,
      phones: ["+79991234567", "+79998887766"],
      cards: ["1234567890123456", "9876543210987654"],
      names: ["Иванов Иван", "И. Иванович", "Иван И."],
      banks: ["Сбербанк", "Тинькофф", "Альфа-Банк"],
      checkCount: 156,
      dealHistory: [
        {
          id: "1",
          trader: "Команда Арбитраж",
          outcome: "success" as const,
          tag: "Обмен",
          comment: "Быстрая сделка, все отлично",
          date: "20.01.2026",
        },
        {
          id: "2",
          trader: "P2P Traders",
          outcome: "dispute" as const,
          tag: "Покупка",
          comment: "Долго переводил, начался спор",
          date: "18.01.2026",
        },
        {
          id: "3",
          trader: "Команда Трейдеры",
          outcome: "cancelled" as const,
          tag: "Продажа",
          comment: "Не вышел на связь",
          date: "15.01.2026",
        },
      ],
      tags: ["scammer", "delayed"],
    };

    setResult(mockDetailedData);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Today Stats Widgets */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div
          className="backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 border text-center"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
          }}
        >
          <Eye className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-[var(--color-primary)]" />
          <p className="text-xs text-muted-foreground mb-1">Проверок сегодня</p>
          <p className="text-xl md:text-2xl font-black">{todayStats.checks}</p>
        </div>

        <div
          className="backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 border text-center"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
          }}
        >
          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-[var(--success)]" />
          <p className="text-xs text-muted-foreground mb-1">Сделок сегодня</p>
          <p className="text-xl md:text-2xl font-black">{todayStats.deals}</p>
        </div>

        <div
          className="backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 border text-center"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
          }}
        >
          <Shield className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-[var(--destructive)]" />
          <p className="text-xs text-muted-foreground mb-1">Найдено рисков</p>
          <p className="text-xl md:text-2xl font-black text-[var(--destructive)]">{todayStats.risks}</p>
        </div>
      </div>

      {/* Counterparty Check */}
      <div
        className="backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div
            className="p-3 rounded-xl"
            style={{ background: "var(--gradient-card)" }}
          >
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">Проверка контрагента</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              По UID, телефону, карте или ФИО
            </p>
          </div>
        </div>

        <Tabs value={exchange} onValueChange={(v) => setExchange(v as Exchange)} className="mb-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="htx">HTX</TabsTrigger>
            <TabsTrigger value="bybit">ByBit</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 md:gap-3 mb-4">
          <Input
            placeholder="UID, телефон, карта или ФИО..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            className="flex-1"
          />
          <Button
            onClick={handleCheck}
            disabled={isLoading}
            className="px-4 md:px-6"
            style={{
              background: "var(--gradient-primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {searchQuery && (
          <p className="text-xs text-muted-foreground mb-4">
            Поиск {getSearchTypeLabel(parseSearchQuery(searchQuery).type)}: <span className="font-mono">{parseSearchQuery(searchQuery).normalized}</span>
          </p>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto" />
          </div>
        )}

        {result && !isLoading && (
          <DetailedCounterpartyCard data={result} />
        )}
      </div>
    </div>
  );
}