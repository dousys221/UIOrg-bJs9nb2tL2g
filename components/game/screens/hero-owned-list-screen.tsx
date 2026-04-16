'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ChevronLeft, Plus, Star, Sword, Shield, Users,
  Flame, Droplet, Leaf, Zap, Moon, Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ResourceBar, RedDot, TabBar, ItemFrame, GameButton, ProgressBar 
} from '../ui-components'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

// 英雄数据类型
interface HeroData {
  id: string
  name: string
  quality: 1 | 2 | 3 | 4 | 5
  star: number
  maxStar: number
  level: number
  property: 'fire' | 'water' | 'wind' | 'thunder' | 'dark' | 'light'
  power: number
  isOnTeam: boolean
  canUpgrade: boolean
  fragments: number
  fragmentsNeeded: number
}

interface HeroOwnedListScreenProps {
  player: PlayerInfo
  onBack: () => void
  onOpenHeroDetail: (heroId: string) => void
  onNavigate: (screen: GameScreen) => void
}

// 阵营配置
const propertyConfig = {
  fire: { icon: Flame, color: 'text-red-500', bgColor: 'bg-red-500/20', label: '火' },
  water: { icon: Droplet, color: 'text-blue-500', bgColor: 'bg-blue-500/20', label: '水' },
  wind: { icon: Leaf, color: 'text-green-500', bgColor: 'bg-green-500/20', label: '风' },
  thunder: { icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', label: '雷' },
  dark: { icon: Moon, color: 'text-purple-500', bgColor: 'bg-purple-500/20', label: '暗' },
  light: { icon: Star, color: 'text-amber-300', bgColor: 'bg-amber-300/20', label: '光' },
}

// 筛选标签
const filterTabs = [
  { id: 'all', label: '全部' },
  { id: 'fire', label: '火系' },
  { id: 'water', label: '水系' },
  { id: 'wind', label: '风系' },
  { id: 'thunder', label: '雷系' },
  { id: 'dark', label: '暗系' },
]

// 模拟英雄数据
const mockHeroes: HeroData[] = [
  { id: 'h1', name: '烈焰战士', quality: 5, star: 5, maxStar: 6, level: 80, property: 'fire', power: 125680, isOnTeam: true, canUpgrade: true, fragments: 45, fragmentsNeeded: 100 },
  { id: 'h2', name: '寒冰法师', quality: 5, star: 4, maxStar: 6, level: 75, property: 'water', power: 118500, isOnTeam: true, canUpgrade: false, fragments: 80, fragmentsNeeded: 100 },
  { id: 'h3', name: '风暴猎人', quality: 4, star: 5, maxStar: 5, level: 70, property: 'wind', power: 95200, isOnTeam: true, canUpgrade: true, fragments: 50, fragmentsNeeded: 80 },
  { id: 'h4', name: '雷霆守卫', quality: 4, star: 4, maxStar: 5, level: 65, property: 'thunder', power: 87600, isOnTeam: false, canUpgrade: false, fragments: 30, fragmentsNeeded: 80 },
  { id: 'h5', name: '暗影刺客', quality: 5, star: 3, maxStar: 6, level: 60, property: 'dark', power: 78900, isOnTeam: true, canUpgrade: true, fragments: 60, fragmentsNeeded: 100 },
  { id: 'h6', name: '圣光骑士', quality: 4, star: 4, maxStar: 5, level: 55, property: 'light', power: 72300, isOnTeam: false, canUpgrade: false, fragments: 40, fragmentsNeeded: 80 },
  { id: 'h7', name: '火焰精灵', quality: 3, star: 5, maxStar: 5, level: 50, property: 'fire', power: 45600, isOnTeam: false, canUpgrade: true, fragments: 100, fragmentsNeeded: 60 },
  { id: 'h8', name: '海浪护卫', quality: 3, star: 4, maxStar: 5, level: 45, property: 'water', power: 38900, isOnTeam: false, canUpgrade: false, fragments: 25, fragmentsNeeded: 60 },
  { id: 'h9', name: '疾风斥候', quality: 3, star: 3, maxStar: 5, level: 40, property: 'wind', power: 32100, isOnTeam: false, canUpgrade: false, fragments: 15, fragmentsNeeded: 60 },
  { id: 'h10', name: '闪电勇士', quality: 2, star: 5, maxStar: 5, level: 35, property: 'thunder', power: 25800, isOnTeam: false, canUpgrade: false, fragments: 80, fragmentsNeeded: 40 },
  { id: 'h11', name: '暗夜游侠', quality: 2, star: 4, maxStar: 5, level: 30, property: 'dark', power: 21500, isOnTeam: false, canUpgrade: false, fragments: 20, fragmentsNeeded: 40 },
  { id: 'h12', name: '光明使者', quality: 2, star: 3, maxStar: 5, level: 25, property: 'light', power: 18200, isOnTeam: false, canUpgrade: true, fragments: 60, fragmentsNeeded: 40 },
]

export function HeroOwnedListScreen({ 
  player, 
  onBack, 
  onOpenHeroDetail,
  onNavigate 
}: HeroOwnedListScreenProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [heroes, setHeroes] = useState<HeroData[]>(mockHeroes)
  const [filteredHeroes, setFilteredHeroes] = useState<HeroData[]>(mockHeroes)
  const [heroCapacity, setHeroCapacity] = useState({ current: 12, max: 50 })
  const [isFirstOpen, setIsFirstOpen] = useState(true)
  const [showExpandPopup, setShowExpandPopup] = useState(false)
  const [animatedCards, setAnimatedCards] = useState<string[]>([])

  // 筛选英雄
  useEffect(() => {
    let result = [...heroes]
    
    // 按阵营筛选
    if (activeFilter !== 'all') {
      result = result.filter(h => h.property === activeFilter)
    }
    
    // 排序：上阵优先 > 等级 > 品质 > 星级 > 战力
    result.sort((a, b) => {
      if (a.isOnTeam !== b.isOnTeam) return a.isOnTeam ? -1 : 1
      if (a.level !== b.level) return b.level - a.level
      if (a.quality !== b.quality) return b.quality - a.quality
      if (a.star !== b.star) return b.star - a.star
      return b.power - a.power
    })
    
    setFilteredHeroes(result)
  }, [activeFilter, heroes])

  // 首次入场动画
  useEffect(() => {
    if (isFirstOpen && filteredHeroes.length > 0) {
      const ids: string[] = []
      filteredHeroes.forEach((hero, idx) => {
        setTimeout(() => {
          ids.push(hero.id)
          setAnimatedCards([...ids])
        }, 50 * idx)
      })
      
      setTimeout(() => {
        setIsFirstOpen(false)
      }, 50 * filteredHeroes.length + 300)
    }
  }, [isFirstOpen, filteredHeroes])

  // 判断英雄是否显示红点
  const getHeroRedPoint = useCallback((hero: HeroData) => {
    return hero.canUpgrade || hero.fragments >= hero.fragmentsNeeded
  }, [])

  // 扩容操作
  const handleExpandCapacity = useCallback(() => {
    // 模拟扩容
    if (player.diamond >= 100) {
      setHeroCapacity(prev => ({ ...prev, max: Math.min(prev.max + 10, 999) }))
      setShowExpandPopup(false)
    }
  }, [player.diamond])

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <div className="relative z-10 px-2.5 pt-2 pb-1">
        <div className="flex items-center justify-between gap-2">
          {/* 返回按钮 */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm transition-all duration-200 hover:bg-card active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* 标题 */}
          <h1 className="text-sm font-bold">英雄总览</h1>
          
          {/* 资源栏 */}
          <ResourceBar
            gold={player.gold}
            diamond={player.diamond}
            stamina={player.stamina}
            maxStamina={player.maxStamina}
          />
        </div>
      </div>

      {/* 英雄数量与扩容 */}
      <div className="px-2.5 py-1">
        <div className="flex items-center justify-between p-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-[10px]">
              英雄数量：
              <span className="text-gold-primary font-bold">{heroCapacity.current}</span>
              <span className="text-muted-foreground">/{heroCapacity.max}</span>
            </span>
          </div>
          <button
            onClick={() => setShowExpandPopup(true)}
            className="flex items-center gap-0.5 px-2 py-1 bg-primary/20 rounded-md border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-primary font-medium">扩容</span>
          </button>
        </div>
      </div>

      {/* 阵营筛选 */}
      <div className="px-2.5 py-1">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                'flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                activeFilter === tab.id
                  ? 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground'
                  : 'bg-card/80 border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 英雄网格列表 */}
      <div className="flex-1 px-2.5 py-1 overflow-y-auto">
        {filteredHeroes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Users className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-xs">暂无符合条件的英雄</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {filteredHeroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                isAnimated={!isFirstOpen || animatedCards.includes(hero.id)}
                showRedPoint={getHeroRedPoint(hero)}
                onClick={() => onOpenHeroDetail(hero.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 扩容弹窗 */}
      {showExpandPopup && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowExpandPopup(false)}
        >
          <div 
            className="w-[80%] max-w-[280px] bg-card rounded-lg border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2.5 border-b border-border">
              <h3 className="text-sm font-bold text-center">扩展英雄容量</h3>
            </div>
            <div className="p-4 text-center">
              <p className="text-[11px] text-muted-foreground mb-2">
                当前容量：{heroCapacity.current}/{heroCapacity.max}
              </p>
              <p className="text-xs mb-4">
                消耗 <span className="text-blue-glow font-bold">100</span> 钻石扩展 <span className="text-gold-primary font-bold">10</span> 个位置
              </p>
              <div className="flex gap-2">
                <GameButton 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowExpandPopup(false)}
                >
                  取消
                </GameButton>
                <GameButton 
                  variant="primary" 
                  className="flex-1"
                  onClick={handleExpandCapacity}
                  disabled={player.diamond < 100}
                >
                  确认扩容
                </GameButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 首次入场遮罩 */}
      {isFirstOpen && (
        <div className="absolute inset-0 z-40 bg-background/50 pointer-events-none" />
      )}
    </div>
  )
}

