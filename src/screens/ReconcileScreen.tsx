import React, { useContext, useState, useEffect } from 'react';
import { NavigationContext } from '../App';

export default function ReconcileScreen() {
  const { goBack, screenParams, funds, updateFund } = useContext(NavigationContext);
  const fundId = screenParams?.fundId;
  const fund = funds.find(f => f.id === fundId);

  const [actualAmount, setActualAmount] = useState('');
  const [actualReturnRate, setActualReturnRate] = useState('');

  useEffect(() => {
    if (fund) {
      setActualAmount(fund.amount.toString());
      setActualReturnRate(fund.totalReturnRate.toString());
    }
  }, [fund]);

  if (!fund) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>未找到基金信息</p>
        <button onClick={goBack} className="ml-4 text-primary">返回</button>
      </div>
    );
  }

  const handleSync = () => {
    const newAmount = parseFloat(actualAmount);
    const newReturnRate = parseFloat(actualReturnRate);
    
    if (!isNaN(newAmount) && !isNaN(newReturnRate) && fund) {
      updateFund(fund.id, {
        amount: newAmount,
        totalReturnRate: newReturnRate
      });
      goBack();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
        <button onClick={goBack} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">持仓对账</h2>
      </div>

      <div className="px-4 py-6 bg-background-light dark:bg-background-dark">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">{fund.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{fund.code}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
            {fund.group}
          </span>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between py-4">
          <h4 className="text-slate-900 dark:text-white text-lg font-bold">数据对比</h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">更新于 {fund.updateTime && fund.updateTime !== '未知' ? fund.updateTime.substring(5) : '今日'}</span>
        </div>

        <div className="bg-white dark:bg-[#192633] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#1e2d3d]">
            <div className="p-4 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">系统记录</p>
            </div>
            <div className="p-4 text-center border-l border-slate-100 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">实际数据</p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-700">
            <div className="p-4 flex flex-col gap-1 items-center justify-center bg-transparent">
              <p className="text-slate-400 dark:text-slate-500 text-xs">持有金额</p>
              <p className="text-slate-900 dark:text-white text-base font-medium">¥{fund.amount.toFixed(2)}</p>
            </div>
            <div className="p-3 border-l border-slate-100 dark:border-slate-700 bg-yellow-50 dark:bg-yellow-900/10 flex flex-col justify-center">
              <label className="block text-center mb-1">
                <span className="text-yellow-700 dark:text-yellow-500 text-xs font-medium flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> 需修正
                </span>
              </label>
              <div className="relative">
                <input 
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  className="w-full text-center bg-white dark:bg-[#111a22] border-yellow-300 dark:border-yellow-700 text-slate-900 dark:text-white text-base font-medium rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 focus:outline-none transition-all" 
                  type="number" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="p-4 flex flex-col gap-1 items-center justify-center">
              <p className="text-slate-400 dark:text-slate-500 text-xs">持有收益率</p>
              <p className="text-slate-900 dark:text-white text-base font-medium">{fund.totalReturnRate.toFixed(2)}%</p>
            </div>
            <div className="p-3 border-l border-slate-100 dark:border-slate-700 bg-yellow-50 dark:bg-yellow-900/10 flex flex-col justify-center">
              <label className="block text-center mb-1">
                <span className="text-yellow-700 dark:text-yellow-500 text-xs font-medium flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> 需修正
                </span>
              </label>
              <div className="relative">
                <input 
                  value={actualReturnRate}
                  onChange={(e) => setActualReturnRate(e.target.value)}
                  className="w-full text-center bg-white dark:bg-[#111a22] border-yellow-300 dark:border-yellow-700 text-slate-900 dark:text-white text-base font-medium rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 focus:outline-none transition-all" 
                  type="number" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-slate-900 dark:text-white tracking-light text-lg font-bold leading-tight text-left pb-4">差异修正</h3>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col flex-1">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">实际持有金额</p>
              <div className="flex w-full flex-1 items-stretch rounded-lg shadow-sm">
                <input 
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#192633] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal transition-all" 
                  type="number" 
                />
                <div className="text-slate-500 dark:text-slate-400 flex border border-l-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#253646] items-center justify-center px-4 rounded-r-lg">
                  <span className="text-sm font-medium">元</span>
                </div>
              </div>
            </label>
            <label className="flex flex-col flex-1">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">实际持有收益率</p>
              <div className="flex w-full flex-1 items-stretch rounded-lg shadow-sm">
                <input 
                  value={actualReturnRate}
                  onChange={(e) => setActualReturnRate(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#192633] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal transition-all" 
                  type="number" 
                />
                <div className="text-slate-500 dark:text-slate-400 flex border border-l-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#253646] items-center justify-center px-4 rounded-r-lg">
                  <span className="text-sm font-medium">%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pl-1">请输入最新的证券账户实际金额和收益率，系统将重新校准。</p>
            </label>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3 mt-2">
              <span className="material-symbols-outlined text-primary mt-0.5 text-lg">info</span>
              <div className="flex-1">
                <h5 className="text-primary text-sm font-bold mb-1">温馨提示</h5>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  校准后，系统将以您输入的金额和收益率为准，重新计算您的累计收益。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md mx-auto p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 z-50">
        <button onClick={handleSync} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined">sync</span>
          <span>确认同步数据</span>
        </button>
      </div>
    </div>
  );
}
