"use client";

import { useEffect, useState } from "react";
import { Star, Unlock, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowCard } from "../ui-components";

interface UnlockedFeature {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface LevelUpPopupProps {
  oldLevel: number;
  newLevel: number;
  playerName: string;
  onClose: () => void;
}

export function LevelUpPopup({
  oldLevel,
  newLevel,
  playerName,
  onClose,
}: LevelUpPopupProps) {
  const [showContent, setShowContent] = useState(false);
  const [animatedLevel, setAnimatedLevel] = useState(oldLevel);

  // Current level unlocks
  const currentUnlocks: UnlockedFeature[] = [
    { id: 1, name: "竞技场", icon: "⚔️", description: "与其他玩家对战" },
    { id: 2, name: "公会系统", icon: "🏰", description: "加入或创建公会" },
  ];

  // Next level unlocks preview
  const nextUnlocks: UnlockedFeature[] = [
    { id: 3, name: "世界BOSS", icon: "👹", description: "挑战强大的世界Boss" },
  ];

  useEffect(() => {
    // Play level up sound effect would go here
    // AudioManager.play("levelup");

    // Animate level number
    const timer = setTimeout(() => {
      setAnimatedLevel(newLevel);
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [newLevel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-500">
        {/* Level Up Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-lg font-bold text-primary">等级提升</span>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>

          {/* Player Name */}
          <p className="text-muted-foreground mb-2">{playerName}</p>

          {/* Level Number with Animation */}
          <div className="relative inline-block">
            <div
              className={cn(
                "text-8xl font-bold transition-all duration-500",
                animatedLevel === newLevel
                  ? "text-primary scale-110"
                  : "text-muted-foreground scale-100"
              )}
            >
              {animatedLevel}
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 text-8xl font-bold text-primary blur-xl opacity-50">
              {animatedLevel}
            </div>
          </div>

          <p className="text-muted-foreground mt-2">
            Lv.{oldLevel} → Lv.{newLevel}
          </p>
        </div>

        {/* Unlocked Features */}
        <div
          className={cn(
            "transition-all duration-500 space-y-4",
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {/* Current Level Unlocks */}
          {currentUnlocks.length > 0 && (
            <GlowCard glowColor="accent" className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Unlock className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent">新功能解锁</span>
              </div>
              <div className="space-y-2">
                {currentUnlocks.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/30"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-xl">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-accent" />
                  </div>
                ))}
              </div>
            </GlowCard>
          )}

          {/* Next Level Preview */}
          {nextUnlocks.length > 0 && (
            <GlowCard className="p-4 opacity-70">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Lv.{newLevel + 1} 将解锁
                </span>
              </div>
              <div className="space-y-2">
                {nextUnlocks.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-card/30"
                  >
                    <div className="w-8 h-8 rounded bg-muted/20 flex items-center justify-center text-lg grayscale">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {feature.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          )}
        </div>

        {/* Tap to Continue */}
        <div
          className={cn(
            "text-center mt-6 transition-all duration-500",
            showContent ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-sm text-muted-foreground animate-pulse">
            点击任意处继续
          </p>
        </div>
      </div>
    </div>
  );
}
