"use client";

import { useState } from "react";
import { Trophy, Medal, Swords, ChevronLeft, X, Clock, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard, ItemFrame, ProgressBar, ResourceBar } from "../ui-components";

// ========== 竞技场类型选择界面 ==========
interface ArenaTypeScreenProps {
  onBack: () => void;
  onSelectArena: (type: 'rank' | 'match' | 'guild') => void;
}

export function ArenaTypeScreen({ onBack, onSelectArena }: ArenaTypeScreenProps) {
  const arenaTypes = [
    {
      id: 'rank' as const,
      icon: Trophy,
      title: '排位赛',
      desc: '挑战其他玩家，提升排名',
      reward: '赛季奖励丰厚',
      color: 'from-yellow-500 to-orange-600',
      redDot: true
    },
    {
      id: 'match' as const,
      icon: Swords,
      title: '匹配赛',
      desc: '随机匹配对手进行对战',
      reward: '获得荣誉点',
      color: 'from-blue-500 to-cyan-600',
      redDot: false
    },
    {
      id: 'guild' as const,
      icon: Users,
      title: '公会战',
      desc: '代表公会参与战斗',
      reward: '公会积分',
      color: 'from-purple-500 to-pink-600',
      redDot: false
    }
  ];

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-background via-card/30 to-background overflow-hidden flex flex-col">
      <div className="px-3 py-2">
        <ResourceBar showBack onBack={onBack} gold={12580} diamond={320} />
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <h1 className="text-xl font-bold text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          竞技场
        </h1>
        <p className="text-center text-xs text-muted-foreground mb-4">选择竞技模式</p>

        <div className="space-y-3">
          {arenaTypes.map((arena) => (
            <GlowCard
              key={arena.id}
              className="cursor-pointer hover:scale-[1.01] transition-transform"
              onClick={() => onSelectArena(arena.id)}
            >
              <div className="flex items-center gap-3 p-3">
                {/* 图标 */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center relative shrink-0",
                  `bg-gradient-to-br ${arena.color}`
                )}>
                  <arena.icon className="w-6 h-6 text-white" />
                  {arena.redDot && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-0.5">{arena.title}</h3>
                  <p className="text-xs text-muted-foreground mb-0.5 truncate">{arena.desc}</p>
                  <p className="text-[10px] text-accent">{arena.reward}</p>
                </div>

                {/* 箭头 */}
                <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 shrink-0" />
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== 竞技场主界面 ==========
interface ArenaMainScreenProps {
  arenaType: 'rank' | 'match' | 'guild';
  onBack: () => void;
  onStartBattle: () => void;
  onShowRecord: () => void;
}

export function ArenaMainScreen({ arenaType, onBack, onStartBattle, onShowRecord }: ArenaMainScreenProps) {
  const [tickets, setTickets] = useState(5);
  
  const arenaInfo = {
    rank: { title: '排位赛', rank: 1234, wins: 45, losses: 12 },
    match: { title: '匹配赛', points: 850, wins: 30, losses: 8 },
    guild: { title: '公会战', contribution: 1250, wins: 15, losses: 3 }
  };

  const info = arenaInfo[arenaType];

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-background via-card/30 to-background overflow-hidden flex flex-col">
      <div className="px-3 py-2">
        <ResourceBar showBack onBack={onBack} gold={12580} diamond={320} />
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <h1 className="text-lg font-bold text-center mb-4 text-white">{info.title}</h1>

        {/* 竞技信息 */}
        <GlowCard className="mb-4">
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-muted-foreground text-[10px] mb-0.5">
                  {arenaType === 'rank' ? '当前排名' : arenaType === 'match' ? '荣誉点' : '贡献值'}
                </p>
                <p className="text-lg font-bold text-accent">
                  {arenaType === 'rank' ? info.rank : arenaType === 'match' ? info.points : info.contribution}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] mb-0.5">胜场</p>
                <p className="text-lg font-bold text-green-400">{info.wins}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] mb-0.5">负场</p>
                <p className="text-lg font-bold text-red-400">{info.losses}</p>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* 挑战券 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Target className="w-4 h-4 text-accent" />
          <span className="text-sm text-white">挑战券: {tickets}/10</span>
          <button className="text-accent text-xs hover:underline">购买</button>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <HexButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onStartBattle}
            disabled={tickets <= 0}
          >
            开始匹配
          </HexButton>

          <HexButton
            variant="secondary"
            size="md"
            className="w-full"
            onClick={onShowRecord}
          >
            战斗记录
          </HexButton>
        </div>
      </div>
    </div>
  );
}

