'use client'

import { useState, useCallback } from 'react'
import { 
  ChevronLeft, Trophy, Crown, Medal, Sword, Star, 
  Gift, Users, Flame, Shield, ChevronRight, Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ResourceBar, TabBar, GameButton, GlowCard, RedDot 
} from '../ui-components'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

// 排行榜类型
interface RankingType {
  id: string
  name: string
  icon: React.ElementType
  description: string
  topPlayer?: RankPlayer
  canWorship: boolean
  hasWorshiped: boolean
  hasReward: boolean
}

// 排名玩家数据
interface RankPlayer {
  uid: string
  name: string
  level: number
  power: number
  rank: number
  avatar?: string
  guildName?: string
  score?: number | string
}

interface RankingMainScreenProps {
  player: PlayerInfo
  onBack: () => void
  onOpenRankDetail: (rankId: string) => void
  onNavigate: (screen: GameScreen) => void
}

// 排行榜标签
const rankTabs = [
  { id: 'power', label: '战力榜' },
  { id: 'level', label: '等级榜' },
  { id: 'tower', label: '爬塔榜' },
]

// 模拟排行榜类型数据
const mockRankingTypes: RankingType[] = [
  {
    id: 'power',
    name: '战力排行',
    icon: Sword,
    description: '展示服务器内战力最强的玩家',
    topPlayer: { uid: '1001', name: '剑圣无双', level: 100, power: 2580000, rank: 1, guildName: '王者公会' },
    canWorship: true,
    hasWorshiped: false,
    hasReward: true,
  },
  {
    id: 'level',
    name: '等级排行',
    icon: Star,
    description: '展示服务器内等级最高的玩家',
    topPlayer: { uid: '1002', name: '练级狂人', level: 100, power: 2150000, rank: 1, guildName: '肝帝联盟' },
    canWorship: true,
    hasWorshiped: true,
    hasReward: false,
  },
  {
    id: 'tower',
    name: '神之塔排行',
    icon: Flame,
    description: '展示神之塔挑战层数最高的玩家',
    topPlayer: { uid: '1003', name: '塔神', level: 98, power: 2380000, rank: 1, score: '第150层', guildName: '登峰造极' },
    canWorship: true,
    hasWorshiped: false,
    hasReward: true,
  },
  {
    id: 'arena',
    name: '竞技场排行',
    icon: Trophy,
    description: '展示竞技场积分最高的玩家',
    topPlayer: { uid: '1004', name: '竞技王者', level: 95, power: 2200000, rank: 1, score: '3500分', guildName: '战神殿' },
    canWorship: true,
    hasWorshiped: false,
    hasReward: false,
  },
  {
    id: 'guild',
    name: '公会排行',
    icon: Shield,
    description: '展示服务器内实力最强的公会',
    topPlayer: { uid: '2001', name: '王者公会', level: 50, power: 85000000, rank: 1 },
    canWorship: false,
    hasWorshiped: false,
    hasReward: true,
  },
]

export function RankingMainScreen({ 
  player, 
  onBack, 
  onOpenRankDetail,
  onNavigate 
}: RankingMainScreenProps) {
  const [activeTab, setActiveTab] = useState('power')
  const [rankings, setRankings] = useState<RankingType[]>(mockRankingTypes)

  // 膜拜操作
  const handleWorship = useCallback((rankId: string) => {
    setRankings(prev => prev.map(r => 
      r.id === rankId ? { ...r, hasWorshiped: true } : r
    ))
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* 顶部导航 */}
      <div className="relative z-10 px-2.5 pt-2 pb-1">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm transition-all duration-200 hover:bg-card active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h1 className="text-sm font-bold">排行榜</h1>
          
          <div className="w-8" />
        </div>
      </div>

      {/* 标签切换 */}
      <div className="px-2.5 py-1">
        <TabBar tabs={rankTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 排行榜卡片列表 */}
      <div className="flex-1 px-2.5 py-1 overflow-y-auto space-y-2">
        {rankings.map((rank) => (
          <RankingCard
            key={rank.id}
            ranking={rank}
            onOpenDetail={() => onOpenRankDetail(rank.id)}
            onWorship={() => handleWorship(rank.id)}
          />
        ))}
      </div>
    </div>
  )
}

