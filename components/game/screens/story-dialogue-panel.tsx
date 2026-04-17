"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronRight, FastForward, Volume2, VolumeX } from "lucide-react"
import { GameButton, GamePanel } from "../ui-components"

interface DialogueData {
  id: number
  speaker: string
  speakerPosition: 'left' | 'right' | 'center' | 'narrator'
  content: string
  bgImage?: string
  voiceRes?: string
  showDir?: number // 1=左侧高亮, 2=右侧高亮
  isDark?: boolean // 旁白模式
  autoNext?: number // 自动下一步倒计时(秒)
}

interface StoryDialoguePanelProps {
  dialogues: DialogueData[]
  initialIndex?: number
  onComplete: () => void
  onSkip: () => void
  jumpId?: number
}

// 模拟对话数据
const mockDialogues: DialogueData[] = [
  {
    id: 1,
    speaker: "艾琳·星野",
    speakerPosition: 'left',
    content: "指挥官，前方探测到异常能量波动，似乎是敌方舰队的信号。",
    showDir: 1,
    autoNext: 5
  },
  {
    id: 2,
    speaker: "指挥官",
    speakerPosition: 'right',
    content: "收到。全舰进入一级战备状态，准备迎敌。",
    showDir: 2,
    autoNext: 5
  },
  {
    id: 3,
    speaker: "",
    speakerPosition: 'narrator',
    content: "警报声在舰桥响起，所有舰员迅速就位，一场激烈的战斗即将打响...",
    isDark: true,
    autoNext: 4
  },
  {
    id: 4,
    speaker: "艾琳·星野",
    speakerPosition: 'left',
    content: "敌舰数量确认：3艘巡洋舰、7艘驱逐舰。建议采用楔形阵型迎击。",
    showDir: 1,
    autoNext: 5
  },
  {
    id: 5,
    speaker: "指挥官",
    speakerPosition: 'right',
    content: "同意。传令各舰，按预定方案行动！",
    showDir: 2,
    autoNext: 4
  }
]

export function StoryDialoguePanel({ 
  dialogues: propsDialogues, 
  initialIndex = 0,
  onComplete, 
  onSkip,
  jumpId
}: StoryDialoguePanelProps) {
  // 如果传入空数组或undefined，使用默认的mockDialogues
  const dialogues = propsDialogues && propsDialogues.length > 0 ? propsDialogues : mockDialogues
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const currentDialogue = dialogues[currentIndex]

  // 打字机效果
  useEffect(() => {
    if (!currentDialogue) return

    setDisplayedText("")
    setIsTyping(true)
    setIsWaiting(false)

    const text = currentDialogue.content
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        setIsWaiting(true)
        if (currentDialogue.autoNext) {
          setCountdown(currentDialogue.autoNext)
        }
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [currentIndex, currentDialogue])

  // 自动倒计时
  useEffect(() => {
    if (!isWaiting || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isWaiting, countdown])

  const handleNext = useCallback(() => {
    if (isTyping) {
      // 如果正在打字，直接显示全部文本
      setDisplayedText(currentDialogue.content)
      setIsTyping(false)
      setIsWaiting(true)
      if (currentDialogue.autoNext) {
        setCountdown(currentDialogue.autoNext)
      }
      return
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete()
    }
  }, [isTyping, currentIndex, dialogues.length, currentDialogue, onComplete])

  const handleSkip = () => {
    if (jumpId) {
      // 跳转到指定剧情节点
      onSkip()
    } else {
      onComplete()
    }
  }

  if (!currentDialogue) return null

  const isNarrator = currentDialogue.speakerPosition === 'narrator' || currentDialogue.isDark

  return (
    <div className="fixed inset-0 z-40">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* 场景背景 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center" />
        </div>
      </div>

      {/* 旁白暗幕 */}
      {isNarrator && (
        <div className="absolute inset-0 bg-black/70 transition-opacity duration-500" />
      )}

      {/* 角色立绘区域 */}
      {!isNarrator && (
        <div className="absolute inset-x-0 bottom-48 flex justify-between items-end px-8">
          {/* 左侧角色 */}
          <div className={`transition-all duration-300 ${
            currentDialogue.showDir === 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95 grayscale'
          }`}>
            <div className="w-48 h-72 relative">
              {/* 角色轮廓 */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/10 to-transparent rounded-t-full">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-48">
                  <div className="w-full h-full bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-3xl opacity-80" />
                  {/* 角色头部 */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-500 rounded-full" />
                </div>
              </div>
              {/* 角色光效 */}
              {currentDialogue.showDir === 1 && (
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
              )}
            </div>
          </div>

          {/* 右侧角色 */}
          <div className={`transition-all duration-300 ${
            currentDialogue.showDir === 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95 grayscale'
          }`}>
            <div className="w-48 h-72 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-secondary/10 to-transparent rounded-t-full">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-48">
                  <div className="w-full h-full bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-3xl opacity-80" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-400 rounded-full" />
                </div>
              </div>
              {currentDialogue.showDir === 2 && (
                <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-xl animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 跳过按钮 */}
      <div className="absolute top-6 right-6 z-10">
        <GameButton
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="flex items-center gap-2 bg-black/50 border border-gray-700"
        >
          <FastForward className="w-4 h-4" />
          <span>跳过剧情</span>
        </GameButton>
      </div>

      {/* 音量控制 */}
      <div className="absolute top-6 right-32 z-10">
        <GameButton
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/50 border border-gray-700"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </GameButton>
      </div>

      {/* 对话框区域 */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div 
          className="relative bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border border-gray-700 rounded-lg p-6 cursor-pointer"
          onClick={handleNext}
        >
          {/* 装饰边框 */}
          <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-primary to-transparent" />
          <div className="absolute top-0 right-0 w-16 h-1 bg-gradient-to-l from-primary to-transparent" />
          <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-secondary to-transparent" />
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-l from-secondary to-transparent" />

          {/* 角色名 */}
          {currentDialogue.speaker && !isNarrator && (
            <div className="mb-3">
              <span className="px-4 py-1 bg-primary/20 border border-primary/50 rounded text-primary font-bold">
                {currentDialogue.speaker}
              </span>
            </div>
          )}

          {/* 对话内容 */}
          <div className={`min-h-[80px] ${isNarrator ? 'text-center italic text-gray-400' : 'text-foreground'}`}>
            <p className="text-lg leading-relaxed">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* 底部状态栏 */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
            {/* 进度指示 */}
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {dialogues.length}
            </div>

            {/* 倒计时 / 继续提示 */}
            <div className="flex items-center gap-2">
              {isWaiting && countdown > 0 && (
                <span className="text-sm text-gray-500">
                  自动继续: {countdown}s
                </span>
              )}
              {isWaiting && (
                <div className="flex items-center gap-1 text-primary animate-pulse">
                  <span className="text-sm">点击继续</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 场景特效层 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 扫描线 */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px]" />
      </div>
    </div>
  )
}
