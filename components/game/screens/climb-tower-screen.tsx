'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  ChevronLeft, Trophy, Star, Gift, Shield, Sword, 
  Users, Lock, Zap, Crown, Plus, Store, Filter, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ResourceBar, ProgressBar, GameButton, GlowCard, RedDot, HexButton 
} from '../ui-components'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

// 塔层数据
interface TowerFloor {
  floor: number
  status: 'cleared' | 'current' | 'locked'
  stars: number
  maxStars: number
  rewards: string[]
  enemies: { name: string, power: number }[]
  recommendPower: number
  firstClearReward?: string
}

// 迷你排行数据
interface MiniRankItem {
  rank: number
  name: string
  floor: number
}

interface ClimbTowerScreenProps {
  player: PlayerInfo
  mode: 'normal' | 'elite'
  onBack: () => void
  onSwitchMode: () => void
  onOpenReward: () => void
  onOpenRank: () => void
  onOpenShop: () => void
  onChallenge: (floor: number) => void
  onNavigate: (screen: GameScreen) => void
}

// 模拟塔层数据
const generateFloors = (currentFloor: number, total: number): TowerFloor[] => {
  return Array.from({ length: total }, (_, i) => {
    const floor = i + 1
    const status = floor < currentFloor ? 'cleared' : floor === currentFloor ? 'current' : 'locked'
    return {
      floor,
      status,
      stars: status === 'cleared' ? Math.floor(Math.random() * 3) + 1 : 0,
      maxStars: 3,
      rewards: ['金币', '经验', floor % 10 === 0 ? '史诗装备' : '材料'],
      enemies: [
        { name: '守卫', power: 50000 + floor * 5000 },
        { name: '精英', power: 80000 + floor * 8000 },
      ],
      recommendPower: 100000 + floor * 10000,
      firstClearReward: floor % 5 === 0 ? '首通宝箱' : undefined,
    }
  })
}

// 模拟迷你排行
const mockMiniRank: MiniRankItem[] = [
  { rank: 1, name: '塔神', floor: 150 },
  { rank: 2, name: '攀登者', floor: 148 },
  { rank: 3, name: '挑战者', floor: 145 },
]

