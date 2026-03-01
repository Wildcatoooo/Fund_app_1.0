import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import HomeScreen from './screens/HomeScreen';
import FundDetailScreen from './screens/FundDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import RebalanceScreen from './screens/RebalanceScreen';
import ReconcileScreen from './screens/ReconcileScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import BatchEditScreen from './screens/BatchEditScreen';
import BatchRebalanceScreen from './screens/BatchRebalanceScreen';
import SecuritySettingsScreen from './screens/SecuritySettingsScreen';
import DataExportScreen from './screens/DataExportScreen';
import DataImportScreen from './screens/DataImportScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import TodaysReturnScreen from './screens/TodaysReturnScreen';
import TotalReturnScreen from './screens/TotalReturnScreen';
import PortfolioChartScreen from './screens/PortfolioChartScreen';
import TargetRebalanceScreen from './screens/TargetRebalanceScreen';
import MemoryBankScreen from './screens/MemoryBankScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import AddFundModal from './modals/AddFundModal';
import ManualEntryModal from './modals/ManualEntryModal';
import AccountSwitchModal from './modals/AccountSwitchModal';
import ImageScanModal from './modals/ImageScanModal';
import TradeModal from './modals/TradeModal';
import AddToGroupModal from './modals/AddToGroupModal';
import TransactionDetailModal from './modals/TransactionDetailModal';
import BottomNav from './components/BottomNav';

import { updateFundDb } from './utils/fundDb';

export type Screen = 'home' | 'fund-detail' | 'favorites' | 'messages' | 'profile' | 'rebalance' | 'reconcile' | 'feedback' | 'batch-edit' | 'batch-rebalance' | 'security-settings' | 'data-export' | 'data-import' | 'notification-settings' | 'todays-return' | 'total-return' | 'portfolio-chart' | 'target-rebalance' | 'memory-bank' | 'transaction-history';
export type Modal = 'none' | 'add-fund' | 'manual-entry' | 'account-switch' | 'image-scan' | 'trade' | 'add-to-group' | 'transaction-detail';

export type Transaction = {
  id: string;
  type: 'buy' | 'sell' | 'add';
  date: string;
  amount: number;
  nav: number;
};

export type Fund = {
  id: string;
  name: string;
  code: string;
  amount: number;
  returnRate: number; // This is now today's return rate
  totalReturnRate: number; // This is the total holding return rate
  group: string;
  isUp: boolean | null;
  isStarred: boolean;
  inPortfolio?: boolean;
  nav: string;
  tag: string | null;
  color: string;
  initials: string;
  updateTime?: string;
  latestNetValue?: string;
  netValueDate?: string;
  dataStatus?: string;
  transactions?: Transaction[];
  isActualNav?: boolean;
  targetTakeProfit?: number;
  targetStopLoss?: number;
};

const initialFundsData: Fund[] = [
  { id: '1', name: 'VTI 全球股市', code: 'Vanguard Total', amount: 245.30, returnRate: 1.2, totalReturnRate: 5.4, group: '定投组', isUp: true, isStarred: true, inPortfolio: true, nav: '2.3456', tag: '重仓', color: 'from-blue-500 to-blue-700', initials: 'VT' },
  { id: '2', name: '纳指100 ETF', code: 'Invesco QQQ', amount: 380.12, returnRate: -0.4, totalReturnRate: -1.2, group: '定投组', isUp: false, isStarred: true, inPortfolio: true, nav: '1.1032', tag: null, color: 'from-indigo-500 to-purple-700', initials: 'QQ' },
  { id: '3', name: '苹果公司', code: 'AAPL Tech', amount: 182.40, returnRate: 0.8, totalReturnRate: 12.5, group: '稳健组', isUp: true, isStarred: false, inPortfolio: true, nav: '3.4410', tag: null, color: 'from-emerald-500 to-teal-700', initials: 'AP' },
  { id: '4', name: '特斯拉', code: 'TSLA Auto', amount: 215.60, returnRate: 3.5, totalReturnRate: 25.4, group: '激进组', isUp: true, isStarred: true, inPortfolio: true, nav: '0.8921', tag: null, color: 'from-orange-500 to-red-600', initials: 'TS' },
  { id: '5', name: '易方达蓝筹精选混合', code: '005827', amount: 12500.00, returnRate: 1.82, totalReturnRate: -5.2, group: '稳健组', isUp: true, isStarred: true, inPortfolio: true, nav: '2.3456', tag: '重仓', color: 'from-blue-500 to-blue-700', initials: 'EF' },
  { id: '6', name: '招商中证白酒指数C', code: '012414', amount: 8200.00, returnRate: -0.45, totalReturnRate: 8.9, group: '激进组', isUp: false, isStarred: false, inPortfolio: true, nav: '1.1032', tag: null, color: 'from-indigo-500 to-purple-700', initials: 'ZS' },
];

