"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sword,
  Gift,
  Clock,
  Trophy,
  FileText,
  Zap,
  ChevronLeft,
  Search,
  MessageSquare,
  Star,
  Package,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HexButton,
  ResourceBar,
  GlowCard,
  ProgressBar,
  RedDot,
} from "../ui-components";

interface LevelMainScreenProps {
  onBack: () => void;
  onStartBattle: () => void;
  onOpenChapterSelect: () => void;
  onOpenFormation: () => void;
  onOpenFastExplore: () => void;
  onOpenRecord: () => void;
  onOpenRewardPreview: () => void;
  onCollectHangReward: () => void;
  /** 返回主城回调 */
  onBackToMain?: () => void;
  /** 章节过场是否正在播放（外部控制） */
  isChapterCloseState?: boolean;
}

// 防连点配置
const BACK_MAIN_CLICK_CD = 500; // 500ms 节流

export function LevelMainScreen({
  onBack,
  onStartBattle,
  onOpenChapterSelect,
  onOpenFormation,
  onOpenFastExplore,
  onOpenRecord,
  onOpenRewardPreview,
  onCollectHangReward,
  onBackToMain,
  isChapterCloseState = false,
}: LevelMainScreenProps) {
  const [hangTime, setHangTime] = useState(7200); // 2 hours in seconds
  const maxHangTime = 28800; // 8 hours
  const [worldLevel, setWorldLevel] = useState(45);
  const [currentChapter, setCurrentChapter] = useState({
    name: "废土边缘",
    number: 3,
    stage: 12,
    difficulty: "普通",
  });
  const [canFight, setCanFight] = useState(true);
  const [hangRewards, setHangRewards] = useState([
    { icon: "gold", name: "金币", perMin: 1250 },
    { icon: "exp", name: "经验", perMin: 850 },
    { icon: "material", name: "材料", perMin: 15 },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 防连点：记录上次点击时间戳
  const backMainLastClickTimeRef = useRef<number>(0);

  // 模拟挂机时间累积
  useEffect(() => {
    const timer = setInterval(() => {
      setHangTime((prev) => Math.min(prev + 1, maxHangTime));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 生命周期复位：组件挂载时重置可点击状态
  useEffect(() => {
    backMainLastClickTimeRef.current = 0;
  }, []);

  // Toast 提示自动消失
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ========== 返回主城（btnBackMain） ==========
  const handleClickBackMain = useCallback(() => {
    const now = Date.now();
    const elapsed = now - backMainLastClickTimeRef.current;

    // 防连点：间隔不足 500ms 则忽略
    if (elapsed < BACK_MAIN_CLICK_CD) {
      return;
    }

    // 章节过场拦截
    if (isChapterCloseState) {
      setToastMessage("章节切换中，请稍后操作");
      return;
    }

    // 通过节流 & 非过场 → 更新时间戳并执行返回
    backMainLastClickTimeRef.current = now;

    // 模拟播放取消音效（前端原型无实际音频，直接跳转）
    if (onBackToMain) {
      onBackToMain();
    } else {
      // 兜底：使用 onBack
      onBack();
    }
  }, [isChapterCloseState, onBackToMain, onBack]);

  // ========== 格式化工具 ==========
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const hangProgress = hangTime / maxHangTime;
  const canCollect = hangTime >= 600; // 10 minutes minimum

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Top Bar with ResourceBar */}
      <div className="relative z-10">
        <ResourceBar />
      </div>

      {/* ===== btnBackMain：独立显式返回主城按钮 ===== */}
      <button
        onClick={handleClickBackMain}
        className={cn(
          'absolute top-20 left-4 z-20',
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-card/80 border border-border backdrop-blur-sm',
          'transition-all duration-200 hover:bg-card hover:border-primary/30 active:scale-95',
          'text-sm font-medium text-muted-foreground hover:text-foreground'
        )}
        title="返回主城"
      >
        <Home className="w-4 h-4" />
        <span>主城</span>
      </button>

      {/* World Level Badge */}
      <div className="absolute top-20 right-4 z-10">
        <GlowCard className="px-3 py-1.5 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">世界等级 Lv.{worldLevel}</span>
        </GlowCard>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full pt-28 pb-32 px-4 flex flex-col">
        {/* Chapter Info */}
        <div
          className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onOpenChapterSelect}
        >
          <GlowCard className="px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-primary font-bold">
                  {currentChapter.number}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {currentChapter.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  第{currentChapter.stage}关 · {currentChapter.difficulty}难度
                </p>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180 ml-2" />
            </div>
          </GlowCard>
        </div>

        {/* Hang Rewards Section */}
        <GlowCard className="mb-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-medium">挂机收益</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatTime(hangTime)} / {formatTime(maxHangTime)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <ProgressBar
                value={hangProgress * 100}
                max={100}
                color={hangProgress >= 1 ? "warning" : "accent"}
                showLabel={false}
              />
              {hangProgress >= 1 && (
                <p className="text-xs text-warning mt-1 animate-pulse">
                  收益已满，请及时领取！
                </p>
              )}
            </div>

            {/* Per Minute Rewards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {hangRewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-card/50 rounded-lg p-2"
                >
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                    {reward.icon === "gold" && (
                      <span className="text-yellow-500">$</span>
                    )}
                    {reward.icon === "exp" && (
                      <Star className="w-4 h-4 text-accent" />
                    )}
                    {reward.icon === "material" && (
                      <Package className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {reward.name}
                    </p>
                    <p className="text-sm font-medium">+{reward.perMin}/分</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Collect Button */}
            <HexButton
              variant={canCollect ? "primary" : "secondary"}
              className="w-full"
              onClick={onCollectHangReward}
              disabled={!canCollect}
            >
              <Gift className="w-4 h-4 mr-2" />
              {canCollect ? "领取收益" : "累计10分钟可领取"}
            </HexButton>
          </div>
        </GlowCard>

        {/* Function Buttons Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <FunctionButton
            icon={<Trophy className="w-5 h-5" />}
            label="排行榜"
            onClick={() => {}}
          />
          <FunctionButton
            icon={<FileText className="w-5 h-5" />}
            label="通关记录"
            onClick={onOpenRecord}
          />
          <FunctionButton
            icon={<Search className="w-5 h-5" />}
            label="寻宝"
            hasRedDot
            onClick={() => {}}
          />
          <FunctionButton
            icon={<Gift className="w-5 h-5" />}
            label="掉落预览"
            onClick={onOpenRewardPreview}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Bottom Action Area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-4 px-4">
        <div className="flex gap-3">
          {/* Fast Explore Button */}
          <HexButton
            variant="secondary"
            className="flex-1"
            onClick={onOpenFastExplore}
          >
            <Zap className="w-4 h-4 mr-2 text-accent" />
            极速探索
          </HexButton>

          {/* Main Battle Button */}
          <HexButton
            variant="primary"
            className="flex-[2]"
            onClick={canFight ? onOpenFormation : undefined}
            disabled={!canFight}
          >
            <Sword className="w-5 h-5 mr-2" />
            {canFight ? "开始战斗" : "条件不足"}
          </HexButton>
        </div>

        {/* Chat Panel Tabs */}
        <div className="mt-4 flex gap-2">
          {["世界", "军团", "私聊"].map((tab, idx) => (
            <button
              key={tab}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all relative",
                idx === 0
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card/50 text-muted-foreground border border-border/50"
              )}
            >
              <MessageSquare className="w-3 h-3 inline mr-1" />
              {tab}
              {idx === 2 && <RedDot className="absolute -top-1 -right-1" />}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Toast 提示（章节过场拦截） ===== */}
      {toastMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="px-6 py-3 rounded-xl bg-card/95 border border-border backdrop-blur-md shadow-xl">
            <p className="text-sm font-medium text-foreground text-center whitespace-nowrap">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FunctionButton({
  icon,
  label,
  hasRedDot,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hasRedDot?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="relative flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/30 transition-all"
      onClick={onClick}
    >
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-xs text-muted-foreground">{label}</span>
      {hasRedDot && <RedDot className="absolute -top-1 -right-1" />}
    </button>
  );
}
