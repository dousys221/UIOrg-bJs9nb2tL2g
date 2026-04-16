"use client";

import { X, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard } from "../ui-components";

interface UnlockChapterPopupProps {
  chapterId: number;
  chapterName: string;
  difficulty: string;
  onClose: () => void;
  onGo: () => void;
  isInBattle?: boolean;
}

export function UnlockChapterPopup({
  chapterId,
  chapterName,
  difficulty,
  onClose,
  onGo,
  isInBattle = false,
}: UnlockChapterPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-300">
        <GlowCard glowColor="primary" className="overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with Effects */}
          <div className="relative h-48 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Unlock Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-primary/30 blur-xl -z-10" />
              </div>
            </div>

            {/* Title */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-sm text-primary font-medium mb-1">
                新章节解锁
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-2 text-center">
            {/* Chapter Info */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-3">
                <span className="text-xs text-accent">{difficulty}难度</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                第{chapterId}章
              </h2>
              <h3 className="text-xl text-primary">{chapterName}</h3>
            </div>

            {/* Chapter Background Preview */}
            <div className="relative h-32 rounded-xl overflow-hidden mb-6 bg-card/50 border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground/20">
                  {chapterId}
                </span>
              </div>
              {/* Preview placeholder */}
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <p className="text-xs text-muted-foreground">
                  完成前置章节，解锁全新冒险
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <HexButton variant="ghost" className="flex-1" onClick={onClose}>
                稍后再说
              </HexButton>
              {!isInBattle && (
                <HexButton variant="primary" className="flex-1" onClick={onGo}>
                  前往挑战
                  <ChevronRight className="w-4 h-4 ml-1" />
                </HexButton>
              )}
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