export type FundMemory = {
  fundCode: string;
  fundName: string;
  updatedAt: number;
};

export type AppMessage = {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  type: 'alert' | 'info';
};

export type Account = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export const NavigationContext = React.createContext<{
  currentScreen: Screen;
  screenParams: any;
  navigate: (screen: Screen, params?: any) => void;
  currentModal: Modal;
  modalParams: any;
  openModal: (modal: Modal, params?: any) => void;
  closeModal: () => void;
  goBack: () => void;
  funds: Fund[];
  setFunds: React.Dispatch<React.SetStateAction<Fund[]>>;
  toggleFavorite: (id: string) => void;
  deleteFund: (id: string) => void;
  addFund: (fund: Fund) => void;
  addTransaction: (fundId: string, transaction: Transaction) => void;
  updateGroupName: (oldName: string, newName: string) => void;
  changeFundGroup: (fundIds: string[], newGroup: string) => void;
  updateFund: (id: string, updates: Partial<Fund>) => void;
  refreshData: () => Promise<void>;
  fundMemory: FundMemory[];
  upsertFundMemory: (code: string, name: string) => void;
  deleteFundMemory: (code: string) => void;
  messages: AppMessage[];
  markMessageRead: (id: string) => void;
  markAllMessagesRead: () => void;
  deleteMessage: (id: string) => void;
  accounts: Account[];
  currentAccountId: string;
  switchAccount: (id: string) => void;
  addAccount: (name: string) => void;
  updateAccountName: (id: string, name: string) => void;
  deleteAccount: (id: string) => void;
  updateAccountAvatar: (id: string, url: string) => void;
}>({
  currentScreen: 'home',
  screenParams: null,
  navigate: () => {},
  currentModal: 'none',
  modalParams: null,
  openModal: () => {},
  closeModal: () => {},
  goBack: () => {},
  funds: [],
  setFunds: () => {},
  toggleFavorite: () => {},
  deleteFund: () => {},
  addFund: () => {},
  addTransaction: () => {},
  updateGroupName: () => {},
  changeFundGroup: () => {},
  updateFund: () => {},
  refreshData: async () => {},
  fundMemory: [],
  upsertFundMemory: () => {},
  deleteFundMemory: () => {},
  messages: [],
  markMessageRead: () => {},
  markAllMessagesRead: () => {},
  deleteMessage: () => {},
  accounts: [],
  currentAccountId: 'default',
  switchAccount: () => {},
  addAccount: () => {},
  updateAccountName: () => {},
  deleteAccount: () => {},
  updateAccountAvatar: () => {},
});

