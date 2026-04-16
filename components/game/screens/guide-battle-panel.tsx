"use client"

import { useState, useEffect } from "react"
import { Sword, Shield, Zap, Heart, SkipForward, Target, Users } from "lucide-react"
import { GameButton, GamePanel, ProgressBar } from "../ui-components"

interface UnitData {
  id: number
  name: string
  hp: number
  maxHp: number
  isEnemy: boolean
  position: number
  isActive?: boolean
}

interface GuideBattlePanelProps {
  guideType?: string
  onBattleEnd: (result: { victory: boolean; hpList: number[]; drops: string[] }) => void
  onSkip?: () => void
}

// 模拟战斗单位数据
const mockUnits: UnitData[] = [
  { id: 1, name: "艾琳", hp: 85, maxHp: 100, isEnemy: false, position: 1, isActive: true },
  { id: 2, name: "雷克斯", hp: 70, maxHp: 100, isEnemy: false, position: 2 },
  { id: 3, name: "莉娜", hp: 90, maxHp: 100, isEnemy: false, position: 3 },
  { id: 4, name: "敌方A", hp: 45, maxHp: 80, isEnemy: true, position: 1 },
  { id: 5, name: "敌方B", hp: 60, maxHp: 80, isEnemy: true, position: 2 },
  { id: 6, name: "敌方C", hp: 30, maxHp: 80, isEnemy: true, position: 3 },
]

