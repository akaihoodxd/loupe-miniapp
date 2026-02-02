import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Phone,
  CreditCard,
  User,
  Building2,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

interface DetailedCounterpartyData {
  uid: string;
  nickname: string;
  score: number;
  dealsCount: number;
  complaintsCount: number;
  accountAge: string;
  risk: "low" | "medium" | "high";
  phones: string[];
  cards: string[];
  names: string[];
  banks: string[];
  checkCount: number;
  dealHistory: Array<{
    id: string;
    trader: string;
    outcome: "success" | "cancelled" | "dispute";
    tag: string;
    comment: string;
    date: string;
  }>;
  tags?: string[];
}

interface DetailedCounterpartyCardProps {
  data: DetailedCounterpartyData;
  onClose?: () => void;
}

export function DetailedCounterpartyCard({ data, onClose }: DetailedCounterpartyCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  
  const getRiskColor = () => {
    if (data.score > 70) return "var(--success)";
    if (data.score > 30) return "var(--warning)";
    return "var(--destructive)";
  };

  const getOutcomeConfig = (outcome: string) => {
    const configs = {
      success: { bg: "rgba(0, 200, 83, 0.1)", text: "var(--success)", label: "Успешно" },
      cancelled: { bg: "rgba(220, 53, 69, 0.1)", text: "var(--destructive)", label: "Отменено" },
      dispute: { bg: "rgba(255, 160, 0, 0.1)", text: "var(--warning)", label: "Спор" },
    };
    return configs[outcome as keyof typeof configs] || configs.success;
  };

  return (
    <div
      className="backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border space-y-4"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
      }}
    >
      {/* Header with Score */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-1">{data.nickname}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">UID: {data.uid}</p>
        </div>
        
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4"
          style={{
            background: `conic-gradient(${getRiskColor()} ${data.score}%, rgba(255,255,255,0.1) ${data.score}%)`,
            borderColor: getRiskColor(),
          }}
        >
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center"
            style={{ background: "var(--card)" }}
          >
            <span className="text-xl md:text-2xl font-black" style={{ color: getRiskColor() }}>
              {data.score}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Сделок</p>
          <p className="text-xl font-black">{data.dealsCount}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Жалоб</p>
          <p className="text-xl font-black text-[var(--destructive)]">{data.complaintsCount}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Проверок</p>
          <p className="text-xl font-black">{data.checkCount}</p>
        </div>
      </div>

      <Separator />

      {/* Requisites */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold">Реквизиты</h4>
        
        {data.names.length > 0 && (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Имена</p>
              <div className="flex flex-wrap gap-2">
                {data.names.map((name, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{name}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {data.phones.length > 0 && (
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Телефоны</p>
              <div className="flex flex-wrap gap-2">
                {data.phones.map((phone, i) => (
                  <Badge key={i} variant="outline" className="text-xs font-mono">{phone}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {data.cards.length > 0 && (
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Карты</p>
              <div className="flex flex-wrap gap-2">
                {data.cards.map((card, i) => (
                  <Badge key={i} variant="outline" className="text-xs font-mono">
                    {card.slice(0, 4)} •••• •••• {card.slice(-4)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {data.banks.length > 0 && (
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Банки</p>
              <div className="flex flex-wrap gap-2">
                {data.banks.map((bank, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{bank}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Deal History */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-bold">История сделок ({data.dealHistory.length})</span>
          </div>
          {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showHistory && (
          <div className="mt-3 space-y-2">
            {data.dealHistory.map((deal) => {
              const outcomeConfig = getOutcomeConfig(deal.outcome);
              return (
                <div
                  key={deal.id}
                  className="p-3 rounded-xl border"
                  style={{
                    background: "var(--muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold">{deal.trader}</p>
                      <p className="text-xs text-muted-foreground">{deal.date}</p>
                    </div>
                    <Badge
                      className="text-xs"
                      style={{
                        background: outcomeConfig.bg,
                        color: outcomeConfig.text,
                      }}
                    >
                      {outcomeConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{deal.tag}</Badge>
                  </div>
                  {deal.comment && (
                    <p className="text-xs text-muted-foreground italic">"{deal.comment}"</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}