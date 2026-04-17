"use client";

import { useState, useEffect } from "react";
import { Sparkles, Star, X, ChevronLeft, Gift, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard, ItemFrame, ProgressBar } from "../ui-components";

// ========== 抽卡结果页 - 单抽 ==========
interface SingleRecruitPanelProps {
  heroName: string;
  heroStar: number;
  heroQuality: 1 | 2 | 3 | 4 | 5;
  onClose: () => void;
  onAgain: () => void;
  onTenRecruit: () => void;
}

export function SingleRecruitPanel({
  heroName,
  heroStar,
  heroQuality,
  onClose,
  onAgain,
  onTenRecruit,
}: SingleRecruitPanelProps) {
  const [showCard, setShowCard] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowCard(true), 300);
    const timer2 = setTimeout(() => setShowGlow(true), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const qualityColors = {
    1: "from-gray-500 to-gray-600",
    2: "from-green-500 to-green-600",
    3: "from-blue-500 to-blue-600",
    4: "from-purple-500 to-purple-600",
    5: "from-gold-primary to-gold-secondary",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* 背景光效 */}
      {showGlow && (
        <div
          className={cn(
            "absolute inset-0 opacity-30 transition-opacity duration-1000",
            heroQuality >= 4 ? "bg-gradient-radial from-purple-500/30 via-transparent to-transparent" : "bg-gradient-radial from-blue-500/20 via-transparent to-transparent"
          )}
        />
      )}

      {/* 卡片 */}
      <div
        className={cn(
          "relative w-64 transition-all duration-500",
          showCard ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        {/* 星级 */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: heroStar }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-5 h-5 fill-current",
                heroQuality >= 4 ? "text-gold-primary" : "text-accent"
              )}
            />
          ))}
        </div>

        {/* 英雄卡片 */}
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden border-2 p-1",
            `bg-gradient-to-br ${qualityColors[heroQuality]}`,
            heroQuality >= 4 && "animate-pulse"
          )}
        >
          <div className="w-full aspect-[3/4] bg-card rounded-xl flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🦸</div>
            <p className="text-lg font-bold">{heroName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {heroQuality === 5 ? "传说" : heroQuality === 4 ? "史诗" : heroQuality === 3 ? "稀有" : "普通"}
            </p>
          </div>
        </div>

        {/* 特效粒子 */}
        {heroQuality >= 4 && showGlow && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gold-primary rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="flex flex-col gap-2 max-w-xs mx-auto">
          <HexButton variant="primary" size="md" className="w-full" onClick={onAgain}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            再抽一次
          </HexButton>
          <HexButton variant="secondary" size="md" className="w-full" onClick={onTenRecruit}>
            十连抽
          </HexButton>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== 抽卡结果页 - 十连 ==========
interface TenRecruitPanelProps {
  heroes: { name: string; star: number; quality: 1 | 2 | 3 | 4 | 5 }[];
  onClose: () => void;
  onAgain: () => void;
}

export function TenRecruitPanel({
  heroes,
  onClose,
  onAgain,
}: TenRecruitPanelProps) {
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    heroes.forEach((_, idx) => {
      setTimeout(() => {
        setRevealed((prev) => [...prev, idx]);
      }, 200 * (idx + 1));
    });
  }, [heroes]);

  const qualityColors = {
    1: "border-gray-500",
    2: "border-green-500",
    3: "border-blue-500",
    4: "border-purple-500",
    5: "border-gold-primary",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[95%] max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 标题 */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold">抽卡结果</h2>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {heroes.map((hero, idx) => (
            <div
              key={idx}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
                `border-2 ${qualityColors[hero.quality]}`,
                revealed.includes(idx) ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}
            >
              <div className="w-full h-full bg-card flex flex-col items-center justify-center p-1">
                <div className="text-2xl">🦸</div>
                <p className="text-[10px] font-medium truncate w-full text-center">
                  {hero.name}
                </p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: Math.min(hero.star, 3) }).map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-current text-gold-primary" />
                  ))}
                </div>
              </div>
              {hero.quality >= 4 && (
                <div className="absolute inset-0 bg-gold-primary/10 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 justify-center">
          <HexButton variant="primary" size="md" onClick={onAgain}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            再来十连
          </HexButton>
          <HexButton variant="secondary" size="md" onClick={onClose}>
            关闭
          </HexButton>
        </div>
      </div>
    </div>
  );
}

// ========== 获得英雄展示页 ==========
interface PublicGetHeroPanelProps {
  heroName: string;
  heroStar: number;
  heroQuality: 1 | 2 | 3 | 4 | 5;
  skills: { name: string; desc: string }[];
  onClose: () => void;
}

export function PublicGetHeroPanel({
  heroName,
  heroStar,
  heroQuality,
  skills,
  onClose,
}: PublicGetHeroPanelProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* 背景立绘区 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[200px] opacity-20">🦸</div>
      </div>

      {/* 内容层 */}
      <div
        className={cn(
          "relative z-10 w-full h-full flex flex-col transition-all duration-700",
          showContent ? "opacity-100" : "opacity-0"
        )}
      >
        {/* 顶部标题 */}
        <div className="pt-8 px-6 text-center">
          <p className="text-sm text-primary mb-2">获得新英雄</p>
          <h1 className="text-3xl font-bold mb-2">{heroName}</h1>
          <div className="flex justify-center gap-1">
            {Array.from({ length: heroStar }).map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current text-gold-primary" />
            ))}
          </div>
        </div>

        {/* 中间技能展示 */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm space-y-3">
            {skills.map((skill, idx) => (
              <GlowCard key={idx} className="p-3" glowColor={heroQuality >= 4 ? "purple" : "blue"}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.desc}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="pb-8 px-6">
          <HexButton variant="primary" className="w-full max-w-xs mx-auto block" onClick={onClose}>
            确定
          </HexButton>
        </div>
      </div>
    </div>
  );
}
