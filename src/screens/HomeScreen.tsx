import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';
import { motion, useMotionValue, animate } from 'motion/react';

const SwipeableItem = ({ children, onRebalance, onReconcile, onToggleFavorite, onDelete, isStarred, onClick }: { children: React.ReactNode, onRebalance: () => void, onReconcile: () => void, onToggleFavorite: () => void, onDelete: () => void, isStarred: boolean, onClick?: () => void, key?: React.Key }) => {
  const x = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
      setIsOpen(false);
    } else {
      animate(x, -224, { type: 'spring', stiffness: 300, damping: 30 });
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full h-20 rounded-xl overflow-hidden shadow-sm group">
      <div className="absolute inset-0 flex items-center justify-end bg-slate-100 dark:bg-slate-900 pl-4 rounded-xl">
        <div className="flex h-full">
          <button onClick={onRebalance} className="w-14 h-full bg-blue-500 text-white flex flex-col items-center justify-center gap-1 active:bg-blue-600">
            <span className="material-symbols-outlined text-xl">tune</span>
            <span className="text-[10px] font-medium">调仓</span>
          </button>
          <button onClick={onReconcile} className="w-14 h-full bg-slate-500 text-white flex flex-col items-center justify-center gap-1 active:bg-slate-600">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            <span className="text-[10px] font-medium">对账</span>
          </button>
          <button onClick={onToggleFavorite} className={`w-14 h-full ${isStarred ? 'bg-amber-400 active:bg-amber-500' : 'bg-slate-400 active:bg-slate-500'} text-white flex flex-col items-center justify-center gap-1`}>
            <span className={`material-symbols-outlined text-xl ${isStarred ? 'filled' : ''}`}>star</span>
            <span className="text-[10px] font-medium">{isStarred ? '已收藏' : '收藏'}</span>
          </button>
          <button onClick={onDelete} className="w-14 h-full bg-red-500 text-white flex flex-col items-center justify-center gap-1 active:bg-red-600">
            <span className="material-symbols-outlined text-xl">delete</span>
            <span className="text-[10px] font-medium">删除</span>
          </button>
        </div>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -224, right: 0 }}
        style={{ x }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -100) {
            animate(x, -224, { type: 'spring', stiffness: 300, damping: 30 });
            setIsOpen(true);
          } else {
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
            setIsOpen(false);
          }
        }}
        onClick={onClick}
        className="relative h-full bg-white dark:bg-[#1c2936] flex items-center px-4 border border-slate-100 dark:border-slate-800 rounded-xl z-10 hover:border-primary/30 transition-colors"
      >
        {children}
      </motion.div>
    </div>
  );
};

const GroupSection = ({ groupName, funds, renderFunds, totalAmount }: any) => {
  const { updateGroupName, openModal } = useContext(NavigationContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(groupName);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editName.trim() && editName !== groupName) {
      updateGroupName(groupName, editName.trim());
    } else {
      setEditName(groupName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const groupAmount = funds.reduce((sum: number, f: any) => sum + f.amount, 0);
  const percentage = totalAmount > 0 ? ((groupAmount / totalAmount) * 100).toFixed(0) : 0;

  return (
    <>
      <div className="flex items-center gap-2 mb-1 mt-3 px-1 group">
        <span className="w-1 h-4 bg-primary rounded-full"></span>
        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 bg-transparent border-b border-primary outline-none w-24"
          />
        ) : (
          <h4 
            className="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            onDoubleClick={handleDoubleClick}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {groupName}
          </h4>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); openModal('add-to-group', { groupName }); }}
          className="ml-1 text-slate-400 hover:text-primary transition-colors relative group/btn flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-10">
            添加
          </div>
        </button>
        <span className="text-xs text-slate-400 ml-auto">占比 {percentage}%</span>
      </div>
      {isExpanded && renderFunds(funds)}
    </>
  );
};

