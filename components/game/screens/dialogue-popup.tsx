"use client"

import { useState, useEffect } from "react"
import { GamePanel } from "../ui-components"

interface DialoguePopupProps {
  speaker: string
  content: string
  speakerIcon?: string
  onClose: () => void
  jumpType?: number // 5=回调并关闭, 其他=继续剧情
}

export function DialoguePopup({ 
  speaker, 
  content, 
  speakerIcon,
  onClose,
  jumpType = 5
}: DialoguePopupProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  // 打字机效果
  useEffect(() => {
    setDisplayedText("")
    setIsComplete(false)
    
    let index = 0
    const typeInterval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsComplete(true)
      }
    }, 40)

    return () => clearInterval(typeInterval)
  }, [content])

  const handleClick = () => {
    if (!isComplete) {
      // 快速显示全部文本
      setDisplayedText(content)
      setIsComplete(true)
    } else {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 cursor-pointer"
      onClick={handleClick}
    >
      {/* 对话卡片 */}
      <div className="relative max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
        <GamePanel className="p-0 overflow-hidden">
          <div className="flex">
            {/* 角色头像 */}
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center">
                {speakerIcon ? (
                  <img src={speakerIcon} alt={speaker} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">{speaker.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 对话内容 */}
            <div className="flex-1 p-4">
              {/* 说话者名字 */}
              <div className="mb-2">
                <span className="text-sm text-primary font-bold">{speaker}</span>
              </div>

              {/* 对话文本 */}
              <p className="text-foreground leading-relaxed">
                {displayedText}
                {!isComplete && <span className="animate-pulse text-primary">|</span>}
              </p>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-700/50 text-center">
            <span className="text-xs text-gray-500">
              {isComplete ? "点击任意位置继续" : "点击跳过"}
            </span>
          </div>
        </GamePanel>

        {/* 装饰角标 */}
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
      </div>

      {/* 点击遮罩 */}
      <div className="absolute inset-0" onClick={handleClick} />
    </div>
  )
}
