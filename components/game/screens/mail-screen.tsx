"use client";

import { useState, useEffect } from "react";
import { Mail, Gift, Trash2, ChevronRight, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceBar, HexButton, GlowCard, RedDot } from "../ui-components";

// 邮件数据类型
interface MailItem {
  id: number;
  title: string;
  sender: string;
  time: string;
  read: boolean;
  hasReward: boolean;
  rewardItems?: { name: string; icon: string; count: number }[];
}

// 模拟邮件数据
const mockMails: MailItem[] = [
  { id: 1, title: "每日签到奖励", sender: "系统", time: "10分钟前", read: false, hasReward: true, rewardItems: [{ name: "金币", icon: "gold", count: 1000 }] },
  { id: 2, title: "竞技场奖励", sender: "竞技场", time: "1小时前", read: false, hasReward: true, rewardItems: [{ name: "钻石", icon: "diamond", count: 50 }] },
  { id: 3, title: "版本更新公告", sender: "官方", time: "2小时前", read: true, hasReward: false },
  { id: 4, title: "首充奖励已发放", sender: "系统", time: "昨天", read: true, hasReward: false },
  { id: 5, title: "好友赠送体力", sender: "玩家A", time: "昨天", read: true, hasReward: true, rewardItems: [{ name: "体力", icon: "stamina", count: 10 }] },
];

interface MailScreenProps {
  onBack: () => void;
  onOpenMailDetail: (mailId: number) => void;
}

export function MailScreen({ onBack, onOpenMailDetail }: MailScreenProps) {
  const [mails, setMails] = useState<MailItem[]>(mockMails);
  const [selectedMail, setSelectedMail] = useState<number | null>(null);

  const unreadCount = mails.filter((m) => !m.read).length;

  // 一键领取
  const handleGetAll = () => {
    const rewardMails = mails.filter((m) => !m.read && m.hasReward);
    if (rewardMails.length === 0) return;
    // 模拟领取
    setMails((prev) =>
      prev.map((m) => (m.hasReward && !m.read ? { ...m, read: true } : m))
    );
    alert(`领取了 ${rewardMails.length} 封邮件的奖励！`);
  };

  // 删除已读
  const handleDelRead = () => {
    const readMails = mails.filter((m) => m.read);
    if (readMails.length === 0) {
      alert("没有可删除的已读邮件");
      return;
    }
    setMails((prev) => prev.filter((m) => !m.read));
  };

  // 点击邮件条目
  const handleMailClick = (mail: MailItem) => {
    if (!mail.read) {
      setMails((prev) =>
        prev.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
      );
    }
    if (mail.hasReward || mail.rewardItems?.length) {
      onOpenMailDetail(mail.id);
    }
    setSelectedMail(mail.id);
  };

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      {/* 顶部栏 */}
      <div className="relative z-10">
        <div className="flex items-center justify-between px-3 py-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-card/80 border border-border"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-primary" />
            <h1 className="text-base font-bold">邮件</h1>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* 邮件列表 */}
      <div className="relative z-10 flex-1 pt-12 pb-20 px-3 overflow-y-auto">
        {mails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Mail className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无邮件</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {mails.map((mail) => (
              <GlowCard
                key={mail.id}
                className={cn(
                  "p-2 cursor-pointer transition-all",
                  selectedMail === mail.id && "ring-1 ring-primary",
                  !mail.read && "border-primary/50"
                )}
                onClick={() => handleMailClick(mail)}
              >
                <div className="flex items-start gap-2">
                  {/* 红点 */}
                  {!mail.read && (
                    <RedDot className="absolute top-1.5 left-1.5 w-2 h-2" />
                  )}
                  
                  {/* 图标 */}
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                    mail.hasReward ? "bg-primary/20" : "bg-card"
                  )}>
                    {mail.hasReward ? (
                      <Gift className="w-4 h-4 text-primary" />
                    ) : (
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn(
                        "text-xs font-medium truncate",
                        !mail.read && "text-foreground",
                        mail.read && "text-muted-foreground"
                      )}>
                        {mail.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{mail.sender}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {mail.time}
                      </span>
                    </div>
                    {mail.hasReward && mail.rewardItems && (
                      <div className="flex items-center gap-1 mt-1">
                        {mail.rewardItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 text-[9px] bg-primary/10 text-primary rounded"
                          >
                            {item.name} x{item.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-3 px-3">
        <div className="flex gap-2">
          <HexButton
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleGetAll}
            disabled={unreadCount === 0}
          >
            <Gift className="w-3.5 h-3.5 mr-1.5" />
            一键领取
          </HexButton>
          <HexButton
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={handleDelRead}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            删除已读
          </HexButton>
        </div>
      </div>
    </div>
  );
}
