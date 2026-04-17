'use client'

import { useState } from 'react'
import { TopBar, ResourceBar, TabBar, ItemFrame, GameButton, ProgressBar, RedDot } from '../ui-components'
import { 
  User, Sword, Shield, Zap, Heart, Star, ChevronRight,
  Cpu, Flag, CircuitBoard, ArrowUp
} from 'lucide-react'
import type { PlayerInfo, SkillData, GameScreen } from '@/lib/game-types'

interface RoleInfoScreenProps {
  player: PlayerInfo
  onBack: () => void
  onNavigate: (screen: GameScreen) => void
}

const mainTabs = [
  { id: 'culture', label: '养成' },
  { id: 'equip', label: '装备' },
  { id: 'info', label: '属性' },
]

const sideTabs = [
  { id: 'ability', label: '能力', icon: Zap, redDot: true },
  { id: 'chip', label: '芯片', icon: Cpu, redDot: false },
  { id: 'flag', label: '旗帜', icon: Flag, redDot: true },
]

const mockSkills: SkillData[] = [
  { id: '1', name: '能量冲击', type: 'active', level: 5, maxLevel: 10, cd: 8, description: '对单体目标造成150%攻击力的伤害', icon: 'skill1' },
  { id: '2', name: '护盾强化', type: 'passive', level: 3, maxLevel: 10, description: '永久提升15%防御力', icon: 'skill2' },
  { id: '3', name: '终极爆发', type: 'active', level: 1, maxLevel: 5, cd: 15, description: '对所有敌人造成200%攻击力的范围伤害', icon: 'skill3' },
]

const attributes = [
  { label: '生命值', value: 125680, icon: Heart, color: 'text-destructive' },
  { label: '攻击力', value: 8560, icon: Sword, color: 'text-gold-primary' },
  { label: '防御力', value: 4280, icon: Shield, color: 'text-blue-tech' },
  { label: '暴击率', value: '25.5%', icon: Zap, color: 'text-gold-secondary' },
]

