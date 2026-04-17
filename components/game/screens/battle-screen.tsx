'use client'

import { useState, useEffect } from 'react'
import { GameButton, ProgressBar } from '../ui-components'
import { 
  Play, FastForward, SkipForward, X, Shield, MessageCircle, 
  ChevronRight, Send, Lock
} from 'lucide-react'

interface BattleScreenProps {
  onExit: () => void
  onBattleEnd: (win: boolean) => void
}

export function BattleScreen({ onExit, onBattleEnd }: BattleScreenProps) {
  const [battleProgress, setBattleProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [showChat, setShowChat] = useState(false)
  const [playerHp, setPlayerHp] = useState(100)
  const [enemyHp, setEnemyHp] = useState(100)
  const [chatMessage, setChatMessage] = useState('')
  const [isSpeedLocked, setIsSpeedLocked] = useState(false)
  const [isSkipLocked, setIsSkipLocked] = useState(true)
  
  // 模拟战斗进程
  useEffect(() => {
    const interval = setInterval(() => {
      setBattleProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // 随机决定胜负
          const win = Math.random() > 0.3
          setTimeout(() => onBattleEnd(win), 500)
          return 100
        }
        return prev + (speed * 2)
      })
      
      // 模拟血量变化
      if (Math.random() > 0.5) {
        setEnemyHp((prev) => Math.max(0, prev - Math.random() * 15))
      }
      if (Math.random() > 0.7) {
        setPlayerHp((prev) => Math.max(0, prev - Math.random() * 10))
      }
    }, 200)
    
    return () => clearInterval(interval)
  }, [speed, onBattleEnd])
  
  const toggleSpeed = () => {
    if (isSpeedLocked) return
    setSpeed((prev) => (prev === 1 ? 2 : 1))
  }
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-background to-card overflow-hidden">
      {/* 战斗场景背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(59,130,246,0.1),_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
        {/* 网格线装饰 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* 顶部战斗信息 */}
      <div className="relative z-10 px-3 pt-3 pb-1.5 space-y-2">
        {/* 敌方信息 */}
        <div className="flex items-center gap-2 p-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
          <div className="w-10 h-10 rounded-md bg-destructive/20 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-bold text-destructive">敌方单位</span>
              <span className="text-[10px] text-muted-foreground">Lv.60</span>
            </div>
            <ProgressBar value={enemyHp} max={100} color="red" />
          </div>
        </div>
        
        {/* 我方信息 */}
        <div className="flex items-center gap-3 p-3 bg-card/80 rounded-xl border border-border backdrop-blur-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-tech/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-tech" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-blue-tech">我方单位</span>
              <span className="text-xs text-muted-foreground">Lv.58</span>
            </div>
            <ProgressBar value={playerHp} max={100} color="blue" />
          </div>
        </div>
      </div>
      
      {/* 战斗区域 */}
      <div className="flex-1 relative z-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-bold text-gold-light animate-pulse">
            战斗中
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            回合 {Math.floor(battleProgress / 10) + 1}
          </p>
        </div>
      </div>
      
      {/* 战斗日志/聊天区 */}
      {showChat && (
        <div className="absolute bottom-32 left-4 right-4 z-20 bg-card/95 rounded-xl border border-border p-3 space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">战斗聊天</span>
            <button onClick={() => setShowChat(false)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="h-24 overflow-y-auto space-y-1 text-xs text-muted-foreground">
            <p>[系统] 战斗开始</p>
            <p>[玩家A] 冲冲冲！</p>
            <p>[系统] 敌方受到12,580点伤害</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="发送消息..."
              className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none"
            />
            <button className="p-2 bg-gold-primary rounded-lg">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      )}
      
      {/* 底部操作栏 */}
      <div className="relative z-10 px-4 pb-6 space-y-3">
        {/* 战斗进度 */}
        <div className="px-2">
          <ProgressBar value={battleProgress} max={100} color="gold" />
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center justify-between gap-2">
          {/* 退出按钮 */}
          <button
            onClick={onExit}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* 中间操作组 */}
          <div className="flex items-center gap-2">
            {/* 聊天按钮 */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`flex items-center justify-center w-12 h-12 rounded-xl border ${
                showChat ? 'bg-gold-primary/20 border-gold-primary' : 'bg-card border-border'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            
            {/* Buff预览 */}
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border">
              <Shield className="w-5 h-5 text-blue-tech" />
            </button>
          </div>
          
          {/* 右侧控制组 */}
          <div className="flex items-center gap-2">
            {/* 倍速按钮 */}
            <button
              onClick={toggleSpeed}
              className={`relative flex items-center justify-center w-12 h-12 rounded-xl border ${
                speed === 2 ? 'bg-gold-primary/20 border-gold-primary' : 'bg-card border-border'
              } ${isSpeedLocked ? 'opacity-50' : ''}`}
            >
              {speed === 1 ? (
                <Play className="w-5 h-5" />
              ) : (
                <FastForward className="w-5 h-5 text-gold-primary" />
              )}
              {isSpeedLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </button>
            
            {/* 跳过按钮 */}
            <button
              onClick={() => !isSkipLocked && onBattleEnd(true)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border ${
                isSkipLocked ? 'opacity-50' : ''
              }`}
            >
              <SkipForward className="w-5 h-5" />
              {isSkipLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
