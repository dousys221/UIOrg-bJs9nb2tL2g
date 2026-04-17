"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Sword,
  Shield,
  Zap,
  Users,
  RotateCcw,
  Info,
  Star,
  Lock,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard, ProgressBar } from "../ui-components";

interface Hero {
  id: number;
  name: string;
  level: number;
  stars: number;
  class: "warrior" | "tank" | "mage" | "support" | "assassin";
  power: number;
  avatar: string;
  isDeployed: boolean;
  position?: number;
}

interface FormationScreenProps {
  onBack: () => void;
  onStartBattle: () => void;
}

const CLASS_ICONS = {
  warrior: Sword,
  tank: Shield,
  mage: Zap,
  support: Users,
  assassin: Zap,
};

const CLASS_NAMES = {
  warrior: "战士",
  tank: "坦克",
  mage: "法师",
  support: "辅助",
  assassin: "刺客",
};

const CLASS_COLORS = {
  warrior: "text-red-500",
  tank: "text-blue-500",
  mage: "text-purple-500",
  support: "text-green-500",
  assassin: "text-orange-500",
};

export function FormationScreen({ onBack, onStartBattle }: FormationScreenProps) {
  const [heroes, setHeroes] = useState<Hero[]>([
    {
      id: 1,
      name: "铁壁",
      level: 60,
      stars: 5,
      class: "tank",
      power: 12500,
      avatar: "",
      isDeployed: true,
      position: 1,
    },
    {
      id: 2,
      name: "烈焰",
      level: 58,
      stars: 5,
      class: "mage",
      power: 11800,
      avatar: "",
      isDeployed: true,
      position: 2,
    },
    {
      id: 3,
      name: "暗影",
      level: 55,
      stars: 4,
      class: "assassin",
      power: 10200,
      avatar: "",
      isDeployed: true,
      position: 5,
    },
    {
      id: 4,
      name: "圣光",
      level: 52,
      stars: 4,
      class: "support",
      power: 9500,
      avatar: "",
      isDeployed: true,
      position: 4,
    },
    {
      id: 5,
      name: "狂战",
      level: 50,
      stars: 4,
      class: "warrior",
      power: 9000,
      avatar: "",
      isDeployed: true,
      position: 8,
    },
    {
      id: 6,
      name: "冰霜",
      level: 48,
      stars: 3,
      class: "mage",
      power: 7500,
      avatar: "",
      isDeployed: false,
    },
    {
      id: 7,
      name: "守护",
      level: 45,
      stars: 3,
      class: "tank",
      power: 6800,
      avatar: "",
      isDeployed: false,
    },
    {
      id: 8,
      name: "疾风",
      level: 42,
      stars: 3,
      class: "warrior",
      power: 6200,
      avatar: "",
      isDeployed: false,
    },
  ]);

  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showLowPowerWarning, setShowLowPowerWarning] = useState(false);

  const recommendedPower = 55000;
  const deployedHeroes = heroes.filter((h) => h.isDeployed);
  const totalPower = deployedHeroes.reduce((sum, h) => sum + h.power, 0);
  const powerRatio = totalPower / recommendedPower;

  const tabs = [
    { id: "all", name: "全部" },
    { id: "warrior", name: "战士" },
    { id: "tank", name: "坦克" },
    { id: "mage", name: "法师" },
    { id: "support", name: "辅助" },
    { id: "assassin", name: "刺客" },
  ];

  const filteredHeroes =
    activeTab === "all"
      ? heroes.filter((h) => !h.isDeployed)
      : heroes.filter((h) => !h.isDeployed && h.class === activeTab);

  const handleOneKeyDeploy = () => {
    const sorted = [...heroes].sort((a, b) => b.power - a.power);
    const newHeroes = heroes.map((h) => ({ ...h, isDeployed: false, position: undefined }));
    sorted.slice(0, 5).forEach((hero, idx) => {
      const heroIdx = newHeroes.findIndex((h) => h.id === hero.id);
      if (heroIdx !== -1) {
        newHeroes[heroIdx].isDeployed = true;
        newHeroes[heroIdx].position = [1, 2, 4, 5, 8][idx];
      }
    });
    setHeroes(newHeroes);
  };

  const handleStartBattle = () => {
    if (deployedHeroes.length === 0) {
      alert("请至少上阵一名英雄");
      return;
    }
    if (powerRatio < 0.8) {
      setShowLowPowerWarning(true);
    } else {
      onStartBattle();
    }
  };

  const handleSlotClick = (position: number) => {
    const heroAtPosition = heroes.find((h) => h.position === position);
    if (heroAtPosition) {
      // Remove from formation
      setHeroes(
        heroes.map((h) =>
          h.id === heroAtPosition.id
            ? { ...h, isDeployed: false, position: undefined }
            : h
        )
      );
    } else if (selectedHero && !selectedHero.isDeployed) {
      // Add to formation
      setHeroes(
        heroes.map((h) =>
          h.id === selectedHero.id ? { ...h, isDeployed: true, position } : h
        )
      );
      setSelectedHero(null);
    }
  };

  const getHeroAtPosition = (position: number) => {
    return heroes.find((h) => h.position === position);
  };

  return (
    <div className="relative h-full w-full bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-3 py-2 bg-card/50 border-b border-border/50">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-base font-bold">战前编队</h1>
        <div className="w-14" />
      </div>

      {/* Formation Grid - 3x3 */}
      <div className="flex-shrink-0 px-3 py-2 bg-gradient-to-b from-card/30 to-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">阵容战力</span>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-bold",
                powerRatio >= 1
                  ? "text-accent"
                  : powerRatio >= 0.8
                    ? "text-primary"
                    : "text-warning"
              )}
            >
              {totalPower.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {recommendedPower.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => {
            const hero = getHeroAtPosition(position);
            return (
              <FormationSlot
                key={position}
                position={position}
                hero={hero}
                isSelected={selectedHero?.position === position}
                onClick={() => handleSlotClick(position)}
              />
            );
          })}
        </div>
      </div>

      {/* Hero List */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border",
                activeTab === tab.id
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-card/50 border-border/50 text-muted-foreground"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Hero Scroll List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="grid grid-cols-5 gap-1.5">
            {filteredHeroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                isSelected={selectedHero?.id === hero.id}
                onClick={() => setSelectedHero(hero)}
              />
            ))}
          </div>
          {filteredHeroes.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              暂无可上阵英雄
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 px-3 py-2 bg-gradient-to-t from-background via-background/95 to-transparent border-t border-border/50">
        <div className="flex gap-2">
          <HexButton variant="secondary" size="md" className="flex-1" onClick={handleOneKeyDeploy}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            一键布阵
          </HexButton>
          <HexButton
            variant="primary"
            size="md"
            className="flex-[2]"
            onClick={handleStartBattle}
            disabled={deployedHeroes.length === 0}
          >
            <Sword className="w-4 h-4 mr-1.5" />
            开始战斗
          </HexButton>
        </div>
      </div>

      {/* Low Power Warning Dialog */}
      {showLowPowerWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowLowPowerWarning(false)}
          />
          <GlowCard className="relative z-10 p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">战力不足</h3>
            <p className="text-muted-foreground mb-4">
              当前阵容战力低于推荐值，可能无法顺利通关。是否继续挑战？
            </p>
            <div className="flex gap-3">
              <HexButton
                variant="ghost"
                className="flex-1"
                onClick={() => setShowLowPowerWarning(false)}
              >
                返回调整
              </HexButton>
              <HexButton
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowLowPowerWarning(false);
                  onStartBattle();
                }}
              >
                继续挑战
              </HexButton>
            </div>
          </GlowCard>
        </div>
      )}
    </div>
  );
}

