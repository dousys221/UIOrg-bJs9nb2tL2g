"use client";

import { useState } from "react";
import {
  ChevronLeft,
  X,
  Store,
  Flame,
  Sparkles,
  Swords,
  Users,
  Crown,
  Star,
  MessageSquare,
  Settings,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HexButton, GlowCard, ProgressBar, RedDot } from "../ui-components";

// ========== 公会主城页 ==========
interface GuildMainCityScreenProps {
  onBack: () => void;
  onOpenShop: () => void;
  onOpenFete: () => void;
  onOpenSkill: () => void;
  onOpenTranscript: () => void;
}

export function GuildMainCityScreen({
  onBack,
  onOpenShop,
  onOpenFete,
  onOpenSkill,
  onOpenTranscript,
}: GuildMainCityScreenProps) {
  const [guildInfo] = useState({
    name: "银河骑士团",
    level: 15,
    exp: 4500,
    maxExp: 6000,
    members: 48,
    maxMembers: 50,
    master: "龙骑士",
    declaration: "欢迎加入银河骑士团！我们一起征服星辰大海！",
  });

  const menuItems = [
    { icon: Store, label: "公会商店", onClick: onOpenShop, redDot: true },
    { icon: Flame, label: "公会祭祀", onClick: onOpenFete, redDot: false },
    { icon: Sparkles, label: "公会技能", onClick: onOpenSkill, redDot: false },
    { icon: Swords, label: "公会副本", onClick: onOpenTranscript, redDot: true },
  ];

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-card/30 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between px-3 py-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-md bg-card/80 border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">公会</h1>
        <button className="flex items-center justify-center w-9 h-9 rounded-md bg-card/80 border border-border">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* 公会信息卡 */}
      <div className="relative z-10 px-3 mt-2">
        <GlowCard className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold truncate">{guildInfo.name}</h2>
                <p className="text-[10px] text-muted-foreground">
                  会长: {guildInfo.master}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-muted-foreground">公会等级</p>
              <p className="text-sm font-bold text-primary">Lv.{guildInfo.level}</p>
            </div>
          </div>

          {/* 经验条 */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
              <span>公会经验</span>
              <span>{guildInfo.exp}/{guildInfo.maxExp}</span>
            </div>
            <ProgressBar value={guildInfo.exp} max={guildInfo.maxExp} color="gold" size="sm" />
          </div>

          {/* 成员数 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>成员</span>
            </div>
            <span className="font-medium">
              {guildInfo.members}/{guildInfo.maxMembers}
            </span>
          </div>
        </GlowCard>
      </div>

      {/* 公会宣言 */}
      <div className="relative z-10 px-3 mt-3">
        <GlowCard className="p-2.5" glowColor="blue">
          <p className="text-[10px] text-muted-foreground">
            📢 {guildInfo.declaration}
          </p>
        </GlowCard>
      </div>

      {/* 功能入口网格 */}
      <div className="relative z-10 px-3 mt-3">
        <div className="grid grid-cols-4 gap-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="relative flex flex-col items-center gap-1 p-2 rounded-lg bg-card/50 border border-border hover:bg-card hover:border-primary/30 transition-all"
            >
              {item.redDot && <RedDot className="absolute -top-0.5 -right-0.5 w-2 h-2" />}
              <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[9px] text-muted-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 公会成员列表预览 */}
      <div className="relative z-10 px-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">在线成员</h3>
          <span className="text-sm text-muted-foreground">查看全部 →</span>
        </div>
        <div className="flex -space-x-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-card border-2 border-background flex items-center justify-center"
            >
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
            +40
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-4 px-4">
        <div className="flex gap-3">
          <HexButton variant="secondary" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            公会聊天
          </HexButton>
          <HexButton variant="primary" className="flex-1">
            <Gift className="w-4 h-4 mr-2" />
            公会红包
          </HexButton>
        </div>
      </div>
    </div>
  );
}

