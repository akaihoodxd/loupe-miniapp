import * as React from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
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

export type ReviewTagId =
  | "scam"
  | "ok"
  | "delay"
  | "disappeared"
  | "rude"
  | "other";

export type ReviewDraft = {
  dealId: string;
  exchange: string;
  counterpartyUid?: string;
  counterpartyNickname?: string;
  rating: number; // 1..5
  tags: ReviewTagId[];
  comment: string;
};

const TAGS: Array<{ id: ReviewTagId; label: string }> = [
  { id: "scam", label: "Скам" },
  { id: "ok", label: "Все в порядке" },
  { id: "delay", label: "Долго выпускает" },
  { id: "disappeared", label: "Пропадает" },
  { id: "rude", label: "Грубит" },
  { id: "other", label: "Другое" },
];

function Star({ active }: { active: boolean }) {
  return (
    <span
      className={
        active ? "text-[var(--color-primary)]" : "text-muted-foreground"
      }
      style={{ fontSize: 18, lineHeight: "18px" }}
    >
      ★
    </span>
  );
}

export function FeedbackModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId: string;
  exchange: string;
  counterpartyUid?: string;
  counterpartyNickname?: string;
  onSubmit: (draft: ReviewDraft) => void;
  onSkip: () => void;
}) {
  const {
    open,
    onOpenChange,
    dealId,
    exchange,
    counterpartyUid,
    counterpartyNickname,
    onSubmit,
    onSkip,
  } = props;

  const [rating, setRating] = React.useState<number>(0);
  const [selectedTags, setSelectedTags] = React.useState<ReviewTagId[]>([]);
  const [comment, setComment] = React.useState<string>("");
  const [skipConfirmOpen, setSkipConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    // Reset on open
    setRating(0);
    setSelectedTags([]);
    setComment("");
    setSkipConfirmOpen(false);
  }, [open]);

  const toggleTag = (id: ReviewTagId) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const canSubmit = rating > 0 && selectedTags.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      dealId,
      exchange,
      counterpartyUid,
      counterpartyNickname,
      rating,
      tags: selectedTags,
      comment: comment.trim(),
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Оставьте отзыв о сделке</DialogTitle>
            <DialogDescription>
              Чтобы продолжить проверки, нужно оставить отзыв о последней
              завершённой/отменённой сделке.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border p-3"
                 style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="text-sm font-semibold">Сделка #{dealId}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Биржа: {exchange.toUpperCase()} • Контрагент: {counterpartyNickname || "—"}
                {counterpartyUid ? ` (UID ${counterpartyUid})` : ""}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Оценка</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="h-10 w-10 rounded-xl border flex items-center justify-center"
                    style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                    onClick={() => setRating(s)}
                    aria-label={`Оценка ${s}`}
                  >
                    <Star active={s <= rating} />
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                  Выберите количество звезд.
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Теги</div>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => {
                  const active = selectedTags.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={
                        "px-3 py-2 rounded-xl border text-sm" +
                        (active
                          ? " bg-primary text-primary-foreground"
                          : " bg-transparent text-foreground")
                      }
                      style={{ borderColor: "var(--border)" }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              {selectedTags.length === 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                  Выберите хотя бы один тег.
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Комментарий (опционально)</div>
              <Textarea
                placeholder="Коротко опишите ситуацию..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={submit}
                disabled={!canSubmit}
                style={{
                  background: "var(--gradient-primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                Отправить
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setSkipConfirmOpen(true)}
              >
                Пропустить
              </Button>
            </div>

            <div className="text-[11px] text-muted-foreground">
              * В продакшене этот запрос обычно приходит от расширения. Сейчас мы
              имитируем поведение: без отзыва проверки блокируются.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={skipConfirmOpen} onOpenChange={setSkipConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Пропустить отзыв?</AlertDialogTitle>
            <AlertDialogDescription>
              Если вы не оставите отзыв сейчас, проверки контрагентов будут
              заблокированы до момента, пока отзыв не будет отправлен.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Вернуться</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setSkipConfirmOpen(false);
                onSkip();
              }}
              style={{ background: "var(--destructive)", color: "var(--destructive-foreground)" }}
            >
              Пропустить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default FeedbackModal;
