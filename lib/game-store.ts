'use client'

import { create } from 'zustand'
import type { GameScreen, PlayerInfo, ItemData, MissionData, FriendData, ChatMessage, ServerInfo } from './game-types'

interface GameState {
  // 当前界面
  currentScreen: GameScreen
  setCurrentScreen: (screen: GameScreen) => void
  
  // 玩家信息
  player: PlayerInfo | null
  setPlayer: (player: PlayerInfo) => void
  
  // 服务器信息
  selectedServer: ServerInfo | null
  setSelectedServer: (server: ServerInfo) => void
  
  // 背包数据
  inventory: ItemData[]
  setInventory: (items: ItemData[]) => void
  
  // 任务数据
  missions: MissionData[]
  setMissions: (missions: MissionData[]) => void
  
  // 好友列表
  friends: FriendData[]
  setFriends: (friends: FriendData[]) => void
  
  // 聊天消息
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  
  // UI状态
  showRedDot: Record<string, boolean>
  setRedDot: (key: string, show: boolean) => void
  
  // 加载进度
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  currentScreen: 'loading',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  player: null,
  setPlayer: (player) => set({ player }),
  
  selectedServer: null,
  setSelectedServer: (server) => set({ selectedServer: server }),
  
  inventory: [],
  setInventory: (items) => set({ inventory: items }),
  
  missions: [],
  setMissions: (missions) => set({ missions }),
  
  friends: [],
  setFriends: (friends) => set({ friends }),
  
  chatMessages: [],
  addChatMessage: (message) => set((state) => ({ 
    chatMessages: [...state.chatMessages.slice(-50), message] 
  })),
  
  showRedDot: {},
  setRedDot: (key, show) => set((state) => ({ 
    showRedDot: { ...state.showRedDot, [key]: show } 
  })),
  
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
}))

// 模拟数据
export const mockPlayer: PlayerInfo = {
  id: 'player001',
  name: '星辰战士',
  level: 58,
  power: 125680,
  avatar: '/avatars/default.png',
  vip: 8,
  gold: 1258600,
  diamond: 3680,
  stamina: 85,
  maxStamina: 120,
  guildName: '星际联盟'
}

export const mockServers: ServerInfo[] = [
  { id: 1, name: '银河先锋', status: 'hot' },
  { id: 2, name: '星际远征', status: 'normal' },
  { id: 3, name: '深空探索', status: 'normal' },
  { id: 4, name: '维护中', status: 'maintenance' },
]

export const mockInventory: ItemData[] = [
  { id: '1', name: '能量核心', type: 'material', quality: 4, count: 25, icon: 'core', description: '高级能量材料' },
  { id: '2', name: '合金碎片', type: 'fragment', quality: 3, count: 180, icon: 'fragment', description: '用于装备强化' },
  { id: '3', name: '战术背包', type: 'equipment', quality: 5, count: 1, icon: 'bag', level: 15, description: '增加负重上限' },
  { id: '4', name: '急救包', type: 'consumable', quality: 2, count: 50, icon: 'medkit', description: '战斗中恢复生命' },
  { id: '5', name: '钛合金护甲', type: 'equipment', quality: 4, count: 1, icon: 'armor', level: 12, description: '提升防御力' },
  { id: '6', name: '瞄准镜', type: 'equipment', quality: 3, count: 1, icon: 'scope', level: 8, description: '提升暴击率' },
]

export const mockMissions: MissionData[] = [
  { id: '1', title: '完成3次战斗', description: '参与任意战斗模式', progress: 2, maxProgress: 3, status: 'ongoing', rewards: [], jumpTo: 'battle' },
  { id: '2', title: '升级装备1次', description: '强化任意装备', progress: 1, maxProgress: 1, status: 'completed', rewards: [] },
  { id: '3', title: '领取邮件奖励', description: '查看并领取邮件', progress: 0, maxProgress: 1, status: 'ongoing', rewards: [], jumpTo: 'mail' },
  { id: '4', title: '完成日常挑战', description: '完成5个日常任务', progress: 3, maxProgress: 5, status: 'ongoing', rewards: [] },
]

export const mockFriends: FriendData[] = [
  { id: '1', name: '银河猎手', level: 62, power: 145000, avatar: '', online: true },
  { id: '2', name: '暗夜行者', level: 55, power: 118000, avatar: '', online: true },
  { id: '3', name: '星辰守护', level: 48, power: 98000, avatar: '', online: false, lastOnline: Date.now() - 3600000 },
]
