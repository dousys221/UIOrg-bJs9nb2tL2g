'use client'

import { useState } from 'react'
import { TopBar, ResourceBar, TabBar, ItemFrame, GameButton, ProgressBar } from '../ui-components'
import { Package, Shield, Star, Sparkles, Gift, Trash2, Combine } from 'lucide-react'
import type { ItemData, PlayerInfo } from '@/lib/game-types'
import { mockInventory } from '@/lib/game-store'

interface BagScreenProps {
  player: PlayerInfo
  onBack: () => void
}

const bagTabs = [
  { id: 'all', label: '全部' },
  { id: 'equipment', label: '装备' },
  { id: 'material', label: '材料' },
  { id: 'consumable', label: '消耗' },
  { id: 'fragment', label: '碎片' },
]

export function BagScreen({ player, onBack }: BagScreenProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null)
  
  const filteredItems = activeTab === 'all' 
    ? mockInventory 
    : mockInventory.filter(item => item.type === activeTab)
  
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'equipment': return Shield
      case 'material': return Star
      case 'consumable': return Sparkles
      case 'fragment': return Package
      default: return Gift
    }
  }
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <TopBar 
        title="背包" 
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
      <div className="px-4 pb-3 overflow-x-auto">
        <div className="flex items-center gap-1 p-1 bg-card rounded-lg border border-border min-w-max">
          {bagTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 物品网格 */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="grid grid-cols-5 gap-3 pb-4">
          {filteredItems.map((item) => {
            const ItemIcon = getItemIcon(item.type)
            return (
              <div key={item.id} className="flex flex-col items-center gap-1">
                <ItemFrame 
                  quality={item.quality} 
                  count={item.count}
                  selected={selectedItem?.id === item.id}
                  onClick={() => setSelectedItem(item)}
                >
                  <ItemIcon className="w-7 h-7 text-foreground/70" />
                </ItemFrame>
                {item.level && (
                  <span className="text-[10px] text-gold-light">+{item.level}</span>
                )}
              </div>
            )
          })}
          
          {/* 空格子占位 */}
          {Array.from({ length: Math.max(0, 20 - filteredItems.length) }).map((_, i) => (
            <div 
              key={`empty-${i}`} 
              className="w-[68px] h-[68px] rounded-lg border border-border/50 bg-muted/20"
            />
          ))}
        </div>
      </div>
      
      {/* 底部操作区 */}
      <div className="px-4 pb-6 pt-3 border-t border-border space-y-3">
        {/* 快捷操作 */}
        <div className="flex items-center gap-3">
          <GameButton variant="secondary" className="flex-1">
            <div className="flex items-center gap-2">
              <Combine className="w-4 h-4" />
              <span>一键合成</span>
            </div>
          </GameButton>
          <GameButton variant="secondary" className="flex-1">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>分解</span>
            </div>
          </GameButton>
        </div>
        
        {/* 容量显示 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>背包容量</span>
          <span>{filteredItems.length}/200</span>
        </div>
      </div>
      
      {/* 物品详情弹窗 */}
      {selectedItem && (
        <ItemDetailPopup 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  )
}

interface ItemDetailPopupProps {
  item: ItemData
  onClose: () => void
}

function ItemDetailPopup({ item, onClose }: ItemDetailPopupProps) {
  const qualityNames = {
    1: '普通',
    2: '优秀',
    3: '稀有',
    4: '史诗',
    5: '传说'
  }
  
  const qualityColors = {
    1: 'text-gray-400',
    2: 'text-green-400',
    3: 'text-blue-400',
    4: 'text-purple-400',
    5: 'text-gold-primary'
  }
  
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div 
        className="w-[85%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 物品头部 */}
        <div className="p-4 bg-gradient-to-b from-muted/50 to-transparent">
          <div className="flex items-start gap-4">
            <ItemFrame quality={item.quality}>
              <Package className="w-7 h-7 text-foreground/70" />
            </ItemFrame>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${qualityColors[item.quality]}`}>
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {qualityNames[item.quality]} · {item.type === 'equipment' ? '装备' : item.type === 'material' ? '材料' : item.type === 'consumable' ? '消耗品' : '碎片'}
              </p>
              {item.level && (
                <p className="text-sm text-gold-light">+{item.level}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 物品描述 */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description || '暂无描述'}
          </p>
        </div>
        
        {/* 数量 */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">拥有数量</span>
          <span className="text-lg font-bold text-gold-light">{item.count}</span>
        </div>
        
        {/* 操作按钮 */}
        <div className="p-4 border-t border-border flex items-center gap-3">
          {item.type === 'consumable' && (
            <GameButton variant="primary" className="flex-1">
              使用
            </GameButton>
          )}
          {item.type === 'equipment' && (
            <GameButton variant="primary" className="flex-1">
              装备
            </GameButton>
          )}
          <GameButton variant="secondary" className="flex-1" onClick={onClose}>
            关闭
          </GameButton>
        </div>
      </div>
    </div>
  )
}
