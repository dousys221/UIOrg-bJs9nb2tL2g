'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Bell, Clock, ChevronRight, AlertCircle, Gift, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GameButton, TabBar, GlowCard } from '../ui-components'

// 公告数据类型
interface NoticeData {
  id: string
  type: 'system' | 'activity' | 'update' | 'maintenance'
  title: string
  content: string
  time: string
  isNew: boolean
  isImportant: boolean
}

interface GameNoticePopupProps {
  onClose: () => void
}

// 公告标签配置
const noticeTabs = [
  { id: 'all', label: '全部' },
  { id: 'system', label: '系统' },
  { id: 'activity', label: '活动' },
  { id: 'update', label: '更新' },
]

// 模拟公告数据
const mockNotices: NoticeData[] = [
  {
    id: 'n1',
    type: 'maintenance',
    title: '服务器维护公告',
    content: '亲爱的指挥官：\n\n为了给您提供更好的游戏体验，我们将于2024年1月15日凌晨2:00-6:00进行服务器维护。\n\n维护期间，服务器将无法登录，请您提前做好安排。\n\n维护内容：\n1. 修复已知BUG\n2. 优化服务器性能\n3. 新增春节活动内容\n\n维护补偿：\n- 钻石x200\n- 体力x100\n- 金币x50000\n\n感谢您的理解与支持！\n\n游戏运营团队',
    time: '2024-01-14 18:00',
    isNew: true,
    isImportant: true,
  },
  {
    id: 'n2',
    type: 'activity',
    title: '春节限时活动开启',
    content: '亲爱的指挥官：\n\n新春佳节即将到来，我们为您准备了丰厚的节日活动！\n\n活动一：春节签到\n- 连续签到7天，获得限定英雄碎片\n- 累计签到15天，获得传说英雄自选礼包\n\n活动二：新春抽卡\n- 限定UP池开放\n- 保底次数减半\n- 首充双倍返利\n\n活动三：红包雨\n- 每日整点红包雨\n- 最高可获得888钻石\n\n活动时间：1月20日-2月10日\n\n祝您新春快乐，游戏愉快！',
    time: '2024-01-13 10:00',
    isNew: true,
    isImportant: false,
  },
  {
    id: 'n3',
    type: 'update',
    title: 'v2.5.0版本更新说明',
    content: '亲爱的指挥官：\n\n游戏已更新至v2.5.0版本，主要更新内容如下：\n\n【新增内容】\n1. 新英雄「炎龙骑士」上线\n2. 新玩法「神之塔」精英模式开放\n3. 新装备「龙魂套装」系列\n4. 公会战玩法优化\n\n【优化内容】\n1. 优化战斗动画表现\n2. 提升游戏加载速度\n3. 修复部分UI显示问题\n4. 优化背包界面操作体验\n\n【BUG修复】\n1. 修复竞技场积分计算异常\n2. 修复邮件领取偶发失败\n3. 修复聊天消息显示重复\n\n请更新至最新版本体验！',
    time: '2024-01-12 08:00',
    isNew: false,
    isImportant: false,
  },
  {
    id: 'n4',
    type: 'system',
    title: '游戏规则说明',
    content: '亲爱的指挥官：\n\n为维护健康的游戏环境，特此说明以下规则：\n\n【禁止行为】\n1. 使用外挂、脚本等作弊工具\n2. 利用BUG进行非法获利\n3. 恶意刷屏、发布不当言论\n4. 账号交易、代练等行为\n\n【处罚措施】\n- 轻度违规：警告并清除违规收益\n- 中度违规：封禁3-30天\n- 严重违规：永久封禁\n\n请各位指挥官遵守游戏规则，共同维护良好的游戏环境。\n\n如有疑问请联系客服。',
    time: '2024-01-10 12:00',
    isNew: false,
    isImportant: false,
  },
]

