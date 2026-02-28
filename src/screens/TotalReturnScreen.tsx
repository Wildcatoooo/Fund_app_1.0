import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function TotalReturnScreen() {
  const { goBack, navigate, funds } = useContext(NavigationContext);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortType, setSortType] = useState<'amount' | 'rate'>('amount');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const portfolioFunds = funds.filter(f => f.inPortfolio !== false);

  // Calculate total return amount based on actual total return rate for each fund
  const fundsWithTotalReturn = portfolioFunds.map(fund => {
    const totalReturnAmount = fund.amount * (fund.totalReturnRate / 100);
    return { ...fund, totalReturnAmount };
  });

  const sortedFunds = [...fundsWithTotalReturn].sort((a, b) => {
    if (sortType === 'amount') {
      return sortOrder === 'asc' ? a.totalReturnAmount - b.totalReturnAmount : b.totalReturnAmount - a.totalReturnAmount;
    } else {
      return sortOrder === 'asc' ? a.totalReturnRate - b.totalReturnRate : b.totalReturnRate - a.totalReturnRate;
    }
  });

  const totalReturnAmount = fundsWithTotalReturn.reduce((sum, fund) => sum + fund.totalReturnAmount, 0);
  const totalAmount = portfolioFunds.reduce((sum, fund) => sum + fund.amount, 0);
  const overallReturnRate = (totalReturnAmount / totalAmount) * 100;

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">累计收益明细</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4">
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 text-center mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">总计累计收益</p>
          <p className={`text-3xl font-bold ${totalReturnAmount >= 0 ? 'text-up' : 'text-down'}`}>
            {totalReturnAmount >= 0 ? '+' : ''}¥{totalReturnAmount.toFixed(2)}
          </p>
          <div className="mt-2 inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            <span className="text-xs text-slate-500 dark:text-slate-400">总收益率</span>
            <span className={`text-xs font-bold ${overallReturnRate >= 0 ? 'text-up' : 'text-down'}`}>
              {overallReturnRate >= 0 ? '+' : ''}{overallReturnRate.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">收益列表</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
              >
                <span>{sortType === 'amount' ? '按累计收益金额排序' : '按累计收益率排序'}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {isDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg z-20 overflow-hidden">
                  <button 
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 ${sortType === 'amount' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => { setSortType('amount'); setIsDropdownOpen(false); }}
                  >
                    按累计收益金额排序
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 ${sortType === 'rate' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => { setSortType('rate'); setIsDropdownOpen(false); }}
                  >
                    按累计收益率排序
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
                <span className={`text-base font-bold font-mono ${fund.totalReturnAmount >= 0 ? 'text-up' : 'text-down'}`}>
                  {fund.totalReturnAmount >= 0 ? '+' : ''}{fund.totalReturnAmount.toFixed(2)}
                </span>
                <span className={`text-xs font-medium font-mono mt-0.5 ${fund.totalReturnRate >= 0 ? 'text-up' : 'text-down'}`}>
                  {fund.totalReturnRate >= 0 ? '+' : ''}{fund.totalReturnRate.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
