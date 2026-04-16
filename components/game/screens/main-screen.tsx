'use client'

import { useState } from 'react'
import { ResourceBar, RedDot, GameButton } from '../ui-components'
import { 
  Sword, Package, User, Store, ListTodo, Users, Settings, Mail, Trophy,
  Sparkles, Gift, Target, Shield, Flame
} from 'lucide-react'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

interface MainScreenProps {
  player: PlayerInfo
  onNavigate: (screen: GameScreen) => void
  redDots?: Record<string, boolean>
}

const activityItems = [
  { id: 'event1', icon: Gift, label: '每日签到', color: 'text-gold-primary' },
  { id: 'event2', icon: Sparkles, label: '限时活动', color: 'text-blue-tech' },
  { id: 'event3', icon: Target, label: '战令系统', color: 'text-gold-secondary' },
  { id: 'event4', icon: Shield, label: '军团战', color: 'text-success' },
  { id: 'event5', icon: Flame, label: '竞技场', color: 'text-destructive' },
]

const quickButtons = [
  { id: 'mission', icon: ListTodo, label: '任务', screen: 'mission' as GameScreen },
  { id: 'rank', icon: Trophy, label: '排行', screen: 'ranking-main' as GameScreen },
  { id: 'mail', icon: Mail, label: '邮件', screen: 'mail' as GameScreen },
  { id: 'friend', icon: Users, label: '好友', screen: 'social' as GameScreen },
]

const featureButtons = [
  { id: 'arena', icon: Trophy, label: '竞技场', screen: 'arena-type' as GameScreen, redDot: true },
  { id: 'recruit', icon: Sparkles, label: '召唤', screen: 'recruit-main' as GameScreen, redDot: true },
  { id: 'guild', icon: Shield, label: '公会', screen: 'guild' as GameScreen, redDot: false },
  { id: 'tower', icon: Flame, label: '爬塔', screen: 'climb-tower' as GameScreen, redDot: true },
  { id: 'map', icon: Gift, label: '地图', screen: 'stage-map' as GameScreen, redDot: false },
]

