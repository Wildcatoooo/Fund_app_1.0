import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function TransactionDetailModal() {
  const { closeModal, modalParams } = useContext(NavigationContext);
  const transaction = modalParams?.transaction;

  if (!transaction) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">交易详情</h2>
        <button onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className={`size-16 rounded-full flex items-center justify-center mb-4 ${
            transaction.type === 'buy' ? 'bg-primary/10 text-primary' : 
            transaction.type === 'add' ? 'bg-emerald-500/10 text-emerald-500' : 
            'bg-orange-500/10 text-orange-500'
          }`}>
            <span className="material-symbols-outlined text-3xl">
              {transaction.type === 'buy' ? 'shopping_cart' : transaction.type === 'add' ? 'add_circle' : 'remove_circle'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {transaction.type === 'buy' ? '买入' : transaction.type === 'add' ? '加仓' : '卖出'}
          </h3>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            ¥{transaction.amount.toFixed(2)}
          </p>
        </div>

        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">基金名称</span>
            <span className="font-medium text-slate-900 dark:text-white">{transaction.fundName || '未知基金'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">基金代码</span>
            <span className="font-medium text-slate-900 dark:text-white">{transaction.fundCode || '未知代码'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">交易日期</span>
            <span className="font-medium text-slate-900 dark:text-white">{transaction.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">成交净值</span>
            <span className="font-medium text-slate-900 dark:text-white">{transaction.nav.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">交易状态</span>
            <span className="font-medium text-emerald-500">交易成功</span>
          </div>
        </div>
      </div>
      <div className="h-6 w-full sm:hidden"></div>
    </div>
  );
}
