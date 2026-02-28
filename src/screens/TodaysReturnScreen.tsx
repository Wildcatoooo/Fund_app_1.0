import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function TodaysReturnScreen() {
  const { goBack, navigate, funds } = useContext(NavigationContext);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortType, setSortType] = useState<'amount' | 'rate'>('amount');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const portfolioFunds = funds.filter(f => f.inPortfolio !== false);

  const fundsWithReturn = portfolioFunds.map(fund => {
    const returnAmount = fund.amount * (fund.returnRate / 100);
    return { ...fund, returnAmount };
  });

  const sortedFunds = [...fundsWithReturn].sort((a, b) => {
    if (sortType === 'amount') {
      return sortOrder === 'asc' ? a.returnAmount - b.returnAmount : b.returnAmount - a.returnAmount;
    } else {
      return sortOrder === 'asc' ? a.returnRate - b.returnRate : b.returnRate - a.returnRate;
    }
  });

  const totalReturn = fundsWithReturn.reduce((sum, fund) => sum + fund.returnAmount, 0);

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">今日收益明细</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4">
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 text-center mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">总计今日收益</p>
          <p className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-up' : 'text-down'}`}>
            {totalReturn >= 0 ? '+' : ''}¥{totalReturn.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">收益列表</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
              >
                <span>{sortType === 'amount' ? '按收益金额排序' : '按收益率排序'}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {isDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg z-20 overflow-hidden">
                  <button 
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 ${sortType === 'amount' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => { setSortType('amount'); setIsDropdownOpen(false); }}
                  >
                    按收益金额排序
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 ${sortType === 'rate' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => { setSortType('rate'); setIsDropdownOpen(false); }}
                  >
                    按收益率排序
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
            >
              <span className="text-[12px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {sortOrder === 'asc' ? '正序' : '倒序'}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-slate-800/50 overflow-hidden">
          {sortedFunds.map((fund, index) => (
            <div 
              key={fund.id} 
              onClick={() => navigate('fund-detail')}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${index !== sortedFunds.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
            >
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">{fund.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{fund.code}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-base font-bold font-mono ${fund.returnAmount >= 0 ? 'text-up' : 'text-down'}`}>
                  {fund.returnAmount >= 0 ? '+' : ''}{fund.returnAmount.toFixed(2)}
                </span>
                <span className={`text-xs font-medium font-mono mt-0.5 ${fund.returnRate >= 0 ? 'text-up' : 'text-down'}`}>
                  {fund.returnRate >= 0 ? '+' : ''}{fund.returnRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
