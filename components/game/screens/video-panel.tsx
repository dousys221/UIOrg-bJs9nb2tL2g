"use client"

import { useState, useEffect, useRef } from "react"
import { X, SkipForward } from "lucide-react"
import { GameButton } from "../ui-components"

interface VideoPanelProps {
  videoName?: string
  onVideoEnd: () => void
  onSkip: () => void
}

export function VideoPanel({ videoName = "opening_cg", onVideoEnd, onSkip }: VideoPanelProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [showSkipHint, setShowSkipHint] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 3秒后显示跳过提示
    const hintTimer = setTimeout(() => {
      setShowSkipHint(true)
    }, 3000)
    
    // 8秒后自动结束视频（与进度条动画同步）
    const endTimer = setTimeout(() => {
      handleVideoEnd()
    }, 8000)
    
    return () => {
      clearTimeout(hintTimer)
      clearTimeout(endTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleVideoEnd = () => {
    setIsPlaying(false)
    onVideoEnd()
  }

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsPlaying(false)
    onSkip()
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* 视频播放区域 - 模拟视频效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 模拟CG动画效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900">
          {/* 星空背景 */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              />
            ))}
          </div>

          {/* 模拟CG场景 - 战舰穿越星际 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* 光束效果 */}
              <div className="absolute -inset-32 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-pulse" />
              
              {/* 战舰轮廓 */}
              <div className="w-64 h-32 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 clip-path-polygon transform -skew-x-12" 
                     style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/60 rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full" />
              </div>

              {/* 引擎尾焰 */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-32 h-8">
                <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent opacity-80 animate-pulse blur-sm" />
              </div>
            </div>
          </div>

          {/* 扫描线效果 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px]" />
          </div>

          {/* 剧情文字 - 滚动效果 */}
          <div className="absolute bottom-1/4 left-0 right-0 text-center">
            <div className="animate-fade-in-up space-y-4 px-8">
              <p className="text-lg text-gray-400 font-mono tracking-wider">公元 2187 年</p>
              <h2 className="text-3xl font-bold text-foreground">
                <span className="text-primary">星际联盟</span> 纪元
              </h2>
              <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                人类文明已扩展至银河系的边缘，然而未知的威胁正从深空逼近...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 跳过按钮 - 右上角 */}
      <div 
        className={`absolute top-8 right-8 z-10 transition-all duration-500 ${
          showSkipHint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <GameButton
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="flex items-center gap-2 bg-black/50 hover:bg-black/70 border border-gray-700"
        >
          <SkipForward className="w-4 h-4" />
          <span>跳过</span>
        </GameButton>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-600 animate-pulse">点击任意位置或按ESC跳过</p>
      </div>

      {/* 点击区域 */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handleSkip}
      />

      {/* 进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div 
          className="h-full bg-primary transition-all duration-100"
          style={{ 
            width: '100%',
            animation: 'progress 8s linear forwards'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