export function GameNoticePopup({ onClose }: GameNoticePopupProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [notices, setNotices] = useState<NoticeData[]>([])
  const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟加载公告
  useEffect(() => {
    setIsLoading(true)
    // 模拟网络请求
    const timer = setTimeout(() => {
      setNotices(mockNotices)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // 筛选公告
  const filteredNotices = activeTab === 'all' 
    ? notices 
    : notices.filter(n => n.type === activeTab)

  // 获取公告类型图标
  const getTypeIcon = (type: NoticeData['type']) => {
    switch (type) {
      case 'maintenance': return <AlertCircle className="w-4 h-4 text-destructive" />
      case 'activity': return <Gift className="w-4 h-4 text-gold-primary" />
      case 'update': return <Bell className="w-4 h-4 text-blue-tech" />
      case 'system': return <Megaphone className="w-4 h-4 text-muted-foreground" />
    }
  }

  // 获取公告类型标签
  const getTypeLabel = (type: NoticeData['type']) => {
    switch (type) {
      case 'maintenance': return '维护'
      case 'activity': return '活动'
      case 'update': return '更新'
      case 'system': return '系统'
    }
  }

  // 获取公告类型颜色
  const getTypeColor = (type: NoticeData['type']) => {
    switch (type) {
      case 'maintenance': return 'bg-destructive/20 text-destructive'
      case 'activity': return 'bg-gold-primary/20 text-gold-primary'
      case 'update': return 'bg-blue-tech/20 text-blue-tech'
      case 'system': return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[90%] max-w-[340px] h-[80%] bg-card rounded-lg border border-border overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">游戏公告</h2>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {selectedNotice ? (
          // 公告详情
          <NoticeDetail 
            notice={selectedNotice} 
            onBack={() => setSelectedNotice(null)} 
          />
        ) : (
          // 公告列表
          <>
            {/* 标签筛选 */}
            <div className="px-4 py-2 border-b border-border">
              <TabBar tabs={noticeTabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

{/* 公告列表 */}
          <>
            {/* 标签筛选 */}
            <div className="px-2.5 py-1.5 border-b border-border">
              <TabBar tabs={noticeTabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* 公告列表 */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredNotices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">暂无公告</p>
                </div>
              ) : (
                <div className="p-2.5 space-y-2">
                  {filteredNotices.map((notice) => (
                    <NoticeListItem
                      key={notice.id}
                      notice={notice}
                      getTypeIcon={getTypeIcon}
                      getTypeLabel={getTypeLabel}
                      getTypeColor={getTypeColor}
                      onClick={() => setSelectedNotice(notice)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// 公告列表项组件
interface NoticeListItemProps {
  notice: NoticeData
  getTypeIcon: (type: NoticeData['type']) => React.ReactNode
  getTypeLabel: (type: NoticeData['type']) => string
  getTypeColor: (type: NoticeData['type']) => string
  onClick: () => void
}

function NoticeListItem({ 
  notice, 
  getTypeIcon, 
  getTypeLabel, 
  getTypeColor,
  onClick 
}: NoticeListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-2 p-2.5 rounded-lg border transition-all text-left',
        notice.isImportant 
          ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/50' 
          : 'bg-card/80 border-border hover:border-primary/30'
      )}
    >
      {/* 类型图标 */}
      <div className="pt-0.5">
        {getTypeIcon(notice.type)}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5 flex-wrap">
          <span className={cn('px-1 py-0 rounded text-[8px] font-bold', getTypeColor(notice.type))}>
            {getTypeLabel(notice.type)}
          </span>
          {notice.isNew && (
            <span className="px-1 py-0 bg-destructive/20 text-destructive text-[8px] rounded">NEW</span>
          )}
          {notice.isImportant && (
            <span className="px-1 py-0 bg-gold-primary/20 text-gold-primary text-[8px] rounded">重要</span>
          )}
        </div>
        <h3 className="text-[11px] font-medium truncate">{notice.title}</h3>
        <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
          <Clock className="w-2.5 h-2.5" />
          <span>{notice.time}</span>
        </div>
      </div>

      {/* 箭头 */}
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  )
}

// 公告详情组件
interface NoticeDetailProps {
  notice: NoticeData
  onBack: () => void
}

function NoticeDetail({ notice, onBack }: NoticeDetailProps) {
  // 处理换行
  const formattedContent = notice.content.replace(/\\n/g, '\n')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 返回按钮 */}
      <div className="px-2.5 py-1.5 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-0.5 text-[10px] text-primary hover:underline"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          返回列表
        </button>
      </div>

      {/* 公告内容 */}
      <div className="flex-1 overflow-y-auto p-2.5">
        {/* 标题 */}
        <div className="mb-2">
          <h2 className="text-sm font-bold mb-1">{notice.title}</h2>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{notice.time}</span>
          </div>
        </div>

        {/* 正文 */}
        <div className="prose prose-sm prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-foreground bg-transparent p-0 m-0">
            {formattedContent}
          </pre>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="p-2.5 border-t border-border">
        <GameButton variant="secondary" className="w-full" onClick={onBack}>
          关闭
        </GameButton>
      </div>
    </div>
  )
}

// 简化版公告弹窗 - 用于登录后首次显示
interface SimpleNoticePopupProps {
  content: string
  onClose: () => void
}

export function SimpleNoticePopup({ content, onClose }: SimpleNoticePopupProps) {
  const formattedContent = content.replace(/\\n/g, '\n')

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[85%] max-w-[300px] max-h-[65%] bg-card rounded-lg border border-border overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">游戏公告</h2>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-2.5">
          <pre className="whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-foreground">
            {formattedContent}
          </pre>
        </div>

        {/* 按钮 */}
        <div className="p-2.5 border-t border-border">
          <GameButton variant="primary" className="w-full" onClick={onClose}>
            我知道了
          </GameButton>
        </div>
      </div>
    </div>
  )
}
