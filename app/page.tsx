'use client'

import { useState, useCallback } from 'react'
import { LoadingScreen } from '@/components/game/screens/loading-screen'
import { LoginScreen } from '@/components/game/screens/login-screen'
import { CreateRoleScreen } from '@/components/game/screens/create-role-screen'
import { MainScreen } from '@/components/game/screens/main-screen'
import { BattleScreen } from '@/components/game/screens/battle-screen'
import { SettlementScreen, DamageStatsPanel } from '@/components/game/screens/settlement-screen'
import { BagScreen } from '@/components/game/screens/bag-screen'
import { RoleInfoScreen } from '@/components/game/screens/role-info-screen'
import { ShopScreen } from '@/components/game/screens/shop-screen'
import { MissionScreen } from '@/components/game/screens/mission-screen'
import { SocialScreen } from '@/components/game/screens/social-screen'
import { SettingScreen } from '@/components/game/screens/setting-screen'
// 关卡链路界面
import { LevelMainScreen } from '@/components/game/screens/level-main-screen'
import { ChapterSelectScreen } from '@/components/game/screens/chapter-select-screen'
import { UnlockChapterPopup } from '@/components/game/screens/unlock-chapter-popup'
import { FormationScreen } from '@/components/game/screens/formation-screen'
import { RewardPreviewPopup } from '@/components/game/screens/reward-preview-popup'
import { FastExplorePopup } from '@/components/game/screens/fast-explore-popup'
import { HangRewardPopup } from '@/components/game/screens/hang-reward-popup'
import { FightRecordPopup } from '@/components/game/screens/fight-record-popup'
import { LevelUpPopup } from '@/components/game/screens/level-up-popup'
// 剧情链路界面
import { VideoPanel } from '@/components/game/screens/video-panel'
import { StoryDialoguePanel } from '@/components/game/screens/story-dialogue-panel'
import { DialoguePopup } from '@/components/game/screens/dialogue-popup'
import { MapOptionPanel } from '@/components/game/screens/map-option-panel'
import { StoryOptionPopup } from '@/components/game/screens/story-option-popup'
import { GuideBattlePanel } from '@/components/game/screens/guide-battle-panel'
import { BackgroundInfoPanel } from '@/components/game/screens/background-info-panel'
// 新增遗漏UI界面
import { MailScreen } from '@/components/game/screens/mail-screen'
import { MailDetailPopup } from '@/components/game/screens/mail-detail-popup'
import { SignInDaysPopup } from '@/components/game/screens/sign-in-days-popup'
import { ArenaTypeScreen, ArenaMainScreen, ArenaRecordPopup, ArenaResultPopup } from '@/components/game/screens/arena-screen'
import { SingleRecruitPanel, TenRecruitPanel, PublicGetHeroPanel } from '@/components/game/screens/recruit-screen'
import { OperatingPanel, FirstRechargePanel, OnlineRewardPanel } from '@/components/game/screens/activity-screen'
import { GuildMainCityScreen, MainRechargeScreen, RoleGetInfoPopup } from '@/components/game/screens/guild-screen'

import type { GameScreen, PlayerInfo, ServerInfo, BattleResult } from '@/lib/game-types'
import { mockPlayer, mockServers } from '@/lib/game-store'

