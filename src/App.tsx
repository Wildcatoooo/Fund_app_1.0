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
import AddFundModal from './modals/AddFundModal';
import ManualEntryModal from './modals/ManualEntryModal';
import AccountSwitchModal from './modals/AccountSwitchModal';
import ImageScanModal from './modals/ImageScanModal';
import TradeModal from './modals/TradeModal';
import AddToGroupModal from './modals/AddToGroupModal';
import BottomNav from './components/BottomNav';

export type Screen = 'home' | 'fund-detail' | 'favorites' | 'messages' | 'profile' | 'rebalance' | 'reconcile' | 'feedback' | 'batch-edit' | 'batch-rebalance' | 'security-settings' | 'data-export' | 'data-import' | 'notification-settings' | 'todays-return' | 'total-return';
export type Modal = 'none' | 'add-fund' | 'manual-entry' | 'account-switch' | 'image-scan' | 'trade' | 'add-to-group';

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
});

export default function App() {
  const [history, setHistory] = useState<{screen: Screen, params?: any}[]>([{screen: 'home'}]);
  const [currentModal, setCurrentModal] = useState<Modal>('none');
  const [modalParams, setModalParams] = useState<any>(null);
  const [funds, setFunds] = useState<Fund[]>(() => {
    const saved = localStorage.getItem('fund_app_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialFundsData;
  });

  const [fundMemory, setFundMemory] = useState<FundMemory[]>(() => {
    const saved = localStorage.getItem('fund_memory_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('fund_app_data', JSON.stringify(funds));
  }, [funds]);

  useEffect(() => {
    localStorage.setItem('fund_memory_db', JSON.stringify(fundMemory));
  }, [fundMemory]);

  const upsertFundMemory = (code: string, name: string) => {
    setFundMemory(prev => {
      const existing = prev.find(m => m.fundCode === code);
      if (existing) {
        return prev.map(m => m.fundCode === code ? { ...m, fundName: name, updatedAt: Date.now() } : m);
      }
      return [...prev, { fundCode: code, fundName: name, updatedAt: Date.now() }];
    });
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
            if (nfItem && nfItem.PDATE && update_time !== '未知') {
              // Extract date from gztime (e.g., "2026-02-27 15:00")
              const tradingDay = update_time.split(' ')[0];
              if (nfItem.PDATE >= tradingDay) {
                // Actual net value is out! Use it instead of estimate
                real_time_estimate = nfItem.NAV ? parseFloat(nfItem.NAV).toFixed(4) : real_time_estimate;
                estimate_change = nfItem.NAVCHGRT ? parseFloat(nfItem.NAVCHGRT).toFixed(2) : estimate_change;
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
              dataStatus: dataStatus
            };
          }
        } catch (e) {
          console.error(`Failed to fetch for ${fund.code}`, e);
        }
        return fund;
      }));
      setFunds(updatedFunds);
    } catch (error) {
      console.error('Failed to fetch real-time data', error);
    }
  };

  useEffect(() => {
    refreshData();
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
    <NavigationContext.Provider value={{ currentScreen, screenParams, navigate, currentModal, modalParams, openModal, closeModal, goBack, funds, toggleFavorite, deleteFund, addFund, addTransaction, updateGroupName, changeFundGroup, updateFund, refreshData, fundMemory, upsertFundMemory }}>
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
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </NavigationContext.Provider>
  );
}