// ========== 竞技场记录弹窗 ==========
interface ArenaRecordPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArenaRecordPopup({ isOpen, onClose }: ArenaRecordPopupProps) {
  if (!isOpen) return null;

  const records = [
    { id: 1, opponent: '玩家A', result: 'win', time: '2分钟前', rankChange: '+12' },
    { id: 2, opponent: '玩家B', result: 'lose', time: '5分钟前', rankChange: '-8' },
    { id: 3, opponent: '玩家C', result: 'win', time: '10分钟前', rankChange: '+15' },
    { id: 4, opponent: '玩家D', result: 'win', time: '1小时前', rankChange: '+10' },
    { id: 5, opponent: '玩家E', result: 'lose', time: '2小时前', rankChange: '-5' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <GlowCard className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-white">战斗记录</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 记录列表 */}
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                  record.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                )}>
                  {record.result === 'win' ? '胜' : '负'}
                </div>
                <div>
                  <p className="font-medium text-white">{record.opponent}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {record.time}
                  </p>
                </div>
              </div>
              <div className={cn(
                "font-bold",
                record.rankChange.startsWith('+') ? 'text-green-400' : 'text-red-400'
              )}>
                {record.rankChange}
              </div>
            </div>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}

// ========== 竞技场结果弹窗 ==========
interface ArenaResultPopupProps {
  isOpen: boolean;
  result: 'win' | 'lose';
  rankChange: number;
  rewards: { gold: number; diamond: number; exp: number };
  onClose: () => void;
  onContinue: () => void;
}

export function ArenaResultPopup({
  isOpen,
  result,
  rankChange,
  rewards,
  onClose,
  onContinue
}: ArenaResultPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <GlowCard className="w-full max-w-sm mx-4">
        <div className="p-6 text-center">
          {/* 结果图标 */}
          <div className={cn(
            "w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center",
            result === 'win'
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          )}>
            {result === 'win' ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <X className="w-12 h-12 text-white" />
            )}
          </div>

          {/* 结果文本 */}
          <h2 className={cn(
            "text-3xl font-bold mb-2",
            result === 'win' ? 'text-yellow-400' : 'text-gray-400'
          )}>
            {result === 'win' ? '胜利！' : '失败'}
          </h2>

          {/* 排名变化 */}
          <div className={cn(
            "text-xl font-bold mb-6",
            rankChange > 0 ? 'text-green-400' : 'text-red-400'
          )}>
            排名 {rankChange > 0 ? '+' : ''}{rankChange}
          </div>

          {/* 奖励 */}
          {result === 'win' && (
            <div className="mb-6 space-y-2">
              <p className="text-muted-foreground text-sm">获得奖励</p>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-400">{rewards.gold}</p>
                  <p className="text-xs text-muted-foreground">金币</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-400">{rewards.diamond}</p>
                  <p className="text-xs text-muted-foreground">钻石</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-400">{rewards.exp}</p>
                  <p className="text-xs text-muted-foreground">经验</p>
                </div>
              </div>
            </div>
          )}

          {/* 按钮 */}
          <div className="space-y-3">
            <HexButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onContinue}
            >
              继续战斗
            </HexButton>
            <button
              className="w-full text-muted-foreground hover:text-white py-2"
              onClick={onClose}
            >
              返回
            </button>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
