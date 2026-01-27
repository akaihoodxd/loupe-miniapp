import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, Star, AlertTriangle, User } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { DetailedCounterpartyCard } from "@/app/components/DetailedCounterpartyCard";

// Expandable list of exchanges
const EXCHANGES = [
  { id: "htx", name: "HTX", color: "#00c853" },
  { id: "bybit", name: "ByBit", color: "#ffa000" },
  { id: "okx", name: "OKX", color: "#ffffff" },
  { id: "gate", name: "Gate", color: "#2196f3" },
  { id: "mexc", name: "MEXC", color: "#00c853" },
  { id: "bitget", name: "Bitget", color: "#ddff00" },
] as const;

type ExchangeId = typeof EXCHANGES[number]["id"];

interface Deal {
  id: string;
  exchange: ExchangeId;
  counterparty: string;
  uid: string;
  amount: number;
  currency: string;
  status: "active" | "completed" | "cancelled" | "dispute";
  date: string;
  rate: number;
  total: number;
  type: "buy" | "sell";
  // For "Team deals" view
  ownerUsername?: string;
  // NOTE: P2P order can include multiple payment methods, so we don't model/show a single bank here.
  risks?: string[];
  history?: Array<{ timestamp: string; action: string }>;
  reviews?: Array<{ author: string; rating: number; text: string }>;
  // Owner (used for Team Deals view)
  ownerUserId?: string;
  ownerUsername?: string;
}

const mockMyDeals: Deal[] = [
  {
    id: "1",
    exchange: "htx",
    counterparty: "billigans",
    uid: "132465789",
    amount: 1500,
    currency: "USDT",
    status: "active",
    date: "2026-01-25",
    rate: 85.64,
    total: 128460,
    type: "buy",
    // paymentMethod removed (can be multiple)
    risks: ["Низкий рейтинг", "Новый аккаунт"],
    history: [
      { timestamp: "2026-01-25 14:30", action: "Сделка создана" },
      { timestamp: "2026-01-25 14:32", action: "Ожидание оплаты" },
    ],
    reviews: [],
  },
  {
    id: "2",
    exchange: "bybit",
    counterparty: "trader123",
    uid: "987654321",
    amount: 3200,
    currency: "USDT",
    status: "completed",
    date: "2026-01-24",
    rate: 85.20,
    total: 272640,
    type: "sell",
    // paymentMethod removed
    risks: [],
    history: [
      { timestamp: "2026-01-24 10:15", action: "Сделка создана" },
      { timestamp: "2026-01-24 10:20", action: "Оплата получена" },
      { timestamp: "2026-01-24 10:25", action: "Крипта отправлена" },
      { timestamp: "2026-01-24 10:30", action: "Сделка завершена" },
    ],
    reviews: [
      { author: "@me", rating: 5, text: "Быстро и надежно!" },
    ],
  },
  {
    id: "3",
    exchange: "htx",
    counterparty: "crypto_pro",
    uid: "555666777",
    amount: 850,
    currency: "USDT",
    status: "dispute",
    date: "2026-01-23",
    rate: 85.10,
    total: 72335,
    type: "buy",
    // paymentMethod removed
    risks: ["Жалобы от других команд"],
    history: [
      { timestamp: "2026-01-23 16:00", action: "Сделка создана" },
      { timestamp: "2026-01-23 16:15", action: "Оплата отправлена" },
      { timestamp: "2026-01-23 17:00", action: "Спор открыт: контрагент не подтверждает получение" },
    ],
    reviews: [],
  },
  {
    id: "4",
    exchange: "bybit",
    counterparty: "fast_trader",
    uid: "111222333",
    amount: 2000,
    currency: "USDT",
    status: "completed",
    date: "2026-01-22",
    rate: 84.90,
    total: 169800,
    type: "buy",
    // paymentMethod removed
    risks: [],
    history: [
      { timestamp: "2026-01-22 12:00", action: "Сделка создана" },
      { timestamp: "2026-01-22 12:05", action: "Оплата отправлена" },
      { timestamp: "2026-01-22 12:10", action: "Крипта получена" },
    ],
    reviews: [
      { author: "@me", rating: 5, text: "Отличный контрагент" },
    ],
  },
  {
    id: "5",
    exchange: "mexc",
    counterparty: "mexc_user",
    uid: "999888777",
    amount: 5000,
    currency: "USDT",
    status: "cancelled",
    date: "2026-01-20",
    rate: 85.50,
    total: 427500,
    type: "sell",
    // paymentMethod removed
    risks: [],
    history: [
      { timestamp: "2026-01-20 09:00", action: "Сделка создана" },
      { timestamp: "2026-01-20 09:30", action: "Отменено по запросу продавца" },
    ],
    reviews: [],
  },
];

