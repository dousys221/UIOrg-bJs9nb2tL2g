'use client'

import { useState } from 'react'
import { GameButton } from '../ui-components'
import { Shuffle, User, UserCircle } from 'lucide-react'

interface CreateRoleScreenProps {
  onConfirm: (name: string, gender: 'male' | 'female') => void
}

const randomNames = {
  male: ['星辰战士', '银河猎手', '暗夜行者', '钢铁守护', '雷霆先锋', '风暴使者'],
  female: ['星辰舞者', '银河女神', '暗夜精灵', '月光守护', '雷霆少女', '风暴女王']
}

export function CreateRoleScreen({ onConfirm }: CreateRoleScreenProps) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [error, setError] = useState('')
  
  const generateRandomName = () => {
    const names = randomNames[gender]
    const randomIndex = Math.floor(Math.random() * names.length)
    setName(names[randomIndex])
    setError('')
  }
  
  const handleConfirm = () => {
    if (!name.trim()) {
      setError('请输入角色名称')
      return
    }
    if (name.length > 6) {
      setError('名称不能超过6个字')
      return
    }
    onConfirm(name, gender)
  }
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-tech/5 blur-3xl" />
      </div>
      
      {/* 标题 */}
      <div className="pt-12 pb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-b from-gold-light to-gold-primary bg-clip-text text-transparent">
          创建角色
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          选择你的战斗形象
        </p>
      </div>
      
      {/* 角色预览区 */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="relative">
          {/* 角色立绘占位 */}
          <div className="w-48 h-64 rounded-2xl bg-gradient-to-b from-card to-muted border border-border flex items-center justify-center">
            {gender === 'male' ? (
              <User className="w-24 h-24 text-blue-tech/50" />
            ) : (
              <UserCircle className="w-24 h-24 text-gold-primary/50" />
            )}
          </div>
          {/* 光效 */}
          <div className="absolute -inset-4 bg-blue-tech/10 blur-2xl rounded-full -z-10" />
        </div>
      </div>
      
      {/* 底部操作区 */}
      <div className="px-8 pb-8 space-y-6">
        {/* 性别选择 */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setGender('male')}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all
              ${gender === 'male' 
                ? 'bg-blue-tech/10 border-blue-tech text-blue-tech' 
                : 'bg-card border-border text-muted-foreground hover:border-blue-tech/50'
              }
            `}
          >
            <User className="w-8 h-8" />
            <span className="text-sm font-medium">男性</span>
          </button>
          
          <button
            onClick={() => setGender('female')}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all
              ${gender === 'female' 
                ? 'bg-gold-primary/10 border-gold-primary text-gold-primary' 
                : 'bg-card border-border text-muted-foreground hover:border-gold-primary/50'
              }
            `}
          >
            <UserCircle className="w-8 h-8" />
            <span className="text-sm font-medium">女性</span>
          </button>
        </div>
        
        {/* 名称输入 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="请输入名字（限6字）"
                maxLength={6}
                className="w-full px-4 py-3 bg-card rounded-lg border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {name.length}/6
              </span>
            </div>
            <button
              onClick={generateRandomName}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-card border border-border hover:border-gold-primary/50 transition-colors"
            >
              <Shuffle className="w-5 h-5 text-gold-primary" />
            </button>
          </div>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
        
        {/* 确认按钮 */}
        <GameButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleConfirm}
        >
          确认创建
        </GameButton>
        
        <p className="text-center text-xs text-muted-foreground">
          创建后可使用改名卡修改名称
        </p>
      </div>
    </div>
  )
}
