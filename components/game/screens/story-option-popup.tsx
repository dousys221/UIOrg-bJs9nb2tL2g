"use client"

import { useState } from "react"
import { GameButton, GamePanel } from "../ui-components"

interface StoryOption {
  id: number
  text: string
}

interface StoryOptionPopupProps {
  options: StoryOption[]
  onSelect: (optionId: number) => void
  onClose: () => void
}

// 模拟选项数据
const mockOptions: StoryOption[] = [
  { id: 1, text: "接受委托，调查失踪事件" },
  { id: 2, text: "拒绝委托，继续原定任务" },
  { id: 3, text: "询问更多细节" },
  { id: 4, text: "要求提高报酬" }
]

export function StoryOptionPopup({ 
  options = mockOptions, 
  onSelect, 
  onClose 
}: StoryOptionPopupProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSelect = (option: StoryOption) => {
    if (isAnimating) return
    
    setSelectedId(option.id)
    setIsAnimating(true)

    // 选中动画后触发回调
    setTimeout(() => {
      onSelect(option.id)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 选项容器 */}
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <GamePanel className="p-6">
          {/* 标题 */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground">做出选择</h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2" />
          </div>

          {/* 选项列表 */}
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="animate-in fade-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GameButton
                  variant={selectedId === option.id ? "primary" : "secondary"}
                  className={`w-full py-4 justify-start transition-all duration-300 ${
                    selectedId === option.id ? 'scale-105 ring-2 ring-primary' : ''
                  } ${selectedId && selectedId !== option.id ? 'opacity-50' : ''}`}
                  onClick={() => handleSelect(option)}
                  disabled={isAnimating}
                >
                  <div className="flex items-center gap-3">
                    {/* 选项序号 */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      selectedId === option.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    {/* 选项文本 */}
                    <span className="text-left flex-1">{option.text}</span>
                  </div>
                </GameButton>
              </div>
            ))}
          </div>

          {/* 提示 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">选择将影响后续剧情走向</p>
          </div>
        </GamePanel>

        {/* 装饰元素 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  )
}
