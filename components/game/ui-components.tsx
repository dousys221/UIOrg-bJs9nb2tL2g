'use client'

import { cn } from '@/lib/utils'
import { Coins, Diamond, Zap, ChevronLeft, Lock, Volume2, VolumeX } from 'lucide-react'

// 游戏按钮组件
interface GameButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  locked?: boolean
  className?: string
  onClick?: () => void
}

export function GameButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  locked = false,
  className,
  onClick
}: GameButtonProps) {
  const baseStyles = 'relative flex items-center justify-center font-bold transition-all duration-200 active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground shadow-lg shadow-gold-primary/30',
    secondary: 'bg-gradient-to-b from-secondary to-secondary/80 text-secondary-foreground border border-border',
    danger: 'bg-gradient-to-b from-destructive to-destructive/80 text-destructive-foreground',
    ghost: 'bg-transparent text-foreground hover:bg-muted'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-[10px] rounded-md',
    md: 'px-3 py-1.5 text-xs rounded-lg',
    lg: 'px-4 py-2 text-sm rounded-xl'
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || locked) && 'opacity-50 grayscale pointer-events-none',
        className
      )}
      onClick={onClick}
      disabled={disabled || locked}
    >
      {children}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-inherit">
          <Lock className="w-4 h-4" />
        </div>
      )}
    </button>
  )
}

// 资源栏组件
interface ResourceBarProps {
  gold?: number
  diamond?: number
  stamina?: number
  maxStamina?: number
  showBack?: boolean
  onBack?: () => void
  className?: string
  onResourceClick?: (type: 'gold' | 'diamond' | 'stamina') => void
}

export function ResourceBar({ gold = 0, diamond = 0, stamina = 0, maxStamina = 100, showBack, onBack, className, onResourceClick }: ResourceBarProps) {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }
  
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {showBack && onBack && (
        <button
          onClick={onBack}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm',
            'transition-all duration-200 hover:bg-card active:scale-95 shrink-0'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <button 
        onClick={() => onResourceClick?.('gold')}
        className="flex items-center gap-1 px-2 py-1 bg-card/80 rounded-full border border-border backdrop-blur-sm"
      >
        <Coins className="w-3 h-3 text-gold-primary" />
        <span className="text-[10px] font-medium text-gold-light">{formatNumber(gold)}</span>
      </button>
      
      <button 
        onClick={() => onResourceClick?.('diamond')}
        className="flex items-center gap-1 px-2 py-1 bg-card/80 rounded-full border border-border backdrop-blur-sm"
      >
        <Diamond className="w-3 h-3 text-blue-glow" />
        <span className="text-[10px] font-medium text-foreground">{formatNumber(diamond)}</span>
      </button>
      
      <button 
        onClick={() => onResourceClick?.('stamina')}
        className="flex items-center gap-1 px-2 py-1 bg-card/80 rounded-full border border-border backdrop-blur-sm"
      >
        <Zap className="w-3 h-3 text-success" />
        <span className="text-[10px] font-medium">
          <span className="text-success">{stamina}</span>
          <span className="text-muted-foreground">/{maxStamina}</span>
        </span>
      </button>
    </div>
  )
}

// 返回按钮
interface BackButtonProps {
  onClick: () => void
  className?: string
}

export function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm',
        'transition-all duration-200 hover:bg-card active:scale-95',
        className
      )}
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  )
}

// 红点组件
interface RedDotProps {
  show?: boolean
  count?: number
  className?: string
}

export function RedDot({ show = true, count, className }: RedDotProps) {
  if (!show) return null
  
  return (
    <div className={cn(
      'absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[12px] h-[12px] px-0.5 rounded-full bg-destructive text-[8px] font-bold text-white',
      className
    )}>
      {count && count > 0 ? (count > 99 ? '99+' : count) : ''}
    </div>
  )
}

// 游戏面板组件 - 通用容器
interface GamePanelProps {
  children: React.ReactNode
  className?: string
}

export function GamePanel({ children, className }: GamePanelProps) {
  return (
    <div className={cn(
      'bg-card/90 backdrop-blur-sm border border-border rounded-xl',
      className
    )}>
      {children}
    </div>
  )
}