// ========== 充值主页 ==========
interface MainRechargeScreenProps {
  onBack: () => void;
}

export function MainRechargeScreen({ onBack }: MainRechargeScreenProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: "recharge", label: "充值" },
    { id: "vip", label: "VIP" },
    { id: "gift", label: "礼包" },
  ];

  const rechargeOptions = [
    { amount: 6, bonus: "+10%", diamonds: 60 },
    { amount: 30, bonus: "+20%", diamonds: 360 },
    { amount: 68, bonus: "+30%", diamonds: 884 },
    { amount: 128, bonus: "+40%", diamonds: 1792 },
    { amount: 328, bonus: "+50%", diamonds: 4920 },
    { amount: 648, bonus: "+60%", diamonds: 10368 },
  ];

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold-primary/5 via-transparent to-background" />

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-card/80 border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">充值中心</h1>
        <div className="w-10" />
      </div>

      {/* Tab切换 */}
      <div className="relative z-10 px-4 mt-2">
        <div className="flex gap-2 p-1 bg-card/50 rounded-lg border border-border">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === idx
                  ? "bg-gradient-to-b from-gold-secondary to-gold-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 充值选项 */}
      <div className="relative z-10 px-4 mt-6 overflow-y-auto pb-24">
        <div className="grid grid-cols-2 gap-3">
          {rechargeOptions.map((option, idx) => (
            <GlowCard
              key={idx}
              className="p-4 cursor-pointer hover:scale-[1.02] transition-transform"
              glowColor="gold"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-5 h-5 text-gold-primary fill-current" />
                  <span className="text-2xl font-bold text-gold-primary">
                    {option.diamonds}
                  </span>
                </div>
                <p className="text-xs text-success mb-2">{option.bonus}额外赠送</p>
                <HexButton variant="primary" size="sm" className="w-full">
                  ¥{option.amount}
                </HexButton>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-4 px-4">
        <p className="text-xs text-muted-foreground text-center">
          充值即代表同意《用户协议》和《隐私政策》
        </p>
      </div>
    </div>
  );
}

// ========== 角色获取详情弹窗 ==========
interface RoleGetInfoPopupProps {
  heroName: string;
  heroStar: number;
  heroQuality: 1 | 2 | 3 | 4 | 5;
  onBack: () => void;
  onGetPath: () => void;
}

export function RoleGetInfoPopup({
  heroName,
  heroStar,
  heroQuality,
  onBack,
  onGetPath,
}: RoleGetInfoPopupProps) {
  const stats = [
    { label: "攻击", value: 12500 },
    { label: "生命", value: 85000 },
    { label: "防御", value: 6200 },
    { label: "速度", value: 145 },
  ];

  const skills = [
    { name: "烈焰斩", desc: "对敌方单体造成150%伤害" },
    { name: "战意激增", desc: "提升自身30%攻击力持续3回合" },
    { name: "不灭战魂", desc: "死亡后复活并恢复50%生命" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[90%] max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
        {/* 立绘区 */}
        <div className="relative h-48 bg-gradient-to-b from-primary/10 to-card flex items-center justify-center">
          <div className="text-8xl">🦸</div>
          <button
            onClick={onBack}
            className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-card/80 border border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 名称和星级 */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-1">{heroName}</h2>
            <div className="flex justify-center gap-1">
              {Array.from({ length: heroStar }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-gold-primary" />
              ))}
            </div>
          </div>

          {/* 属性 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-2 rounded-lg bg-card/50 border border-border">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-bold text-sm">{stat.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* 技能 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">技能</h3>
            {skills.map((skill, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card/50 border border-border">
                <p className="font-medium text-sm">{skill.name}</p>
                <p className="text-xs text-muted-foreground">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-border shrink-0">
          <HexButton variant="primary" className="w-full" onClick={onGetPath}>
            获取途径
          </HexButton>
        </div>
      </div>
    </div>
  );
}