// 英雄卡片组件
interface HeroCardProps {
  hero: HeroData
  isAnimated: boolean
  showRedPoint: boolean
  onClick: () => void
}

function HeroCard({ hero, isAnimated, showRedPoint, onClick }: HeroCardProps) {
  const property = propertyConfig[hero.property]
  const PropertyIcon = property.icon

  const qualityColors = {
    1: 'from-gray-500 to-gray-600',
    2: 'from-green-500 to-green-600',
    3: 'from-blue-500 to-blue-600',
    4: 'from-purple-500 to-purple-600',
    5: 'from-gold-primary to-gold-secondary',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col rounded-lg overflow-hidden transition-all duration-300',
        'bg-gradient-to-br p-[1px]',
        qualityColors[hero.quality],
        isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
        'hover:scale-105 active:scale-95'
      )}
    >
      <div className="w-full h-full bg-card rounded-[7px] flex flex-col">
        {/* 英雄立绘区 */}
        <div className="relative aspect-square flex items-center justify-center bg-gradient-to-b from-muted/30 to-transparent">
          {/* 阵营图标 */}
          <div className={cn('absolute top-0.5 left-0.5 p-0.5 rounded', property.bgColor)}>
            <PropertyIcon className={cn('w-2.5 h-2.5', property.color)} />
          </div>
          
          {/* 等级 */}
          <span className="absolute top-0.5 right-0.5 px-1 py-0 bg-black/60 rounded text-[8px] font-bold">
            Lv.{hero.level}
          </span>
          
          {/* 上阵标识 */}
          {hero.isOnTeam && (
            <div className="absolute bottom-0.5 left-0.5 px-1 py-0 bg-success/80 rounded text-[7px] font-bold text-white">
              上阵
            </div>
          )}
          
          {/* 英雄头像占位 */}
          <div className="text-xl">
            {hero.property === 'fire' && '🔥'}
            {hero.property === 'water' && '💧'}
            {hero.property === 'wind' && '🍃'}
            {hero.property === 'thunder' && '⚡'}
            {hero.property === 'dark' && '🌙'}
            {hero.property === 'light' && '☀️'}
          </div>
        </div>
        
        {/* 英雄信息 */}
        <div className="p-1">
          {/* 星级 */}
          <div className="flex justify-center gap-0">
            {Array.from({ length: hero.maxStar }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-2 h-2',
                  i < hero.star ? 'fill-gold-primary text-gold-primary' : 'fill-muted text-muted'
                )}
              />
            ))}
          </div>
          
          {/* 名称 */}
          <p className="text-[8px] font-medium text-center truncate mt-0.5">{hero.name}</p>
          
          {/* 战力 */}
          <div className="flex items-center justify-center gap-0.5">
            <Sword className="w-2 h-2 text-gold-primary" />
            <span className="text-[7px] text-gold-light">{(hero.power / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>
      
      {/* 红点 */}
      {showRedPoint && <RedDot />}
    </button>
  )
}
