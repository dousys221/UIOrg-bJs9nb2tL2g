"use client";

import { useState } from "react";
import {
  X,
  Zap,
  Gift,
  Crown,
  CheckCircle,
  Circle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard, ProgressBar } from "../ui-components";

interface FastExplorePopupProps {
  onClose: () => void;
  onTrain: () => void;
  onBuyPrivilege: () => void;
}

interface TaskItem {
  id: number;
  name: string;
  progress: number;
  target: number;
  completed: boolean;
}

export function FastExplorePopup({
  onClose,
  onTrain,
  onBuyPrivilege,
}: FastExplorePopupProps) {
  const [freeCount, setFreeCount] = useState(2);
  const [itemCount, setItemCount] = useState(5);
  const [privilegeCount, setPrivilegeCount] = useState(0);
  const [hasPrivilege, setHasPrivilege] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const [tasks] = useState<TaskItem[]>([
    { id: 1, name: "完成3次快速训练", progress: 2, target: 3, completed: false },
    { id: 2, name: "累计获得10000金币", progress: 10000, target: 10000, completed: true },
    { id: 3, name: "累计获得5000经验", progress: 3500, target: 5000, completed: false },
  ]);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const canClaimReward = completedTasks >= 3;

  const rewards = [
    { name: "金币", icon: "$", amount: "2500" },
    { name: "经验", icon: "★", amount: "1500" },
    { name: "材料", icon: "◆", amount: "8" },
  ];

  const totalTrainCount = freeCount + itemCount + privilegeCount;

  const handleTrain = () => {
    if (totalTrainCount <= 0) return;
    setIsTraining(true);
    setTimeout(() => {
      if (freeCount > 0) {
        setFreeCount(freeCount - 1);
      } else if (itemCount > 0) {
        setItemCount(itemCount - 1);
      } else if (privilegeCount > 0) {
        setPrivilegeCount(privilegeCount - 1);
      }
      setIsTraining(false);
      onTrain();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-300">
        <GlowCard className="overflow-hidden">
          {/* Header */}
          <div className="relative p-4 border-b border-border/50 bg-gradient-to-r from-accent/10 to-primary/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold">极速探索</h2>
                <p className="text-sm text-muted-foreground">快速获取挂机收益</p>
              </div>
              <button className="ml-auto w-8 h-8 rounded-full bg-card/50 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">预计获得</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {rewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border/50"
                >
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-lg">
                    {reward.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{reward.name}</p>
                    <p className="text-sm font-medium text-primary">+{reward.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Train Count */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">可用次数</span>
              <span className="text-lg font-bold text-accent">{totalTrainCount} 次</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>免费次数</span>
                <span className={freeCount > 0 ? "text-accent" : ""}>{freeCount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>道具次数</span>
                <span>{itemCount}</span>
              </div>
              {hasPrivilege && (
                <div className="flex justify-between text-muted-foreground">
                  <span>特权次数</span>
                  <span className="text-primary">{privilegeCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tasks Panel */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">训练任务</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {completedTasks}/3 完成
              </span>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-card/30"
                >
                  {task.completed ? (
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{task.name}</p>
                    <ProgressBar
                      value={task.progress}
                      max={task.target}
                      color={task.completed ? "accent" : "primary"}
                      size="xs"
                      showLabel={false}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {task.progress}/{task.target}
                  </span>
                </div>
              ))}
            </div>
            {completedTasks >= 3 && (
              <HexButton variant="accent" size="sm" className="w-full mt-3">
                <Gift className="w-4 h-4 mr-2" />
                领取阶段奖励
              </HexButton>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 space-y-3">
            {/* Train Button */}
            <HexButton
              variant="primary"
              className="w-full"
              onClick={handleTrain}
              disabled={totalTrainCount <= 0 || isTraining}
            >
              {isTraining ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  训练中...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  快速训练
                  {freeCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                      免费
                    </span>
                  )}
                </>
              )}
            </HexButton>

            {/* Buy Privilege Button */}
            {!hasPrivilege && (
              <HexButton
                variant="ghost"
                className="w-full border-primary/30"
                onClick={onBuyPrivilege}
              >
                <Crown className="w-4 h-4 mr-2 text-primary" />
                购买特权 · 解锁更多次数
              </HexButton>
            )}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