export function RoleInfoScreen({ player, onBack, onNavigate }: RoleInfoScreenProps) {
  const [activeMainTab, setActiveMainTab] = useState('culture')
  const [activeSideTab, setActiveSideTab] = useState('ability')
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null)
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <TopBar 
        title="角色" 
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
      
      {/* 角色信息概览 */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 p-3 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
          <div className="relative">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gold-secondary to-gold-primary flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-blue-tech rounded text-[9px] font-bold text-white leading-none">
              Lv.{player.level}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold truncate">{player.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sword className="w-3.5 h-3.5 text-gold-primary" />
              <span className="text-sm text-gold-light font-bold">{player.power.toLocaleString()}</span>
            </div>
            <div className="mt-1.5">
              <ProgressBar value={65} max={100} color="blue" size="sm" />
              <p className="text-[9px] text-muted-foreground mt-0.5">经验 65/100</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主Tab */}
      <div className="px-3 pb-2">
        <TabBar tabs={mainTabs} activeTab={activeMainTab} onChange={setActiveMainTab} />
      </div>
      
      {/* 内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {activeMainTab === 'culture' && (
          <>
            {/* 左侧子页签 */}
            <div className="w-16 py-1 pl-1 space-y-1">
              {sideTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSideTab(tab.id)}
                  className={`relative w-full flex flex-col items-center gap-0.5 py-2 rounded-l-lg transition-all ${
                    activeSideTab === tab.id 
                      ? 'bg-card border-l-2 border-gold-primary' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeSideTab === tab.id ? 'text-gold-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-[9px] ${activeSideTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {tab.label}
                  </span>
                  {tab.redDot && <RedDot className="absolute top-0.5 right-0.5 w-2 h-2" />}
                </button>
              ))}
            </div>
            
            {/* 右侧内容 */}
            <div className="flex-1 p-3 overflow-y-auto">
              {activeSideTab === 'ability' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-muted-foreground">技能列表</h3>
                  <div className="space-y-2">
                    {mockSkills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill)}
                        className="w-full flex items-center gap-2 p-2 bg-card/80 rounded-lg border border-border hover:border-gold-primary/50 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                          skill.type === 'active' ? 'bg-blue-tech/20' : 'bg-gold-primary/20'
                        }`}>
                          <Zap className={`w-4 h-4 ${skill.type === 'active' ? 'text-blue-tech' : 'text-gold-primary'}`} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium truncate">{skill.name}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">Lv.{skill.level}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{skill.description}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                  
                  {/* 升级按钮 */}
                  <GameButton variant="primary" size="md" className="w-full">
                    <div className="flex items-center gap-1.5">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>升级技能</span>
                    </div>
                  </GameButton>
                </div>
              )}
              
              {activeSideTab === 'chip' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-muted-foreground">芯片插槽</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((slot) => (
                      <ItemFrame key={slot} quality={slot <= 3 ? 4 : 1} locked={slot > 3}>
                        <CircuitBoard className="w-5 h-5 text-foreground/50" />
                      </ItemFrame>
                    ))}
                  </div>
                </div>
              )}
              
              {activeSideTab === 'flag' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-muted-foreground">旗帜系统</h3>
                  <div className="p-4 bg-card/50 rounded-lg border border-border text-center">
                    <Flag className="w-10 h-10 mx-auto text-muted-foreground/50" />
                    <p className="mt-2 text-xs text-muted-foreground">等级达到60级解锁</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeMainTab === 'equip' && (
          <div className="flex-1 p-3">
            <div className="grid grid-cols-3 gap-2">
              {['武器', '护甲', '头盔', '护腿', '靴子', '饰品'].map((slot, i) => (
                <div key={slot} className="flex flex-col items-center gap-1">
                  <ItemFrame quality={i < 3 ? 5 : 4}>
                    <Shield className="w-5 h-5 text-foreground/50" />
                  </ItemFrame>
                  <span className="text-[10px] text-muted-foreground">{slot}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeMainTab === 'info' && (
          <div className="flex-1 p-3 space-y-2">
            {attributes.map((attr) => (
              <div key={attr.label} className="flex items-center justify-between p-2 bg-card/80 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <attr.icon className={`w-4 h-4 ${attr.color}`} />
                  <span className="text-xs">{attr.label}</span>
                </div>
                <span className="text-sm font-bold text-gold-light">{typeof attr.value === 'number' ? attr.value.toLocaleString() : attr.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 技能详情弹窗 */}
      {selectedSkill && (
        <SkillInfoPopup skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  )
}

interface SkillInfoPopupProps {
  skill: SkillData
  onClose: () => void
}

function SkillInfoPopup({ skill, onClose }: SkillInfoPopupProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div 
        className="w-[85%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 技能头部 */}
        <div className="p-4 bg-gradient-to-b from-muted/50 to-transparent">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              skill.type === 'active' ? 'bg-blue-tech/20' : 'bg-gold-primary/20'
            }`}>
              <Zap className={`w-8 h-8 ${skill.type === 'active' ? 'text-blue-tech' : 'text-gold-primary'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{skill.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  skill.type === 'active' ? 'bg-blue-tech/20 text-blue-tech' : 'bg-gold-primary/20 text-gold-primary'
                }`}>
                  {skill.type === 'active' ? '主动' : '被动'}
                </span>
                <span className="text-sm text-muted-foreground">Lv.{skill.level}/{skill.maxLevel}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 技能描述 */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-sm text-foreground leading-relaxed">
            {skill.description}
          </p>
        </div>
        
        {/* CD显示 */}
        {skill.type === 'active' && skill.cd && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">冷却时间</span>
            <span className="font-bold text-blue-tech">{skill.cd}秒</span>
          </div>
        )}
        
        {/* 升级条件 */}
        {skill.level < skill.maxLevel && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              升级条件: 角色等级 {skill.level * 10 + 10}
            </p>
          </div>
        )}
        
        {/* 关闭按钮 */}
        <div className="p-4 border-t border-border">
          <GameButton variant="secondary" className="w-full" onClick={onClose}>
            关闭
          </GameButton>
        </div>
      </div>
    </div>
  )
}