export function MainScreen({ player, onNavigate, redDots = {} }: MainScreenProps) {
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-blue-tech/3 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[150px] h-[150px] rounded-full bg-gold-primary/3 blur-3xl" />
      </div>
      
      {/* 顶部状态栏 */}
      <div className="relative z-10 px-2.5 pt-2 pb-1">
        <div className="flex items-center justify-between gap-2">
          {/* 玩家信息 */}
          <button 
            onClick={() => setShowPlayerInfo(!showPlayerInfo)}
            className="flex items-center gap-2 px-2 py-1.5 bg-card/80 rounded-lg border border-border backdrop-blur-sm"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-gold-secondary to-gold-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
              <span className="absolute -bottom-0.5 -right-0.5 px-1 py-0 bg-destructive rounded text-[8px] font-bold text-white">
                V{player.vip}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold leading-tight">{player.name}</p>
              <p className="text-[9px] text-muted-foreground">Lv.{player.level}</p>
            </div>
          </button>
          
          {/* 资源栏 */}
          <ResourceBar
            gold={player.gold}
            diamond={player.diamond}
            stamina={player.stamina}
            maxStamina={player.maxStamina}
          />
        </div>
        
        {/* 战力显示 */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 py-1">
          <Sword className="w-3 h-3 text-gold-primary" />
          <span className="text-[10px] text-muted-foreground">战力</span>
          <span className="text-sm font-bold text-gold-light">{player.power.toLocaleString()}</span>
        </div>
      </div>
      
      {/* 中部活动区域 */}
      <div className="flex-1 relative z-10 px-2.5 overflow-hidden">
        {/* 活动入口网格 */}
        <div className="grid grid-cols-5 gap-1.5 py-2">
          {activityItems.map((item) => (
            <button
              key={item.id}
              className="relative flex flex-col items-center gap-1 py-1.5 px-1 bg-card/60 rounded-lg border border-border backdrop-blur-sm hover:bg-card transition-colors"
            >
              <div className={`p-1.5 rounded-md bg-muted ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-medium text-center leading-tight">{item.label}</span>
              {redDots[item.id] && <RedDot />}
            </button>
          ))}
        </div>
        
        {/* 主战斗入口 - 进入关卡主界面 */}
        <div className="mt-2">
          <GameButton
            variant="primary"
            size="lg"
            className="w-full h-12"
            onClick={() => onNavigate('level-main')}
          >
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5" />
              <span className="text-sm font-bold">进入战斗</span>
            </div>
          </GameButton>
        </div>
        
        {/* 功能入口按钮 */}
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {featureButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => onNavigate(btn.screen)}
              className="relative flex flex-col items-center gap-0.5 py-1.5 bg-card/60 rounded-md border border-border hover:bg-card transition-colors"
            >
              <btn.icon className="w-4 h-4 text-primary" />
              <span className="text-[8px] text-muted-foreground">{btn.label}</span>
              {btn.redDot && <RedDot />}
            </button>
          ))}
        </div>
      </div>
      
      {/* 底部功能区 */}
      <div className="relative z-10 px-2.5 pb-3 space-y-2">
        {/* 快捷功能按钮 */}
        <div className="flex items-center justify-end gap-1.5">
          {quickButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => onNavigate(btn.screen)}
              className="relative flex flex-col items-center gap-0.5 w-12 py-1.5 bg-card/80 rounded-lg border border-border backdrop-blur-sm hover:bg-card transition-colors"
            >
              <btn.icon className="w-4 h-4 text-gold-primary" />
              <span className="text-[8px] text-muted-foreground">{btn.label}</span>
              {redDots[btn.id] && <RedDot />}
            </button>
          ))}
        </div>
        
        {/* 底部导航栏 */}
        <div className="flex items-center justify-around py-1.5 bg-card/80 rounded-xl border border-border backdrop-blur-sm">
          <NavButton 
            icon={Package} 
            label="背包" 
            onClick={() => onNavigate('bag')} 
            redDot={redDots.bag}
          />
          <NavButton 
            icon={User} 
            label="英雄" 
            onClick={() => onNavigate('hero-list')} 
            redDot={redDots.role}
          />
          <NavButton 
            icon={Store} 
            label="商城" 
            onClick={() => onNavigate('shop')} 
            redDot={redDots.shop}
          />
          <NavButton 
            icon={Settings} 
            label="设置" 
            onClick={() => onNavigate('setting')} 
          />
        </div>
      </div>
      
      {/* 玩家信息弹窗 */}
      {showPlayerInfo && (
        <div 
          className="absolute inset-0 z-20 bg-black/60"
          onClick={() => setShowPlayerInfo(false)}
        >
          <div 
            className="absolute top-14 left-2.5 right-2.5 bg-card rounded-lg border border-border p-3 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-secondary to-gold-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">{player.name}</p>
                <p className="text-[10px] text-muted-foreground">UID: {player.id}</p>
                <p className="text-[10px] text-muted-foreground">公会: {player.guildName || '未加入'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border">
              <div className="text-center">
                <p className="text-base font-bold text-gold-light">{player.level}</p>
                <p className="text-[9px] text-muted-foreground">等级</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-blue-tech">{player.power.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">战力</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-destructive">VIP{player.vip}</p>
                <p className="text-[9px] text-muted-foreground">等级</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NavButton({ 
  icon: Icon, 
  label, 
  onClick, 
  redDot 
}: { 
  icon: React.ElementType
  label: string
  onClick: () => void
  redDot?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 px-3 py-1"
    >
      <Icon className="w-4 h-4 text-foreground" />
      <span className="text-[9px] text-muted-foreground">{label}</span>
      {redDot && <RedDot />}
    </button>
  )
}
