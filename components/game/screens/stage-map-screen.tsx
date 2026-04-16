'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  ChevronLeft, ChevronRight, Lock, Star, Sword, 
  Trophy, Gift, FileText, Zap, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ResourceBar, ProgressBar, GameButton, GlowCard, RedDot, HexButton 
} from '../ui-components'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

// 章节数据类型
interface ChapterData {
  id: number
  name: string
  description: string
  difficulty: 'normal' | 'hard' | 'nightmare'
  totalStages: number
  clearedStages: number
  isUnlocked: boolean
  isCurrent: boolean
  rewards: string[]
  bgColor: string
}

interface StageMapScreenProps {
  player: PlayerInfo
  onBack: () => void
  onSelectChapter: (chapterId: number) => void
  onOpenLevelDetail: (chapterId: number) => void
  onNavigate: (screen: GameScreen) => void
}

// 模拟章节数据
const mockChapters: ChapterData[] = [
  { 
    id: 1, name: '新手村', description: '指挥官的第一步', difficulty: 'normal',
    totalStages: 12, clearedStages: 12, isUnlocked: true, isCurrent: false,
    rewards: ['金币', '经验', '装备'], bgColor: 'from-green-600/20 to-green-800/20'
  },
  { 
    id: 2, name: '荒野平原', description: '危机四伏的荒野', difficulty: 'normal',
    totalStages: 15, clearedStages: 15, isUnlocked: true, isCurrent: false,
    rewards: ['金币', '经验', '材料'], bgColor: 'from-amber-600/20 to-amber-800/20'
  },
  { 
    id: 3, name: '废土边缘', description: '文明的残骸', difficulty: 'normal',
    totalStages: 18, clearedStages: 12, isUnlocked: true, isCurrent: true,
    rewards: ['稀有装备', '英雄碎片'], bgColor: 'from-orange-600/20 to-orange-800/20'
  },
  { 
    id: 4, name: '机械墓地', description: '沉睡的机械巨兽', difficulty: 'hard',
    totalStages: 20, clearedStages: 0, isUnlocked: false, isCurrent: false,
    rewards: ['史诗装备', '传说碎片'], bgColor: 'from-purple-600/20 to-purple-800/20'
  },
  { 
    id: 5, name: '深渊裂隙', description: '通往未知的裂口', difficulty: 'hard',
    totalStages: 22, clearedStages: 0, isUnlocked: false, isCurrent: false,
    rewards: ['传说装备', '特殊道具'], bgColor: 'from-indigo-600/20 to-indigo-800/20'
  },
  { 
    id: 6, name: '暗影要塞', description: '最终的决战', difficulty: 'nightmare',
    totalStages: 25, clearedStages: 0, isUnlocked: false, isCurrent: false,
    rewards: ['神话装备', '限定英雄'], bgColor: 'from-red-600/20 to-red-800/20'
  },
]

