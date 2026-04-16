"use client";

import { X, Play, User, Trophy, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard } from "../ui-components";

interface FightRecord {
  id: number;
  rank: number;
  playerName: string;
  playerId: string;
  avatarUrl?: string;
  teamPower: number;
  clearTime: number; // in seconds
  heroes: { name: string; level: number }[];
  timestamp: Date;
}

interface FightRecordPopupProps {
  levelName: string;
  onClose: () => void;
  onReplay: (recordId: number) => void;
}

export function FightRecordPopup({
  levelName,
  onClose,
  onReplay,
}: FightRecordPopupProps) {
  const records: FightRecord[] = [
    {
      id: 1,
      rank: 1,
      playerName: "战神无双",
      playerId: "123456",
      teamPower: 125000,
      clearTime: 45,
      heroes: [
        { name: "铁壁", level: 80 },
        { name: "烈焰", level: 78 },
        { name: "暗影", level: 75 },
        { name: "圣光", level: 72 },
        { name: "狂战", level: 70 },
      ],
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      rank: 2,
      playerName: "剑指苍穹",
      playerId: "234567",
      teamPower: 118000,
      clearTime: 52,
      heroes: [
        { name: "守护", level: 76 },
        { name: "冰霜", level: 74 },
        { name: "疾风", level: 72 },
        { name: "雷霆", level: 70 },
        { name: "圣光", level: 68 },
      ],
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: 3,
      rank: 3,
      playerName: "龙魂觉醒",
      playerId: "345678",
      teamPower: 112000,
      clearTime: 58,
      heroes: [
        { name: "烈焰", level: 74 },
        { name: "暗影", level: 72 },
        { name: "铁壁", level: 70 },
        { name: "冰霜", level: 68 },
        { name: "疾风", level: 66 },
      ],
      timestamp: new Date(Date.now() - 10800000),
    },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return "刚刚";
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case 2:
        return "bg-gray-400/20 text-gray-400 border-gray-400/50";
      case 3:
        return "bg-amber-600/20 text-amber-600 border-amber-600/50";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-in zoom-in-95 fade-in duration-300 max-h-[80vh] flex flex-col">
        <GlowCard className="overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative p-4 border-b border-border/50 bg-card/50 flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">通关记录</h2>
                <p className="text-sm text-muted-foreground">{levelName}</p>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {records.length > 0 ? (
              records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  rankStyle={getRankStyle(record.rank)}
                  formatTime={formatTime}
                  formatTimestamp={formatTimestamp}
                  onReplay={() => onReplay(record.id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">暂无通关记录</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-card/50 border-t border-border/50 flex-shrink-0">
            <p className="text-xs text-center text-muted-foreground">
              最多保留3条最快通关记录
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

function RecordCard({
  record,
  rankStyle,
  formatTime,
  formatTimestamp,
  onReplay,
}: {
  record: FightRecord;
  rankStyle: string;
  formatTime: (s: number) => string;
  formatTimestamp: (d: Date) => string;
  onReplay: () => void;
}) {
  return (
    <GlowCard className="p-4">
      <div className="flex items-start gap-3">
        {/* Rank Badge */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-lg flex-shrink-0",
            rankStyle
          )}
        >
          {record.rank}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium truncate">{record.playerName}</p>
              <p className="text-xs text-muted-foreground">ID: {record.playerId}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="w-3 h-3" />
              <span>{record.teamPower.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Clock className="w-3 h-3" />
              <span>{formatTime(record.clearTime)}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(record.timestamp)}
            </span>
          </div>

          {/* Team Preview */}
          <div className="flex gap-1 mt-2">
            {record.heroes.map((hero, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded bg-card/50 border border-border/50 flex items-center justify-center text-xs font-medium"
                title={`${hero.name} Lv.${hero.level}`}
              >
                {hero.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Replay Button */}
        <HexButton
          variant="secondary"
          size="sm"
          className="flex-shrink-0"
          onClick={onReplay}
        >
          <Play className="w-4 h-4 mr-1" />
          回放
        </HexButton>
      </div>
    </GlowCard>
  );
}
