import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';
import { motion, useMotionValue, animate } from 'motion/react';

const SwipeableFavoriteItem = ({ children, onDelete, onClick }: { children: React.ReactNode, onDelete: () => void, onClick?: () => void, key?: React.Key }) => {
  const x = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
      setIsOpen(false);
    } else {
      animate(x, -80, { type: 'spring', stiffness: 300, damping: 30 });
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full border-b border-gray-100 dark:border-border-color/50 overflow-hidden group">
      <div className="absolute inset-0 flex items-center justify-end bg-red-500">
        <button onClick={onDelete} className="w-20 h-full text-white flex flex-col items-center justify-center gap-1 active:bg-red-600">
          <span className="material-symbols-outlined text-xl">delete</span>
          <span className="text-[10px] font-medium">删除</span>
        </button>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        style={{ x }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -40) {
            animate(x, -80, { type: 'spring', stiffness: 300, damping: 30 });
            setIsOpen(true);
          } else {
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
            setIsOpen(false);
          }
        }}
        onClick={onClick}
        className="relative h-full bg-white dark:bg-background-dark z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function FavoritesScreen() {
  const { goBack, navigate, funds, toggleFavorite } = useContext(NavigationContext);
  const favorites = funds.filter(f => f.isStarred);
  const [tabs, setTabs] = useState(['全部', '股票型', '债券型', '混合型']);
  const [activeTab, setActiveTab] = useState(0);
  const [editingTab, setEditingTab] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDelete = (id: string) => {
    toggleFavorite(id);
  };

  const handleTabDoubleClick = (index: number) => {
    if (index === 0) return; // Don't edit '全部'
    setEditingTab(index);
    setEditValue(tabs[index]);
  };

  const handleTabEditComplete = (index: number) => {
    if (editValue.trim() && editValue !== tabs[index]) {
      const newTabs = [...tabs];
      newTabs[index] = editValue.trim();
      setTabs(newTabs);
    }
    setEditingTab(null);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleTabEditComplete(index);
    } else if (e.key === 'Escape') {
      setEditingTab(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-border-color">
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex-1 text-center tracking-tight">我的收藏</h1>
          <div className="flex w-10 items-center justify-end relative">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
            </button>
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark"></span>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative flex items-center w-full h-11 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-color shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
            <div className="flex items-center justify-center pl-3 text-slate-400 dark:text-text-sub">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input className="w-full h-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-text-sub focus:ring-0 px-3 outline-none" placeholder="搜索基金代码/名称/拼音" type="text" />
          </div>
        </div>

        <div className="flex px-4 border-b border-gray-200 dark:border-border-color/50 overflow-x-auto no-scrollbar">
          {tabs.map((tab, index) => (
            <div key={index} className="flex-1 min-w-[70px] flex justify-center">
              {editingTab === index ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleTabEditComplete(index)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className="w-full text-center pb-2 pt-2 text-sm font-bold text-primary bg-transparent outline-none border-b-[3px] border-primary"
                />
              ) : (
                <button
                  onClick={() => setActiveTab(index)}
                  onDoubleClick={() => handleTabDoubleClick(index)}
                  className={`w-full pb-3 pt-2 text-sm transition-colors whitespace-nowrap px-2 ${
                    activeTab === index
                      ? 'font-bold text-primary border-b-[3px] border-primary'
                      : 'font-medium text-slate-500 dark:text-text-sub hover:text-slate-700 dark:hover:text-white border-b-[3px] border-transparent'
                  }`}
                >
                  {tab}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-surface-dark/50 text-xs text-slate-500 dark:text-text-sub">
          <div className="flex-1 pl-14">基金名称</div>
          <div className="w-20 text-right">最新净值</div>
          <div className="w-20 text-right pr-2">日涨跌幅</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {favorites.map((fund) => (
          <SwipeableFavoriteItem key={fund.id} onDelete={() => handleDelete(fund.id)} onClick={() => navigate('fund-detail')}>
            <div className="group relative flex items-center gap-3 px-4 py-4 active:bg-slate-100 dark:active:bg-surface-dark transition-colors cursor-pointer">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-surface-dark">
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${fund.color} text-white font-bold text-xs`}>{fund.initials}</div>
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{fund.name}</p>
                  {fund.tag && (
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${fund.tag === '重仓' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {fund.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-text-sub mt-0.5 font-mono">{fund.code}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{fund.nav}</p>
                <div className={`flex items-center justify-end rounded px-1.5 py-0.5 ${fund.isUp === true ? 'bg-red-50 dark:bg-red-900/20 text-up' : fund.isUp === false ? 'bg-green-50 dark:bg-green-900/20 text-down' : 'bg-slate-100 dark:bg-surface-dark text-slate-400 dark:text-text-sub'}`}>
                  <span className="text-xs font-bold font-mono">{fund.isUp ? '+' : ''}{fund.returnRate}%</span>
                </div>
              </div>
            </div>
          </SwipeableFavoriteItem>
        ))}
      </div>
    </div>
  );
}
