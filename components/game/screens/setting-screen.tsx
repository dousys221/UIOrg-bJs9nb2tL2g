'use client'

import { useState } from 'react'
import { TopBar, ResourceBar, GameButton, VolumeSlider } from '../ui-components'
import { 
  User, Settings, Palette, Globe, LogOut, Key, Headphones,
  Smartphone, Shield, ChevronRight, Check
} from 'lucide-react'
import type { PlayerInfo } from '@/lib/game-types'

interface SettingScreenProps {
  player: PlayerInfo
  onBack: () => void
  onLogout: () => void
}

const settingTabs = [
  { id: 'account', label: '账号', icon: User },
  { id: 'audio', label: '音频', icon: Headphones },
  { id: 'display', label: '画质', icon: Smartphone },
  { id: 'other', label: '其他', icon: Settings },
]

const qualityOptions = [
  { id: 'low', label: '省电', desc: '30帧，低画质' },
  { id: 'medium', label: '均衡', desc: '45帧，中画质' },
  { id: 'high', label: '高性能', desc: '60帧，高画质' },
]

const languages = [
  { id: 'zh', label: '简体中文' },
  { id: 'zh-tw', label: '繁體中文' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
]

export function SettingScreen({ player, onBack, onLogout }: SettingScreenProps) {
  const [activeTab, setActiveTab] = useState('account')
  const [bgmVolume, setBgmVolume] = useState(80)
  const [sfxVolume, setSfxVolume] = useState(100)
  const [quality, setQuality] = useState('medium')
  const [language, setLanguage] = useState('zh')
  const [showVip, setShowVip] = useState(true)
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <TopBar 
        title="设置" 
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
      
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧Tab */}
        <div className="w-16 py-1 pl-1 space-y-1">
          {settingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex flex-col items-center gap-0.5 py-2 rounded-l-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-card border-l-2 border-gold-primary' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gold-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[9px] ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1 p-3 overflow-y-auto">
          {activeTab === 'account' && (
            <div className="space-y-3">
              {/* 玩家信息 */}
              <div className="p-3 bg-card/80 rounded-lg border border-border backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-secondary to-gold-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate">{player.name}</h3>
                    <p className="text-[10px] text-muted-foreground">UID: {player.id}</p>
                    <p className="text-[10px] text-muted-foreground truncate">公会: {player.guildName || '未加入'}</p>
                  </div>
                  <button className="p-1.5 rounded-md bg-muted shrink-0">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              {/* 功能按钮 */}
              <div className="space-y-1.5">
                <SettingButton 
                  icon={Key} 
                  label="兑换码" 
                  onClick={() => {}}
                />
                <SettingButton 
                  icon={Headphones} 
                  label="客服中心" 
                  onClick={() => {}}
                />
                <SettingButton 
                  icon={Shield} 
                  label="账号安全" 
                  onClick={() => {}}
                />
              </div>
              
              {/* 退出登录 */}
              <GameButton 
                variant="danger" 
                size="md"
                className="w-full mt-4"
                onClick={onLogout}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                切换账号
              </GameButton>
            </div>
          )}
          
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-3 bg-card/80 rounded-lg border border-border backdrop-blur-sm space-y-3">
                <VolumeSlider 
                  label="背景音乐" 
                  value={bgmVolume} 
                  onChange={setBgmVolume}
                />
                <VolumeSlider 
                  label="音效" 
                  value={sfxVolume} 
                  onChange={setSfxVolume}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'display' && (
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground">画质设置</h3>
              <div className="space-y-1.5">
                {qualityOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setQuality(option.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      quality === option.id 
                        ? 'bg-gold-primary/10 border-gold-primary' 
                        : 'bg-card/80 border-border hover:border-gold-primary/50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-[10px] text-muted-foreground">{option.desc}</p>
                    </div>
                    {quality === option.id && (
                      <div className="w-5 h-5 rounded-full bg-gold-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'other' && (
            <div className="space-y-2">
              {/* 语言设置 */}
              <button
                onClick={() => setShowLanguageSelect(true)}
                className="w-full flex items-center justify-between p-3 bg-card/80 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">语言</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    {languages.find(l => l.id === language)?.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </button>
              
              {/* VIP显示 */}
              <div className="flex items-center justify-between p-3 bg-card/80 rounded-lg border border-border">
                <span className="text-sm">显示VIP标识</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowVip(true)}
                    className={`px-2 py-1 rounded-md text-xs ${
                      showVip 
                        ? 'bg-gold-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    是
                  </button>
                  <button
                    onClick={() => setShowVip(false)}
                    className={`px-2 py-1 rounded-md text-xs ${
                      !showVip 
                        ? 'bg-gold-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    否
                  </button>
                </div>
              </div>
              
              {/* 版本信息 */}
              <div className="p-3 bg-card/80 rounded-lg border border-border text-center">
                <p className="text-[10px] text-muted-foreground">游戏版本</p>
                <p className="text-sm font-medium">v1.2.58</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 语言选择弹窗 */}
      {showLanguageSelect && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60"
          onClick={() => setShowLanguageSelect(false)}
        >
          <div 
            className="w-[85%] max-w-sm bg-card rounded-xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-bold text-center">选择语言</h3>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id)
                    setShowLanguageSelect(false)
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    language === lang.id 
                      ? 'bg-gold-primary/10 border border-gold-primary' 
                      : 'bg-muted/50 border border-transparent hover:border-gold-primary/50'
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.id && (
                    <Check className="w-5 h-5 text-gold-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <GameButton 
                variant="secondary" 
                className="w-full"
                onClick={() => setShowLanguageSelect(false)}
              >
                取消
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface SettingButtonProps {
  icon: React.ElementType
  label: string
  onClick: () => void
}

function SettingButton({ icon: Icon, label, onClick }: SettingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-2.5 bg-card/80 rounded-lg border border-border hover:border-gold-primary/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
    </button>
  )
}
