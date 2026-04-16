'use client'

import { useEffect, useState } from 'react'
import { ProgressBar } from '../ui-components'

interface LoadingScreenProps {
  onComplete: () => void
}

const loadingTips = [
  '正在初始化战术系统...',
  '加载武器数据库...',
  '同步战斗服务器...',
  '准备机甲核心模块...',
  '校准能量护盾参数...',
  '连接星际通讯频道...',
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  
  useEffect(() => {
    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 3 + 1
      })
    }, 100)
    
    // 轮换提示文案
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % loadingTips.length)
    }, 2000)
    
    return () => {
      clearInterval(progressInterval)
      clearInterval(tipInterval)
    }
  }, [onComplete])
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-tech/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      {/* Logo区域 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-b from-gold-light to-gold-primary bg-clip-text text-transparent">
            战术前线
          </h1>
          <p className="mt-2 text-lg text-muted-foreground tracking-widest">
            TACTICAL FRONT
          </p>
          {/* 光效装饰 */}
          <div className="absolute -inset-8 bg-gold-primary/10 blur-2xl rounded-full -z-10" />
        </div>
      </div>
      
      {/* 底部加载区域 */}
      <div className="relative w-full px-8 pb-16 space-y-4">
        {/* 进度条 */}
        <div className="relative">
          <ProgressBar value={progress} max={100} color="gold" />
          {/* 进度数字 */}
          <span className="absolute -top-6 right-0 text-lg font-bold text-gold-light">
            {Math.min(Math.floor(progress), 100)}%
          </span>
        </div>
        
        {/* 提示文案 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-foreground animate-pulse">
            {loadingTips[tipIndex]}
          </p>
          <p className="text-xs text-muted-foreground">
            此过程不消耗流量
          </p>
        </div>
      </div>
      
      {/* 版本号 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        v1.2.58 Build 20260416
      </div>
    </div>
  )
}