// 进度条组件
interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showText?: boolean
  showLabel?: boolean
  color?: 'gold' | 'blue' | 'green' | 'red' | 'primary' | 'secondary' | 'warning' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({ value, max, className, showText = false, showLabel = false, color = 'gold', size = 'md' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    gold: 'bg-gradient-to-r from-gold-primary to-gold-secondary',
    blue: 'bg-gradient-to-r from-blue-tech to-blue-glow',
    green: 'bg-gradient-to-r from-success to-success/80',
    red: 'bg-gradient-to-r from-destructive to-destructive/80',
    primary: 'bg-gradient-to-r from-primary to-primary/80',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600',
    accent: 'bg-gradient-to-r from-accent to-accent/80'
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }
  
  return (
    <div className={cn('relative w-full', className)}>
      <div className={cn('bg-muted rounded-full overflow-hidden', sizes[size])}>
        <div 
          className={cn('h-full rounded-full transition-all duration-300', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {(showText || showLabel) && (
        <span className="absolute right-0 -top-5 text-xs text-muted-foreground">
          {value}/{max}
        </span>
      )}
    </div>
  )
}

// 物品品质框
interface ItemFrameProps {
  quality: 1 | 2 | 3 | 4 | 5
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  locked?: boolean
  count?: number
}

export function ItemFrame({ quality, children, className, onClick, selected, locked, count }: ItemFrameProps) {
  const qualityColors = {
    1: 'from-gray-500 to-gray-600',
    2: 'from-green-500 to-green-600',
    3: 'from-blue-500 to-blue-600',
    4: 'from-purple-500 to-purple-600',
    5: 'from-gold-primary to-gold-secondary'
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-12 h-12 rounded-md overflow-hidden',
        'bg-gradient-to-br p-[1px]',
        qualityColors[quality],
        selected && 'ring-1 ring-gold-primary ring-offset-1 ring-offset-background',
        locked && 'opacity-50 grayscale',
        className
      )}
    >
      <div className="w-full h-full bg-card rounded-[5px] flex items-center justify-center">
        {children}
      </div>
      {count !== undefined && count > 1 && (
        <span className="absolute bottom-0 right-0.5 text-[9px] font-bold text-foreground drop-shadow-lg">
          {count}
        </span>
      )}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Lock className="w-3 h-3" />
        </div>
      )}
    </button>
  )
}

// Tab组件
interface TabItem {
  id: string
  label: string
  redDot?: boolean
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function TabBar({ tabs, activeTab, onChange, className }: TabBarProps) {
  return (
    <div className={cn('flex items-center gap-0.5 p-0.5 bg-card rounded-md border border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex-1 px-2 py-1 text-[10px] font-medium rounded transition-all duration-200',
            activeTab === tab.id
              ? 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {tab.label}
          {tab.redDot && <RedDot className="absolute -top-0.5 -right-0.5" />}
        </button>
      ))}
    </div>
  )
}

// 顶部导航栏
interface TopBarProps {
  title?: string
  onBack?: () => void
  rightContent?: React.ReactNode
  className?: string
}

export function TopBar({ title, onBack, rightContent, className }: TopBarProps) {
  return (
    <div className={cn('flex items-center justify-between px-3 py-2', className)}>
      <div className="flex items-center gap-2">
        {onBack && <BackButton onClick={onBack} />}
        {title && <h1 className="text-sm font-bold">{title}</h1>}
      </div>
      {rightContent}
    </div>
  )
}

// 音量控制
interface VolumeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export function VolumeSlider({ label, value, onChange }: VolumeSliderProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-20 text-sm text-muted-foreground">{label}</span>
      <button 
        onClick={() => onChange(0)}
        className="text-muted-foreground hover:text-foreground"
      >
        {value === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gold-primary
          [&::-webkit-slider-thumb]:shadow-lg"
      />
      <span className="w-10 text-sm text-right">{value}%</span>
    </div>
  )
}

// 六边形按钮组件 - 用于关卡入口等
interface HexButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export function HexButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  onClick
}: HexButtonProps) {
  const baseStyles = 'relative flex items-center justify-center font-bold transition-all duration-200 active:scale-95 clip-hexagon'
  
  const variants = {
    primary: 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground shadow-lg shadow-gold-primary/30',
    secondary: 'bg-gradient-to-b from-blue-tech to-blue-glow text-white shadow-lg shadow-blue-glow/30',
    outline: 'bg-card border-2 border-gold-primary text-gold-primary hover:bg-gold-primary/10'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 grayscale pointer-events-none',
        'rounded-lg',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// 发光卡片组件 - 用于展示重要内容
interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'gold' | 'blue' | 'purple' | 'green'
  onClick?: () => void
}

export function GlowCard({ children, className, glowColor = 'gold', onClick }: GlowCardProps) {
  const glowColors = {
    gold: 'shadow-gold-primary/20 hover:shadow-gold-primary/40 border-gold-primary/30',
    blue: 'shadow-blue-glow/20 hover:shadow-blue-glow/40 border-blue-glow/30',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40 border-purple-500/30',
    green: 'shadow-success/20 hover:shadow-success/40 border-success/30'
  }
  
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-card rounded-lg border p-2.5 transition-all duration-300',
        'shadow-md backdrop-blur-sm',
        glowColors[glowColor],
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
    >
      {children}
    </div>
  )
}
