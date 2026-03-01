import React, { useContext, useState, useEffect } from 'react';
import { NavigationContext } from '../App';

export default function ManualEntryModal() {
  const { closeModal, addFund, currentScreen } = useContext(NavigationContext);
  const [fundInput, setFundInput] = useState('');
  const [fundName, setFundName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [returnRate, setReturnRate] = useState('');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  const handleSubmit = async () => {
    if (isBatchMode) {
      if (!batchInput.trim()) return;
      setIsProcessingBatch(true);
      const lines = batchInput.split('\n').map(l => l.trim()).filter(l => l);
      
      for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const code = parts[0];
          const amt = parseFloat(parts[1]);
          if (/^\d{6}$/.test(code) && !isNaN(amt)) {
            let name = code;
            try {
              const fallbackResponse = await fetch(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&Fcodes=${code}`);
              const fallbackData = await fallbackResponse.json();
              if (fallbackData && fallbackData.Datas && fallbackData.Datas.length > 0) {
                name = fallbackData.Datas[0].SHORTNAME;
              }
            } catch (e) {}

            const newFund = {
              id: Date.now().toString() + Math.random().toString(36).substring(7),
              name: name,
              code: code,
              amount: amt,
              returnRate: 0,
              totalReturnRate: 0,
              group: '未分组',
              isUp: true,
              isStarred: currentScreen === 'favorites',
              inPortfolio: currentScreen !== 'favorites',
              nav: '1.0000',
              tag: null,
              color: 'from-blue-500 to-blue-700',
              initials: name.substring(0, 2).toUpperCase()
            };
            addFund(newFund);
          }
        }
      }
      setIsProcessingBatch(false);
      closeModal();
      return;
    }

    if (!fundInput || !amount) return;
    
    // Extract name and code if we have a recognized fund, otherwise use input
    let name = fundInput;
    let code = fundInput;
    
    if (fundName && fundName !== '未找到该基金' && fundName !== '查询失败，请检查网络') {
      const match = fundName.match(/(.+)\s\((\d+)\)/);
      if (match) {
        name = match[1];
        code = match[2];
      }
    }

    const newFund = {
      id: Date.now().toString(),
      name: name,
      code: code,
      amount: parseFloat(amount) || 0,
      returnRate: 0, // Today's return will be fetched by API
      totalReturnRate: parseFloat(returnRate) || 0,
      group: '未分组',
      isUp: true, // Will be updated by API
      isStarred: currentScreen === 'favorites',
      inPortfolio: currentScreen !== 'favorites',
      nav: '1.0000',
      tag: null,
      color: 'from-blue-500 to-blue-700',
      initials: name.substring(0, 2).toUpperCase()
    };

    addFund(newFund);
    closeModal();
  };

  useEffect(() => {
    const fetchFundInfo = async () => {
      if (/^\d{6}$/.test(fundInput)) {
        setIsSearching(true);
        try {
          const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundgz.1234567.com.cn/js/${fundInput}.js?rt=${Date.now()}`)}`;
          const response = await fetch(url);
          const text = await response.text();
          const match = text.match(/jsonpgz\((.*)\)/);
          
          if (match) {
            const data = JSON.parse(match[1]);
            setFundName(`${data.name} (${data.fundcode})`);
          } else {
            // Fallback to mobile API
            const fallbackResponse = await fetch(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&Fcodes=${fundInput}`);
            const fallbackData = await fallbackResponse.json();
            if (fallbackData && fallbackData.Datas && fallbackData.Datas.length > 0) {
              const fund = fallbackData.Datas[0];
              setFundName(`${fund.SHORTNAME} (${fund.FCODE})`);
            } else {
              setFundName('未找到该基金');
            }
          }
        } catch (error) {
          console.error('Failed to fetch fund info:', error);
          setFundName('查询失败，请检查网络');
        } finally {
          setIsSearching(false);
        }
      } else {
        setFundName('');
      }
    };

    const debounceTimer = setTimeout(fetchFundInfo, 500);
    return () => clearTimeout(debounceTimer);
  }, [fundInput]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#233648]">
        <div className="w-12"></div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">手动补录</h2>
        <button onClick={closeModal} className="w-12 flex items-center justify-end text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="flex justify-end">
          <button onClick={() => setIsBatchMode(!isBatchMode)} className="text-primary hover:text-blue-500 text-sm font-bold flex items-center gap-1 transition-colors group">
            <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">
              {isBatchMode ? 'list' : 'library_add'}
            </span>
            {isBatchMode ? '单条输入' : '批量输入'}
          </button>
        </div>

        {isBatchMode ? (
          <div className="space-y-4 flex-1 flex flex-col h-full">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="batch-input">
                批量输入 (基金代码 金额)
              </label>
              <textarea 
                id="batch-input"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="请输入基金代码和金额，每行一个，用空格隔开。例如：&#10;000001 1000&#10;000002 2000"
                className="w-full flex-1 min-h-[200px] rounded-lg bg-slate-50 dark:bg-[#1e2a36] border border-slate-200 dark:border-[#324d67] text-slate-900 dark:text-white text-base p-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="fund-name">
              基金名称/代码
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                className="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#1e2a36] border border-slate-200 dark:border-[#324d67] text-slate-900 dark:text-white text-base pl-10 pr-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                id="fund-name" 
                placeholder="请输入基金名称 or 代码 (如: 000001)" 
                type="text" 
                value={fundInput}
                onChange={(e) => setFundInput(e.target.value)}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {fundName && !isSearching && (
              <div className="text-xs font-medium text-primary mt-1 ml-1">
                识别结果: {fundName}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="amount">
              金额
            </label>
            <div className="relative group">
              <input 
                className="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#1e2a36] border border-slate-200 dark:border-[#324d67] text-slate-900 dark:text-white text-base px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                id="amount" 
                inputMode="decimal" 
                placeholder="0.00" 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-sm">
                元
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="return-rate">
              持有收益率
            </label>
            <div className="relative group">
              <input 
                className="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#1e2a36] border border-slate-200 dark:border-[#324d67] text-slate-900 dark:text-white text-base px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                id="return-rate" 
                inputMode="decimal" 
                placeholder="0.00" 
                type="text" 
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-sm">
                %
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirm-date">
              确认日期
            </label>
            <div className="relative">
              <input 
                type="date" 
                id="confirm-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#1e2a36] border border-slate-200 dark:border-[#324d67] text-slate-900 dark:text-white text-base px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
              />
            </div>
          </div>
        </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-[#233648] bg-white dark:bg-[#16212b]">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={closeModal} className="h-12 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-[#233648] transition-colors focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700">
            取消
          </button>
          <button onClick={handleSubmit} disabled={isProcessingBatch} className="h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 active:scale-[0.98] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#16212b] disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessingBatch ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                处理中...
              </>
            ) : (
              '确认补录'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
