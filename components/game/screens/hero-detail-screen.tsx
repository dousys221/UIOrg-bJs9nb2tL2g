'use client'

import { useState, useCallback } from 'react'
import { 
  ChevronLeft, Star, Sword, Shield, Heart, Zap, 
  Lock, RefreshCw, MessageCircle, ArrowUp, Cpu, 
  Flag, CircuitBoard, Package, ChevronRight, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ResourceBar, RedDot, TabBar, ItemFrame, GameButton, ProgressBar, GlowCard 
} from '../ui-components'
import type { PlayerInfo, GameScreen } from '@/lib/game-types'

// 英雄详细数据
interface HeroDetailData {
  id: string
  name: string
  quality: 1 | 2 | 3 | 4 | 5
  star: number
  maxStar: number
  level: number
  maxLevel: number
  power: number
  isLocked: boolean
  attributes: {
    hp: number
    atk: number
    def: number
    crit: number
    critDmg: number
    speed: number
  }
  skills: SkillInfo[]
  equipment: EquipSlot[]
  upStarMaterials: MaterialInfo[]
  abilityPoints: number
  maxAbilityPoints: number
  chips: ChipSlot[]
}

interface SkillInfo {
  id: string
  name: string
  type: 'active' | 'passive' | 'ultimate'
  level: number
  maxLevel: number
  description: string
  cd?: number
  canUpgrade: boolean
}

interface EquipSlot {
  slot: string
  equipped: boolean
  item?: {
    name: string
    quality: number
    level: number
  }
}

interface MaterialInfo {
  id: string
  name: string
  current: number
  needed: number
  quality: number
}

interface ChipSlot {
  slot: number
  unlocked: boolean
  chip?: {
    name: string
    quality: number
    setName: string
  }
}

interface HeroDetailScreenProps {
  player: PlayerInfo
  heroId: string
  onBack: () => void
  onNavigate: (screen: GameScreen) => void
}

// 模拟英雄详细数据
const mockHeroDetail: HeroDetailData = {
  id: 'h1',
  name: '烈焰战士',
  quality: 5,
  star: 5,
  maxStar: 6,
  level: 80,
  maxLevel: 100,
  power: 125680,
  isLocked: false,
  attributes: {
    hp: 125680,
    atk: 8560,
    def: 4280,
    crit: 25.5,
    critDmg: 180,
    speed: 120,
  },
  skills: [
    { id: 's1', name: '烈焰冲击', type: 'active', level: 8, maxLevel: 10, description: '对单体目标造成200%攻击力的火焰伤害', cd: 8, canUpgrade: true },
    { id: 's2', name: '火焰护盾', type: 'passive', level: 5, maxLevel: 10, description: '受到攻击时有20%概率触发护盾，吸收10%最大生命值的伤害', canUpgrade: false },
    { id: 's3', name: '炎龙天降', type: 'ultimate', level: 3, maxLevel: 5, description: '召唤炎龙对所有敌人造成300%攻击力的范围伤害', cd: 15, canUpgrade: true },
  ],
  equipment: [
    { slot: '武器', equipped: true, item: { name: '烈焰之剑', quality: 5, level: 40 } },
    { slot: '护甲', equipped: true, item: { name: '炎龙战甲', quality: 5, level: 35 } },
    { slot: '头盔', equipped: true, item: { name: '火焰头盔', quality: 4, level: 30 } },
    { slot: '护腿', equipped: false },
    { slot: '靴子', equipped: true, item: { name: '疾风战靴', quality: 4, level: 25 } },
    { slot: '饰品', equipped: false },
  ],
  upStarMaterials: [
    { id: 'm1', name: '英雄碎片', current: 45, needed: 100, quality: 5 },
    { id: 'm2', name: '星辉石', current: 30, needed: 50, quality: 4 },
    { id: 'm3', name: '升星符文', current: 5, needed: 10, quality: 3 },
  ],
  abilityPoints: 85,
  maxAbilityPoints: 200,
  chips: [
    { slot: 1, unlocked: true, chip: { name: '攻击芯片', quality: 4, setName: '狂战套装' } },
    { slot: 2, unlocked: true, chip: { name: '防御芯片', quality: 4, setName: '守护套装' } },
    { slot: 3, unlocked: true, chip: { name: '暴击芯片', quality: 3, setName: '狂战套装' } },
    { slot: 4, unlocked: false },
    { slot: 5, unlocked: false },
    { slot: 6, unlocked: false },
  ],
}

