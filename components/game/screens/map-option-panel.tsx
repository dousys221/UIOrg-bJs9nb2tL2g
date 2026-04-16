"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronRight, FastForward, AlertCircle } from "lucide-react"
import { GameButton, GamePanel } from "../ui-components"

type PanelMode = 'dialogue' | 'option'

interface OptionData {
  id: number
  text: string
  addCondition?: {
    type: string
    required: number
    current: number
  }
  isVisible?: boolean
}

interface MapOptionPanelProps {
  mode: PanelMode
  eventId: number
  speaker?: string
  speakerPosition?: 'left' | 'right'
  content?: string
  options?: OptionData[]
  bgImage?: string
  onNext: (optionId?: number) => void
  onSkip: () => void
  onClose: () => void
}

// 模拟选项数据
const mockOptions: OptionData[] = [
  { id: 1, text: "调查可疑信号源", isVisible: true },
  { id: 2, text: "继续前进", isVisible: true },
  { 
    id: 3, 
    text: "使用能量探测器", 
    addCondition: { type: "能量核心", required: 2, current: 3 },
    isVisible: true 
  },
  { 
    id: 4, 
    text: "启动隐身系统", 
    addCondition: { type: "行动力", required: 50, current: 30 },
    isVisible: true 
  }
]

export function MapOptionPanel({
  mode = 'dialogue',
  eventId,
  speaker = "神秘信号",
  speakerPosition = 'left',
  content = "前方探测到未知能量反应，是否继续调查？",
  options = mockOptions,
  bgImage,
  onNext,
  onSkip,
  onClose
}: MapOptionPanelProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // 打字机效果
  useEffect(() => {
    if (mode !== 'dialogue') return

    setDisplayedText("")
    setIsTyping(true)
    setIsWaiting(false)

    let index = 0
    const typeInterval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        setIsWaiting(true)
      }
    }, 40)

    return () => clearInterval(typeInterval)
  }, [content, mode])

  const handleDialogueNext = useCallback(() => {
    if (isTyping) {
      setDisplayedText(content)
      setIsTyping(false)
      setIsWaiting(true)
      return
    }
    onNext()
  }, [isTyping, content, onNext])

  const handleOptionSelect = (option: OptionData) => {
    // 检查条件是否满足
    if (option.addCondition && option.addCondition.current < option.addCondition.required) {
      // 条件不满足，显示提示
      return
    }
    setSelectedOption(option.id)
    setTimeout(() => {
      onNext(option.id)
    }, 300)
  }

  // 选项按钮Y坐标位置（按文档规范）
  const optionPositions = [0, 1, 2, 3]

  return (
    <div className="fixed inset-0 z-40">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-40">
          {bgImage ? (
            <img src={bgImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900/30 via-gray-900 to-purple-900/30" />
          )}
        </div>
      </div>

      {/* 跳过按钮 */}
      <div className="absolute top-6 right-6 z-10">
        <GameButton
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="flex items-center gap-2 bg-black/50 border border-gray-700"
        >
          <FastForward className="w-4 h-4" />
          <span>跳过</span>
        </GameButton>
      </div>

      {/* 对话模式 */}
      {mode === 'dialogue' && (
        <>
          {/* 角色立绘 */}
          <div className="absolute inset-x-0 bottom-48 flex justify-between items-end px-8">
            <div className={`transition-all duration-300 ${
              speakerPosition === 'left' ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
            }`}>
              <div className="w-40 h-60 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-44">
                  <div className="w-full h-full bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-3xl opacity-80" />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gray-500 rounded-full" />
                </div>
                {speakerPosition === 'left' && (
                  <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                )}
              </div>
            </div>

            <div className={`transition-all duration-300 ${
              speakerPosition === 'right' ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
            }`}>
              <div className="w-40 h-60 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-44">
                  <div className="w-full h-full bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-3xl opacity-80" />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* 对话框 */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div 
              className="relative bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border border-gray-700 rounded-lg p-6 cursor-pointer"
              onClick={handleDialogueNext}
            >
              {/* 装饰边框 */}
              <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-primary to-transparent" />
              <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-l from-primary to-transparent" />

              {/* 角色名 */}
              {speaker && (
                <div className="mb-3">
                  <span className="px-4 py-1 bg-primary/20 border border-primary/50 rounded text-primary font-bold">
                    {speaker}
                  </span>
                </div>
              )}

              {/* 对话内容 */}
              <div className="min-h-[60px]">
                <p className="text-lg leading-relaxed text-foreground">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </p>
              </div>

              {/* 继续提示 */}
              {isWaiting && (
                <div className="flex items-center justify-end mt-4 text-primary animate-pulse">
                  <span className="text-sm">点击继续</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 选项模式 */}
      {mode === 'option' && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-4">
            {/* 提示文本 */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">选择行动</h3>
              <p className="text-gray-400">{content}</p>
            </div>

            {/* 选项按钮列表 */}
            {options.filter(o => o.isVisible !== false).map((option, index) => {
              const isDisabled = option.addCondition && option.addCondition.current < option.addCondition.required
              const isSelected = selectedOption === option.id

              return (
                <div 
                  key={option.id}
                  className={`transform transition-all duration-300 ${
                    isSelected ? 'scale-105' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <GameButton
                    variant={isDisabled ? "ghost" : "secondary"}
                    className={`w-full py-4 justify-start ${
                      isDisabled ? 'opacity-60 cursor-not-allowed' : ''
                    } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => !isDisabled && handleOptionSelect(option)}
                    disabled={isDisabled}
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="text-left">{option.text}</span>
                      
                      {/* 条件显示 */}
                      {option.addCondition && (
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          isDisabled ? 'text-red-500' : 'text-green-500'
                        }`}>
                          <AlertCircle className="w-3 h-3" />
                          <span>
                            需要 {option.addCondition.type}: {option.addCondition.current}/{option.addCondition.required}
                          </span>
                        </div>
                      )}
                    </div>
                  </GameButton>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 场景特效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px]" />
      </div>
    </div>
  )
}
