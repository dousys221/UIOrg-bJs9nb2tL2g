'use client'

import { useState } from 'react'
import { GameButton } from '../ui-components'
import { Settings, MessageCircle, FileText, ChevronDown, Server } from 'lucide-react'
import type { ServerInfo } from '@/lib/game-types'
import { mockServers } from '@/lib/game-store'

interface LoginScreenProps {
  onLogin: () => void
  onServerSelect: (server: ServerInfo) => void
  selectedServer: ServerInfo | null
}

export function LoginScreen({ onLogin, onServerSelect, selectedServer }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showServerList, setShowServerList] = useState(false)
  
  const currentServer = selectedServer || mockServers[0]
  
  const handleLogin = async () => {
    setIsLoading(true)
    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    onLogin()
  }
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-blue-tech/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] rounded-full bg-gold-primary/5 blur-3xl" />
      </div>
      
      {/* 顶部功能按钮 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button className="p-2 rounded-lg bg-card/80 border border-border backdrop-blur-sm">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg bg-card/80 border border-border backdrop-blur-sm">
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg bg-card/80 border border-border backdrop-blur-sm">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      
      {/* Logo区域 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-b from-gold-light to-gold-primary bg-clip-text text-transparent">
            战术前线
          </h1>
          <p className="mt-2 text-lg text-muted-foreground tracking-widest">
            TACTICAL FRONT
          </p>
          <div className="absolute -inset-8 bg-gold-primary/10 blur-2xl rounded-full -z-10" />
        </div>
      </div>
      
      {/* 底部操作区 */}
      <div className="relative px-8 pb-8 space-y-4">
        {/* 选服按钮 */}
        <button
          onClick={() => setShowServerList(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-card/80 rounded-lg border border-border backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-blue-tech" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">当前服务器</p>
              <p className="text-sm font-medium">{currentServer.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded ${
              currentServer.status === 'hot' ? 'bg-destructive/20 text-destructive' :
              currentServer.status === 'maintenance' ? 'bg-muted text-muted-foreground' :
              'bg-success/20 text-success'
            }`}>
              {currentServer.status === 'hot' ? '火爆' : currentServer.status === 'maintenance' ? '维护' : '正常'}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
        
        {/* 登录按钮 */}
        <GameButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleLogin}
          disabled={isLoading || currentServer.status === 'maintenance'}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              登录中...
            </span>
          ) : (
            '进入游戏'
          )}
        </GameButton>
        
        {/* 协议文案 */}
        <p className="text-center text-xs text-muted-foreground">
          登录即表示同意
          <button className="text-blue-tech mx-1">《用户协议》</button>
          和
          <button className="text-blue-tech mx-1">《隐私政策》</button>
        </p>
      </div>
      
      {/* 版本号 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        v1.2.58
      </div>
      
      {/* 服务器选择弹窗 */}
      {showServerList && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
          <div className="w-[85%] max-w-sm bg-card rounded-xl border border-border p-4 space-y-4">
            <h2 className="text-lg font-bold text-center">选择服务器</h2>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockServers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    onServerSelect(server)
                    setShowServerList(false)
                  }}
                  disabled={server.status === 'maintenance'}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all
                    ${currentServer.id === server.id ? 'bg-gold-primary/10 border-gold-primary' : 'bg-muted/50 border-border hover:border-gold-primary/50'}
                    ${server.status === 'maintenance' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      server.status === 'hot' ? 'bg-destructive' :
                      server.status === 'maintenance' ? 'bg-muted-foreground' :
                      'bg-success'
                    }`} />
                    <span className="font-medium">{server.name}</span>
                  </div>
                  <span className={`text-xs ${
                    server.status === 'hot' ? 'text-destructive' :
                    server.status === 'maintenance' ? 'text-muted-foreground' :
                    'text-success'
                  }`}>
                    {server.status === 'hot' ? '火爆' : server.status === 'maintenance' ? '维护中' : '正常'}
                  </span>
                </button>
              ))}
            </div>
            
            <GameButton
              variant="secondary"
              className="w-full"
              onClick={() => setShowServerList(false)}
            >
              取消
            </GameButton>
          </div>
        </div>
      )}
    </div>
  )
}
