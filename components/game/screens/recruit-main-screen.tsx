'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ChevronLeft, Sparkles, Gift, Info, Users, Eye, 
  Diamond, Coins, Clock, Star, ChevronRight, SkipForward
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ResourceBar, RedDot, ProgressBar, GameButton, GlowCard, HexButton 
} from '../ui-components'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

// 奖池类型
interface PoolData {
  id: string
  name: string
  type: 'normal' | 'friend' | 'premium'
  description: string
  singleCost: { type: 'diamond' | 'gold' | 'ticket', amount: number }
  tenCost: { type: 'diamond' | 'gold' | 'ticket', amount: number }
  freeCount: number
  freeCountdown: number // 秒
  guaranteeCount: number
  guaranteeMax: number
  featuredHero?: { name: string, quality: number }
}

interface RecruitMainScreenProps {
  player: PlayerInfo
  onBack: () => void
  onSingleRecruit: (poolId: string) => void
  onTenRecruit: (poolId: string) => void
  onOpenPreview: (poolId: string) => void
  onOpenRecommend: () => void
  onOpenRewardBox: () => void
  onNavigate: (screen: GameScreen) => void
}

// 模拟奖池数据
const mockPools: PoolData[] = [
  {
    id: 'normal',
    name: '普通召唤',
    type: 'normal',
    description: '使用金币进行召唤',
    singleCost: { type: 'gold', amount: 10000 },
    tenCost: { type: 'gold', amount: 90000 },
    freeCount: 1,
    freeCountdown: 0,
    guaranteeCount: 45,
    guaranteeMax: 50,
  },
  {
    id: 'friend',
    name: '友情召唤',
    type: 'friend',
    description: '使用友情点进行召唤',
    singleCost: { type: 'ticket', amount: 20 },
    tenCost: { type: 'ticket', amount: 180 },
    freeCount: 0,
    freeCountdown: 3600,
    guaranteeCount: 30,
    guaranteeMax: 100,
  },
  {
    id: 'premium',
    name: '高级召唤',
    type: 'premium',
    description: '概率获得传说英雄',
    singleCost: { type: 'diamond', amount: 300 },
    tenCost: { type: 'diamond', amount: 2700 },
    freeCount: 0,
    freeCountdown: 86400,
    guaranteeCount: 75,
    guaranteeMax: 80,
    featuredHero: { name: '烈焰战神', quality: 5 },
  },
]

