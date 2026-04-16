"use client";

import { useState } from "react";
import { X, Gift, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, ItemFrame, RedDot } from "../ui-components";

// 签到奖励数据
const signRewards = [
  { day: 1, name: "金币", icon: "gold", count: 1000, quality: 2 as const },
  { day: 2, name: "体力", icon: "stamina", count: 50, quality: 2 as const },
  { day: 3, name: "抽卡券", icon: "ticket", count: 1, quality: 3 as const },
  { day: 4, name: "金币", icon: "gold", count: 2000, quality: 2 as const },
  { day: 5, name: "钻石", icon: "diamond", count: 100, quality: 3 as const },
  { day: 6, name: "体力", icon: "stamina", count: 100, quality: 2 as const },
  { day: 7, name: "稀有英雄", icon: "hero", count: 1, quality: 5 as const },
];

interface SignInDaysPopupProps {
  currentDay: number;
  onClose: () => void;
  onClaim: (day: number) => void;
}

export function SignInDaysPopup({
  currentDay = 3,
  onClose,
  onClaim,
}: SignInDaysPopupProps) {
  const [claimedDays, setClaimedDays] = useState<number[]>([1, 2]);
  const [claiming, setClaiming] = useState<number | null>(null);

  const handleClaim = (day: number) => {
    if (claimedDays.includes(day) || day > currentDay) return;
    setClaiming(day);
    setTimeout(() => {
      setClaimedDays((prev) => [...prev, day]);
      setClaiming(null);
      onClaim(day);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[95%] max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* 标题栏 */}
        <div className="relative flex items-center justify-center px-4 py-4 border-b border-border bg-gradient-to-b from-primary/10 to-transparent">
          <h2 className="text-xl font-bold">每日签到</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 签到进度 */}
        <div className="px-4 py-3 bg-card/50 border-b border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">当前进度</span>
            <span className="text-primary font-medium">
              第 {currentDay} 天 / 共 7 天
            </span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${(claimedDays.length / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* 签到网格 */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {signRewards.map((reward) => {
              const isClaimed = claimedDays.includes(reward.day);
              const isCurrent = reward.day === currentDay && !isClaimed;
              const isLocked = reward.day > currentDay;

              return (
                <div
                  key={reward.day}
                  className={cn(
                    "relative flex flex-col items-center p-2 rounded-xl border transition-all",
                    isClaimed && "bg-success/10 border-success/30",
                    isCurrent && "bg-primary/10 border-primary/50 ring-2 ring-primary/50",
                    isLocked && "bg-muted/30 border-border/30 opacity-60",
                    !isClaimed && !isCurrent && !isLocked && "bg-card border-border"
                  )}
                >
                  {/* 红点 */}
                  {isCurrent && <RedDot className="absolute -top-1 -right-1" />}

                  {/* 天数标签 */}
                  <span className={cn(
                    "absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold rounded-full",
                    isClaimed && "bg-success text-white",
                    isCurrent && "bg-primary text-primary-foreground",
                    isLocked && "bg-muted text-muted-foreground",
                    !isClaimed && !isCurrent && !isLocked && "bg-card border border-border text-muted-foreground"
                  )}>
                    第{reward.day}天
                  </span>

                  {/* 奖励内容 */}
                  <div className="mt-4 mb-2">
                    {isLocked ? (
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ) : isClaimed ? (
                      <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-success" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(reward.day)}
                        disabled={claiming !== null}
                        className={cn(
                          "w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all",
                          isCurrent && "bg-primary/20 hover:bg-primary/30",
                          !isCurrent && "bg-card hover:bg-muted"
                        )}
                      >
                        <span className="text-lg">
                          {reward.icon === "gold" && "💰"}
                          {reward.icon === "diamond" && "💎"}
                          {reward.icon === "stamina" && "⚡"}
                          {reward.icon === "ticket" && "🎫"}
                          {reward.icon === "hero" && "🦸"}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* 奖励名称 */}
                  <span className="text-[10px] text-muted-foreground truncate max-w-full">
                    {reward.name}
                  </span>
                  <span className="text-xs font-medium">x{reward.count}</span>
                </div>
              );
            })}
          </div>

          {/* 第7天特殊展示 */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🦸</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">累计签到7天奖励</p>
                <p className="text-xs text-muted-foreground">可获得稀有英雄一位！</p>
              </div>
              {claimedDays.length === 7 && (
                <div className="flex items-center gap-1 text-success text-sm">
                  <Check className="w-4 h-4" />
                  已领取
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-4 pb-4">
          <HexButton
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            关闭
          </HexButton>
        </div>
      </div>
    </div>
  );
}