// 一级页签
const mainTabs = [
  { id: 'info', label: '属性' },
  { id: 'equip', label: '装备' },
  { id: 'culture', label: '培养' },
]

// 二级页签（培养子页签）
const cultureTabs = [
  { id: 'upstar', label: '升星', icon: Star, redDot: true },
  { id: 'ability', label: '能力', icon: Zap, redDot: true },
  { id: 'chip', label: '芯片', icon: Cpu, redDot: false },
]

export function HeroDetailScreen({ 
  player, 
  heroId, 
  onBack, 
  onNavigate 
}: HeroDetailScreenProps) {
  const [hero, setHero] = useState<HeroDetailData>(mockHeroDetail)
  const [activeMainTab, setActiveMainTab] = useState('info')
  const [activeCultureTab, setActiveCultureTab] = useState('upstar')
  const [selectedSkill, setSelectedSkill] = useState<SkillInfo | null>(null)
  const [showEquipSelect, setShowEquipSelect] = useState<string | null>(null)

  // 切换锁定状态
  const handleToggleLock = useCallback(() => {
    setHero(prev => ({ ...prev, isLocked: !prev.isLocked }))
  }, [])

  // 升级操作
  const handleLevelUp = useCallback(() => {
    // 模拟升级
    setHero(prev => ({ 
      ...prev, 
      level: Math.min(prev.level + 1, prev.maxLevel),
      power: prev.power + 1500,
      attributes: {
        ...prev.attributes,
        hp: prev.attributes.hp + 1500,
        atk: prev.attributes.atk + 100,
        def: prev.attributes.def + 50,
      }
    }))
  }, [])

  // 升星操作
  const handleUpStar = useCallback(() => {
    if (hero.star < hero.maxStar) {
      setHero(prev => ({
        ...prev,
        star: prev.star + 1,
        power: prev.power + 10000,
      }))
    }
  }, [hero.star, hero.maxStar])

  // 检查升星材料是否足够
  const canUpStar = hero.upStarMaterials.every(m => m.current >= m.needed)

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <div className="relative z-10 px-2.5 pt-2 pb-1">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-card/80 border border-border backdrop-blur-sm transition-all duration-200 hover:bg-card active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <ResourceBar
            gold={player.gold}
            diamond={player.diamond}
            stamina={player.stamina}
            maxStamina={player.maxStamina}
          />
        </div>
      </div>

      {/* 英雄概览 */}
      <div className="px-2.5 py-1">
        <div className="flex items-center gap-2.5 p-2 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
          {/* 英雄头像 */}
          <div className="relative">
            <div className={cn(
              'w-14 h-14 rounded-lg flex items-center justify-center',
              'bg-gradient-to-br from-gold-secondary to-gold-primary'
            )}>
              <span className="text-2xl">🔥</span>
            </div>
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0 bg-blue-tech rounded text-[8px] font-bold text-white">
              Lv.{hero.level}
            </span>
          </div>
          
          {/* 英雄信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-xs font-bold">{hero.name}</h2>
              <button onClick={handleToggleLock} className="text-muted-foreground hover:text-foreground">
                <Lock className={cn('w-3 h-3', hero.isLocked && 'text-gold-primary')} />
              </button>
            </div>
            
            {/* 星级 */}
            <div className="flex gap-0 mb-1">
              {Array.from({ length: hero.maxStar }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < hero.star ? 'fill-gold-primary text-gold-primary' : 'fill-muted text-muted'
                  )}
                />
              ))}
            </div>
            
            {/* 战力 */}
            <div className="flex items-center gap-1">
              <Sword className="w-3 h-3 text-gold-primary" />
              <span className="text-[11px] text-gold-light font-bold">{hero.power.toLocaleString()}</span>
            </div>
          </div>
          
          {/* 功能按钮 */}
          <div className="flex flex-col gap-1">
            <button className="p-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors">
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors">
              <MessageCircle className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* 一级页签 */}
      <div className="px-2.5 py-1">
        <TabBar tabs={mainTabs} activeTab={activeMainTab} onChange={setActiveMainTab} />
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-hidden">
        {/* 属性页 */}
        {activeMainTab === 'info' && (
          <div className="h-full px-4 py-2 overflow-y-auto space-y-4">
            {/* 基础属性 */}
            <GlowCard className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">基础属性</h3>
              <div className="grid grid-cols-2 gap-3">
                <AttributeRow icon={Heart} label="生命值" value={hero.attributes.hp.toLocaleString()} color="text-destructive" />
                <AttributeRow icon={Sword} label="攻击力" value={hero.attributes.atk.toLocaleString()} color="text-gold-primary" />
                <AttributeRow icon={Shield} label="防御力" value={hero.attributes.def.toLocaleString()} color="text-blue-tech" />
                <AttributeRow icon={Zap} label="暴击率" value={`${hero.attributes.crit}%`} color="text-gold-secondary" />
              </div>
            </GlowCard>

            {/* 技能列表 */}
            <GlowCard className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">技能</h3>
              <div className="space-y-3">
                {hero.skills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className="w-full flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      skill.type === 'ultimate' ? 'bg-gold-primary/20' : skill.type === 'active' ? 'bg-blue-tech/20' : 'bg-green-500/20'
                    )}>
                      <Zap className={cn(
                        'w-6 h-6',
                        skill.type === 'ultimate' ? 'text-gold-primary' : skill.type === 'active' ? 'text-blue-tech' : 'text-green-500'
                      )} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">Lv.{skill.level}</span>
                        {skill.canUpgrade && <RedDot />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{skill.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </GlowCard>

            {/* 升级按钮 */}
            <GameButton 
              variant="primary" 
              className="w-full"
              onClick={handleLevelUp}
              disabled={hero.level >= hero.maxLevel}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              {hero.level >= hero.maxLevel ? '已满级' : '升级'}
            </GameButton>
          </div>
        )}

        {/* 装备页 */}
        {activeMainTab === 'equip' && (
          <div className="h-full px-4 py-2 overflow-y-auto">
            <GlowCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">装备槽位</h3>
                <button className="text-xs text-primary">一键装备</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {hero.equipment.map((slot) => (
                  <button
                    key={slot.slot}
                    onClick={() => setShowEquipSelect(slot.slot)}
                    className="flex flex-col items-center gap-2"
                  >
                    <ItemFrame 
                      quality={slot.item?.quality || 1}
                      locked={!slot.equipped}
                    >
                      {slot.equipped && slot.item ? (
                        <Package className="w-6 h-6 text-foreground" />
                      ) : (
                        <span className="text-xs text-muted-foreground">+</span>
                      )}
                    </ItemFrame>
                    <span className="text-xs text-muted-foreground">{slot.slot}</span>
                    {slot.item && (
                      <span className="text-[10px] text-primary">Lv.{slot.item.level}</span>
                    )}
                  </button>
                ))}
              </div>
            </GlowCard>
          </div>
        )}

        {/* 培养页 */}
        {activeMainTab === 'culture' && (
          <div className="h-full flex overflow-hidden">
            {/* 左侧二级页签 */}
            <div className="w-20 py-2 pl-2 space-y-2">
              {cultureTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCultureTab(tab.id)}
                  className={cn(
                    'relative w-full flex flex-col items-center gap-1 py-3 rounded-l-xl transition-all',
                    activeCultureTab === tab.id 
                      ? 'bg-card border-l-2 border-gold-primary' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  )}
                >
                  <tab.icon className={cn(
                    'w-5 h-5',
                    activeCultureTab === tab.id ? 'text-gold-primary' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    'text-[10px]',
                    activeCultureTab === tab.id ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {tab.label}
                  </span>
                  {tab.redDot && <RedDot className="absolute top-1 right-1" />}
                </button>
              ))}
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* 升星 */}
              {activeCultureTab === 'upstar' && (
                <div className="space-y-4">
                  <GlowCard className="p-4" glowColor="gold">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground mb-2">当前星级</p>
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: hero.maxStar }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-6 h-6',
                              i < hero.star ? 'fill-gold-primary text-gold-primary' : 'fill-muted text-muted'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm font-medium">升星材料</p>
                      {hero.upStarMaterials.map((mat) => (
                        <div key={mat.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-card flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-gold-primary" />
                            </div>
                            <span className="text-sm">{mat.name}</span>
                          </div>
                          <span className={cn(
                            'text-sm font-medium',
                            mat.current >= mat.needed ? 'text-success' : 'text-destructive'
                          )}>
                            {mat.current}/{mat.needed}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <GameButton 
                      variant="primary" 
                      className="w-full"
                      onClick={handleUpStar}
                      disabled={!canUpStar || hero.star >= hero.maxStar}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {hero.star >= hero.maxStar ? '已满星' : canUpStar ? '升星' : '材料不足'}
                    </GameButton>
                  </GlowCard>
                </div>
              )}

              {/* 能力 */}
              {activeCultureTab === 'ability' && (
                <div className="space-y-4">
                  <GlowCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">能力点数</span>
                      <span className="text-sm">
                        <span className="text-primary font-bold">{hero.abilityPoints}</span>
                        <span className="text-muted-foreground">/{hero.maxAbilityPoints}</span>
                      </span>
                    </div>
                    <ProgressBar value={hero.abilityPoints} max={hero.maxAbilityPoints} color="blue" />
                  </GlowCard>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <GlowCard className="p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">攻击强化</p>
                      <p className="text-lg font-bold text-gold-primary">+15%</p>
                    </GlowCard>
                    <GlowCard className="p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">生命强化</p>
                      <p className="text-lg font-bold text-destructive">+12%</p>
                    </GlowCard>
                    <GlowCard className="p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">防御强化</p>
                      <p className="text-lg font-bold text-blue-tech">+10%</p>
                    </GlowCard>
                    <GlowCard className="p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">暴击强化</p>
                      <p className="text-lg font-bold text-gold-secondary">+8%</p>
                    </GlowCard>
                  </div>
                </div>
              )}

              {/* 芯片 */}
              {activeCultureTab === 'chip' && (
                <div className="space-y-4">
                  <GlowCard className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">芯片槽位</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {hero.chips.map((chip) => (
                        <ItemFrame 
                          key={chip.slot} 
                          quality={chip.chip?.quality || 1} 
                          locked={!chip.unlocked}
                        >
                          {chip.unlocked && chip.chip ? (
                            <CircuitBoard className="w-6 h-6 text-foreground" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </ItemFrame>
                      ))}
                    </div>
                  </GlowCard>
                  
                  <div className="flex gap-3">
                    <GameButton variant="secondary" className="flex-1">
                      芯片图鉴
                    </GameButton>
                    <GameButton variant="primary" className="flex-1">
                      芯片管理
                    </GameButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 技能详情弹窗 */}
      {selectedSkill && (
        <SkillDetailPopup 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)} 
        />
      )}
    </div>
  )
}