export default function GameApp() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('loading')
  const [player, setPlayer] = useState<PlayerInfo | null>(null)
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(mockServers[0])
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [showDamageStats, setShowDamageStats] = useState(false)
  const [needsCreateRole, setNeedsCreateRole] = useState(false)
  const [isNewPlayer, setIsNewPlayer] = useState(false)
  
  // 关卡链路弹窗状态
  const [showUnlockChapter, setShowUnlockChapter] = useState(false)
  const [showRewardPreview, setShowRewardPreview] = useState(false)
  const [showFastExplore, setShowFastExplore] = useState(false)
  const [showHangReward, setShowHangReward] = useState(false)
  const [showFightRecord, setShowFightRecord] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [unlockChapterData, setUnlockChapterData] = useState({ id: 4, name: '机械墓地', difficulty: '普通' })
  
  // 剧情链路弹窗状态
  const [showDialoguePopup, setShowDialoguePopup] = useState(false)
  const [showStoryOptionPopup, setShowStoryOptionPopup] = useState(false)
  const [dialogueData, setDialogueData] = useState({ speaker: '', content: '' })
  
  // 新增界面弹窗状态
  const [showMailDetail, setShowMailDetail] = useState(false)
  const [selectedMailId, setSelectedMailId] = useState<number | null>(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showArenaRecord, setShowArenaRecord] = useState(false)
  const [showArenaResult, setShowArenaResult] = useState(false)
  const [arenaResultData, setArenaResultData] = useState({ victory: true, scoreChange: 0 })
  const [showRecruitResult, setShowRecruitResult] = useState(false)
  const [recruitType, setRecruitType] = useState<'single' | 'ten'>('single')
  const [showGetHero, setShowGetHero] = useState(false)
  const [showRoleGetInfo, setShowRoleGetInfo] = useState(false)
  
  // 模拟红点状态
  const redDots = {
    mission: true,
    mail: true,
    bag: false,
    role: true,
    shop: true,
    friend: true,
  }
  
  // 加载完成
  const handleLoadingComplete = useCallback(() => {
    setCurrentScreen('login')
  }, [])
  
  // 登录
  const handleLogin = useCallback(() => {
    // 模拟：新玩家需要创建角色并观看开场CG
    const newPlayer = Math.random() > 0.7
    if (newPlayer) {
      setIsNewPlayer(true)
      setNeedsCreateRole(true)
      // 新玩家先看开场视频
      setCurrentScreen('video')
    } else {
      setPlayer(mockPlayer)
      setCurrentScreen('main')
    }
  }, [])
  
  // 开场视频结束
  const handleVideoEnd = useCallback(() => {
    // 视频结束后进入剧情对话
    setCurrentScreen('story-dialogue')
  }, [])
  
  // 剧情对话完成
  const handleStoryDialogueComplete = useCallback(() => {
    if (needsCreateRole) {
      setCurrentScreen('create-role')
    } else {
      // 如果不需要创建角色但player为空，设置默认player
      if (!player) {
        setPlayer(mockPlayer)
      }
      setCurrentScreen('main')
    }
  }, [needsCreateRole, player])
  
  // 创建角色
  const handleCreateRole = useCallback((name: string, gender: 'male' | 'female') => {
    const newPlayer: PlayerInfo = {
      ...mockPlayer,
      name,
      level: 1,
      power: 1000,
    }
    setPlayer(newPlayer)
    setNeedsCreateRole(false)
    
    if (isNewPlayer) {
      // 新玩家创建角色后进入引导战斗
      setCurrentScreen('guide-battle')
    } else {
      setCurrentScreen('main')
    }
  }, [isNewPlayer])
  
  // 引导战斗结束
  const handleGuideBattleEnd = useCallback((result: { victory: boolean; hpList: number[]; drops: string[] }) => {
    // 引导战斗后显示背景叙事
    setCurrentScreen('background-info')
  }, [])
  
  // 背景叙事完成
  const handleBackgroundInfoComplete = useCallback(() => {
    setIsNewPlayer(false)
    // 确保player已设置
    if (!player) {
      setPlayer(mockPlayer)
    }
    setCurrentScreen('main')
  }, [player])
  
  // 导航
  const handleNavigate = useCallback((screen: GameScreen) => {
    setCurrentScreen(screen)
  }, [])
  
  // 返回主界面
  const handleBackToMain = useCallback(() => {
    setCurrentScreen('main')
  }, [])
  
  // 战斗结束
  const handleBattleEnd = useCallback((win: boolean) => {
    const result: BattleResult = {
      win,
      damage: Math.floor(Math.random() * 500000) + 100000,
      drops: [],
      exp: Math.floor(Math.random() * 5000) + 1000,
      gold: Math.floor(Math.random() * 50000) + 10000,
    }
    setBattleResult(result)
    setCurrentScreen('settlement')
    
    // 模拟升级
    if (win && Math.random() > 0.5 && player) {
      setTimeout(() => {
        setShowLevelUp(true)
      }, 500)
    }
  }, [player])
  
  // 结算继续
  const handleSettlementContinue = useCallback(() => {
    setBattleResult(null)
    setShowDamageStats(false)
    setCurrentScreen('level-main')
  }, [])
  
  // 退出登录
  const handleLogout = useCallback(() => {
    setPlayer(null)
    setCurrentScreen('login')
  }, [])
  
  // 任务跳转
  const handleMissionJump = useCallback((target: string) => {
    if (target === 'battle') {
      setCurrentScreen('level-main')
    }
  }, [])
  
  // 关卡链路处理函数
  const handleOpenLevelMain = useCallback(() => {
    setCurrentScreen('level-main')
  }, [])
  
  const handleOpenChapterSelect = useCallback(() => {
    setCurrentScreen('chapter-select')
  }, [])
  
  const handleOpenFormation = useCallback(() => {
    setCurrentScreen('formation')
  }, [])
  
  const handleStartBattle = useCallback(() => {
    setCurrentScreen('battle')
  }, [])
  
  const handleSelectChapter = useCallback((chapterId: number) => {
    // 选择章节后返回关卡主界面
    setCurrentScreen('level-main')
  }, [])
  
  const handleUnlockChapter = useCallback((chapterId: number) => {
    // 显示解锁弹窗
    setUnlockChapterData({ id: chapterId, name: '机械墓地', difficulty: '普通' })
    setShowUnlockChapter(true)
  }, [])
  
  const handleCollectHangReward = useCallback(() => {
    setShowHangReward(true)
  }, [])
  
  const handleFastExploreTrain = useCallback(() => {
    // 快速训练完成，显示奖励
    alert('训练完成！获得奖励')
  }, [])
  
  const handleReplayRecord = useCallback((recordId: number) => {
    setShowFightRecord(false)
    setCurrentScreen('battle')
  }, [])
  
  // 地图事件处理
  const handleMapEventNext = useCallback((optionId?: number) => {
    // 处理地图事件选项选择
    setCurrentScreen('level-main')
  }, [])
  
  // 剧情选项选择
  const handleStoryOptionSelect = useCallback((optionId: number) => {
    setShowStoryOptionPopup(false)
    // 根据选项继续剧情
  }, [])
  
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="game-container bg-background">
        {currentScreen === 'loading' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        
        {currentScreen === 'login' && (
          <LoginScreen 
            onLogin={handleLogin}
            onServerSelect={setSelectedServer}
            selectedServer={selectedServer}
          />
        )}
        
        {/* 剧情链路界面 */}
        {currentScreen === 'video' && (
          <VideoPanel 
            videoName="opening_cg"
            onVideoEnd={handleVideoEnd}
            onSkip={handleVideoEnd}
          />
        )}
        
        {currentScreen === 'story-dialogue' && (
          <StoryDialoguePanel 
            dialogues={[]}
            onComplete={handleStoryDialogueComplete}
            onSkip={handleStoryDialogueComplete}
          />
        )}
        
        {currentScreen === 'guide-battle' && (
          <GuideBattlePanel 
            guideType="FakeBattle"
            onBattleEnd={handleGuideBattleEnd}
            onSkip={() => handleGuideBattleEnd({ victory: true, hpList: [], drops: [] })}
          />
        )}
        
        {currentScreen === 'background-info' && (
          <BackgroundInfoPanel 
            text="战斗结束后，指挥官带领舰队继续向未知星域进发。前方的道路充满未知，但每一次战斗都让他们变得更加强大。新的冒险，正在等待着他们..."
            onComplete={handleBackgroundInfoComplete}
          />
        )}
        
        {currentScreen === 'map-option' && (
          <MapOptionPanel 
            mode="option"
            eventId={1}
            onNext={handleMapEventNext}
            onSkip={() => setCurrentScreen('level-main')}
            onClose={() => setCurrentScreen('level-main')}
          />
        )}
        
        {currentScreen === 'create-role' && (
          <CreateRoleScreen onConfirm={handleCreateRole} />
        )}
        
        {currentScreen === 'main' && player && (
          <MainScreen 
            player={player}
            onNavigate={handleNavigate}
            redDots={redDots}
          />
        )}
        
        {/* 关卡链路界面 */}
        {currentScreen === 'level-main' && (
          <LevelMainScreen
            onBack={handleBackToMain}
            onStartBattle={handleStartBattle}
            onOpenChapterSelect={handleOpenChapterSelect}
            onOpenFormation={handleOpenFormation}
            onOpenFastExplore={() => setShowFastExplore(true)}
            onOpenRecord={() => setShowFightRecord(true)}
            onOpenRewardPreview={() => setShowRewardPreview(true)}
            onCollectHangReward={handleCollectHangReward}
            onBackToMain={handleBackToMain}
            isChapterCloseState={false}
          />
        )}
        
        {currentScreen === 'chapter-select' && (
          <ChapterSelectScreen
            onBack={() => setCurrentScreen('level-main')}
            onSelectChapter={handleSelectChapter}
            onUnlockChapter={handleUnlockChapter}
          />
        )}
        
        {currentScreen === 'formation' && (
          <FormationScreen
            onBack={() => setCurrentScreen('level-main')}
            onStartBattle={handleStartBattle}
          />
        )}
        
        {currentScreen === 'battle' && (
          <BattleScreen 
            onExit={() => setCurrentScreen('level-main')}
            onBattleEnd={handleBattleEnd}
          />
        )}
        
        {currentScreen === 'settlement' && battleResult && (
          showDamageStats ? (
            <DamageStatsPanel onBack={() => setShowDamageStats(false)} />
          ) : (
            <SettlementScreen 
              result={battleResult}
              onContinue={handleSettlementContinue}
              onShowStats={() => setShowDamageStats(true)}
            />
          )
        )}
        
        {currentScreen === 'bag' && player && (
          <BagScreen 
            player={player}
            onBack={handleBackToMain}
          />
        )}
        
        {currentScreen === 'role-info' && player && (
          <RoleInfoScreen 
            player={player}
            onBack={handleBackToMain}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentScreen === 'shop' && player && (
          <ShopScreen 
            player={player}
            onBack={handleBackToMain}
          />
        )}
        
        {currentScreen === 'mission' && player && (
          <MissionScreen 
            player={player}
            onBack={handleBackToMain}
            onJump={handleMissionJump}
          />
        )}
        
        {currentScreen === 'social' && player && (
          <SocialScreen 
            player={player}
            onBack={handleBackToMain}
          />
        )}
        
        {currentScreen === 'setting' && player && (
          <SettingScreen 
            player={player}
            onBack={handleBackToMain}
            onLogout={handleLogout}
          />
        )}
        
        {/* 关卡链路弹窗 */}
        {showUnlockChapter && (
          <UnlockChapterPopup
            chapterId={unlockChapterData.id}
            chapterName={unlockChapterData.name}
            difficulty={unlockChapterData.difficulty}
            onClose={() => setShowUnlockChapter(false)}
            onGo={() => {
              setShowUnlockChapter(false)
              setCurrentScreen('level-main')
            }}
          />
        )}
        
        {showRewardPreview && (
          <RewardPreviewPopup
            levelName="第3章-12 废土边缘"
            onClose={() => setShowRewardPreview(false)}
          />
        )}
        
        {showFastExplore && (
          <FastExplorePopup
            onClose={() => setShowFastExplore(false)}
            onTrain={handleFastExploreTrain}
            onBuyPrivilege={() => alert('跳转充值页面')}
          />
        )}
        
        {showHangReward && (
          <HangRewardPopup
            hangTime={7200}
            onClose={() => setShowHangReward(false)}
            onCollect={() => {
              setShowHangReward(false)
              alert('领取成功！')
            }}
          />
        )}
        
        {showFightRecord && (
          <FightRecordPopup
            levelName="第3章-12 废土边缘"
            onClose={() => setShowFightRecord(false)}
            onReplay={handleReplayRecord}
          />
        )}
        
        {showLevelUp && player && (
          <LevelUpPopup
            oldLevel={player.level}
            newLevel={player.level + 1}
            playerName={player.name}
            onClose={() => setShowLevelUp(false)}
          />
        )}
        
        {/* 剧情链路弹窗 */}
        {showDialoguePopup && (
          <DialoguePopup 
            speaker={dialogueData.speaker}
            content={dialogueData.content}
            onClose={() => setShowDialoguePopup(false)}
          />
        )}
        
        {showStoryOptionPopup && (
          <StoryOptionPopup
            options={[]}
            onSelect={handleStoryOptionSelect}
            onClose={() => setShowStoryOptionPopup(false)}
          />
        )}

        {/* ========== 新增遗漏UI界面 ========== */}
        
        {/* 邮件界面 */}
        {currentScreen === 'mail' && (
          <MailScreen
            onBack={handleBackToMain}
            onOpenMailDetail={(mailId) => {
              setSelectedMailId(mailId)
              setShowMailDetail(true)
            }}
          />
        )}
        
        {/* 签到弹窗 */}
        {showSignIn && (
          <SignInDaysPopup
            currentDay={3}
            onClose={() => setShowSignIn(false)}
            onClaim={(day) => {
              alert(`签到第${day}天成功！`)
            }}
          />
        )}
        
        {/* 邮件详情弹窗 */}
        {showMailDetail && (
          <MailDetailPopup
            mailId={selectedMailId || 0}
            title="系统奖励"
            content="恭喜您完成每日任务，获得以下奖励！"
            rewards={[
              { name: '金币', icon: 'gold', count: 1000, quality: 2 },
              { name: '钻石', icon: 'diamond', count: 50, quality: 3 },
            ]}
            onClose={() => setShowMailDetail(false)}
            onClaim={() => {
              setShowMailDetail(false)
              alert('领取成功！')
            }}
            onDelete={() => setShowMailDetail(false)}
          />
        )}

        {/* 竞技场界面 */}
        {currentScreen === 'arena-type' && (
          <ArenaTypeScreen
            onBack={handleBackToMain}
            onOpenArena={() => setCurrentScreen('arena-main')}
            onOpenTopMatch={() => setCurrentScreen('arena-top-match')}
          />
        )}
        
        {currentScreen === 'arena-main' && (
          <ArenaMainScreen
            onBack={() => setCurrentScreen('arena-type')}
            onOpenRecord={() => setShowArenaRecord(true)}
            onStartBattle={() => {
              setArenaResultData({ victory: true, scoreChange: 15 })
              setShowArenaResult(true)
            }}
          />
        )}
        
        {currentScreen === 'arena-top-match' && (
          <ArenaMainScreen
            onBack={() => setCurrentScreen('arena-type')}
            onOpenRecord={() => setShowArenaRecord(true)}
            onStartBattle={() => {
              setArenaResultData({ victory: false, scoreChange: -12 })
              setShowArenaResult(true)
            }}
          />
        )}
        
        {showArenaRecord && (
          <ArenaRecordPopup
            onClose={() => setShowArenaRecord(false)}
            onReplay={(recordId) => {
              setShowArenaRecord(false)
              alert(`播放战报 ${recordId}`)
            }}
          />
        )}
        
        {showArenaResult && (
          <ArenaResultPopup
            victory={arenaResultData.victory}
            scoreChange={arenaResultData.scoreChange}
            onClose={() => setShowArenaResult(false)}
          />
        )}

        {/* 抽卡界面 */}
        {currentScreen === 'recruit' && (
          <div className="relative h-full w-full bg-background flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-6">召唤祭坛</h2>
            <div className="flex gap-4">
              <div
                className="w-32 h-48 rounded-xl bg-gradient-to-b from-primary/20 to-card border border-primary/30 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setRecruitType('single')
                  setShowRecruitResult(true)
                }}
              >
                <span className="text-4xl mb-2">🎴</span>
                <p className="font-medium">单抽</p>
                <p className="text-xs text-muted-foreground">100钻石</p>
              </div>
              <div
                className="w-32 h-48 rounded-xl bg-gradient-to-b from-accent/20 to-card border border-accent/30 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setRecruitType('ten')
                  setShowRecruitResult(true)
                }}
              >
                <span className="text-4xl mb-2">🎴x10</span>
                <p className="font-medium">十连抽</p>
                <p className="text-xs text-muted-foreground">900钻石</p>
              </div>
            </div>
            <button
              onClick={handleBackToMain}
              className="mt-8 px-6 py-2 rounded-lg bg-card border border-border"
            >
              返回
            </button>
          </div>
        )}
        
        {showRecruitResult && recruitType === 'single' && (
          <SingleRecruitPanel
            heroName="龙骑士"
            heroStar={5}
            heroQuality={5}
            onClose={() => setShowRecruitResult(false)}
            onAgain={() => {}}
            onTenRecruit={() => {
              setRecruitType('ten')
            }}
          />
        )}
        
        {showRecruitResult && recruitType === 'ten' && (
          <TenRecruitPanel
            heroes={[
              { name: '战士', star: 3, quality: 3 },
              { name: '法师', star: 2, quality: 2 },
              { name: '弓手', star: 3, quality: 3 },
              { name: '刺客', star: 4, quality: 4 },
              { name: '坦克', star: 2, quality: 2 },
              { name: '治疗', star: 3, quality: 3 },
              { name: '龙骑士', star: 5, quality: 5 },
              { name: '召唤师', star: 3, quality: 3 },
              { name: '武僧', star: 2, quality: 2 },
              { name: '狂战', star: 4, quality: 4 },
            ]}
            onClose={() => setShowRecruitResult(false)}
            onAgain={() => {}}
          />
        )}
        
        {showGetHero && (
          <PublicGetHeroPanel
            heroName="龙骑士"
            heroStar={5}
            heroQuality={5}
            skills={[
              { name: '烈焰斩', desc: '对敌方单体造成150%伤害' },
              { name: '战意激增', desc: '提升自身30%攻击力' },
            ]}
            onClose={() => setShowGetHero(false)}
          />
        )}

        {/* 活动运营界面 */}
        {currentScreen === 'operating' && (
          <OperatingPanel
            onBack={handleBackToMain}
            onOpenFirstRecharge={() => setCurrentScreen('first-recharge')}
            onOpenDailyRecharge={() => setCurrentScreen('first-recharge')}
            onOpenOnlineReward={() => setCurrentScreen('online-reward')}
          />
        )}
        
        {currentScreen === 'first-recharge' && (
          <FirstRechargePanel
            onBack={() => setCurrentScreen('operating')}
            onRecharge={() => alert('跳转充值')}
          />
        )}
        
        {currentScreen === 'online-reward' && (
          <OnlineRewardPanel
            onBack={() => setCurrentScreen('operating')}
            onClaim={(idx) => alert(`领取第${idx}个奖励`)}
            onClaimAll={() => alert('一键领取成功！')}
          />
        )}

        {/* 公会界面 */}
        {currentScreen === 'guild' && (
          <GuildMainCityScreen
            onBack={handleBackToMain}
            onOpenShop={() => setCurrentScreen('shop')}
            onOpenFete={() => alert('公会祭祀')}
            onOpenSkill={() => alert('公会技能')}
            onOpenTranscript={() => alert('公会副本')}
          />
        )}

        {/* 充值界面 */}
        {currentScreen === 'recharge' && (
          <MainRechargeScreen onBack={handleBackToMain} />
        )}

        {/* 角色详情弹窗 */}
        {showRoleGetInfo && (
          <RoleGetInfoPopup
            heroName="龙骑士"
            heroStar={5}
            heroQuality={5}
            onBack={() => setShowRoleGetInfo(false)}
            onGetPath={() => alert('查看获取途径')}
          />
        )}
      </div>
    </div>
  )
}
