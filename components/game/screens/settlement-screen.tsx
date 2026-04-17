'use client'

import { useState } from 'react'
import { GameButton, ItemFrame, TabBar } from '../ui-components'
import { Trophy, Skull, ArrowUp, BarChart3, Package, Coins, Star } from 'lucide-react'
import type { BattleResult, ItemData } from '@/lib/game-types'

interface SettlementScreenProps {
  result: BattleResult
  onContinue: () => void
  onShowStats: () => void
}

const mockDrops: ItemData[] = [
  { id: '1', name: '能量核心', type: 'material', quality: 4, count: 5, icon: 'core' },
  { id: '2', name: '合金碎片', type: 'fragment', quality: 3, count: 20, icon: 'fragment' },
  { id: '3', name: '经验药水', type: 'consumable', quality: 2, count: 3, icon: 'potion' },
]

export function SettlementScreen({ result, onContinue, onShowStats }: SettlementScreenProps) {
  const [showDrops, setShowDrops] = useState(true)
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {result.win ? (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold-primary/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(254,192,0,0.1),_transparent_50%)]" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-destructive/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(239,68,68,0.1),_transparent_50%)]" />
          </>
        )}
      </div>
      
      {/* 结果标题 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-8">
        {result.win ? (
          <>
            <div className="relative">
              <Trophy className="w-16 h-16 text-gold-primary animate-bounce" />
              <div className="absolute -inset-3 bg-gold-primary/20 blur-2xl rounded-full -z-10" />
            </div>
            <h1 className="mt-4 text-2xl font-bold bg-gradient-to-b from-gold-light to-gold-primary bg-clip-text text-transparent">
              战斗胜利
            </h1>
          </>
        ) : (
          <>
            <div className="relative">
              <Skull className="w-16 h-16 text-destructive animate-pulse" />
              <div className="absolute -inset-3 bg-destructive/20 blur-2xl rounded-full -z-10" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-destructive">
              战斗失败
            </h1>
          </>
        )}
        
        {/* 战斗统计概览 */}
        <div className="mt-6 flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gold-light">{result.damage.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">总伤害</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-blue-tech">+{result.exp.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">经验值</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-success">+{result.gold.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">金币</p>
          </div>
        </div>
      </div>
      
      {/* 奖励展示区 */}
      {result.win && showDrops && (
        <div className="relative z-10 px-4 pb-4">
          <div className="bg-card/80 rounded-xl border border-border p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gold-primary" />
                <span className="font-medium">获得物品</span>
              </div>
              <span className="text-xs text-muted-foreground">点击查看详情</span>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {mockDrops.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-1">
                  <ItemFrame quality={item.quality} count={item.count}>
                    <div className="w-full h-full flex items-center justify-center text-gold-primary/50">
                      {item.type === 'material' && <Star className="w-6 h-6" />}
                      {item.type === 'fragment' && <Package className="w-6 h-6" />}
                      {item.type === 'consumable' && <Coins className="w-6 h-6" />}
                    </div>
                  </ItemFrame>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[68px]">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 底部操作区 */}
      <div className="relative z-10 px-4 pb-6 space-y-3">
        {result.win ? (
          <GameButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onContinue}
          >
            确认
          </GameButton>
        ) : (
          <div className="space-y-3">
            <GameButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onContinue}
            >
              <div className="flex items-center gap-2">
                <ArrowUp className="w-5 h-5" />
                <span>变强助手</span>
              </div>
            </GameButton>
            
            <div className="flex items-center gap-3">
              <GameButton
                variant="secondary"
                className="flex-1"
                onClick={onShowStats}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>战斗统计</span>
                </div>
              </GameButton>
              <GameButton
                variant="secondary"
                className="flex-1"
                onClick={onContinue}
              >
                返回
              </GameButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 战斗统计详情组件
interface DamageStatsProps {
  onBack: () => void
}

export function DamageStatsPanel({ onBack }: DamageStatsProps) {
  const [activeTab, setActiveTab] = useState('attack')
  
  const tabs = [
    { id: 'attack', label: '伤害统计' },
    { id: 'defense', label: '承伤统计' },
  ]
  
  const statsData = [
    { name: '星辰战士', value: 125680, percent: 100 },
    { name: '机甲卫士', value: 98500, percent: 78 },
    { name: '能量使者', value: 76200, percent: 60 },
    { name: '暗影刺客', value: 54300, percent: 43 },
  ]
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 标题 */}
      <div className="px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-b from-gold-light to-gold-primary bg-clip-text text-transparent">
          战斗统计
        </h1>
      </div>
      
      {/* Tab切换 */}
      <div className="px-4 pb-4">
        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
      
      {/* 统计列表 */}
      <div className="flex-1 px-4 space-y-3 overflow-y-auto">
        {statsData.map((stat, index) => (
          <div 
            key={stat.name}
            className="p-4 bg-card/80 rounded-xl border border-border backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gold-primary/20 text-gold-primary text-xs font-bold">
                  {index + 1}
                </span>
                <span className="font-medium">{stat.name}</span>
              </div>
              <span className="text-gold-light font-bold">{stat.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-primary to-gold-secondary rounded-full transition-all duration-500"
                style={{ width: `${stat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部返回 */}
      <div className="px-4 py-6">
        <GameButton
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onBack}
        >
          返回
        </GameButton>
      </div>
    </div>
  )
}