export function ClimbTowerScreen({ 
  player, 
  mode,
  onBack, 
  onSwitchMode,
  onOpenReward,
  onOpenRank,
  onOpenShop,
  onChallenge,
  onNavigate 
}: ClimbTowerScreenProps) {
  const [currentFloor, setCurrentFloor] = useState(45)
  const [floors, setFloors] = useState<TowerFloor[]>(() => generateFloors(45, 150))
  const [selectedFloor, setSelectedFloor] = useState<TowerFloor | null>(null)
  const [challengeTimes, setChallengetimes] = useState({ current: 5, max: 10, bought: 0, maxBuy: 5 })
  const [miniRank] = useState<MiniRankItem[]>(mockMiniRank)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 滚动到当前层
  useEffect(() => {
    if (scrollRef.current) {
      const currentIndex = floors.findIndex(f => f.status === 'current')
      if (currentIndex >= 0) {
        const itemHeight = 80
        scrollRef.current.scrollTop = Math.max(0, (floors.length - currentIndex - 3) * itemHeight)
      }
    }
  }, [floors])

  // 选择层
  const handleSelectFloor = useCallback((floor: TowerFloor) => {
    if (floor.status !== 'locked') {
      setSelectedFloor(floor)
    }
  }, [])

  // 购买挑战次数
  const handleBuyChallengeTimes = useCallback(() => {
    if (challengeTimes.bought < challengeTimes.maxBuy) {
      setChallengetimes(prev => ({
        ...prev,
        current: prev.current + 1,
        bought: prev.bought + 1,
      }))
    }
  }, [challengeTimes.bought, challengeTimes.maxBuy])

  // 开始挑战
  const handleStartChallenge = useCallback(() => {
    if (selectedFloor && challengeTimes.current > 0) {
      onChallenge(selectedFloor.floor)
    }
  }, [selectedFloor, challengeTimes.current, onChallenge])

  const isElite = mode === 'elite'

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-b opacity-20',
        isElite ? 'from-purple-600/30 to-background' : 'from-blue-600/30 to-background'
      )} />

      {/* 顶部导航 */}
      <div className="relative z-10 px-2.5 pt-2 pb-1">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm transition-all duration-200 hover:bg-card active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h1 className="text-sm font-bold">
            {isElite ? '魔之塔' : '神之塔'}
          </h1>
          
          <button
            onClick={onOpenRank}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm"
          >
            <Trophy className="w-4 h-4 text-gold-primary" />
          </button>
        </div>
      </div>

      {/* 资源和次数 */}
      <div className="relative z-10 px-2.5 py-1 space-y-1.5">
        <ResourceBar
          gold={player.gold}
          diamond={player.diamond}
          stamina={player.stamina}
          maxStamina={player.maxStamina}
        />
        
        {/* 挑战次数 */}
        <div className="flex items-center justify-between p-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-[10px]">挑战次数</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold">
              <span className="text-primary">{challengeTimes.current}</span>
              <span className="text-muted-foreground">/{challengeTimes.max}</span>
            </span>
            <button
              onClick={handleBuyChallengeTimes}
              disabled={challengeTimes.bought >= challengeTimes.maxBuy}
              className={cn(
                'flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px]',
                challengeTimes.bought < challengeTimes.maxBuy
                  ? 'bg-primary/20 text-primary hover:bg-primary/30'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Plus className="w-2.5 h-2.5" />
              <span>购买({challengeTimes.bought}/{challengeTimes.maxBuy})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 功能按钮行 */}
      <div className="relative z-10 px-2.5 py-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenReward}
            className="relative flex items-center gap-1 px-2 py-1.5 bg-card/80 rounded-md border border-border backdrop-blur-sm flex-1"
          >
            <Gift className="w-3 h-3 text-gold-primary" />
            <span className="text-[10px]">奖励</span>
            <RedDot />
          </button>
          
          {isElite && (
            <>
              <button
                onClick={onOpenShop}
                className="flex items-center gap-1 px-2 py-1.5 bg-card/80 rounded-md border border-border backdrop-blur-sm flex-1"
              >
                <Store className="w-3 h-3 text-accent" />
                <span className="text-[10px]">商店</span>
              </button>
              <button
                className="flex items-center gap-1 px-2 py-1.5 bg-card/80 rounded-md border border-border backdrop-blur-sm"
              >
                <Filter className="w-3 h-3 text-muted-foreground" />
              </button>
            </>
          )}
          
          <button
            onClick={onSwitchMode}
            className="relative flex items-center gap-1 px-2 py-1.5 bg-card/80 rounded-md border border-border backdrop-blur-sm flex-1"
          >
            <Shield className={cn('w-3 h-3', isElite ? 'text-blue-tech' : 'text-purple-400')} />
            <span className="text-[10px]">{isElite ? '神之塔' : '魔之塔'}</span>
            {!isElite && <RedDot />}
          </button>
        </div>
      </div>

      {/* 塔层滚动列表 */}
      <div 
        ref={scrollRef}
        className="flex-1 px-2.5 py-1 overflow-y-auto"
      >
        <div className="flex flex-col-reverse gap-1.5">
          {floors.map((floor) => (
            <TowerFloorItem
              key={floor.floor}
              floor={floor}
              isSelected={selectedFloor?.floor === floor.floor}
              onClick={() => handleSelectFloor(floor)}
            />
          ))}
        </div>
      </div>

      {/* 迷你排行 */}
      <div className="relative z-10 px-2.5 py-1">
        <GlowCard className="p-2" glowColor="gold">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium">排行榜</span>
            <button onClick={onOpenRank} className="text-[9px] text-primary">查看全部</button>
          </div>
          <div className="flex items-center gap-1.5">
            {miniRank.map((item) => (
              <div key={item.rank} className="flex-1 flex items-center gap-1 p-1.5 bg-muted/30 rounded-md">
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                  item.rank === 1 ? 'bg-gold-primary text-primary-foreground' :
                  item.rank === 2 ? 'bg-gray-300 text-gray-700' :
                  'bg-amber-500 text-white'
                )}>
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-medium truncate">{item.name}</p>
                  <p className="text-[8px] text-muted-foreground">第{item.floor}层</p>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* 底部挑战按钮 */}
      <div className="relative z-10 px-2.5 py-2 bg-gradient-to-t from-background to-transparent">
        <HexButton
          variant="primary"
          className="w-full"
          onClick={handleStartChallenge}
          disabled={!selectedFloor || challengeTimes.current <= 0 || selectedFloor.status === 'cleared'}
        >
          <Sword className="w-4 h-4 mr-1" />
          <span className="text-xs">
          {!selectedFloor 
            ? '选择关卡' 
            : challengeTimes.current <= 0 
              ? '次数不足'
              : selectedFloor.status === 'cleared'
                ? '已通关'
                : `挑战第${selectedFloor.floor}层`
          }
          </span>
        </HexButton>
      </div>

      {/* 层详情弹窗 */}
      {selectedFloor && (
        <TowerFloorDetailPopup
          floor={selectedFloor}
          onClose={() => setSelectedFloor(null)}
          onChallenge={handleStartChallenge}
          canChallenge={challengeTimes.current > 0 && selectedFloor.status !== 'cleared'}
        />
      )}
    </div>
  )
}

