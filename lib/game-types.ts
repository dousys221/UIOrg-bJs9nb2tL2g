// 游戏类型定义

export type GameScreen =
  | 'loading'
  | 'login'
  | 'create-role'
  | 'main'
  | 'battle'
  | 'settlement'
  | 'bag'
  | 'role-info'
  | 'skill-info'
  | 'shop'
  | 'mission'
  | 'social'
  | 'setting'
  // 关卡链路新增界面
  | 'level-main'       // 关卡主界面
  | 'chapter-select'   // 章节选择
  | 'formation'        // 战前编队
  // 剧情链路新增界面
  | 'video'            // 开场视频
  | 'story-dialogue'   // 剧情对话
  | 'map-option'       // 地图事件选项
  | 'guide-battle'     // 引导战斗
  | 'background-info'  // 背景故事叙事
  // 邮件与签到
  | 'mail'             // 邮件列表
  | 'sign-in'          // 签到
  // 竞技场
  | 'arena-type'       // 竞技场类型
  | 'arena-main'       // 竞技场主页
  | 'arena-top-match'  // 巅峰赛
  // 抽卡
  | 'recruit'          // 抽卡
  | 'recruit-result'   // 抽卡结果
  // 活动运营
  | 'operating'        // 运营聚合
  | 'first-recharge'   // 首充
  | 'online-reward'    // 在线奖励
  // 公会
  | 'guild'            // 公会主城
  // 充值
  | 'recharge'         // 充值中心
  // 第10章新增界面
  | 'hero-list'        // 英雄总览
  | 'hero-detail'      // 英雄详情
  | 'recruit-main'     // 抽卡主界面
  | 'ranking-main'     // 排行榜总入口
  | 'ranking-detail'   // 单榜详情
  | 'stage-map'        // 章节地图总览
  | 'climb-tower'      // 神之塔普通
  | 'climb-tower-elite' // 魔之塔精英

export interface PlayerInfo {
  id: string
  name: string
  level: number
  power: number
  avatar: string
  vip: number
  gold: number
  diamond: number
  stamina: number
  maxStamina: number
  guildName?: string
}

export interface ServerInfo {
  id: number
  name: string
  status: 'hot' | 'normal' | 'maintenance'
}

export interface ItemData {
  id: string
  name: string
  type: 'equipment' | 'material' | 'consumable' | 'fragment' | 'gift'
  quality: 1 | 2 | 3 | 4 | 5
  count: number
  icon: string
  level?: number
  description?: string
}

export interface SkillData {
  id: string
  name: string
  type: 'active' | 'passive'
  level: number
  maxLevel: number
  cd?: number
  description: string
  icon: string
}

export interface MissionData {
  id: string
  title: string
  description: string
  progress: number
  maxProgress: number
  status: 'ongoing' | 'completed' | 'claimed'
  rewards: ItemData[]
  jumpTo?: string
}

export interface ChatMessage {
  id: string
  sender: string
  content: string
  channel: 'world' | 'guild' | 'private' | 'system'
  timestamp: number
  avatar?: string
}

export interface FriendData {
  id: string
  name: string
  level: number
  power: number
  avatar: string
  online: boolean
  lastOnline?: number
}

export interface ShopItem {
  id: string
  item: ItemData
  price: number
  currency: 'gold' | 'diamond' | 'cny'
  discount?: number
  stock?: number
  purchased?: number
}

export interface BattleResult {
  win: boolean
  damage: number
  drops: ItemData[]
  exp: number
  gold: number
}