export function StageMapScreen({ 
  player, 
  onBack, 
  onSelectChapter,
  onOpenLevelDetail,
  onNavigate 
}: StageMapScreenProps) {
  const [chapters] = useState<ChapterData[]>(mockChapters)
  const [selectedChapter, setSelectedChapter] = useState<ChapterData>(
    chapters.find(c => c.isCurrent) || chapters[0]
  )
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // 计算总进度
  const totalStages = chapters.reduce((sum, c) => sum + c.totalStages, 0)
  const clearedStages = chapters.reduce((sum, c) => sum + c.clearedStages, 0)
  const overallProgress = (clearedStages / totalStages) * 100

  // 自动滚动到当前章节
  useEffect(() => {
    if (scrollRef.current) {
      const currentIndex = chapters.findIndex(c => c.isCurrent)
      if (currentIndex > 0) {
        const nodeWidth = 140 // 节点宽度 + 间距
        scrollRef.current.scrollLeft = (currentIndex - 1) * nodeWidth
      }
    }
  }, [chapters])

  // 拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 选择章节
  const handleSelectChapter = useCallback((chapter: ChapterData) => {
    if (!chapter.isUnlocked) return
    setSelectedChapter(chapter)
  }, [])

  // 进入章节
  const handleEnterChapter = useCallback(() => {
    if (selectedChapter.isUnlocked) {
      onOpenLevelDetail(selectedChapter.id)
    }
  }, [selectedChapter, onOpenLevelDetail])

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-30 transition-all duration-500',
        selectedChapter.bgColor
      )} />

      {/* 顶部导航 */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-card/80 border border-border backdrop-blur-sm transition-all duration-200 hover:bg-card active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-bold">章节地图</h1>
          
          <ResourceBar
            gold={player.gold}
            diamond={player.diamond}
            stamina={player.stamina}
            maxStamina={player.maxStamina}
          />
        </div>
      </div>

      {/* 总进度 */}
      <div className="relative z-10 px-4 py-2">
        <GlowCard className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">主线进度</span>
            <span className="text-xs text-muted-foreground">
              {clearedStages}/{totalStages} 关
            </span>
          </div>
          <ProgressBar value={overallProgress} max={100} color="gold" />
        </GlowCard>
      </div>

      {/* 章节信息展示 */}
      <div className="relative z-10 px-4 py-4 flex-1">
        <GlowCard 
          className="h-full p-4 flex flex-col" 
          glowColor={selectedChapter.isUnlocked ? 'gold' : 'blue'}
        >
          {/* 章节标题 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground">第{selectedChapter.id}章</span>
                <span className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold',
                  selectedChapter.difficulty === 'nightmare' ? 'bg-destructive/20 text-destructive' :
                  selectedChapter.difficulty === 'hard' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-success/20 text-success'
                )}>
                  {selectedChapter.difficulty === 'nightmare' ? '噩梦' :
                   selectedChapter.difficulty === 'hard' ? '困难' : '普通'}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{selectedChapter.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedChapter.description}</p>
            </div>
            {!selectedChapter.isUnlocked && (
              <Lock className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* 章节进度 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">章节进度</span>
              <span className="text-sm">
                <span className="text-primary font-bold">{selectedChapter.clearedStages}</span>
                <span className="text-muted-foreground">/{selectedChapter.totalStages}</span>
              </span>
            </div>
            <ProgressBar 
              value={selectedChapter.clearedStages} 
              max={selectedChapter.totalStages} 
              color={selectedChapter.isUnlocked ? 'blue' : 'secondary'}
            />
          </div>

          {/* 掉落奖励 */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">章节奖励</p>
            <div className="flex flex-wrap gap-2">
              {selectedChapter.rewards.map((reward, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-muted/50 rounded-lg text-xs"
                >
                  {reward}
                </span>
              ))}
            </div>
          </div>

          {/* 星级评价 */}
          {selectedChapter.isUnlocked && selectedChapter.clearedStages > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">评价</p>
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <Star 
                    key={s}
                    className={cn(
                      'w-6 h-6',
                      s <= Math.ceil((selectedChapter.clearedStages / selectedChapter.totalStages) * 3)
                        ? 'fill-gold-primary text-gold-primary'
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-auto">
            {selectedChapter.isUnlocked ? (
              <HexButton 
                variant="primary" 
                className="w-full"
                onClick={handleEnterChapter}
              >
                <Play className="w-5 h-5 mr-2" />
                {selectedChapter.clearedStages === selectedChapter.totalStages ? '重新挑战' : '继续冒险'}
              </HexButton>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">解锁条件</p>
                <p className="text-sm text-primary">通关第{selectedChapter.id - 1}章</p>
              </div>
            )}
          </div>
        </GlowCard>
      </div>

      {/* 底部章节滑动条 */}
      <div className="relative z-10 px-4 py-4 bg-gradient-to-t from-background to-transparent">
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {chapters.map((chapter, index) => (
            <ChapterNode 
              key={chapter.id}
              chapter={chapter}
              index={index}
              isSelected={selectedChapter.id === chapter.id}
              onClick={() => handleSelectChapter(chapter)}
            />
          ))}
        </div>
        
        {/* 滑动指示 */}
        <div className="flex justify-center mt-2 gap-1">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                selectedChapter.id === chapter.id ? 'bg-primary w-4' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 章节节点组件
interface ChapterNodeProps {
  chapter: ChapterData
  index: number
  isSelected: boolean
  onClick: () => void
}

function ChapterNode({ chapter, index, isSelected, onClick }: ChapterNodeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-[120px] flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200',
        isSelected 
          ? 'bg-primary/20 border-2 border-primary scale-105' 
          : chapter.isUnlocked 
            ? 'bg-card/80 border border-border hover:border-primary/50' 
            : 'bg-muted/30 border border-border/50 opacity-60',
        !chapter.isUnlocked && 'cursor-not-allowed'
      )}
      disabled={!chapter.isUnlocked}
    >
      {/* 章节图标 */}
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center relative',
        chapter.isUnlocked 
          ? 'bg-gradient-to-br from-primary/30 to-accent/30' 
          : 'bg-muted'
      )}>
        {chapter.isUnlocked ? (
          <span className="text-xl font-bold">{chapter.id}</span>
        ) : (
          <Lock className="w-6 h-6 text-muted-foreground" />
        )}
        
        {/* 当前章节标识 */}
        {chapter.isCurrent && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success animate-pulse" />
        )}
        
        {/* 完成标识 */}
        {chapter.clearedStages === chapter.totalStages && chapter.isUnlocked && (
          <div className="absolute -bottom-1 -right-1">
            <Star className="w-4 h-4 fill-gold-primary text-gold-primary" />
          </div>
        )}
      </div>
      
      {/* 章节名称 */}
      <p className={cn(
        'text-xs font-medium text-center truncate w-full',
        isSelected ? 'text-primary' : 'text-foreground'
      )}>
        {chapter.name}
      </p>
      
      {/* 进度条 */}
      {chapter.isUnlocked && (
        <div className="w-full">
          <ProgressBar 
            value={chapter.clearedStages} 
            max={chapter.totalStages} 
            color={chapter.clearedStages === chapter.totalStages ? 'gold' : 'blue'}
            size="sm"
          />
        </div>
      )}
    </button>
  )
}
