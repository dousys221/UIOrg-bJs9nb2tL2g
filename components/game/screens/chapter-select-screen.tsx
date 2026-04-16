"use client";

import { useState, useRef } from "react";
import { ChevronLeft, Lock, Check, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard } from "../ui-components";

interface Chapter {
  id: number;
  name: string;
  difficulty: number;
  status: "locked" | "current" | "completed";
  stars: number;
  maxStars: number;
}

interface ChapterSelectScreenProps {
  onBack: () => void;
  onSelectChapter: (chapterId: number) => void;
  onUnlockChapter: (chapterId: number) => void;
}

const DIFFICULTY_NAMES = ["简单", "普通", "困难", "噩梦", "地狱"];
const DIFFICULTY_COLORS = [
  "text-green-500",
  "text-blue-500",
  "text-purple-500",
  "text-orange-500",
  "text-red-500",
];

export function ChapterSelectScreen({
  onBack,
  onSelectChapter,
  onUnlockChapter,
}: ChapterSelectScreenProps) {
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [chapters] = useState<Chapter[]>([
    {
      id: 1,
      name: "新兵训练场",
      difficulty: 1,
      status: "completed",
      stars: 36,
      maxStars: 36,
    },
    {
      id: 2,
      name: "边境哨站",
      difficulty: 1,
      status: "completed",
      stars: 30,
      maxStars: 36,
    },
    {
      id: 3,
      name: "废土边缘",
      difficulty: 1,
      status: "current",
      stars: 18,
      maxStars: 36,
    },
    {
      id: 4,
      name: "机械墓地",
      difficulty: 1,
      status: "locked",
      stars: 0,
      maxStars: 36,
    },
    {
      id: 5,
      name: "核心禁区",
      difficulty: 2,
      status: "locked",
      stars: 0,
      maxStars: 36,
    },
    {
      id: 6,
      name: "终末之地",
      difficulty: 3,
      status: "locked",
      stars: 0,
      maxStars: 36,
    },
  ]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mapRef.current.offsetLeft);
    setScrollLeft(mapRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapRef.current) return;
    e.preventDefault();
    const x = e.pageX - mapRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    mapRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.status === "locked") {
      // Show unlock popup would be triggered here
      onUnlockChapter(chapter.id);
    } else {
      onSelectChapter(chapter.id);
    }
  };

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        {/* Cloud effect layers */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/5 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background/90 to-transparent">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>返回</span>
        </button>

        {/* Difficulty Title */}
        <div className="flex items-center gap-2">
          <img
            src={`/difficulty-${currentDifficulty}.png`}
            alt=""
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span
            className={cn(
              "text-lg font-bold",
              DIFFICULTY_COLORS[currentDifficulty - 1]
            )}
          >
            {DIFFICULTY_NAMES[currentDifficulty - 1]}难度
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Difficulty Tabs */}
      <div className="relative z-10 px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {DIFFICULTY_NAMES.map((name, idx) => (
            <button
              key={name}
              onClick={() => setCurrentDifficulty(idx + 1)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                currentDifficulty === idx + 1
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : idx + 1 <= 2
                    ? "bg-card/50 border-border/50 text-muted-foreground hover:bg-card"
                    : "bg-card/30 border-border/30 text-muted-foreground/50"
              )}
              disabled={idx + 1 > 2}
            >
              {name}
              {idx + 1 > 2 && <Lock className="w-3 h-3 inline ml-1" />}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Map - Draggable */}
      <div
        ref={mapRef}
        className="relative z-10 flex-1 overflow-x-auto overflow-y-hidden px-4 pb-8 cursor-grab active:cursor-grabbing scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        <div className="flex gap-6 min-w-max py-8">
          {chapters
            .filter(
              (c) =>
                c.difficulty === currentDifficulty || c.status !== "locked"
            )
            .map((chapter, idx) => (
              <ChapterNode
                key={chapter.id}
                chapter={chapter}
                index={idx}
                onClick={() => handleChapterClick(chapter)}
              />
            ))}
        </div>

        {/* Connection Lines */}
        <svg
          className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 pointer-events-none"
          style={{ minWidth: chapters.length * 200 }}
        >
          <line
            x1="100"
            y1="4"
            x2={chapters.length * 180}
            y2="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="text-border"
          />
        </svg>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <p className="text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 inline mr-1" />
          左右滑动查看更多章节
        </p>
      </div>
    </div>
  );
}

function ChapterNode({
  chapter,
  index,
  onClick,
}: {
  chapter: Chapter;
  index: number;
  onClick: () => void;
}) {
  const isLocked = chapter.status === "locked";
  const isCurrent = chapter.status === "current";
  const isCompleted = chapter.status === "completed";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center cursor-pointer transition-all duration-300",
        isLocked && "opacity-60",
        isCurrent && "scale-110"
      )}
      onClick={onClick}
    >
      {/* Flag/Node */}
      <div
        className={cn(
          "relative w-32 h-40 rounded-xl border-2 overflow-hidden transition-all",
          isLocked && "border-border/50 bg-card/30",
          isCurrent && "border-primary bg-primary/10 shadow-lg shadow-primary/20",
          isCompleted && "border-accent/50 bg-accent/10"
        )}
      >
        {/* Chapter Preview Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80" />

        {/* Status Icon */}
        <div className="absolute top-2 right-2">
          {isLocked && (
            <div className="w-8 h-8 rounded-full bg-card/80 flex items-center justify-center">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          {isCompleted && (
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-accent" />
            </div>
          )}
          {isCurrent && (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>

        {/* Chapter Number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            className={cn(
              "text-4xl font-bold",
              isLocked && "text-muted-foreground/50",
              isCurrent && "text-primary",
              isCompleted && "text-accent"
            )}
          >
            {chapter.id}
          </span>
        </div>

        {/* Stars */}
        {!isLocked && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.ceil(chapter.stars / (chapter.maxStars / 3))
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chapter Name */}
      <div className="mt-3 text-center">
        <h3
          className={cn(
            "font-medium",
            isLocked && "text-muted-foreground",
            isCurrent && "text-primary",
            isCompleted && "text-foreground"
          )}
        >
          {chapter.name}
        </h3>
        {!isLocked && (
          <p className="text-xs text-muted-foreground mt-1">
            {chapter.stars}/{chapter.maxStars} 星
          </p>
        )}
      </div>

      {/* Current Indicator */}
      {isCurrent && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            当前
          </div>
        </div>
      )}
    </div>
  );
}
