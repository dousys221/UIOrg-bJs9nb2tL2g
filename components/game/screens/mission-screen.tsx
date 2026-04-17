'use client'

import { useState } from 'react'
import { TopBar, ResourceBar, TabBar, GameButton, ProgressBar, RedDot } from '../ui-components'
import { Gift, ChevronRight, Check, Lock, Trophy } from 'lucide-react'
import type { PlayerInfo, MissionData } from '@/lib/game-types'
import { mockMissions } from '@/lib/game-store'

interface MissionScreenProps {
  player: PlayerInfo
  onBack: () => void
  onJump: (target: string) => void
}

const missionTabs = [
  { id: 'daily', label: '日常任务', redDot: true },
  { id: 'achievement', label: '成就' },
]

const dailyBoxes = [
  { id: 1, points: 20, claimed: true },
  { id: 2, points: 50, claimed: true },
  { id: 3, points: 80, claimed: false },
  { id: 4, points: 100, claimed: false },
]

const mockAchievements: MissionData[] = [
  { id: 'a1', title: '初出茅庐', description: '完成新手引导', progress: 1, maxProgress: 1, status: 'claimed', rewards: [] },
  { id: 'a2', title: '百战勇士', description: '参与100场战斗', progress: 58, maxProgress: 100, status: 'ongoing', rewards: [] },
  { id: 'a3', title: '财富积累', description: '累计获得100万金币', progress: 45, maxProgress: 100, status: 'ongoing', rewards: [] },
]

export function MissionScreen({ player, onBack, onJump }: MissionScreenProps) {
  const [activeTab, setActiveTab] = useState('daily')
  const currentPoints = 65
  
  const missions = activeTab === 'daily' ? mockMissions : mockAchievements
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <TopBar 
        title="任务" 
        onBack={onBack}
        rightContent={
          <ResourceBar
            gold={player.gold}
            diamond={player.diamond}
            stamina={player.stamina}
            maxStamina={player.maxStamina}
          />
        }
      />
      
      {/* Tab切换 */}
      <div className="px-3 pb-2">
        <TabBar 
          tabs={missionTabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>
      
      {/* 日常活跃度奖励 */}
      {activeTab === 'daily' && (
        <div className="px-3 pb-3">
          <div className="p-3 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">今日活跃度</span>
              <span className="text-xs">
                <span className="text-gold-light font-bold">{currentPoints}</span>
                <span className="text-muted-foreground">/100</span>
              </span>
            </div>
            
            {/* 进度条 */}
            <div className="relative mb-3">
              <ProgressBar value={currentPoints} max={100} color="gold" size="sm" />
              {/* 节点标记 */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between -translate-y-1/2">
                {dailyBoxes.map((box) => (
                  <div
                    key={box.id}
                    className="relative"
                    style={{ left: `${box.points - 2}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                  >
                    <div className={`w-0.5 h-2 rounded-full ${
                      currentPoints >= box.points ? 'bg-gold-primary' : 'bg-muted'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* 宝箱 */}
            <div className="flex items-center justify-between">
              {dailyBoxes.map((box) => (
                <button
                  key={box.id}
                  className="relative flex flex-col items-center gap-0.5"
                >
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    box.claimed 
                      ? 'bg-muted' 
                      : currentPoints >= box.points 
                        ? 'bg-gold-primary/20 animate-pulse' 
                        : 'bg-muted/50'
                  }`}>
                    {box.claimed ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : currentPoints >= box.points ? (
                      <Gift className="w-5 h-5 text-gold-primary" />
                    ) : (
                      <Gift className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground">{box.points}</span>
                  {currentPoints >= box.points && !box.claimed && (
                    <RedDot className="absolute -top-0.5 -right-0.5 w-2 h-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 一键领取 */}
      <div className="px-3 pb-2">
        <GameButton 
          variant="primary" 
          size="sm"
          className="w-full"
          disabled={!missions.some(m => m.status === 'completed')}
        >
          一键领取
        </GameButton>
      </div>
      
      {/* 任务列表 */}
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-2 pb-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="p-2.5 bg-card/80 rounded-lg border border-border backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-medium truncate">{mission.title}</h4>
                    {mission.status === 'claimed' && (
                      <span className="px-1.5 py-0.5 bg-success/20 text-success rounded text-[9px] shrink-0">
                        完成
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{mission.description}</p>
                  
                  {/* 进度 */}
                  {mission.status !== 'claimed' && (
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-muted-foreground">进度</span>
                        <span className="text-[10px]">
                          <span className={mission.progress >= mission.maxProgress ? 'text-success' : 'text-gold-light'}>
                            {mission.progress}
                          </span>
                          <span className="text-muted-foreground">/{mission.maxProgress}</span>
                        </span>
                      </div>
                      <ProgressBar 
                        value={mission.progress} 
                        max={mission.maxProgress} 
                        color={mission.progress >= mission.maxProgress ? 'green' : 'gold'}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
                
                {/* 操作按钮 */}
                <div className="flex-shrink-0">
                  {mission.status === 'ongoing' && mission.progress < mission.maxProgress && mission.jumpTo && (
                    <GameButton 
                      variant="secondary" 
                      size="sm"
                      onClick={() => onJump(mission.jumpTo!)}
                    >
                      <div className="flex items-center gap-0.5">
                        <span>前往</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </GameButton>
                  )}
                  {mission.status === 'completed' && (
                    <GameButton variant="primary" size="sm">
                      领取
                    </GameButton>
                  )}
                  {mission.status === 'claimed' && (
                    <div className="flex items-center justify-center w-10 h-10">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