function FormationSlot({
  position,
  hero,
  isSelected,
  onClick,
}: {
  position: number;
  hero?: Hero;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isFrontRow = position <= 3;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-lg border-2 transition-all overflow-hidden",
        hero
          ? "border-primary/50 bg-primary/10"
          : "border-dashed border-border/50 bg-card/30",
        isSelected && "border-accent ring-1 ring-accent/30",
        isFrontRow ? "opacity-100" : "opacity-80"
      )}
    >
      {hero ? (
        <>
          {/* Hero Avatar */}
          <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-card to-card/50 flex items-center justify-center">
            <span className="text-lg font-bold text-primary/50">
              {hero.name[0]}
            </span>
          </div>
          {/* Hero Info */}
          <div className="absolute bottom-0 left-0 right-0 px-0.5 py-0.5 bg-gradient-to-t from-card/90 to-transparent">
            <p className="text-[9px] font-medium truncate text-center">{hero.name}</p>
          </div>
          {/* Stars */}
          <div className="absolute top-0.5 right-0.5 flex">
            {[...Array(Math.min(hero.stars, 3))].map((_, i) => (
              <Star
                key={i}
                className="w-1.5 h-1.5 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Plus className="w-4 h-4 text-muted-foreground/30" />
        </div>
      )}
      {/* Position indicator */}
      <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-sm bg-card/80 flex items-center justify-center">
        <span className="text-[8px] text-muted-foreground">{position}</span>
      </div>
    </button>
  );
}

function HeroCard({
  hero,
  isSelected,
  onClick,
}: {
  hero: Hero;
  isSelected: boolean;
  onClick: () => void;
}) {
  const ClassIcon = CLASS_ICONS[hero.class];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-[3/4] rounded-lg border transition-all overflow-hidden",
        isSelected
          ? "border-accent bg-accent/10 ring-1 ring-accent/30"
          : "border-border/50 bg-card/50 hover:bg-card"
      )}
    >
      {/* Avatar */}
      <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-card to-card/50 flex items-center justify-center">
        <span className="text-base font-bold text-muted-foreground/50">
          {hero.name[0]}
        </span>
      </div>

      {/* Class Icon */}
      <div
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-sm bg-card/80 flex items-center justify-center",
          CLASS_COLORS[hero.class]
        )}
      >
        <ClassIcon className="w-2.5 h-2.5" />
      </div>

      {/* Stars */}
      <div className="absolute top-0.5 right-0.5 flex">
        {[...Array(Math.min(hero.stars, 3))].map((_, i) => (
          <Star key={i} className="w-1.5 h-1.5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-gradient-to-t from-card/90 to-transparent">
        <p className="text-[9px] font-medium truncate text-center">{hero.name}</p>
        <p className="text-[8px] text-muted-foreground text-center">
          Lv.{hero.level}
        </p>
      </div>
    </button>
  );
}