export function GuideBattlePanel({ 
  guideType = "FakeBattle",
  onBattleEnd,
  onSkip
}: GuideBattlePanelProps) {
  const [round, setRound] = useState(1)
  const [order, setOrder] = useState(1)
  const [totalOrder, setTotalOrder] = useState(3)
  const [units, setUnits] = useState<UnitData[]>(mockUnits)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [showSkillHint, setShowSkillHint] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<string | null>(null)
  const [isGM, setIsGM] = useState(false)

  // 模拟自动战斗
  useEffect(() => {
    if (!isAutoPlay) return

    const battleInterval = setInterval(() => {
      // 模拟战斗进程
      setUnits(prev => {
        const newUnits = prev.map(unit => {
          if (unit.isEnemy && unit.hp > 0) {
            const damage = Math.floor(Math.random() * 15) + 5
            return { ...unit, hp: Math.max(0, unit.hp - damage) }
          }
          return unit
        })

        // 检查是否所有敌人被击败
        const allEnemiesDefeated = newUnits.filter(u => u.isEnemy).every(u => u.hp <= 0)
        if (allEnemiesDefeated) {
          clearInterval(battleInterval)
          setTimeout(() => {
            onBattleEnd({
              victory: true,
              hpList: newUnits.filter(u => !u.isEnemy).map(u => u.hp),
              drops: ["经验值 x100", "金币 x50"]
            })
          }, 1000)
        }

        return newUnits
      })

      // 添加战斗日志
      setBattleLog(prev => {
        const messages = [
          "艾琳发动技能「星光斩」!",
          "雷克斯使用「护盾冲击」!",
          "莉娜释放「治愈之光」!",
          "敌方受到暴击伤害!",
        ]
        const msg = messages[Math.floor(Math.random() * messages.length)]
        return [...prev.slice(-4), msg]
      })

      // 显示技能提示
      setShowSkillHint(true)
      setCurrentSkill("星光斩")
      setTimeout(() => setShowSkillHint(false), 1500)

    }, 2000)

    return () => clearInterval(battleInterval)
  }, [isAutoPlay, onBattleEnd])

  const handleSkipBattle = () => {
    if (onSkip) {
      onSkip()
    } else {
      onBattleEnd({
        victory: true,
        hpList: [85, 70, 90],
        drops: ["经验值 x100", "金币 x50"]
      })
    }
  }

  const friendlyUnits = units.filter(u => !u.isEnemy)
  const enemyUnits = units.filter(u => u.isEnemy)

  return (
    <div className="fixed inset-0 z-40 bg-gray-900">
      {/* 战场背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-gray-900 to-purple-900/20" />
        {/* 网格效果 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* 顶部HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center justify-between">
          {/* 波次信息 */}
          <GamePanel className="px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">波次</span>
                <span className="text-lg font-bold text-foreground">{order}/{totalOrder}</span>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" />
                <span className="text-sm text-gray-400">回合</span>
                <span className="text-lg font-bold text-foreground">{round}</span>
              </div>
            </div>
          </GamePanel>

          {/* 跳过按钮 (GM模式) */}
          {isGM && (
            <GameButton
              variant="ghost"
              size="sm"
              onClick={handleSkipBattle}
              className="bg-black/50 border border-gray-700"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              跳过战斗
            </GameButton>
          )}
        </div>
      </div>

      {/* 敌方单位区域 */}
      <div className="absolute top-24 left-0 right-0 px-8">
        <div className="flex justify-center gap-8">
          {enemyUnits.map((unit) => (
            <div key={unit.id} className="flex flex-col items-center">
              {/* 敌方头像 */}
              <div className={`relative w-20 h-20 rounded-lg bg-gradient-to-br from-red-900/50 to-red-800/50 border-2 ${
                unit.hp <= 0 ? 'border-gray-700 opacity-50' : 'border-red-600'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sword className={`w-8 h-8 ${unit.hp <= 0 ? 'text-gray-600' : 'text-red-400'}`} />
                </div>
                {unit.hp <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="text-red-500 font-bold">击败</span>
                  </div>
                )}
              </div>
              {/* 血条 */}
              <div className="mt-2 w-24">
                <ProgressBar 
                  value={unit.hp} 
                  max={unit.maxHp} 
                  color={unit.hp > unit.maxHp * 0.5 ? "secondary" : "primary"} 
                  size="sm"
                  showLabel
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">{unit.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 战斗动画区域 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {showSkillHint && currentSkill && (
          <div className="animate-in zoom-in fade-in duration-300">
            <div className="px-8 py-4 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 border border-primary rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-xl font-bold text-foreground">{currentSkill}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 我方单位区域 */}
      <div className="absolute bottom-32 left-0 right-0 px-8">
        <div className="flex justify-center gap-8">
          {friendlyUnits.map((unit) => (
            <div key={unit.id} className="flex flex-col items-center">
              {/* 名称和血条 */}
              <span className="text-xs text-primary mb-1">{unit.name}</span>
              <div className="w-24 mb-2">
                <ProgressBar 
                  value={unit.hp} 
                  max={unit.maxHp} 
                  color="primary" 
                  size="sm"
                  showLabel
                />
              </div>
              {/* 我方头像 */}
              <div className={`relative w-24 h-24 rounded-lg bg-gradient-to-br from-blue-900/50 to-cyan-800/50 border-2 ${
                unit.isActive ? 'border-primary ring-2 ring-primary/50' : 'border-cyan-700'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-cyan-400" />
                </div>
                {unit.isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <GamePanel className="p-4">
          <div className="flex items-center justify-between">
            {/* 战斗日志 */}
            <div className="flex-1 h-16 overflow-hidden">
              <div className="space-y-1">
                {battleLog.slice(-3).map((log, index) => (
                  <p key={index} className="text-sm text-gray-400 animate-in fade-in slide-in-from-bottom duration-300">
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* 自动战斗指示 */}
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded text-sm ${
                isAutoPlay ? 'bg-primary/20 text-primary' : 'bg-gray-700 text-gray-400'
              }`}>
                {isAutoPlay ? '自动战斗中' : '手动模式'}
              </div>
            </div>
          </div>
        </GamePanel>
      </div>

      {/* 引导提示 (剧情战斗特有) */}
      {guideType === "FakeBattle" && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <div className="bg-black/80 border border-primary/50 rounded-lg p-4 max-w-xs animate-pulse">
            <p className="text-sm text-foreground">
              这是新手引导战斗，系统将自动完成战斗演示
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