// 排行榜卡片组件
interface RankingCardProps {
  ranking: RankingType
  onOpenDetail: () => void
  onWorship: () => void
}

function RankingCard({ ranking, onOpenDetail, onWorship }: RankingCardProps) {
  const Icon = ranking.icon

  return (
    <GlowCard className="p-2.5" glowColor="gold">
      {/* 榜单标题 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-bold">{ranking.name}</h3>
            <p className="text-[9px] text-muted-foreground line-clamp-1">{ranking.description}</p>
          </div>
        </div>
        {ranking.hasReward && <RedDot />}
      </div>

      {/* 冠军信息 */}
      {ranking.topPlayer && ranking.topPlayer.uid !== '0' && (
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md mb-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-secondary to-gold-primary flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <Crown className="absolute -top-1 -right-0.5 w-4 h-4 text-gold-primary fill-gold-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold truncate">{ranking.topPlayer.name}</span>
              <span className="text-[9px] text-muted-foreground">Lv.{ranking.topPlayer.level}</span>
            </div>
            {ranking.topPlayer.guildName && (
              <p className="text-[9px] text-muted-foreground truncate">{ranking.topPlayer.guildName}</p>
            )}
            <div className="flex items-center gap-1">
              {ranking.topPlayer.score ? (
                <span className="text-[10px] text-gold-light font-bold">{ranking.topPlayer.score}</span>
              ) : (
                <>
                  <Sword className="w-2.5 h-2.5 text-gold-primary" />
                  <span className="text-[10px] text-gold-light font-bold">
                    {ranking.topPlayer.power.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        {ranking.canWorship && (
          <GameButton
            variant={ranking.hasWorshiped ? 'secondary' : 'primary'}
            size="sm"
            className="flex-1"
            onClick={onWorship}
            disabled={ranking.hasWorshiped}
          >
            <Heart className="w-3 h-3 mr-0.5" />
            {ranking.hasWorshiped ? '已膜拜' : '膜拜'}
          </GameButton>
        )}
        <GameButton
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onOpenDetail}
        >
          详情
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </GameButton>
      </div>
    </GlowCard>
  )
}

// ========== 单榜详情界面 ==========
interface RankingSingleListScreenProps {
  player: PlayerInfo
  rankType: string
  onBack: () => void
}

// 模拟排名列表数据
const mockRankList: RankPlayer[] = [
  { uid: '1001', name: '剑圣无双', level: 100, power: 2580000, rank: 1, guildName: '王者公会' },
  { uid: '1002', name: '天下第一', level: 99, power: 2450000, rank: 2, guildName: '无敌战队' },
  { uid: '1003', name: '战神降临', level: 98, power: 2380000, rank: 3, guildName: '神之领域' },
  { uid: '1004', name: '暗夜杀手', level: 97, power: 2250000, rank: 4, guildName: '暗影联盟' },
  { uid: '1005', name: '光明使者', level: 96, power: 2180000, rank: 5, guildName: '圣光教会' },
  { uid: '1006', name: '疾风剑豪', level: 95, power: 2120000, rank: 6, guildName: '王者公会' },
  { uid: '1007', name: '冰霜女王', level: 95, power: 2080000, rank: 7, guildName: '冰雪王国' },
  { uid: '1008', name: '烈焰战神', level: 94, power: 2050000, rank: 8, guildName: '炎龙军团' },
  { uid: '1009', name: '雷霆之怒', level: 93, power: 1980000, rank: 9, guildName: '雷电先锋' },
  { uid: '1010', name: '暴风领主', level: 92, power: 1920000, rank: 10, guildName: '风暴使者' },
]

export function RankingSingleListScreen({ 
  player, 
  rankType, 
  onBack 
}: RankingSingleListScreenProps) {
  const [rankList] = useState<RankPlayer[]>(mockRankList)
  const [myRank] = useState<RankPlayer>({
    uid: player.id,
    name: player.name,
    level: player.level,
    power: player.power,
    rank: 156,
  })

  // 获取排名图标
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-gold-primary fill-gold-primary" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300 fill-gray-300" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
  }

  // 前三名
  const top3 = rankList.slice(0, 3)
  const restList = rankList.slice(3)

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-gold-primary/10 blur-3xl" />
      </div>

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
            {rankType === 'power' ? '战力排行' : rankType === 'level' ? '等级排行' : '排行榜'}
          </h1>
          
          <div className="w-8" />
        </div>
      </div>

      {/* Top3 展示区 */}
      <div className="relative z-10 px-2.5 py-2">
        <div className="flex items-end justify-center gap-2">
          {/* 第二名 */}
          {top3[1] && (
            <div className="flex flex-col items-center w-[70px]">
              <div className="relative mb-1">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border border-gray-300">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-gray-700">2</span>
                </div>
              </div>
              <p className="text-[10px] font-medium truncate w-full text-center">{top3[1].name}</p>
              <p className="text-[8px] text-muted-foreground">Lv.{top3[1].level}</p>
              <p className="text-[9px] text-gold-light">{(top3[1].power / 10000).toFixed(1)}万</p>
            </div>
          )}

          {/* 第一名 */}
          {top3[0] && (
            <div className="flex flex-col items-center w-[80px] -mt-2">
              <Crown className="w-5 h-5 text-gold-primary fill-gold-primary" />
              <div className="relative mb-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-secondary to-gold-primary flex items-center justify-center border border-gold-primary shadow-md shadow-gold-primary/30">
                  <Users className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gold-primary flex items-center justify-center">
                  <span className="text-[9px] font-bold text-primary-foreground">1</span>
                </div>
              </div>
              <p className="text-[11px] font-bold truncate w-full text-center">{top3[0].name}</p>
              <p className="text-[8px] text-muted-foreground">Lv.{top3[0].level}</p>
              <p className="text-[10px] text-gold-primary font-bold">{(top3[0].power / 10000).toFixed(1)}万</p>
            </div>
          )}

          {/* 第三名 */}
          {top3[2] && (
            <div className="flex flex-col items-center w-[70px]">
              <div className="relative mb-1">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border border-amber-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">3</span>
                </div>
              </div>
              <p className="text-[10px] font-medium truncate w-full text-center">{top3[2].name}</p>
              <p className="text-[8px] text-muted-foreground">Lv.{top3[2].level}</p>
              <p className="text-[9px] text-gold-light">{(top3[2].power / 10000).toFixed(1)}万</p>
            </div>
          )}
        </div>
      </div>

      {/* 排名列表 */}
      <div className="flex-1 px-2.5 overflow-y-auto">
        <div className="space-y-1.5">
          {restList.map((player) => (
            <RankListItem key={player.uid} player={player} getRankIcon={getRankIcon} />
          ))}
        </div>

        {/* 空态 */}
        {restList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Trophy className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-xs">暂无排名数据</p>
          </div>
        )}
      </div>

      {/* 我的排名 (固定底部) */}
      <div className="relative z-10 px-2.5 py-2 bg-gradient-to-t from-background via-background to-transparent">
        <GlowCard className="p-2" glowColor="blue">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{myRank.rank}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-tech to-accent flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{myRank.name}</p>
              <p className="text-[9px] text-muted-foreground">Lv.{myRank.level}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Sword className="w-3 h-3 text-gold-primary" />
                <span className="text-[11px] font-bold text-gold-light">{myRank.power.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}

// 排名列表项组件
function RankListItem({ 
  player, 
  getRankIcon 
}: { 
  player: RankPlayer
  getRankIcon: (rank: number) => React.ReactNode 
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
      <div className="w-7 h-7 flex items-center justify-center">
        {getRankIcon(player.rank)}
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
        <Users className="w-4 h-4 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium truncate">{player.name}</p>
        <p className="text-[9px] text-muted-foreground truncate">
          Lv.{player.level} {player.guildName && `· ${player.guildName}`}
        </p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-0.5">
          <Sword className="w-2.5 h-2.5 text-gold-primary" />
          <span className="text-[10px] font-medium text-gold-light">
            {(player.power / 10000).toFixed(1)}万
          </span>
        </div>
      </div>
    </div>
  )
}
