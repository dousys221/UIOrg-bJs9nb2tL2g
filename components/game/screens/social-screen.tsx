'use client'

import { useState } from 'react'
import { TopBar, ResourceBar, TabBar, GameButton, RedDot } from '../ui-components'
import { 
  Users, UserPlus, Search, Ban, Heart, MessageCircle, Send,
  Globe, Home, User, Megaphone
} from 'lucide-react'
import type { PlayerInfo, FriendData, ChatMessage } from '@/lib/game-types'
import { mockFriends } from '@/lib/game-store'

interface SocialScreenProps {
  player: PlayerInfo
  onBack: () => void
}

const friendTabs = [
  { id: 'list', label: '好友', redDot: true },
  { id: 'apply', label: '申请', redDot: true },
  { id: 'search', label: '搜索' },
  { id: 'black', label: '黑名单' },
]

const chatChannels = [
  { id: 'world', label: '世界', icon: Globe },
  { id: 'guild', label: '公会', icon: Home },
  { id: 'private', label: '私聊', icon: User },
  { id: 'system', label: '系统', icon: Megaphone },
]

const mockChatMessages: ChatMessage[] = [
  { id: '1', sender: '星辰战士', content: '有人组队刷副本吗？', channel: 'world', timestamp: Date.now() - 60000 },
  { id: '2', sender: '系统', content: '玩家银河猎手击败了世界Boss！', channel: 'system', timestamp: Date.now() - 120000 },
  { id: '3', sender: '暗夜行者', content: '666', channel: 'world', timestamp: Date.now() - 180000 },
]

const mockApplications: FriendData[] = [
  { id: 'app1', name: '新手玩家', level: 25, power: 45000, avatar: '', online: true },
  { id: 'app2', name: '银河舞者', level: 42, power: 89000, avatar: '', online: false },
]

export function SocialScreen({ player, onBack }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState('list')
  const [activeChannel, setActiveChannel] = useState('world')
  const [chatInput, setChatInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showChat, setShowChat] = useState(false)
  
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    return `${Math.floor(diff / 3600000)}小时前`
  }
  
  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-card to-background overflow-hidden">
      {/* 顶部导航 */}
      <TopBar 
        title="社交" 
        onBack={onBack}
        rightContent={
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-1.5 rounded-md ${showChat ? 'bg-gold-primary/20' : 'bg-card/80'} border border-border`}
          >
            <MessageCircle className={`w-4 h-4 ${showChat ? 'text-gold-primary' : 'text-muted-foreground'}`} />
          </button>
        }
      />
      
      {showChat ? (
        // 聊天界面
        <div className="flex-1 flex flex-col">
          {/* 频道切换 */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5">
              {chatChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeChannel === channel.id
                      ? 'bg-gold-primary/20 text-gold-primary border border-gold-primary/50'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <channel.icon className="w-3.5 h-3.5" />
                  {channel.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* 聊天消息 */}
          <div className="flex-1 px-4 overflow-y-auto">
            <div className="space-y-3 pb-4">
              {mockChatMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gold-light">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground mt-0.5 break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 输入区 */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold-primary"
              />
              <GameButton variant="primary" size="sm">
                <Send className="w-4 h-4" />
              </GameButton>
            </div>
            {activeChannel === 'world' && (
              <p className="text-[10px] text-muted-foreground mt-1">世界频道发言间隔10秒</p>
            )}
          </div>
        </div>
      ) : (
        // 好友界面
        <>
          {/* Tab切换 */}
          <div className="px-4 pb-3">
            <TabBar tabs={friendTabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
          
          {/* 好友数量/搜索 */}
          {activeTab === 'list' && (
            <div className="px-4 pb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                好友 <span className="text-gold-light">{mockFriends.length}</span>/100
              </span>
              <div className="flex items-center gap-2">
                <GameButton variant="secondary" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  赠送
                </GameButton>
                <GameButton variant="secondary" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  领取
                </GameButton>
              </div>
            </div>
          )}
          
          {activeTab === 'search' && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="输入玩家昵称搜索"
                  className="flex-1 px-4 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold-primary"
                />
                <GameButton variant="primary" size="sm">
                  <Search className="w-4 h-4" />
                </GameButton>
              </div>
            </div>
          )}
          
          {activeTab === 'apply' && mockApplications.length > 0 && (
            <div className="px-4 pb-3">
              <GameButton variant="primary" className="w-full">
                一键同意
              </GameButton>
            </div>
          )}
          
          {/* 列表内容 */}
          <div className="flex-1 px-4 overflow-y-auto">
            <div className="space-y-3 pb-4">
              {activeTab === 'list' && mockFriends.map((friend) => (
                <FriendItem key={friend.id} friend={friend} type="friend" />
              ))}
              
              {activeTab === 'apply' && mockApplications.map((app) => (
                <FriendItem key={app.id} friend={app} type="apply" />
              ))}
              
              {activeTab === 'search' && (
                <div className="py-12 text-center">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">搜索玩家添加好友</p>
                </div>
              )}
              
              {activeTab === 'black' && (
                <div className="py-12 text-center">
                  <Ban className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">暂无黑名单</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface FriendItemProps {
  friend: FriendData
  type: 'friend' | 'apply' | 'search'
}

function FriendItem({ friend, type }: FriendItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card/80 rounded-xl border border-border backdrop-blur-sm">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
          friend.online ? 'bg-success' : 'bg-muted-foreground'
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{friend.name}</span>
          <span className="text-xs text-muted-foreground">Lv.{friend.level}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          战力 {friend.power.toLocaleString()}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {type === 'friend' && (
          <>
            <button className="p-2 rounded-lg bg-muted hover:bg-muted/80">
              <MessageCircle className="w-4 h-4 text-blue-tech" />
            </button>
            <button className="p-2 rounded-lg bg-muted hover:bg-muted/80">
              <Heart className="w-4 h-4 text-destructive" />
            </button>
          </>
        )}
        {type === 'apply' && (
          <>
            <GameButton variant="primary" size="sm">同意</GameButton>
            <GameButton variant="secondary" size="sm">拒绝</GameButton>
          </>
        )}
        {type === 'search' && (
          <GameButton variant="primary" size="sm">
            <UserPlus className="w-4 h-4 mr-1" />
            添加
          </GameButton>
        )}
      </div>
    </div>
  )
}
