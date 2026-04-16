"use client";

import { X, Gift, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, ItemFrame, GlowCard } from "../ui-components";

interface MailDetailPopupProps {
  mailId: number;
  title: string;
  content: string;
  rewards: { name: string; icon: string; count: number; quality?: 1 | 2 | 3 | 4 | 5 }[];
  onClose: () => void;
  onClaim: () => void;
  onDelete: () => void;
  claimed?: boolean;
}

export function MailDetailPopup({
  mailId,
  title,
  content,
  rewards,
  onClose,
  onClaim,
  onDelete,
  claimed = false,
}: MailDetailPopupProps) {
  const hasRewards = rewards.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[90%] max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
          <h2 className="text-lg font-bold truncate">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-4">
          <GlowCard className="mb-4" glowColor="blue">
            <div className="p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {content || "暂无内容"}
            </div>
          </GlowCard>

          {/* 附件列表 */}
          {hasRewards && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">附件</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rewards.map((reward, idx) => (
                  <ItemFrame
                    key={idx}
                    quality={reward.quality || 3}
                    onClick={() => {}}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg">
                        {reward.icon === "gold" && "💰"}
                        {reward.icon === "diamond" && "💎"}
                        {reward.icon === "stamina" && "⚡"}
                        {reward.icon === "exp" && "⭐"}
                        {!["gold", "diamond", "stamina", "exp"].includes(reward.icon) && "📦"}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1">{reward.name}</span>
                    </div>
                    <span className="absolute bottom-0 right-1 text-xs font-bold text-foreground">
                      x{reward.count}
                    </span>
                  </ItemFrame>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            {hasRewards && !claimed && (
              <HexButton
                variant="primary"
                className="flex-1"
                onClick={onClaim}
              >
                <Gift className="w-4 h-4 mr-2" />
                领取附件
              </HexButton>
            )}
            {hasRewards && claimed && (
              <HexButton
                variant="secondary"
                className="flex-1"
                disabled
              >
                已领取
              </HexButton>
            )}
            <HexButton
              variant="secondary"
              className={hasRewards && !claimed ? "" : "flex-1"}
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除
            </HexButton>
          </div>
        </div>
      </div>
    </div>
  );
}
