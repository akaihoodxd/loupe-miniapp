import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Shield,
  Eye,
  CheckCircle,
  MoreVertical,
  Edit2,
  Trash2,
  PinOff,
} from "lucide-react";

import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";


import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { DetailedCounterpartyCard } from "@/app/components/DetailedCounterpartyCard";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ScrollRow } from "@/app/components/ScrollRow";
import { Textarea } from "@/app/components/ui/textarea";
import { FeedbackModal, ReviewDraft } from "@/app/components/FeedbackModal";
import { parseSearchQuery, getSearchTypeLabel } from "@/app/utils/counterpartySearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

type Exchange = "all" | "htx" | "bybit" | "others" | "okx" | "gate" | "mexc" | "bitget";

type GlobalMessage = {
  id: string;
  userId: string;
  username: string;
  teamId: string;
  teamName: string;
  text: string;
  createdAt: string;
  isPinned: boolean;
};

const LS_PENDING_REVIEW = "loupe.pending_review";
const LS_REVIEWS = "loupe.reviews";

function loadPendingReview(): { dealId: string; exchange: string; uid?: string; nickname?: string } | null {
  try {
    const raw = localStorage.getItem(LS_PENDING_REVIEW);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveReview(draft: ReviewDraft) {
  const existingRaw = localStorage.getItem(LS_REVIEWS);
  const existing: ReviewDraft[] = existingRaw ? JSON.parse(existingRaw) : [];
  existing.push(draft);
  localStorage.setItem(LS_REVIEWS, JSON.stringify(existing));
}

function clearPendingReview() {
  localStorage.removeItem(LS_PENDING_REVIEW);
}

export function Home() {
  const [exchange, setExchange] = useState<Exchange>("all");
  const [otherExchangesOpen, setOtherExchangesOpen] = useState(false);
  const [otherExchanges, setOtherExchanges] = useState<Array<Exclude<Exchange, "all" | "htx" | "bybit" | "others">>>(["okx","gate","mexc"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // === Демо-логика, имитируем поведение расширения ===
  // Если отзыв по завершенной/отмененной сделке не оставлен в расширении,
  // Mini App должен попросить оставить отзыв перед проверкой.
  const [pendingReview, setPendingReview] = useState<ReturnType<typeof loadPendingReview>>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    // Для теста: считаем, что расширение "оставило" обязательный отзыв, но пользователь его еще не заполнил.
    // Если в localStorage уже есть pendingReview — не трогаем.
    const existing = loadPendingReview();
    if (existing) {
      setPendingReview(existing);
      return;
    }

    const seed = {
      dealId: "456789",
      exchange: "htx",
      uid: "132465789",
      nickname: "billigans",
    };
    localStorage.setItem(LS_PENDING_REVIEW, JSON.stringify(seed));
    setPendingReview(seed);
  }, []);

  const todayStats = useMemo(
    () => ({
      checks: 47,
      deals: 23,
      risks: 5,
    }),
    [],
  );

  // Mock текущего пользователя (позже заменим на Telegram initData + API)
  const currentUser = useMemo(
    () => ({
      userId: "U-10241",
      username: "@akaihoodxd",
      teamId: "T-77",
      teamName: "Арбитражники",
    }),
    [],
  );

  // Общий чат (все пользователи). Пока мок, потом: GET/POST /api/v1/chat/global
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalMessages, setGlobalMessages] = useState<GlobalMessage[]>([
    {
      id: "m1",
      userId: "U-90001",
      username: "@p2p_wolf",
      teamId: "T-12",
      teamName: "Pro Traders",
      text: "Кто сейчас на HTX с нормальным курсом?",
      createdAt: "18:10",
      isPinned: false,
    },
    {
      id: "m2",
      userId: currentUser.userId,
      username: currentUser.username,
      teamId: currentUser.teamId,
      teamName: currentUser.teamName,
      text: "Тестим общий чат. Дальше подключим API и БД 🙂",
      createdAt: "18:12",
      isPinned: false,
    },
  ]);

  const [editingGlobalId, setEditingGlobalId] = useState<string | null>(null);
  const [editedGlobalText, setEditedGlobalText] = useState("");
  const [deleteGlobalId, setDeleteGlobalId] = useState<string | null>(null);

  const sendGlobalMessage = () => {
    const text = globalMessage.trim();
    if (!text) return;

    setGlobalMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        userId: currentUser.userId,
        username: currentUser.username,
        teamId: currentUser.teamId,
        teamName: currentUser.teamName,
        text,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isPinned: false,
      },
    ]);
    setGlobalMessage("");
  };

  const startEditGlobal = (id: string, text: string) => {
    setEditingGlobalId(id);
    setEditedGlobalText(text);
  };

  const saveEditGlobal = () => {
    if (!editingGlobalId) return;
    const text = editedGlobalText.trim();
    if (!text) return;

    setGlobalMessages((prev) =>
      prev.map((m) => (m.id === editingGlobalId ? { ...m, text } : m)),
    );
    setEditingGlobalId(null);
    setEditedGlobalText("");
  };

  const cancelEditGlobal = () => {
    setEditingGlobalId(null);
    setEditedGlobalText("");
  };

  const deleteGlobalMessage = (id: string) => {
    setGlobalMessages((prev) => prev.filter((m) => m.id !== id));
    setDeleteGlobalId(null);
  };

  const unpinGlobalMessage = (id: string) => {
    setGlobalMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPinned: false } : m)),
    );
  };

  const requireReviewBeforeCheck = () => {
    const pr = loadPendingReview();
    if (!pr) return false;
    setPendingReview(pr);
    setReviewModalOpen(true);
    return true;
  };

  const handleCheck = async () => {
    // Блокируем проверки, если висит обязательный отзыв
    if (requireReviewBeforeCheck()) return;
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    const parsed = parseSearchQuery(searchQuery);
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
          comment: "Быстрая сделка, все отлично",
          date: "20.01.2026",
          rating: 5,
          tags: ["ok"],
        },
        {
          id: "2",
          trader: "P2P Traders",
          outcome: "dispute" as const,
          comment: "Долго переводил, начался спор",
          date: "18.01.2026",
          rating: 2,
          tags: ["delay"],
        },
        {
          id: "3",
          trader: "Команда Трейдеры",
          outcome: "cancelled" as const,
          comment: "Не вышел на связь",
          date: "15.01.2026",
          rating: 1,
          tags: ["disappeared"],
        },
      ],
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
          style={{ background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
        >
          <Eye className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-[var(--color-primary)]" />
          <p className="text-xs text-muted-foreground mb-1">Проверок сегодня</p>
          <p className="text-xl md:text-2xl font-black">{todayStats.checks}</p>
        </div>

        <div
          className="backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 border text-center"
          style={{ background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
        >
          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-[var(--success)]" />
          <p className="text-xs text-muted-foreground mb-1">Сделок сегодня</p>
          <p className="text-xl md:text-2xl font-black">{todayStats.deals}</p>
        </div>

        <div
          className="backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 border text-center"
          style={{ background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
        >
          <Shield className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-[var(--destructive)]" />
          <p className="text-xs text-muted-foreground mb-1">Найдено рисков</p>
          <p className="text-xl md:text-2xl font-black text-[var(--destructive)]">
            {todayStats.risks}
          </p>
        </div>
      </div>

      {/* Counterparty Check */}
      <div
        className="backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border"
        style={{ background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
      >
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="p-3 rounded-xl" style={{ background: "var(--gradient-card)" }}>
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">Проверка контрагента</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              По UID, нику, телефону, карте, ФИО или ссылке
            </p>
          </div>
        </div>

        <div className="mb-4">
          <ScrollRow hint={false}>
            <button
              onClick={() => setExchange("all")}
              className={"px-3 py-2 rounded-xl border text-sm whitespace-nowrap " + (exchange === "all" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "")}
              style={{ borderColor: "var(--border)", background: exchange === "all" ? "var(--primary)" : "var(--muted)" }}
            >
              Все
            </button>
            <button
              onClick={() => setExchange("htx")}
              className={"px-3 py-2 rounded-xl border text-sm whitespace-nowrap " + (exchange === "htx" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "")}
              style={{ borderColor: "var(--border)", background: exchange === "htx" ? "var(--primary)" : "var(--muted)" }}
            >
              HTX
            </button>
            <button
              onClick={() => setExchange("bybit")}
              className={"px-3 py-2 rounded-xl border text-sm whitespace-nowrap " + (exchange === "bybit" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "")}
              style={{ borderColor: "var(--border)", background: exchange === "bybit" ? "var(--primary)" : "var(--muted)" }}
            >
              ByBit
            </button>
            <button
              onClick={() => {
                setExchange("others");
                setOtherExchangesOpen(true);
              }}
              className={"px-3 py-2 rounded-xl border text-sm whitespace-nowrap " + (exchange === "others" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "")}
              style={{ borderColor: "var(--border)", background: exchange === "others" ? "var(--primary)" : "var(--muted)" }}
            >
              Другие
            </button>
          </ScrollRow>

          <Dialog open={otherExchangesOpen} onOpenChange={setOtherExchangesOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Выберите биржи</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                {([
                  { id: "okx", label: "OKX" },
                  { id: "gate", label: "Gate" },
                  { id: "mexc", label: "MEXC" },
                  { id: "bitget", label: "Bitget" },
                ] as const).map((x) => {
                  const checked = otherExchanges.includes(x.id);
                  return (
                    <label key={x.id} className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ borderColor: "var(--destructive)", background: "rgba(255,82,82,0.10)" }}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const next = v
                            ? Array.from(new Set([...otherExchanges, x.id]))
                            : otherExchanges.filter((e) => e !== x.id);
                          setOtherExchanges(next);
                        }}
                      />
                      <div className="font-semibold">{x.label}</div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOtherExchangesOpen(false)}>
                  Закрыть
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setOtherExchangesOpen(false)}
                  style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
                >
                  Готово
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {exchange === "others" && (
            <div className="mt-2 text-xs text-muted-foreground">
              Выбрано: {otherExchanges.length ? otherExchanges.join(", ").toUpperCase() : "ничего"}
            </div>
          )}
        </div>

        <div className="flex gap-2 md:gap-3 mb-4">
          <Input
            placeholder="UID, ник, телефон, карта, ФИО или ссылка..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            className="flex-1"
          />
          <Button
            onClick={handleCheck}
            disabled={isLoading}
            className="px-4 md:px-6"
            style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {searchQuery && (
          <p className="text-xs text-muted-foreground mb-4">
            Поиск {getSearchTypeLabel(parseSearchQuery(searchQuery).type)}: {" "}
            <span className="font-mono">{parseSearchQuery(searchQuery).normalized}</span>
          </p>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto" />
          </div>
        )}

        {result && !isLoading && <DetailedCounterpartyCard data={result} />}

        {/* Мягкое уведомление, если висит обязательный отзыв */}
        {pendingReview && (
          <div className="mt-4 rounded-xl border p-3 text-sm"
               style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="font-semibold">Нужно оставить отзыв</div>
            <div className="text-muted-foreground mt-1">
              У вас есть завершённая/отменённая сделка без отзыва. Пока отзыв не будет отправлен,
              проверки контрагентов заблокированы.
            </div>
            <div className="mt-3">
              <Button
                onClick={() => setReviewModalOpen(true)}
                style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
              >
                Оставить отзыв
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Global Chat */}
      <div
        className="backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border"
        style={{ background: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold">Общий чат трейдеров</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Виден всем пользователям • ник • команда • ID
            </p>
          </div>
        </div>

        <div
          className="rounded-xl border p-3 md:p-4 space-y-3 max-h-64 overflow-y-auto"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          {globalMessages.map((m) => {
            const isMine = m.userId === currentUser.userId;
            const isEditing = editingGlobalId === m.id;

            return (
              <div key={m.id} className="text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight">
                      <span className="text-[var(--color-primary)]">{m.username}</span>{" "}
                      <span className="text-muted-foreground font-medium">
                        • {m.teamName} • {m.userId}
                      </span>
                      {m.isPinned && (
                        <span
                          className="ml-2 text-[10px] px-2 py-0.5 rounded-full border"
                          style={{ borderColor: "var(--border)" }}
                        >
                          закреплено
                        </span>
                      )}
                    </div>
                  </div>

                  {isMine && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="h-8 w-8 rounded-lg border flex items-center justify-center shrink-0"
                          style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                          aria-label="Действия"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditGlobal(m.id, m.text)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>

                        {m.isPinned && (
                          <DropdownMenuItem onClick={() => unpinGlobalMessage(m.id)}>
                            <PinOff className="w-4 h-4 mr-2" />
                            Открепить
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => setDeleteGlobalId(m.id)}
                          className="text-[var(--destructive)]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="mt-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedGlobalText}
                        onChange={(e) => setEditedGlobalText(e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEditGlobal}>
                          Сохранить
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditGlobal}>
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-foreground whitespace-pre-wrap">{m.text}</div>
                      <div className="text-xs text-muted-foreground mt-1">{m.createdAt}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-3">
          <Input
            placeholder="Написать в общий чат..."
            value={globalMessage}
            onChange={(e) => setGlobalMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendGlobalMessage()}
            className="flex-1"
          />
          <Button
            onClick={sendGlobalMessage}
            style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
          >
            Отправить
          </Button>
        </div>

        <AlertDialog open={!!deleteGlobalId} onOpenChange={(open) => !open && setDeleteGlobalId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить сообщение?</AlertDialogTitle>
              <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteGlobalId && deleteGlobalMessage(deleteGlobalId)}
                style={{ background: "var(--destructive)", color: "var(--destructive-foreground)" }}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Review Modal */}
      {pendingReview && (
        <FeedbackModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          dealId={pendingReview.dealId}
          exchange={pendingReview.exchange}
          counterpartyUid={pendingReview.uid}
          counterpartyNickname={pendingReview.nickname}
          onSubmit={(draft) => {
            saveReview(draft);
            clearPendingReview();
            setPendingReview(null);
          }}
          onSkip={() => {
            // Пропуск не снимает блокировку: оставляем pendingReview
            setReviewModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;