// 塔层列表项
interface TowerFloorItemProps {
  floor: TowerFloor
  isSelected: boolean
  onClick: () => void
}

function TowerFloorItem({ floor, isSelected, onClick }: TowerFloorItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg transition-all',
        floor.status === 'locked' 
          ? 'bg-muted/30 opacity-50 cursor-not-allowed' 
          : isSelected
            ? 'bg-primary/20 border border-primary'
            : floor.status === 'current'
              ? 'bg-card/80 border border-primary/50 shadow-md shadow-primary/20'
              : 'bg-card/80 border border-border hover:border-primary/30'
      )}
      disabled={floor.status === 'locked'}
    >
      {/* 层数 */}
      <div className={cn(
        'w-9 h-9 rounded-md flex flex-col items-center justify-center',
        floor.status === 'current' 
          ? 'bg-gradient-to-br from-primary to-accent' 
          : floor.status === 'cleared'
            ? 'bg-success/20'
            : 'bg-muted'
      )}>
        <span className={cn(
          'text-sm font-bold leading-none',
          floor.status === 'current' ? 'text-white' : 
          floor.status === 'cleared' ? 'text-success' : 'text-muted-foreground'
        )}>
          {floor.floor}
        </span>
        <span className="text-[7px] text-white/80">层</span>
      </div>

      {/* 层信息 */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[10px] font-medium">第{floor.floor}层</span>
          {floor.status === 'current' && (
            <span className="px-1 py-0 bg-primary/20 text-primary text-[8px] rounded">当前</span>
          )}
          {floor.firstClearReward && floor.status !== 'cleared' && (
            <span className="px-1 py-0 bg-gold-primary/20 text-gold-primary text-[8px] rounded">首通</span>
          )}
        </div>
        
        {/* 星级 */}
        {floor.status === 'cleared' && (
          <div className="flex gap-0">
            {Array.from({ length: floor.maxStars }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-2.5 h-2.5',
                  i < floor.stars ? 'fill-gold-primary text-gold-primary' : 'fill-muted text-muted'
                )}
              />
            ))}
          </div>
        )}
        
        {floor.status === 'current' && (
          <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <Sword className="w-2.5 h-2.5" />
            <span>推荐战力: {(floor.recommendPower / 10000).toFixed(0)}万</span>
          </div>
        )}
      </div>

      {/* 状态图标 */}
      <div className="flex items-center">
        {floor.status === 'locked' && <Lock className="w-4 h-4 text-muted-foreground" />}
        {floor.status === 'cleared' && <Shield className="w-4 h-4 text-success" />}
        {floor.status === 'current' && <Play className="w-4 h-4 text-primary" />}
      </div>
    </button>
  )
}