const mockTeamDeals: Deal[] = [
  // existing deals, attributed to team owner
  ...mockMyDeals.map((d) => ({ ...d, ownerUsername: "@owner_user" })),
  {
    id: "t1",
    exchange: "gate",
    counterparty: "gate_friendly",
    uid: "445566778",
    amount: 900,
    currency: "USDT",
    status: "active",
    date: "2026-01-26",
    rate: 86.05,
    total: 77445,
    type: "sell",
    ownerUsername: "@team_member1",
    risks: [],
    history: [
      { timestamp: "2026-01-26 11:05", action: "Сделка создана" },
      { timestamp: "2026-01-26 11:08", action: "Контрагент в чате" },
    ],
    reviews: [],
  },
  {
    id: "t2",
    exchange: "bitget",
    counterparty: "bitget_slow",
    uid: "120045500",
    amount: 2500,
    currency: "USDT",
    status: "dispute",
    date: "2026-01-26",
    rate: 85.8,
    total: 214500,
    type: "buy",
    ownerUsername: "@team_member2",
    risks: ["Задержка подтверждения", "Есть жалобы"],
    history: [
      { timestamp: "2026-01-26 15:10", action: "Сделка создана" },
      { timestamp: "2026-01-26 15:20", action: "Оплата отправлена" },
      { timestamp: "2026-01-26 16:00", action: "Открыт спор" },
    ],
    reviews: [],
  },
];

