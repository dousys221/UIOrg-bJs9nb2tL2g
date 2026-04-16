"use client";

import { X, Gift, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowCard } from "../ui-components";

interface RewardItem {
  id: number;
  name: string;
  icon: string;
  count: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  isFixed: boolean;
}

interface RewardPreviewPopupProps {
  levelName: string;
  onClose: () => void;
}

const RARITY_COLORS = {
  common: "border-gray-500/50 bg-gray-500/10",
  uncommon: "border-green-500/50 bg-green-500/10",
  rare: "border-blue-500/50 bg-blue-500/10",
  epic: "border-purple-500/50 bg-purple-500/10",
  legendary: "border-yellow-500/50 bg-yellow-500/10",
};

const RARITY_TEXT_COLORS = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

export function RewardPreviewPopup({
  levelName,
  onClose,
}: RewardPreviewPopupProps) {
  const fixedRewards: RewardItem[] = [
    { id: 1, name: "金币", icon: "$", count: 5000, rarity: "common", isFixed: true },
    { id: 2, name: "经验", icon: "★", count: 3000, rarity: "common", isFixed: true },
    { id: 3, name: "强化石", icon: "◆", count: 10, rarity: "uncommon", isFixed: true },
  ];

  const randomRewards: RewardItem[] = [
    { id: 4, name: "精英碎片", icon: "◇", count: 5, rarity: "rare", isFixed: false },
    { id: 5, name: "技能书", icon: "📕", count: 1, rarity: "epic", isFixed: false },
    { id: 6, name: "高级材料", icon: "⬡", count: 3, rarity: "rare", isFixed: false },
    { id: 7, name: "进阶石", icon: "▲", count: 2, rarity: "uncommon", isFixed: false },
    { id: 8, name: "传说碎片", icon: "✦", count: 1, rarity: "legendary", isFixed: false },
    { id: 9, name: "装备箱", icon: "📦", count: 1, rarity: "epic", isFixed: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-in zoom-in-95 fade-in duration-300">
        <GlowCard className="overflow-hidden">
          {/* Header */}
          <div className="relative p-4 border-b border-border/50 bg-card/50">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">掉落预览</h2>
                <p className="text-sm text-muted-foreground">{levelName}</p>
              </div>
            </div>
          </div>

          {/* Fixed Rewards */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">固定掉落</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {fixedRewards.map((reward) => (
                <RewardItemCard key={reward.id} reward={reward} />
              ))}
            </div>
          </div>

          {/* Random Rewards */}
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">随机掉落</span>
              <span className="text-xs text-muted-foreground">(按品质排序)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {randomRewards
                .sort((a, b) => {
                  const order = ["legendary", "epic", "rare", "uncommon", "common"];
                  return order.indexOf(a.rarity) - order.indexOf(b.rarity);
                })
                .map((reward) => (
                  <RewardItemCard key={reward.id} reward={reward} />
                ))}
            </div>
          </div>

          {/* Footer Hint */}
          <div className="p-3 bg-card/50 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              实际掉落以游戏内结算为准
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

function RewardItemCard({ reward }: { reward: RewardItem }) {
  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 transition-all hover:scale-105",
        RARITY_COLORS[reward.rarity]
      )}
    >
      {/* Icon */}
      <div className="text-2xl mb-1">{reward.icon}</div>

      {/* Name */}
      <p className="text-[10px] text-center truncate w-full">{reward.name}</p>

      {/* Count Badge */}
      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded bg-card border border-border text-[10px] font-medium">
        x{reward.count}
      </div>

      {/* Rarity Indicator */}
      <div
        className={cn(
          "absolute bottom-0.5 left-0 right-0 h-0.5 rounded-full mx-1",
          reward.rarity === "legendary" && "bg-yellow-500",
          reward.rarity === "epic" && "bg-purple-500",
          reward.rarity === "rare" && "bg-blue-500",
          reward.rarity === "uncommon" && "bg-green-500",
          reward.rarity === "common" && "bg-gray-500"
        )}
      />
    </div>
  );
}