// 属性行组件
function AttributeRow({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType
  label: string
  value: string
  color: string 
}) {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon className={cn('w-4 h-4', color)} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  )
}

// 技能详情弹窗
function SkillDetailPopup({ 
  skill, 
  onClose 
}: { 
  skill: SkillInfo
  onClose: () => void 
}) {
  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[85%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-gradient-to-b from-muted/50 to-transparent">
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-16 h-16 rounded-xl flex items-center justify-center',
              skill.type === 'ultimate' ? 'bg-gold-primary/20' : skill.type === 'active' ? 'bg-blue-tech/20' : 'bg-green-500/20'
            )}>
              <Zap className={cn(
                'w-8 h-8',
                skill.type === 'ultimate' ? 'text-gold-primary' : skill.type === 'active' ? 'text-blue-tech' : 'text-green-500'
              )} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{skill.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'px-2 py-0.5 rounded text-xs',
                  skill.type === 'ultimate' ? 'bg-gold-primary/20 text-gold-primary' : 
                  skill.type === 'active' ? 'bg-blue-tech/20 text-blue-tech' : 'bg-green-500/20 text-green-500'
                )}>
                  {skill.type === 'ultimate' ? '终极' : skill.type === 'active' ? '主动' : '被动'}
                </span>
                <span className="text-sm text-muted-foreground">Lv.{skill.level}/{skill.maxLevel}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 border-t border-border">
          <p className="text-sm leading-relaxed">{skill.description}</p>
        </div>
        
        {skill.cd && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">冷却时间</span>
            <span className="font-bold text-blue-tech">{skill.cd}秒</span>
          </div>
        )}
        
        <div className="p-4 border-t border-border">
          <GameButton 
            variant={skill.canUpgrade ? 'primary' : 'secondary'} 
            className="w-full" 
            onClick={onClose}
            disabled={!skill.canUpgrade}
          >
            {skill.canUpgrade ? '升级技能' : '关闭'}
          </GameButton>
        </div>
      </div>
    </div>
  )
}
