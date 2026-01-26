import { useState } from "react";
import {
  Settings as SettingsIcon,
  Crown,
  Mail,
  MessageCircle,
  Check,
  Copy,
  CreditCard,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

type SubscriptionPlan = "light" | "basic" | "pro";
type Network = "trc20" | "bep20";
type PaymentStatus = "idle" | "pending" | "confirming" | "confirmed";

const plans = {
  light: {
    name: "Light",
    price: 990,
    features: [
      "До 50 проверок/месяц",
      "До 20 сделок/месяц",
      "Базовая статистика",
      "Email поддержка",
    ],
    icon: Zap,
    color: "var(--info)",
  },
  basic: {
    name: "Basic",
    price: 2490,
    features: [
      "До 200 проверок/месяц",
      "До 100 сделок/месяц",
      "Расширенная статистика",
      "Командная работа (до 3 чел.)",
      "Приоритетная поддержка",
    ],
    icon: Star,
    color: "var(--warning)",
  },
  pro: {
    name: "Pro",
    price: 4990,
    features: [
      "Безлимитные проверки",
      "Безлимитные сделки",
      "Полная аналитика",
      "Командная работа (безлимит)",
      "VIP поддержка 24/7",
      "API доступ",
    ],
    icon: Crown,
    color: "var(--color-primary)",
  },
};

const wallets = {
  trc20: "TYourWalletAddressHere123456789",
  bep20: "0xYourWalletAddressHere123456789",
};

export function Settings() {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("basic");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("trc20");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [copied, setCopied] = useState(false);

  const handleChangePlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
    setPaymentStatus("idle");
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(wallets[selectedNetwork]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirmation = () => {
    setPaymentStatus("confirming");
    
    // Simulate payment confirmation (5 seconds)
    setTimeout(() => {
      setPaymentStatus("confirmed");
      if (selectedPlan) {
        setCurrentPlan(selectedPlan);
      }
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowPaymentDialog(false);
        setPaymentStatus("idle");
        setSelectedPlan(null);
      }, 2000);
    }, 5000);
  };

  const handleCancelSubscription = () => {
    setCurrentPlan("light");
    setShowCancelDialog(false);
  };

  const planPrice = selectedPlan ? plans[selectedPlan].price : 0;
  const usdtAmount = (planPrice / 85.64).toFixed(2); // Convert RUB to USDT

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black mb-1">Настройки</h2>
        <p className="text-sm text-muted-foreground">
          Управление подпиской и поддержка
        </p>
      </div>

      {/* Current Subscription */}
      <div
        className="backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border"
        style={{
          background: "var(--gradient-card)",
          borderColor: "var(--glass-border)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {(() => {
              const CurrentPlanIcon = plans[currentPlan].icon;
              return (
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "var(--card)" }}
                >
                  <CurrentPlanIcon
                    className="w-6 h-6"
                    style={{ color: plans[currentPlan].color }}
                  />
                </div>
              );
            })()}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg md:text-xl font-black">
                  {plans[currentPlan].name}
                </h3>
                <Badge
                  style={{
                    background: plans[currentPlan].color,
                    color: "#000",
                  }}
                >
                  Активна
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {plans[currentPlan].price} ₽/месяц
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {plans[currentPlan].features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 shrink-0" style={{ color: plans[currentPlan].color }} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowCancelDialog(true)}
          style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}
        >
          Отменить подписку
        </Button>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-bold mb-3">Доступные планы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(plans) as SubscriptionPlan[]).map((planKey) => {
            const plan = plans[planKey];
            const isActive = currentPlan === planKey;
            const PlanIcon = plan.icon;

            return (
              <div
                key={planKey}
                className={`backdrop-blur-xl rounded-xl p-4 md:p-6 border transition-all ${
                  isActive ? "ring-2" : ""
                }`}
                style={{
                  background: isActive ? "var(--gradient-card)" : "var(--glass-bg)",
                  borderColor: isActive ? plan.color : "var(--glass-border)",
                  ringColor: isActive ? plan.color : "transparent",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <PlanIcon className="w-5 h-5" style={{ color: plan.color }} />
                  <h4 className="font-black text-lg">{plan.name}</h4>
                </div>

                <p className="text-2xl font-black mb-4" style={{ color: plan.color }}>
                  {plan.price} ₽
                  <span className="text-sm font-normal text-muted-foreground">/мес</span>
                </p>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {!isActive && (
                  <Button
                    className="w-full font-bold"
                    onClick={() => handleChangePlan(planKey)}
                    style={{
                      background: plan.color,
                      color: "#000",
                    }}
                  >
                    Выбрать план
                  </Button>
                )}

                {isActive && (
                  <div className="text-center text-sm font-bold" style={{ color: plan.color }}>
                    ✓ Текущий план
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div
        className="backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
        }}
      >
        <h3 className="text-lg font-bold mb-4">Помощь и поддержка</h3>
        
        <div className="space-y-3">
          <a
            href="https://t.me/loupe_support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors"
          >
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-card)" }}
            >
              <MessageCircle className="w-5 h-5 text-[var(--info)]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Telegram поддержка</p>
              <p className="text-xs text-muted-foreground">Напишите нам в Telegram</p>
            </div>
          </a>

          <a
            href="mailto:support@loupe.app"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors"
          >
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-card)" }}
            >
              <Mail className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Email</p>
              <p className="text-xs text-muted-foreground">support@loupe.app</p>
            </div>
          </a>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentStatus === "confirmed" ? "Оплата подтверждена!" : "Оплата подписки"}
            </DialogTitle>
            <DialogDescription>
              {paymentStatus === "confirmed"
                ? `Ваш план ${selectedPlan ? plans[selectedPlan].name : ""} активирован`
                : `Оплатите ${usdtAmount} USDT для активации плана ${selectedPlan ? plans[selectedPlan].name : ""}`}
            </DialogDescription>
          </DialogHeader>

          {paymentStatus === "confirmed" ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "var(--success)" }}
              >
                <Check className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-bold">Спасибо за оплату!</p>
            </div>
          ) : paymentStatus === "confirming" ? (
            <div className="text-center py-8">
              <div className="animate-spin w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="font-bold">Подтверждение оплаты...</p>
              <p className="text-sm text-muted-foreground">Это займет несколько секунд</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Network Selection */}
              <div>
                <p className="text-sm font-bold mb-2">Выберите сеть</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedNetwork("trc20")}
                    className="p-3 rounded-xl border font-bold text-sm transition-all"
                    style={
                      selectedNetwork === "trc20"
                        ? {
                            background: "var(--gradient-card)",
                            borderColor: "var(--color-primary)",
                            color: "var(--color-primary)",
                          }
                        : {
                            background: "var(--muted)",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    TRC20
                  </button>
                  <button
                    onClick={() => setSelectedNetwork("bep20")}
                    className="p-3 rounded-xl border font-bold text-sm transition-all"
                    style={
                      selectedNetwork === "bep20"
                        ? {
                            background: "var(--gradient-card)",
                            borderColor: "var(--color-primary)",
                            color: "var(--color-primary)",
                          }
                        : {
                            background: "var(--muted)",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    BEP20
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div
                className="p-4 rounded-xl border text-center"
                style={{
                  background: "var(--gradient-card)",
                  borderColor: "var(--color-primary)",
                }}
              >
                <p className="text-xs text-muted-foreground mb-1">Сумма к оплате</p>
                <p className="text-3xl font-black text-[var(--color-primary)]">
                  {usdtAmount} USDT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {planPrice} ₽
                </p>
              </div>

              {/* Wallet Address */}
              <div>
                <p className="text-sm font-bold mb-2">Адрес кошелька</p>
                <div
                  className="p-3 rounded-xl border break-all text-sm font-mono"
                  style={{
                    background: "var(--muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  {wallets[selectedNetwork]}
                </div>
                <Button
                  onClick={handleCopyWallet}
                  variant="outline"
                  className="w-full mt-2"
                  style={
                    copied
                      ? { background: "var(--success)", color: "#fff", borderColor: "var(--success)" }
                      : {}
                  }
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Копировать адрес
                    </>
                  )}
                </Button>
              </div>

              {/* Payment Instructions */}
              <div
                className="p-3 rounded-xl text-xs space-y-1"
                style={{
                  background: "var(--muted)",
                  borderLeft: "3px solid var(--color-primary)",
                }}
              >
                <p className="font-bold">Инструкция:</p>
                <p>1. Отправьте {usdtAmount} USDT на адрес выше</p>
                <p>2. Убедитесь, что выбрали сеть {selectedNetwork.toUpperCase()}</p>
                <p>3. Нажмите "Я оплатил" после отправки</p>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePaymentConfirmation}
                className="w-full font-bold text-black"
                style={{ background: "var(--gradient-primary)" }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Я оплатил
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                LOUPE не предназначен для сбора PII или защиты конфиденциальных данных
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить подписку?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить подписку {plans[currentPlan].name}? 
              Вы будете переведены на план Light.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Назад</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              style={{ background: "var(--destructive)" }}
            >
              Отменить подписку
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}