function MainApp({ accountId, accounts, currentAccountId, switchAccount, addAccount, updateAccountName, deleteAccount, updateAccountAvatar }: any) {
  const [history, setHistory] = useState<{screen: Screen, params?: any}[]>([{screen: 'home'}]);
  const [currentModal, setCurrentModal] = useState<Modal>('none');
  const [modalParams, setModalParams] = useState<any>(null);
  const [funds, setFunds] = useState<Fund[]>(() => {
    const saved = localStorage.getItem(`${accountId}_fund_app_data`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    } else if (accountId === 'default') {
      // Migrate old data
      const oldSaved = localStorage.getItem('fund_app_data');
      if (oldSaved) {
        try {
          return JSON.parse(oldSaved);
        } catch (e) {}
      }
    }
    return initialFundsData;
  });

  const [fundMemory, setFundMemory] = useState<FundMemory[]>(() => {
    const saved = localStorage.getItem(`${accountId}_fund_memory_db`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    } else if (accountId === 'default') {
      const oldSaved = localStorage.getItem('fund_memory_db');
      if (oldSaved) {
        try {
          return JSON.parse(oldSaved);
        } catch (e) {}
      }
    }
    return [];
  });

  const [messages, setMessages] = useState<AppMessage[]>(() => {
    const saved = localStorage.getItem(`${accountId}_fund_messages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    } else if (accountId === 'default') {
      const oldSaved = localStorage.getItem('fund_messages');
      if (oldSaved) {
        try {
          return JSON.parse(oldSaved);
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`${accountId}_fund_app_data`, JSON.stringify(funds));
    // Auto-collect funds to memory bank
    funds.forEach(fund => {
      upsertFundMemory(fund.code, fund.name);
    });
  }, [funds, accountId]);

  useEffect(() => {
    localStorage.setItem(`${accountId}_fund_memory_db`, JSON.stringify(fundMemory));
  }, [fundMemory, accountId]);

  useEffect(() => {
    localStorage.setItem(`${accountId}_fund_messages`, JSON.stringify(messages));
  }, [messages, accountId]);

  useEffect(() => {
    const checkAndDeleteOldTransactions = () => {
      const now = new Date();
      if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() >= 30)) {
        const todayStr = now.toISOString().split('T')[0];
        const lastDeleteDate = localStorage.getItem(`${accountId}_last_tx_delete_date`);
        
        if (lastDeleteDate !== todayStr) {
          const twoDaysAgo = new Date(now);
          twoDaysAgo.setDate(now.getDate() - 2);
          const cutoffDateStr = twoDaysAgo.toISOString().split('T')[0];

          setFunds(prevFunds => {
            let changed = false;
            const newFunds = prevFunds.map(fund => {
              if (fund.transactions && fund.transactions.length > 0) {
                const filtered = fund.transactions.filter(t => t.date > cutoffDateStr);
                if (filtered.length !== fund.transactions.length) {
                  changed = true;
                  return { ...fund, transactions: filtered };
                }
              }
              return fund;
            });
            return changed ? newFunds : prevFunds;
          });
          
          localStorage.setItem(`${accountId}_last_tx_delete_date`, todayStr);
        }
      }
    };

    checkAndDeleteOldTransactions();
    const interval = setInterval(checkAndDeleteOldTransactions, 60000);
    return () => clearInterval(interval);
  }, [accountId]);

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const markAllMessagesRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const upsertFundMemory = (code: string, name: string) => {
    setFundMemory(prev => {
      const existing = prev.find(m => m.fundCode === code);
      if (existing) {
        return prev.map(m => m.fundCode === code ? { ...m, fundName: name, updatedAt: Date.now() } : m);
      }
      return [...prev, { fundCode: code, fundName: name, updatedAt: Date.now() }];
    });
  };

  const deleteFundMemory = (code: string) => {
    setFundMemory(prev => prev.filter(m => m.fundCode !== code));
  };

  const fundsRef = useRef(funds);
  useEffect(() => {
    fundsRef.current = funds;
  }, [funds]);

  const refreshData = async () => {
    try {
      const validFunds = fundsRef.current.filter(f => /^\d{6}$/.test(f.code));
      let nfInfoMap: Record<string, any> = {};
      
      if (validFunds.length > 0) {
        const fcodes = validFunds.map(f => f.code).join(',');
        const nfInfoUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&Fcodes=${fcodes}`)}`;
        
        try {
          const nfResponse = await fetch(nfInfoUrl);
          const nfData = await nfResponse.json();
          if (nfData && nfData.Datas) {
            nfData.Datas.forEach((item: any) => {
              nfInfoMap[item.FCODE] = item;
            });
          }
        } catch (e) {
          console.error('Failed to fetch NFInfo', e);
        }
      }

      const updatedFunds = await Promise.all(fundsRef.current.map(async (fund) => {
        if (!/^\d{6}$/.test(fund.code)) return fund;
        
        try {
          const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundgz.1234567.com.cn/js/${fund.code}.js?rt=${Date.now()}`)}`;
          const response = await fetch(url);
          const text = await response.text();
          const match = text.match(/jsonpgz\((.*)\)/);
          
          if (match) {
            const data = JSON.parse(match[1]);
            let real_time_estimate = data.gsz ? parseFloat(data.gsz).toFixed(4) : '未知';
            let estimate_change = data.gszzl ? parseFloat(data.gszzl).toFixed(2) : '未知';
            const update_time = data.gztime || '未知';
            const latest_net_value = data.dwjz ? parseFloat(data.dwjz).toFixed(4) : '未知';
            const net_value_date = data.jzrq || '未知';

            // Check if we have actual net value for today
            const nfItem = nfInfoMap[fund.code];
            let isActualNav = false;
            
            if (nfItem && nfItem.PDATE && update_time !== '未知') {
              // Extract date from gztime (e.g., "2026-02-27 15:00")
              const tradingDay = update_time.split(' ')[0];
              const now = new Date();
              const todayStr = now.toISOString().split('T')[0];
              const isAfter3PM = now.getHours() >= 15;
              
              if (nfItem.PDATE >= tradingDay || (isAfter3PM && nfItem.PDATE === todayStr)) {
                // Actual net value is out! Use it instead of estimate
                real_time_estimate = nfItem.NAV ? parseFloat(nfItem.NAV).toFixed(4) : real_time_estimate;
                estimate_change = nfItem.NAVCHGRT ? parseFloat(nfItem.NAVCHGRT).toFixed(2) : estimate_change;
                isActualNav = true;
              }
            }

            let dataStatus = '正常';
            if (estimate_change !== '未知' && Math.abs(parseFloat(estimate_change)) > 10) {
              dataStatus = '数据异常，请核实';
            }

            const returnRate = estimate_change !== '未知' ? parseFloat(estimate_change) : 0;

            return {
              ...fund,
              returnRate: returnRate,
              isUp: returnRate >= 0,
              nav: real_time_estimate !== '未知' ? real_time_estimate : fund.nav,
              updateTime: update_time,
              latestNetValue: latest_net_value,
              netValueDate: net_value_date,
              dataStatus: dataStatus,
              isActualNav: isActualNav
            };
          }
        } catch (e) {
          console.error(`Failed to fetch for ${fund.code}`, e);
        }
        return fund;
      }));
      setFunds(updatedFunds);

      // Check for alerts at 14:30
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const lastAlertDate = localStorage.getItem('last_alert_date');
      
      if (now.getHours() > 14 || (now.getHours() === 14 && now.getMinutes() >= 30)) {
        if (lastAlertDate !== todayStr) {
          const newMessages: AppMessage[] = [];
          
          updatedFunds.forEach(fund => {
            // Check if today is a trading day for this fund
            // If it's a weekend, or if the fund's latest update time is not today, it means today is a non-trading day (weekend/holiday)
            const isWeekend = now.getDay() === 0 || now.getDay() === 6;
            if (isWeekend || (fund.updateTime && fund.updateTime !== '未知' && !fund.updateTime.startsWith(todayStr))) {
              return; // Skip alerts for non-trading days
            }

            let alertReasons = [];
            const currentNav = parseFloat(fund.nav);

            // Check Custom Alerts (Take Profit / Stop Loss)
            if (fund.targetTakeProfit && currentNav >= fund.targetTakeProfit) {
              alertReasons.push(`当前净值(${currentNav})已达到或超过止盈线(${fund.targetTakeProfit})`);
            }
            if (fund.targetStopLoss && currentNav <= fund.targetStopLoss) {
              alertReasons.push(`当前净值(${currentNav})已跌破或达到止损线(${fund.targetStopLoss})`);
            }

            if (fund.isStarred) {
              let lastBuyNav = null;
              let lastBuyAmount = null;
              if (fund.transactions && fund.transactions.length > 0) {
                const buys = fund.transactions.filter(t => t.type === 'buy' || t.type === 'add').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                if (buys.length > 0) {
                  lastBuyNav = buys[0].nav;
                  lastBuyAmount = buys[0].amount;
                }
              }
              
              if (lastBuyNav && currentNav < lastBuyNav) {
                alertReasons.push(`当前净值(${currentNav})低于上次买入净值(${lastBuyNav})`);
              }
              
              if (fund.totalReturnRate > 15) {
                alertReasons.push(`累计收益高于15% (${fund.totalReturnRate.toFixed(2)}%)`);
              } else if (fund.totalReturnRate < 10) {
                alertReasons.push(`累计收益低于10% (${fund.totalReturnRate.toFixed(2)}%)`);
              }
            }
            
            if (alertReasons.length > 0) {
              newMessages.push({
                id: Date.now().toString() + Math.random().toString(36).substring(7),
                title: `基金异动提醒: ${fund.name}`,
                content: `基金名: ${fund.name}\n当前总额: ¥${fund.amount.toFixed(2)}\n当前净值: ${fund.nav}\n\n触发原因:\n- ${alertReasons.join('\n- ')}`,
                date: now.toISOString(),
                read: false,
                type: 'alert'
              });
            }
          });
          
          if (newMessages.length > 0) {
            setMessages(prev => [...newMessages, ...prev]);
          }
          localStorage.setItem('last_alert_date', todayStr);
        }
      }

    } catch (error) {
      console.error('Failed to fetch real-time data', error);
    }
  };

  useEffect(() => {
    refreshData();
    updateFundDb();
    const interval = setInterval(refreshData, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (id: string) => {
    setFunds(prev => prev.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f));
  };

  const deleteFund = (id: string) => {
    setFunds(prev => prev.map(f => f.id === id ? { ...f, inPortfolio: false } : f));
  };

  const addFund = (fund: Fund) => {
    setFunds(prev => [fund, ...prev]);
  };

  const addTransaction = (fundId: string, transaction: Transaction) => {
    setFunds(prev => prev.map(f => {
      if (f.id === fundId) {
        const newTransactions = [...(f.transactions || []), transaction];
        let newAmount = f.amount;
        if (transaction.type === 'buy' || transaction.type === 'add') {
          newAmount += transaction.amount;
        } else if (transaction.type === 'sell') {
          newAmount = Math.max(0, newAmount - transaction.amount);
        }
        return { ...f, transactions: newTransactions, amount: newAmount };
      }
      return f;
    }));
  };

  const updateGroupName = (oldName: string, newName: string) => {
    setFunds(prev => prev.map(f => f.group === oldName ? { ...f, group: newName } : f));
  };

  const changeFundGroup = (fundIds: string[], newGroup: string) => {
    setFunds(prev => prev.map(f => fundIds.includes(f.id) ? { ...f, group: newGroup } : f));
  };

  const updateFund = (id: string, updates: Partial<Fund>) => {
    setFunds(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const currentScreenObj = history[history.length - 1];
  const currentScreen = currentScreenObj.screen;
  const screenParams = currentScreenObj.params;

  const navigate = (screen: Screen, params?: any) => {
    setHistory((prev) => [...prev, {screen, params}]);
  };

  const goBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const openModal = (modal: Modal, params?: any) => {
    setCurrentModal(modal);
    setModalParams(params || null);
  };
  const closeModal = () => {
    setCurrentModal('none');
    setModalParams(null);
  };

  const showBottomNav = ['home', 'favorites', 'profile', 'fund-detail'].includes(currentScreen);

  return (
    <NavigationContext.Provider value={{ currentScreen, screenParams, navigate, currentModal, modalParams, openModal, closeModal, goBack, funds, setFunds, toggleFavorite, deleteFund, addFund, addTransaction, updateGroupName, changeFundGroup, updateFund, refreshData, fundMemory, upsertFundMemory, deleteFundMemory, messages, markMessageRead, markAllMessagesRead, deleteMessage, accounts, currentAccountId, switchAccount, addAccount, updateAccountName, deleteAccount, updateAccountAvatar }}>
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background-light shadow-2xl dark:bg-background-dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full flex-col"
          >
            {currentScreen === 'home' && <HomeScreen />}
            {currentScreen === 'fund-detail' && <FundDetailScreen />}
            {currentScreen === 'favorites' && <FavoritesScreen />}
            {currentScreen === 'messages' && <MessagesScreen />}
            {currentScreen === 'profile' && <ProfileScreen />}
            {currentScreen === 'rebalance' && <RebalanceScreen />}
            {currentScreen === 'reconcile' && <ReconcileScreen />}
            {currentScreen === 'feedback' && <FeedbackScreen />}
            {currentScreen === 'batch-edit' && <BatchEditScreen />}
            {currentScreen === 'batch-rebalance' && <BatchRebalanceScreen />}
            {currentScreen === 'security-settings' && <SecuritySettingsScreen />}
            {currentScreen === 'data-export' && <DataExportScreen />}
            {currentScreen === 'data-import' && <DataImportScreen />}
            {currentScreen === 'notification-settings' && <NotificationSettingsScreen />}
            {currentScreen === 'todays-return' && <TodaysReturnScreen />}
            {currentScreen === 'total-return' && <TotalReturnScreen />}
            {currentScreen === 'portfolio-chart' && <PortfolioChartScreen />}
            {currentScreen === 'target-rebalance' && <TargetRebalanceScreen />}
            {currentScreen === 'memory-bank' && <MemoryBankScreen />}
            {currentScreen === 'transaction-history' && <TransactionHistoryScreen />}
          </motion.div>
        </AnimatePresence>

        {showBottomNav && <BottomNav />}

        <AnimatePresence>
          {currentModal !== 'none' && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden bg-white shadow-2xl dark:bg-[#192633] ${currentModal === 'account-switch' ? 'h-[90vh] rounded-t-3xl' : 'max-h-[90vh] rounded-t-2xl'}`}
              >
                {currentModal === 'add-fund' && <AddFundModal />}
                {currentModal === 'manual-entry' && <ManualEntryModal />}
                {currentModal === 'account-switch' && <AccountSwitchModal />}
                {currentModal === 'image-scan' && <ImageScanModal />}
                {currentModal === 'trade' && <TradeModal />}
                {currentModal === 'add-to-group' && <AddToGroupModal />}
                {currentModal === 'transaction-detail' && <TransactionDetailModal />}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </NavigationContext.Provider>
  );
}

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('app_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [{ id: 'default', name: localStorage.getItem('user_name') || '张三' }];
  });

  const [currentAccountId, setCurrentAccountId] = useState<string>(() => {
    return localStorage.getItem('current_account_id') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('app_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('current_account_id', currentAccountId);
  }, [currentAccountId]);

  const switchAccount = (id: string) => {
    if (accounts.find(a => a.id === id)) {
      setCurrentAccountId(id);
    }
  };

  const addAccount = (name: string) => {
    const newId = 'acc_' + Date.now().toString() + Math.random().toString(36).substring(7);
    setAccounts(prev => [...prev, { id: newId, name }]);
    setCurrentAccountId(newId);
  };

  const updateAccountName = (id: string, name: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, name } : a));
  };

  const deleteAccount = (id: string) => {
    if (id === 'default') return; // Cannot delete default account
    setAccounts(prev => {
      const newAccounts = prev.filter(a => a.id !== id);
      if (currentAccountId === id) {
        setCurrentAccountId('default');
      }
      return newAccounts;
    });
    // Clean up local storage data for this account
    localStorage.removeItem(`${id}_fund_app_data`);
    localStorage.removeItem(`${id}_fund_memory_db`);
    localStorage.removeItem(`${id}_fund_messages`);
    localStorage.removeItem(`${id}_last_tx_delete_date`);
  };

  const updateAccountAvatar = (id: string, url: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, avatarUrl: url } : a));
  };

  return (
    <MainApp 
      key={currentAccountId} 
      accountId={currentAccountId} 
      accounts={accounts} 
      currentAccountId={currentAccountId} 
      switchAccount={switchAccount} 
      addAccount={addAccount} 
      updateAccountName={updateAccountName} 
      deleteAccount={deleteAccount}
      updateAccountAvatar={updateAccountAvatar}
    />
  );
}