function DealCard({ deal, showOwner }: { deal: Deal; showOwner: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCounterpartyCard, setShowCounterpartyCard] = useState(false);

  // Mock detailed counterparty data
  const counterpartyData = {
    uid: deal.uid,
    nickname: deal.counterparty,
    score: 45,
    dealsCount: 89,
    complaintsCount: 7,
    accountAge: "2 месяца",
    risk: "medium" as const,
    phones: ["+79991234567"],
    cards: ["1234567890123456"],
    names: ["Петров Петр"],
    banks: ["Сбербанк", "Тинькофф"],
    checkCount: 234,
    dealHistory: [
      {
        id: "1",
        trader: "Команда Pro",
        outcome: "success" as const,
        tag: "Обмен",
        comment: "Нормальная сделка",
        date: "22.01.2026",
      },
    ],
    tags: ["normal"],
  };

  const getStatusConfig = (status: Deal["status"]) => {
    const configs = {
      active: { 
        bg: "rgba(33, 150, 243, 0.1)", 
        text: "var(--info)", 
        label: "Активная" 
      },
      completed: { 
        bg: "rgba(0, 200, 83, 0.1)", 
        text: "var(--success)", 
        label: "Завершена" 
      },
      cancelled: { 
        bg: "rgba(220, 53, 69, 0.1)", 
        text: "var(--destructive)", 
        label: "Отменена" 
      },
      dispute: { 
        bg: "rgba(255, 160, 0, 0.1)", 
        text: "var(--warning)", 
        label: "Спор" 
      },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(deal.status);
  const exchange = EXCHANGES.find(e => e.id === deal.exchange);
  const canReview = ["completed", "cancelled", "dispute"].includes(deal.status);

  const riskChip = (() => {
    const reasons = deal.risks ?? [];
    if (reasons.length === 0) {
      return { label: "Норм", color: "var(--success)", bg: "rgba(0, 200, 83, 0.12)", reason: "Нет негативных сигналов" };
    }
    const high = reasons.some((r) => /жалоб|скам|мошен/i.test(r)) || reasons.length >= 2;
    if (high) {
      return { label: "Риск", color: "var(--destructive)", bg: "rgba(255, 82, 82, 0.12)", reason: reasons[0] };
    }
    return { label: "Подозр", color: "var(--warning)", bg: "rgba(255, 160, 0, 0.12)", reason: reasons[0] };
  })();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="backdrop-blur-xl rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300"
        style={{
          background: "var(--glass-bg)",
          borderColor: isOpen ? "var(--glass-border)" : "var(--border)",
          boxShadow: isOpen ? "0 8px 32px rgba(221, 255, 0, 0.15)" : "none",
        }}
      >
        {/* Compact View */}
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 md:p-5 text-left hover:bg-[var(--muted)] transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-sm md:text-base truncate">
                    {deal.counterparty}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs uppercase shrink-0"
                    style={{ 
                      borderColor: exchange?.color,
                      color: exchange?.color,
                    }}
                  >
                    {exchange?.name}
                  </Badge>
                  {showOwner && deal.ownerUsername && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <User className="w-3 h-3" />
                      <span className="font-semibold">{deal.ownerUsername}</span>
                    </div>
                  )}
                  <span
                    className="text-xs px-2 py-1 rounded-full border shrink-0"
                    style={{
                      background: riskChip.bg,
                      borderColor: riskChip.color,
                      color: riskChip.color,
                    }}
                  >
                    {riskChip.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground flex-wrap">
                  <span>{deal.date}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-semibold text-foreground">
                    {deal.amount.toLocaleString()} {deal.currency}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden md:inline">
                    {deal.total.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge
                  className="font-bold text-xs whitespace-nowrap"
                  style={{
                    background: statusConfig.bg,
                    color: statusConfig.text,
                  }}
                >
                  {statusConfig.label}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        {/* Expanded View */}
        <CollapsibleContent>
          <div className="border-t border-border p-4 md:p-5 space-y-4">
            {/* Deal Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">UID</p>
                <p className="font-semibold text-sm">{deal.uid}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Тип</p>
                <p className="font-semibold text-sm">
                  {deal.type === "buy" ? "Покупка" : "Продажа"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Курс</p>
                <p className="font-semibold text-sm">{deal.rate} ₽</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Сумма</p>
                <p className="font-semibold text-sm">
                  {deal.amount.toLocaleString()} {deal.currency}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Итого</p>
                <p className="font-semibold text-sm">{deal.total.toLocaleString()} ₽</p>
              </div>
            </div>

            {/* Risk summary */}
            <div
              className="rounded-xl p-3 border"
              style={{
                background: riskChip.bg,
                borderColor: riskChip.color,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" style={{ color: riskChip.color }} />
                <p className="text-sm font-bold" style={{ color: riskChip.color }}>
                  {riskChip.label}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {riskChip.reason}
              </p>
              {deal.risks && deal.risks.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {deal.risks.map((risk, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground">
                      • {risk}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* History */}
            {deal.history && deal.history.length > 0 && (
              <div>
                <p className="text-sm font-bold mb-3">Ход сделки</p>
                <div className="space-y-2">
                  {deal.history.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div 
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: "var(--gradient-primary)" }}
                      />
                      <div>
                        <p className="text-muted-foreground">{item.timestamp}</p>
                        <p className="font-medium">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {deal.reviews && deal.reviews.length > 0 && (
              <div>
                <p className="text-sm font-bold mb-3">Отзывы</p>
                <div className="space-y-2">
                  {deal.reviews.map((review, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-xl p-3 border"
                      style={{
                        background: "var(--muted)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[var(--color-primary)]">
                          {review.author}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-3 h-3 fill-[var(--warning)] text-[var(--warning)]" 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Form */}
            {canReview && !showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                variant="outline"
                className="w-full"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <Star className="w-4 h-4 mr-2" />
                Оставить отзыв
              </Button>
            )}

            {showReviewForm && (
              <div 
                className="rounded-xl p-4 border space-y-3"
                style={{
                  background: "var(--glass-bg)",
                  borderColor: "var(--glass-border)",
                }}
              >
                <p className="text-sm font-bold">Оставить отзыв</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className="w-6 h-6 text-muted-foreground hover:fill-[var(--warning)] hover:text-[var(--warning)]" />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 rounded-xl border text-sm resize-none"
                  rows={3}
                  placeholder="Ваш отзыв о сделке..."
                  style={{
                    background: "var(--input)",
                    borderColor: "var(--border)",
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1 font-bold text-black"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Отправить
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            {/* Counterparty Card */}
            {showCounterpartyCard && (
              <DetailedCounterpartyCard
                data={counterpartyData}
                onClose={() => setShowCounterpartyCard(false)}
              />
            )}

            {/* Counterparty Info Button */}
            {!showCounterpartyCard && (
              <Button
                onClick={() => setShowCounterpartyCard(true)}
                variant="outline"
                className="w-full"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <User className="w-4 h-4 mr-2" />
                Информация о контрагенте
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function Deals() {
  const [scope, setScope] = useState<"my" | "team">("my");
  const [statusFilter, setStatusFilter] = useState<"all" | Deal["status"]>("all");
  const [exchangeFilter, setExchangeFilter] = useState<"all" | ExchangeId>("all");

  const baseDeals = scope === "my" ? mockMyDeals : mockTeamDeals;

  const filteredDeals = baseDeals.filter((deal) => {
    const statusMatch = statusFilter === "all" || deal.status === statusFilter;
    const exchangeMatch = exchangeFilter === "all" || deal.exchange === exchangeFilter;
    return statusMatch && exchangeMatch;
  });

  const statusFilters = [
    { id: "all", label: "Все" },
    { id: "active", label: "Активные" },
    { id: "completed", label: "Завершенные" },
    { id: "dispute", label: "Споры" },
    { id: "cancelled", label: "Отмененные" },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-black mb-1">Сделки</h2>
        <p className="text-sm text-muted-foreground">
          Всего: {baseDeals.length} • Активных: {baseDeals.filter((d) => d.status === "active").length}
        </p>

        {/* Scope Toggle */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setScope("my")}
            className="px-4 py-2 rounded-xl text-sm font-semibold border"
            style={
              scope === "my"
                ? { background: "var(--gradient-primary)", color: "#000", borderColor: "var(--glass-border)" }
                : { background: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }
            }
          >
            Мои
          </button>
          <button
            onClick={() => setScope("team")}
            className="px-4 py-2 rounded-xl text-sm font-semibold border"
            style={
              scope === "team"
                ? { background: "var(--gradient-primary)", color: "#000", borderColor: "var(--glass-border)" }
                : { background: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }
            }
          >
            Команда
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-4 md:mb-6">
        {/* Status Filters */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Статус</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id as typeof statusFilter)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all"
                style={
                  statusFilter === filter.id
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
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange Filters */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Биржа</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setExchangeFilter("all")}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all"
              style={
                exchangeFilter === "all"
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
              Все
            </button>
            {EXCHANGES.map((exchange) => (
              <button
                key={exchange.id}
                onClick={() => setExchangeFilter(exchange.id)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all border"
                style={
                  exchangeFilter === exchange.id
                    ? {
                        // Selected exchange should be clearly highlighted (brand accent)
                        background: "var(--gradient-primary)",
                        borderColor: "transparent",
                        color: "#000",
                        fontWeight: "bold",
                      }
                    : {
                        background: "var(--muted)",
                        borderColor: "var(--border)",
                        color: "var(--muted-foreground)",
                      }
                }
              >
                {exchange.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="space-y-3 md:space-y-4">
        {filteredDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} showOwner={scope === "team"} />
        ))}

        {filteredDeals.length === 0 && (
          <div
            className="backdrop-blur-xl rounded-2xl p-8 md:p-12 border text-center"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
            }}
          >
            <p className="text-muted-foreground">Сделок не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Deals;
