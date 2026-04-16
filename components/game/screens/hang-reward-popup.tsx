"use client";

import { X, Clock, Gift, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard } from "../ui-components";

interface HangRewardPopupProps {
  hangTime: number; // in seconds
  onClose: () => void;
  onCollect: () => void;
}

interface RewardItem {
  icon: string;
  name: string;
  amount: number;
}

export function HangRewardPopup({
  hangTime,
  onClose,
  onCollect,
}: HangRewardPopupProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const rewards: RewardItem[] = [
    { icon: "$", name: "金币", amount: Math.floor(hangTime * 2.5) },
    { icon: "★", name: "经验", amount: Math.floor(hangTime * 1.8) },
    { icon: "◆", name: "材料", amount: Math.floor(hangTime / 300) },
    { icon: "⬡", name: "精华", amount: Math.floor(hangTime / 600) },
  ];

  const maxTime = 28800; // 8 hours
  const isFull = hangTime >= maxTime;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-sm mx-4 animate-in zoom-in-95 fade-in duration-300">
        <GlowCard
          glowColor={isFull ? "warning" : "accent"}
          className="overflow-hidden"
        >
          {/* Header */}
          <div
            className={cn(
              "relative p-4 border-b border-border/50",
              isFull
                ? "bg-gradient-to-r from-warning/20 to-orange-500/10"
                : "bg-gradient-to-r from-accent/10 to-primary/10"
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isFull && (
              <div className="flex items-center gap-2 text-warning mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">收益已满</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  isFull
                    ? "bg-warning/20 border-warning/30"
                    : "bg-accent/20 border-accent/30"
                )}
              >
                <Clock
                  className={cn(
                    "w-6 h-6",
                    isFull ? "text-warning" : "text-accent"
                  )}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">挂机收益</h2>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isFull ? "text-warning" : "text-accent"
                  )}
                >
                  {formatTime(hangTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Rewards List */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">可领取奖励</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {rewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-xl">
                    {reward.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{reward.name}</p>
                    <p className="text-lg font-bold text-foreground">
                      +{reward.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Collect Button */}
            <HexButton
              variant={isFull ? "warning" : "primary"}
              className="w-full"
              onClick={onCollect}
            >
              <Gift className="w-5 h-5 mr-2" />
              立即领取
            </HexButton>
          </div>

          {/* Footer Hint */}
          {isFull && (
            <div className="p-3 bg-warning/10 border-t border-warning/30">
              <p className="text-xs text-center text-warning">
                收益已达上限，请及时领取以继续累积！
              </p>
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