export default function HomeScreen() {
  const { navigate, funds, toggleFavorite, deleteFund, refreshData, messages, accounts, currentAccountId } = useContext(NavigationContext);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'amount' | 'returnRate' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const currentAccount = accounts.find(a => a.id === currentAccountId);
  const userName = currentAccount?.name || '张三';
  const userAvatar = currentAccount?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHXRdImaOWAILwdlH0ieQAT9f0VCO3__kvGFixQ9syXVmJXnCstUw4DAb2x4msKz2gplzqAILuy8I08GH9T-4gDijTUL5WQkTwshDVdiIYnGgvFsXHU_dDDqa2QGM6CuVTdSBgCfh-aLoOYb28FC96Diayj_GRIbZsAw1KSImsF0dm0TdbU3soVwqjhDSP9YRJd8Dygz_uW_MiFzAOzRuw3DpDPXjT7oCOqmZL4qqr-SlxAl83l02N8eiO6HxksgXnZPFUtvapaA';

  const handleSort = (field: 'name' | 'amount' | 'returnRate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const portfolioFunds = funds.filter(f => f.inPortfolio !== false);

  const getEffectiveAmount = (fund: typeof funds[0]) => {
    const today = new Date().toISOString().split('T')[0];
    let amount = fund.amount;
    if (fund.transactions) {
      fund.transactions.forEach(tx => {
        if (tx.date > today) {
          if (tx.type === 'buy' || tx.type === 'add') amount -= tx.amount;
          else if (tx.type === 'sell') amount += tx.amount;
        }
      });
    }
    return Math.max(0, amount);
  };

  const sortedFunds = [...portfolioFunds].sort((a, b) => {
    if (!sortField) return 0;
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'amount') {
      comparison = getEffectiveAmount(a) - getEffectiveAmount(b);
    } else if (sortField === 'returnRate') {
      comparison = a.returnRate - b.returnRate;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalAmount = portfolioFunds.reduce((sum, fund) => sum + getEffectiveAmount(fund), 0);
  const todaysReturnAmount = portfolioFunds.reduce((sum, fund) => sum + (getEffectiveAmount(fund) * fund.returnRate / 100), 0);
  const isTodaysReturnUp = todaysReturnAmount >= 0;
  const todaysReturnRate = totalAmount > 0 ? (todaysReturnAmount / totalAmount) * 100 : 0;
  
  const totalReturnAmount = portfolioFunds.reduce((sum, fund) => sum + (getEffectiveAmount(fund) * fund.totalReturnRate / 100), 0);
  const isTotalReturnUp = totalReturnAmount >= 0;
  const totalReturnRate = totalAmount > 0 ? (totalReturnAmount / totalAmount) * 100 : 0;
  
  const groups = Array.from(new Set(portfolioFunds.map(f => f.group))).filter(g => g !== '未分组');
  if (portfolioFunds.some(f => f.group === '未分组')) {
    groups.push('未分组');
  }

  const latestUpdateTime = portfolioFunds.reduce((latest, fund) => {
    if (fund.updateTime && fund.updateTime !== '未知') {
      if (!latest || fund.updateTime > latest) {
        return fund.updateTime;
      }
    }
    return latest;
  }, '');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const renderFunds = (fundsList: typeof funds) => {
    return fundsList.map((fund) => {
      const effectiveAmount = getEffectiveAmount(fund);
      return (
      <SwipeableItem 
        key={fund.id} 
        onRebalance={() => navigate('rebalance', { fundId: fund.id })} 
        onReconcile={() => navigate('reconcile', { fundId: fund.id })} 
        onToggleFavorite={() => toggleFavorite(fund.id)} 
        onDelete={() => deleteFund(fund.id)} 
        isStarred={fund.isStarred} 
        onClick={() => navigate('fund-detail', { fundId: fund.id })}
      >
        <div className="grid grid-cols-12 gap-2 w-full items-center cursor-pointer">
          <div className="col-span-5 flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{fund.name}</p>
              {fund.isStarred && <span className="material-symbols-outlined filled text-amber-400 text-sm">star</span>}
            </div>
            <div className="flex items-center gap-1 flex-wrap mt-0.5">
              <p className="text-xs text-slate-500 dark:text-slate-400">{fund.code}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded">{fund.isActualNav ? '净值' : '估值'} {fund.nav}</p>
              {fund.dataStatus === '数据异常，请核实' && (
                <span className="text-[9px] text-red-500 bg-red-100 dark:bg-red-900/30 px-1 rounded">异常</span>
              )}
            </div>
          </div>
          <div className="col-span-4 flex flex-col items-end justify-center">
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{privacyMode ? '****' : `¥${effectiveAmount.toFixed(2)}`}</p>
            <p className={`text-[11px] font-medium mt-0.5 ${fund.totalReturnRate >= 0 ? 'text-up' : 'text-down'}`}>
              {privacyMode ? '****' : `${fund.totalReturnRate >= 0 ? '+' : ''}${fund.totalReturnRate.toFixed(2)}%`}
            </p>
          </div>
          <div className="col-span-3 flex flex-col items-end justify-center gap-1">
            <div className={`flex items-center ${fund.isUp ? 'text-up bg-red-500/10' : 'text-down bg-green-500/10'} px-2 py-0.5 rounded-md`}>
              <span className="text-xs font-bold">{privacyMode ? '****' : `${fund.isUp ? '+' : ''}${fund.returnRate.toFixed(2)}%`}</span>
            </div>
            <div className={`flex items-center ${fund.isUp ? 'text-up' : 'text-down'}`}>
              <span className="text-[10px] font-medium">{privacyMode ? '****' : `${fund.isUp ? '+' : ''}${(effectiveAmount * fund.returnRate / 100).toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      </SwipeableItem>
    )});
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-primary/20">
            <div className="bg-center bg-no-repeat w-full h-full bg-cover" style={{ backgroundImage: `url("${userAvatar}")` }}></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">欢迎回来</span>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold leading-tight">{userName}</h2>
              {latestUpdateTime && (
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {latestUpdateTime.substring(5)} 更新
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => navigate('messages')} className="relative flex items-center justify-center size-10 rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 flex items-center justify-center size-4 rounded-full bg-red-500 border-2 border-background-light dark:border-background-dark">
              <span className="text-[9px] font-bold text-white leading-none">{unreadCount > 99 ? '99+' : unreadCount}</span>
            </div>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Asset Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-blue-600 p-6 shadow-lg shadow-primary/25">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between text-blue-100">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium opacity-90">总资产</p>
                <button onClick={() => setPrivacyMode(!privacyMode)} className="flex items-center justify-center rounded-full hover:bg-white/10 p-1 transition-colors">
                  <span className="material-symbols-outlined text-lg opacity-80">{privacyMode ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {privacyMode && (
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xs">shield</span>
                  <span className="opacity-90">隐私模式已开启</span>
                </div>
              )}
            </div>
            <div 
              className="cursor-pointer group"
              onClick={() => navigate('portfolio-chart')}
            >
              <p className="text-3xl font-extrabold text-white tracking-tight mt-1 group-hover:opacity-90 transition-opacity">
                {privacyMode ? '******' : `¥${totalAmount.toFixed(2)}`}
                <span className="material-symbols-outlined text-lg ml-2 opacity-0 group-hover:opacity-100 transition-opacity align-middle">pie_chart</span>
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 w-fit backdrop-blur-md">
              <span className={`material-symbols-outlined text-sm ${privacyMode ? 'text-slate-300' : isTodaysReturnUp ? 'text-red-300' : 'text-green-300'}`}>
                {isTodaysReturnUp ? 'trending_up' : 'trending_down'}
              </span>
              <p className="text-sm font-semibold text-white">{privacyMode ? '****' : `${isTodaysReturnUp ? '+' : ''}${todaysReturnRate.toFixed(2)}%`} <span className="font-normal opacity-80 text-xs ml-1">今日</span></p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div onClick={() => navigate('todays-return')} className="flex flex-1 flex-col justify-between rounded-xl bg-white dark:bg-[#1c2936] p-5 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2 ${isTodaysReturnUp ? 'bg-red-500/10 text-up' : 'bg-green-500/10 text-down'}`}>
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">今日收益</p>
              <p className={`text-xl font-bold ${isTodaysReturnUp ? 'text-up' : 'text-down'}`}>{privacyMode ? '****' : `${isTodaysReturnUp ? '+' : ''}¥${todaysReturnAmount.toFixed(2)}`}</p>
              <p className={`text-xs font-medium mt-0.5 ${isTodaysReturnUp ? 'text-up/80' : 'text-down/80'}`}>{privacyMode ? '****' : `${isTodaysReturnUp ? '+' : ''}${todaysReturnRate.toFixed(2)}%`}</p>
            </div>
          </div>
          <div onClick={() => navigate('total-return')} className="flex flex-1 flex-col justify-between rounded-xl bg-white dark:bg-[#1c2936] p-5 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2 ${isTotalReturnUp ? 'bg-red-500/10 text-up' : 'bg-green-500/10 text-down'}`}>
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">累计收益</p>
              <p className={`text-xl font-bold ${isTotalReturnUp ? 'text-up' : 'text-down'}`}>{privacyMode ? '****' : `${isTotalReturnUp ? '+' : ''}¥${totalReturnAmount.toFixed(2)}`}</p>
              <p className={`text-xs font-medium mt-0.5 ${isTotalReturnUp ? 'text-up/80' : 'text-down/80'}`}>{privacyMode ? '****' : `${isTotalReturnUp ? '+' : ''}${totalReturnRate.toFixed(2)}%`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">我的持仓</h3>
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
              <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
              刷新
            </button>
            <button onClick={() => navigate('batch-rebalance')} className="text-sm font-semibold text-primary hover:text-blue-500 transition-colors">批量调仓</button>
          </div>
        </div>

        <div className="flex mb-6 overflow-x-auto no-scrollbar">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
            <button onClick={() => setGrouped(false)} className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all ${!grouped ? 'shadow-sm bg-white dark:bg-slate-700 text-primary' : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>全部</button>
            <button onClick={() => setGrouped(true)} className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all ${grouped ? 'shadow-sm bg-white dark:bg-slate-700 text-primary' : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>分组</button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 px-4 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <div className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('name')}>
            名称
          </div>
          <div className="col-span-4 flex flex-col items-end justify-center cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('amount')}>
            <div className="flex items-center gap-1">
              金额
            </div>
            <div className="text-[9px] opacity-70">持有收益率</div>
          </div>
          <div className="col-span-3 flex flex-col items-end justify-center cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('returnRate')}>
            <div className="flex items-center gap-1">
              {funds.some(f => f.isActualNav) ? '净值/估值涨跌' : '估值涨跌'}
            </div>
            <div className="text-[9px] opacity-70">今日收益</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {grouped ? (
            <>
              {groups.map(group => (
                <GroupSection 
                  key={group} 
                  groupName={group} 
                  funds={sortedFunds.filter(f => f.group === group)} 
                  renderFunds={renderFunds} 
                  totalAmount={totalAmount} 
                />
              ))}
            </>
          ) : (
            renderFunds(sortedFunds)
          )}
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">—— 已经到底了 ——</p>
      </div>
    </div>
  );
}
