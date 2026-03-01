import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function TransactionHistoryScreen() {
  const { goBack, openModal, funds } = useContext(NavigationContext);

  const allTransactions = funds.flatMap(fund => 
    (fund.transactions || []).map(t => ({ ...t, fundName: fund.name, fundCode: fund.code }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button onClick={goBack} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">全部交易记录</h2>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-2">
        {allTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">receipt_long</span>
            <p>暂无交易记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allTransactions.map(t => (
              <div 
                key={t.id} 
                className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:bg-slate-50 md:hover:bg-slate-50 dark:active:bg-slate-800 dark:md:hover:bg-slate-800 transition-colors"
                onClick={() => openModal('transaction-detail', { transaction: t })}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{t.fundName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.fundCode}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    t.type === 'buy' ? 'bg-primary/10 text-primary' : 
                    t.type === 'add' ? 'bg-emerald-500/10 text-emerald-500' : 
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {t.type === 'buy' ? '买入' : t.type === 'add' ? '加仓' : '卖出'}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">交易金额</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">¥{t.amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">净值日期: {t.date}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">净值: {t.nav.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
