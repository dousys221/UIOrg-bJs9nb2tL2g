"use client"

import { useState, useEffect } from "react"
import { SkipForward } from "lucide-react"
import { GameButton } from "../ui-components"

interface BackgroundInfoPanelProps {
  text: string
  onComplete: () => void
}

export function BackgroundInfoPanel({ 
  text = "战斗结束后，指挥官带领舰队继续向未知星域进发。前方的道路充满未知，但每一次战斗都让他们变得更加强大...",
  onComplete 
}: BackgroundInfoPanelProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showMask, setShowMask] = useState(true)

  // 打字机效果
  useEffect(() => {
    setDisplayedText("")
    setIsComplete(false)
    setShowMask(true)

    let index = 0
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsComplete(true)
        setShowMask(false)
      }
    }, 60) // 较慢的打字速度，营造叙事感

    return () => clearInterval(typeInterval)
  }, [text])

  const handleClick = () => {
    if (!isComplete) {
      // 快速显示全部
      setDisplayedText(text)
      setIsComplete(true)
      setShowMask(false)
    } else {
      onComplete()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-black">
        {/* 星空背景 */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        {/* 渐变覆盖 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* 输入遮罩（打字期间防误触） */}
      {showMask && (
        <div className="absolute inset-0 bg-transparent" />
      )}

      {/* 跳过按钮 */}
      <div className="absolute top-6 right-6 z-10">
        <GameButton
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onComplete()
          }}
          className="bg-black/50 border border-gray-700"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          跳过
        </GameButton>
      </div>

      {/* 叙事文本 */}
      <div className="relative z-10 max-w-2xl px-8 text-center">
        {/* 装饰线 */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-8" />
        
        {/* 文本内容 */}
        <p className="text-xl leading-relaxed text-gray-300 italic">
          {displayedText}
          {!isComplete && <span className="animate-pulse text-primary">|</span>}
        </p>

        {/* 装饰线 */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-8" />

        {/* 继续提示 */}
        {isComplete && (
          <div className="mt-8 animate-pulse">
            <span className="text-sm text-gray-500">点击任意位置继续</span>
          </div>
        )}
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