export function RecruitMainScreen({ 
  player, 
  onBack, 
  onSingleRecruit,
  onTenRecruit,
  onOpenPreview,
  onOpenRecommend,
  onOpenRewardBox,
  onNavigate 
}: RecruitMainScreenProps) {
  const [activePool, setActivePool] = useState<string>('premium')
  const [pools, setPools] = useState<PoolData[]>(mockPools)
  const [isJump, setIsJump] = useState(false)
  const [recruitBoxPoints, setRecruitBoxPoints] = useState(650)
  const [recruitBoxMax, setRecruitBoxMax] = useState(1000)
  const [countdowns, setCountdowns] = useState<Record<string, number>>({})
  const [showBoxEffect, setShowBoxEffect] = useState(false)

  // 初始化倒计时
  useEffect(() => {
    const initialCountdowns: Record<string, number> = {}
    pools.forEach(pool => {
      if (pool.freeCountdown > 0) {
        initialCountdowns[pool.id] = pool.freeCountdown
      }
    })
    setCountdowns(initialCountdowns)
  }, [pools])

  // 倒计时逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdowns(prev => {
        const newCountdowns = { ...prev }
        Object.keys(newCountdowns).forEach(key => {
          if (newCountdowns[key] > 0) {
            newCountdowns[key] -= 1
          }
        })
        return newCountdowns
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 格式化时间
  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h}时${m}分`
    }
    return `${m}分${s}秒`
  }, [])

  // 获取当前选中的奖池
  const currentPool = pools.find(p => p.id === activePool) || pools[0]

  // 切换跳过动画
  const handleToggleJump = useCallback(() => {
    setIsJump(prev => !prev)
    // 持久化到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('recruitJump', (!isJump).toString())
    }
  }, [isJump])

  // 判断是否可以免费抽
  const canFreePull = useCallback((poolId: string) => {
    const pool = pools.find(p => p.id === poolId)
    if (!pool) return false
    return pool.freeCount > 0 || (countdowns[poolId] !== undefined && countdowns[poolId] <= 0)
  }, [pools, countdowns])

  // 获取消耗图标
  const getCostIcon = (type: 'diamond' | 'gold' | 'ticket') => {
    switch (type) {
      case 'diamond': return <Diamond className="w-4 h-4 text-blue-glow" />
      case 'gold': return <Coins className="w-4 h-4 text-gold-primary" />
      case 'ticket': return <Gift className="w-4 h-4 text-accent" />
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* 顶部导航 */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          {/* 返回按钮 */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-card/80 border border-border backdrop-blur-sm transition-all duration-200 hover:bg-card active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* 功能按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPreview(activePool)}
              className="flex items-center gap-1 px-3 py-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm hover:bg-card transition-colors"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">概率预览</span>
            </button>
            <button
              onClick={onOpenRecommend}
              className="relative flex items-center gap-1 px-3 py-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm hover:bg-card transition-colors"
            >
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">推荐阵容</span>
              <RedDot className="absolute -top-1 -right-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 资源栏 */}
      <div className="px-4 py-2">
        <ResourceBar
          gold={player.gold}
          diamond={player.diamond}
          stamina={player.stamina}
          maxStamina={player.maxStamina}
        />
      </div>

      {/* 积分宝箱进度 */}
      <div className="px-4 py-2">
        <GlowCard className="p-3" glowColor="gold">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-primary" />
              <span className="text-sm font-medium">召唤积分</span>
            </div>
            <button
              onClick={onOpenRewardBox}
              disabled={recruitBoxPoints < recruitBoxMax}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                recruitBoxPoints >= recruitBoxMax
                  ? 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground animate-pulse'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {recruitBoxPoints >= recruitBoxMax ? '领取奖励' : '查看奖励'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <ProgressBar 
              value={recruitBoxPoints} 
              max={recruitBoxMax} 
              color="gold" 
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {recruitBoxPoints}/{recruitBoxMax}
            </span>
          </div>
        </GlowCard>
      </div>

      {/* 奖池切换 */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          {pools.map((pool) => (
            <button
              key={pool.id}
              onClick={() => setActivePool(pool.id)}
              className={cn(
                'flex-1 px-3 py-3 rounded-xl transition-all duration-200',
                'border-2',
                activePool === pool.id
                  ? 'bg-gradient-to-b from-primary/20 to-card border-primary shadow-lg shadow-primary/20'
                  : 'bg-card/50 border-border/50 hover:border-border'
              )}
            >
              <div className="text-center">
                <p className={cn(
                  'text-sm font-bold mb-1',
                  activePool === pool.id ? 'text-primary' : 'text-foreground'
                )}>
                  {pool.name}
                </p>
                {pool.featuredHero && (
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-gold-primary fill-gold-primary" />
                    <span className="text-[10px] text-gold-light">{pool.featuredHero.name}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 当前奖池内容 */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <GlowCard className="p-4" glowColor={currentPool.type === 'premium' ? 'purple' : 'blue'}>
          {/* 奖池信息 */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-1">{currentPool.name}</h2>
            <p className="text-sm text-muted-foreground">{currentPool.description}</p>
          </div>

          {/* 保底进度 */}
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">保底进度</span>
              <span className="text-xs">
                <span className="text-primary font-bold">{currentPool.guaranteeCount}</span>
                <span className="text-muted-foreground">/{currentPool.guaranteeMax}</span>
              </span>
            </div>
            <ProgressBar 
              value={currentPool.guaranteeCount} 
              max={currentPool.guaranteeMax} 
              color="blue"
            />
          </div>

          {/* 免费/倒计时状态 */}
          {(currentPool.freeCount > 0 || countdowns[currentPool.id] !== undefined) && (
            <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-success font-medium">
                  {canFreePull(currentPool.id) ? '免费召唤可用' : '免费召唤倒计时'}
                </span>
                {!canFreePull(currentPool.id) && countdowns[currentPool.id] !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-accent font-mono">{formatTime(countdowns[currentPool.id])}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 抽卡按钮 */}
          <div className="flex gap-3">
            {/* 单抽 */}
            <div className="flex-1">
              <HexButton
                variant={canFreePull(currentPool.id) ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() => onSingleRecruit(currentPool.id)}
              >
                <div className="flex flex-col items-center">
                  <span className="font-bold">单抽</span>
                  <div className="flex items-center gap-1 mt-1">
                    {canFreePull(currentPool.id) ? (
                      <span className="text-xs">免费</span>
                    ) : (
                      <>
                        {getCostIcon(currentPool.singleCost.type)}
                        <span className="text-xs">{currentPool.singleCost.amount}</span>
                      </>
                    )}
                  </div>
                </div>
              </HexButton>
            </div>

            {/* 十连 */}
            <div className="flex-1">
              <HexButton
                variant="primary"
                className="w-full"
                onClick={() => onTenRecruit(currentPool.id)}
              >
                <div className="flex flex-col items-center">
                  <span className="font-bold">十连</span>
                  <div className="flex items-center gap-1 mt-1">
                    {getCostIcon(currentPool.tenCost.type)}
                    <span className="text-xs">{currentPool.tenCost.amount}</span>
                  </div>
                </div>
              </HexButton>
            </div>
          </div>
        </GlowCard>

        {/* UP英雄展示 (仅高级池) */}
        {currentPool.featuredHero && (
          <GlowCard className="mt-4 p-4" glowColor="purple">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">UP英雄</p>
                  <p className="text-lg font-bold">{currentPool.featuredHero.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: currentPool.featuredHero.quality }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold-primary text-gold-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </GlowCard>
        )}
      </div>

      {/* 底部：跳过动画开关 */}
      <div className="relative z-10 px-4 py-4 bg-gradient-to-t from-background to-transparent">
        <div className="flex items-center justify-between p-3 bg-card/80 rounded-xl border border-border backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <SkipForward className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">跳过抽卡动画</span>
          </div>
          <button
            onClick={handleToggleJump}
            className={cn(
              'w-12 h-6 rounded-full transition-colors relative',
              isJump ? 'bg-primary' : 'bg-muted'
            )}
          >
            <div className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
              isJump ? 'translate-x-7' : 'translate-x-1'
            )} />
          </button>
        </div>
      </div>
    </div>
  )
}

// 奖池预览弹窗
interface PoolPreviewPopupProps {
  poolId: string
  onClose: () => void
}

export function PoolPreviewPopup({ poolId, onClose }: PoolPreviewPopupProps) {
  const previewData = [
    { quality: 5, rate: '2%', heroes: ['烈焰战神', '寒冰女王', '雷霆之王'] },
    { quality: 4, rate: '15%', heroes: ['风暴猎人', '暗影刺客', '圣光骑士', '大地守护'] },
    { quality: 3, rate: '50%', heroes: ['火焰精灵', '海浪护卫', '疾风斥候', '闪电勇士', '暗夜游侠'] },
    { quality: 2, rate: '30%', heroes: ['普通战士', '见习法师', '新手弓手'] },
    { quality: 1, rate: '3%', heroes: ['碎片材料'] },
  ]

  const qualityColors = {
    5: 'text-gold-primary',
    4: 'text-purple-400',
    3: 'text-blue-400',
    2: 'text-green-400',
    1: 'text-gray-400',
  }

  const qualityLabels = {
    5: '传说',
    4: '史诗',
    3: '稀有',
    2: '普通',
    1: '材料',
  }

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[90%] max-w-md max-h-[80%] bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">概率预览</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {previewData.map((item) => (
            <div key={item.quality} className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.quality }).map((_, i) => (
                      <Star key={i} className={cn('w-3 h-3 fill-current', qualityColors[item.quality as keyof typeof qualityColors])} />
                    ))}
                  </div>
                  <span className={cn('text-sm font-medium', qualityColors[item.quality as keyof typeof qualityColors])}>
                    {qualityLabels[item.quality as keyof typeof qualityLabels]}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">{item.rate}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.heroes.map((hero) => (
                  <span key={hero} className="px-2 py-0.5 bg-card rounded text-xs text-muted-foreground">
                    {hero}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 积分宝箱弹窗
interface RecruitBoxPopupProps {
  points: number
  maxPoints: number
  onClose: () => void
  onClaim: () => void
}

export function RecruitBoxPopup({ points, maxPoints, onClose, onClaim }: RecruitBoxPopupProps) {
  const canClaim = points >= maxPoints
  
  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[85%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold text-center">召唤积分宝箱</h3>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className={cn(
              'w-24 h-24 rounded-xl flex items-center justify-center',
              canClaim 
                ? 'bg-gradient-to-br from-gold-primary to-gold-secondary animate-pulse' 
                : 'bg-muted'
            )}>
              <Gift className={cn('w-12 h-12', canClaim ? 'text-primary-foreground' : 'text-muted-foreground')} />
            </div>
          </div>
          
          <div className="mb-4">
            <ProgressBar value={points} max={maxPoints} color="gold" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              {points}/{maxPoints}
            </p>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mb-4">
            {canClaim 
              ? '积分已满，可以领取丰厚奖励！' 
              : `还需要 ${maxPoints - points} 积分即可领取`
            }
          </p>
          
          <div className="flex gap-3">
            <GameButton variant="secondary" className="flex-1" onClick={onClose}>
              关闭
            </GameButton>
            <GameButton 
              variant="primary" 
              className="flex-1" 
              onClick={onClaim}
              disabled={!canClaim}
            >
              {canClaim ? '领取' : '未满'}
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  )
}
