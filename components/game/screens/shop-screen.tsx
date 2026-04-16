'use client'

import { useState } from 'react'
import { TopBar, ResourceBar, ItemFrame, GameButton, RedDot } from '../ui-components'
import { Coins, Diamond, CreditCard, Package, Star, Lock, Tag } from 'lucide-react'
import type { PlayerInfo, ShopItem, ItemData } from '@/lib/game-types'

interface ShopScreenProps {
  player: PlayerInfo
  onBack: () => void
}

const shopCategories = [
  { id: 'hot', label: '热卖', redDot: true },
  { id: 'gem', label: '钻石' },
  { id: 'gold', label: '金币' },
  { id: 'gift', label: '礼包' },
]

const shopSubTabs = [
  { id: 'daily', label: '每日' },
  { id: 'weekly', label: '每周' },
  { id: 'special', label: '特惠' },
]

const mockShopItems: ShopItem[] = [
  { id: '1', item: { id: '1', name: '能量核心礼包', type: 'gift', quality: 5, count: 1, icon: 'gift' }, price: 98, currency: 'cny', discount: 50 },
  { id: '2', item: { id: '2', name: '高级材料箱', type: 'gift', quality: 4, count: 1, icon: 'box' }, price: 500, currency: 'diamond' },
  { id: '3', item: { id: '3', name: '体力药水x10', type: 'consumable', quality: 3, count: 10, icon: 'potion' }, price: 50000, currency: 'gold' },
  { id: '4', item: { id: '4', name: '钻石月卡', type: 'gift', quality: 5, count: 1, icon: 'card' }, price: 30, currency: 'cny' },
  { id: '5', item: { id: '5', name: '经验加速卡', type: 'consumable', quality: 3, count: 5, icon: 'exp' }, price: 200, currency: 'diamond' },
  { id: '6', item: { id: '6', name: '金币宝箱', type: 'gift', quality: 4, count: 1, icon: 'chest' }, price: 100000, currency: 'gold' },
]

export function ShopScreen({ player, onBack }: ShopScreenProps) {
  const [activeCategory, setActiveCategory] = useState('hot')
  const [activeSubTab, setActiveSubTab] = useState('daily')
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  
  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'gold': return Coins
      case 'diamond': return Diamond
      case 'cny': return CreditCard
      default: return Coins
    }
  }
  
  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'gold': return 'text-gold-primary'
      case 'diamond': return 'text-blue-tech'
      case 'cny': return 'text-success'
      default: return 'text-foreground'
    }
  }
  
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'cny') return `¥${price}`
    if (price >= 10000) return `${(price / 10000).toFixed(1)}万`
    return price.toLocaleString()
  }
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <TopBar 
        title="商城" 
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
      
      {/* 一级分类 */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1 p-1 bg-card rounded-lg border border-border">
          {shopCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
              {cat.redDot && <RedDot className="absolute -top-0.5 -right-0.5" />}
            </button>
          ))}
        </div>
      </div>
      
      {/* 二级分类 */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          {shopSubTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeSubTab === tab.id
                  ? 'bg-blue-tech/20 text-blue-tech border border-blue-tech/50'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 商品列表 */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {mockShopItems.map((shopItem) => {
            const CurrencyIcon = getCurrencyIcon(shopItem.currency)
            return (
              <button
                key={shopItem.id}
                onClick={() => setSelectedItem(shopItem)}
                className="relative bg-card rounded-xl border border-border overflow-hidden hover:border-gold-primary/50 transition-colors"
              >
                {/* 折扣标签 */}
                {shopItem.discount && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-destructive rounded text-[10px] font-bold text-white">
                    <Tag className="w-3 h-3" />
                    {shopItem.discount}% OFF
                  </div>
                )}
                
                {/* 商品图片区 */}
                <div className="p-4 bg-gradient-to-b from-muted/30 to-transparent">
                  <div className="mx-auto w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center">
                    {shopItem.item.type === 'gift' ? (
                      <Package className="w-8 h-8 text-gold-primary/70" />
                    ) : (
                      <Star className="w-8 h-8 text-blue-tech/70" />
                    )}
                  </div>
                </div>
                
                {/* 商品信息 */}
                <div className="px-3 pb-3">
                  <p className="text-sm font-medium truncate">{shopItem.item.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <CurrencyIcon className={`w-4 h-4 ${getCurrencyColor(shopItem.currency)}`} />
                      <span className={`text-sm font-bold ${getCurrencyColor(shopItem.currency)}`}>
                        {formatPrice(shopItem.price, shopItem.currency)}
                      </span>
                    </div>
                    {shopItem.discount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(shopItem.price * 2, shopItem.currency)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* 购买弹窗 */}
      {selectedItem && (
        <ShopBuyPopup 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)}
          onBuy={() => {
            setSelectedItem(null)
            // 购买逻辑
          }}
        />
      )}
    </div>
  )
}

interface ShopBuyPopupProps {
  item: ShopItem
  onClose: () => void
  onBuy: () => void
}

function ShopBuyPopup({ item, onClose, onBuy }: ShopBuyPopupProps) {
  const [count, setCount] = useState(1)
  
  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'gold': return Coins
      case 'diamond': return Diamond
      case 'cny': return CreditCard
      default: return Coins
    }
  }
  
  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'gold': return 'text-gold-primary'
      case 'diamond': return 'text-blue-tech'
      case 'cny': return 'text-success'
      default: return 'text-foreground'
    }
  }
  
  const CurrencyIcon = getCurrencyIcon(item.currency)
  
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div 
        className="w-[85%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 商品展示 */}
        <div className="p-6 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex flex-col items-center">
            <ItemFrame quality={item.item.quality}>
              <Package className="w-7 h-7 text-foreground/70" />
            </ItemFrame>
            <h3 className="mt-3 text-lg font-bold">{item.item.name}</h3>
            {item.discount && (
              <span className="mt-1 px-2 py-0.5 bg-destructive/20 text-destructive rounded text-xs">
                限时{item.discount}%折扣
              </span>
            )}
          </div>
        </div>
        
        {/* 数量选择 */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">购买数量</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCount(Math.max(1, count - 1))}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg"
              >
                -
              </button>
              <span className="w-8 text-center font-bold">{count}</span>
              <button 
                onClick={() => setCount(Math.min(99, count + 1))}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* 总价 */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">总价</span>
          <div className="flex items-center gap-2">
            <CurrencyIcon className={`w-5 h-5 ${getCurrencyColor(item.currency)}`} />
            <span className={`text-xl font-bold ${getCurrencyColor(item.currency)}`}>
              {(item.price * count).toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="p-4 border-t border-border flex items-center gap-3">
          <GameButton variant="secondary" className="flex-1" onClick={onClose}>
            取消
          </GameButton>
          <GameButton variant="primary" className="flex-1" onClick={onBuy}>
            购买
          </GameButton>
        </div>
      </div>
    </div>
  )
}