// 层详情弹窗
interface TowerFloorDetailPopupProps {
  floor: TowerFloor
  onClose: () => void
  onChallenge: () => void
  canChallenge: boolean
}

function TowerFloorDetailPopup({ floor, onClose, onChallenge, canChallenge }: TowerFloorDetailPopupProps) {
  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[90%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-gradient-to-b from-primary/20 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">第{floor.floor}层</h3>
              <p className="text-sm text-muted-foreground">
                推荐战力: {floor.recommendPower.toLocaleString()}
              </p>
            </div>
            {floor.status === 'cleared' && (
              <div className="flex gap-0.5">
                {Array.from({ length: floor.maxStars }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < floor.stars ? 'fill-gold-primary text-gold-primary' : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 敌人信息 */}
          <div>
            <p className="text-sm font-medium mb-2">敌方阵容</p>
            <div className="space-y-2">
              {floor.enemies.map((enemy, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm">{enemy.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sword className="w-3 h-3 text-gold-primary" />
                    <span className="text-sm text-gold-light">{(enemy.power / 10000).toFixed(1)}万</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 奖励 */}
          <div>
            <p className="text-sm font-medium mb-2">通关奖励</p>
            <div className="flex flex-wrap gap-2">
              {floor.rewards.map((reward, idx) => (
                <span key={idx} className="px-3 py-1 bg-muted/50 rounded-lg text-xs">
                  {reward}
                </span>
              ))}
              {floor.firstClearReward && floor.status !== 'cleared' && (
                <span className="px-3 py-1 bg-gold-primary/20 text-gold-primary rounded-lg text-xs">
                  {floor.firstClearReward}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-3">
          <GameButton variant="secondary" className="flex-1" onClick={onClose}>
            关闭
          </GameButton>
          <GameButton 
            variant="primary" 
            className="flex-1" 
            onClick={onChallenge}
            disabled={!canChallenge}
          >
            {floor.status === 'cleared' ? '已通关' : '挑战'}
          </GameButton>
        </div>
      </div>
    </div>
  )
}

// 爬塔奖励弹窗
interface ClimbTowerRewardPopupProps {
  onClose: () => void
  onClaim: (rewardId: string) => void
}

export function ClimbTowerRewardPopup({ onClose, onClaim }: ClimbTowerRewardPopupProps) {
  const rewards = [
    { id: 'r1', floor: 10, name: '青铜宝箱', claimed: true },
    { id: 'r2', floor: 25, name: '白银宝箱', claimed: true },
    { id: 'r3', floor: 50, name: '黄金宝箱', claimed: false },
    { id: 'r4', floor: 75, name: '铂金宝箱', claimed: false },
    { id: 'r5', floor: 100, name: '钻石宝箱', claimed: false },
  ]

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
          <h3 className="text-lg font-bold">层数奖励</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
          {rewards.map((reward) => (
            <div 
              key={reward.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl border',
                reward.claimed ? 'bg-muted/30 border-border' : 'bg-card border-primary/30'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  reward.claimed ? 'bg-muted' : 'bg-gold-primary/20'
                )}>
                  <Gift className={cn(
                    'w-6 h-6',
                    reward.claimed ? 'text-muted-foreground' : 'text-gold-primary'
                  )} />
                </div>
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">通关第{reward.floor}层</p>
                </div>
              </div>
              <GameButton
                variant={reward.claimed ? 'secondary' : 'primary'}
                size="sm"
                disabled={reward.claimed}
                onClick={() => onClaim(reward.id)}
              >
                {reward.claimed ? '已领取' : '领取'}
              </GameButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
