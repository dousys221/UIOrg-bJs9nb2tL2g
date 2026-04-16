"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  Clock,
  ChevronLeft,
  X,
  Star,
  Crown,
  Zap,
  Coins,
  Diamond,
  Target,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard, ProgressBar, RedDot, ItemFrame } from "../ui-components";

// ========== 运营聚合页 ==========
interface OperatingPanelProps {
  onBack: () => void;
  onOpenFirstRecharge: () => void;
  onOpenDailyRecharge: () => void;
  onOpenOnlineReward: () => void;
}

export function OperatingPanel({
  onBack,
  onOpenFirstRecharge,
  onOpenDailyRecharge,
  onOpenOnlineReward,
}: OperatingPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: "first", label: "首充", redDot: true, onClick: onOpenFirstRecharge },
    { id: "daily", label: "每日充值", redDot: false, onClick: onOpenDailyRecharge },
    { id: "online", label: "在线奖励", redDot: true, onClick: onOpenOnlineReward },
    { id: "eight", label: "八日礼包", redDot: false, onClick: () => {} },
    { id: "festival", label: "节日活动", redDot: false, onClick: () => {} },
  ];

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-card/80 border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">活动中心</h1>
        <div className="w-10" />
      </div>

      {/* 左侧Tab + 右侧内容 */}
      <div className="relative z-10 flex h-full pt-16 pb-4">
        {/* Tab列表 */}
        <div className="w-20 shrink-0 px-2 space-y-2 overflow-y-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(idx);
                tab.onClick?.();
              }}
              className={cn(
                "relative w-full py-3 text-sm font-medium rounded-lg transition-all",
                activeTab === idx
                  ? "bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {tab.label}
              {tab.redDot && <RedDot className="absolute -top-1 -right-1" />}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Gift className="w-16 h-16 mb-4 opacity-30" />
            <p>选择左侧活动查看详情</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== 首充页 ==========
interface FirstRechargePanelProps {
  onBack: () => void;
  onRecharge: () => void;
}

export function FirstRechargePanel({ onBack, onRecharge }: FirstRechargePanelProps) {
  const [activeTier, setActiveTier] = useState(0);
  const [claimed, setClaimed] = useState(false);

  const tiers = [
    { price: 6, hero: "精英战士", bonus: "额外300钻石" },
    { price: 30, hero: "传奇英雄", bonus: "额外2000钻石" },
    { price: 68, hero: "神话领主", bonus: "额外5000钻石+专属皮肤" },
  ];

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-card/80 border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">首充奖励</h1>
        <div className="w-10" />
      </div>

      {/* 档位选择 */}
      <div className="relative z-10 px-4 mt-4">
        <div className="flex gap-2">
          {tiers.map((tier, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTier(idx)}
              className={cn(
                "flex-1 py-2 text-center rounded-lg text-sm font-medium transition-all",
                activeTier === idx
                  ? "bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground border border-border"
              )}
            >
              ¥{tier.price}
            </button>
          ))}
        </div>
      </div>

      {/* 英雄展示 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 mt-8">
        <div className="w-48 h-64 rounded-2xl bg-gradient-to-b from-primary/20 to-card border border-primary/30 flex flex-col items-center justify-center mb-6">
          <div className="text-8xl mb-4">🦸</div>
          <p className="text-xl font-bold">{tiers[activeTier].hero}</p>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-gold-primary" />
            ))}
          </div>
        </div>

        <GlowCard className="w-full mb-6" glowColor="gold">
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">首充特惠</p>
            <p className="text-primary font-medium">{tiers[activeTier].bonus}</p>
          </div>
        </GlowCard>
      </div>

      {/* 底部按钮 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-4 px-6">
        <HexButton
          variant="primary"
          className="w-full"
          onClick={() => {
            onRecharge();
            setClaimed(true);
          }}
          disabled={claimed}
        >
          <Coins className="w-4 h-4 mr-2" />
          {claimed ? "已领取" : `充值 ¥${tiers[activeTier].price}`}
        </HexButton>
      </div>
    </div>
  );
}

// ========== 在线奖励页 ==========
interface OnlineRewardPanelProps {
  onBack: () => void;
  onClaim: (index: number) => void;
  onClaimAll: () => void;
}

export function OnlineRewardPanel({
  onBack,
  onClaim,
  onClaimAll,
}: OnlineRewardPanelProps) {
  const [onlineTime, setOnlineTime] = useState(1800); // 30分钟
  const [claimedIndexes, setClaimedIndexes] = useState<number[]>([]);

  const rewards = [
    { time: 5, name: "金币", count: 1000, icon: "gold" },
    { time: 10, name: "体力", count: 30, icon: "stamina" },
    { time: 15, name: "钻石", count: 50, icon: "diamond" },
    { time: 30, name: "抽卡券", count: 1, icon: "ticket" },
    { time: 60, name: "稀有装备", count: 1, icon: "equipment" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const canClaimAll = rewards.some((r, idx) => onlineTime / 60 >= r.time && !claimedIndexes.includes(idx));

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-card/80 border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">在线奖励</h1>
        <div className="w-10" />
      </div>

      {/* 在线时间 */}
      <div className="relative z-10 px-4 mt-4">
        <GlowCard className="p-4" glowColor="blue">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-medium">在线时长</span>
            </div>
            <span className="text-2xl font-bold text-accent">{formatTime(onlineTime)}</span>
          </div>
        </GlowCard>
      </div>

      {/* 奖励列表 */}
      <div className="relative z-10 px-4 mt-6 space-y-3 overflow-y-auto max-h-[50vh]">
        {rewards.map((reward, idx) => {
          const canClaim = onlineTime / 60 >= reward.time && !claimedIndexes.includes(idx);
          const claimed = claimedIndexes.includes(idx);

          return (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-all",
                claimed ? "bg-success/10 border-success/30" : "bg-card/50 border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  claimed ? "bg-success/20" : "bg-primary/20"
                )}>
                  {reward.icon === "gold" && <Coins className="w-6 h-6 text-gold-primary" />}
                  {reward.icon === "stamina" && <Zap className="w-6 h-6 text-success" />}
                  {reward.icon === "diamond" && <Diamond className="w-6 h-6 text-accent" />}
                  {reward.icon === "ticket" && <Gift className="w-6 h-6 text-primary" />}
                  {reward.icon === "equipment" && <Star className="w-6 h-6 text-purple-500" />}
                </div>
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">
                    在线 {reward.time} 分钟
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">x{reward.count}</p>
                <HexButton
                  variant={canClaim ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => {
                    onClaim(idx);
                    setClaimedIndexes((prev) => [...prev, idx]);
                  }}
                  disabled={!canClaim || claimed}
                >
                  {claimed ? "已领" : canClaim ? "领取" : "未达"}
                </HexButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部一键领取 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-4 px-6">
        <HexButton
          variant="primary"
          className="w-full"
          onClick={() => {
            rewards.forEach((r, idx) => {
              if (onlineTime / 60 >= r.time && !claimedIndexes.includes(idx)) {
                setClaimedIndexes((prev) => [...prev, idx]);
              }
            });
            onClaimAll();
          }}
          disabled={!canClaimAll}
        >
          <Gift className="w-4 h-4 mr-2" />
          一键领取
        </HexButton>
      </div>
    </div>
  );
}
