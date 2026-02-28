import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function TradeModal() {
  const { closeModal, modalParams, funds, addTransaction } = useContext(NavigationContext);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>(modalParams?.type || 'buy');
  const [amount, setAmount] = useState('');

  const fundId = modalParams?.fundId;
  const fund = funds.find(f => f.id === fundId);

  if (!fund) {
    return (
      <div className="w-full flex flex-col h-full bg-white dark:bg-[#192633] items-center justify-center">
        <p className="text-slate-500">未找到基金信息</p>
        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-slate-100 rounded-lg">关闭</button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-[#192633]">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-12"></div>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setTradeType('buy')}
            className={`px-6 py-1.5 text-sm font-bold rounded-md transition-colors ${tradeType === 'buy' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            买入
          </button>
          <button 
            onClick={() => setTradeType('sell')}
            className={`px-6 py-1.5 text-sm font-bold rounded-md transition-colors ${tradeType === 'sell' ? 'bg-white dark:bg-slate-700 text-warning shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            卖出
          </button>
        </div>
        <button onClick={closeModal} className="w-12 flex items-center justify-end text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{fund.name} ({fund.code})</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{fund.nav}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">当前净值</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {tradeType === 'buy' ? '买入金额' : '卖出份额'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xl font-bold text-slate-900 dark:text-white">
                {tradeType === 'buy' ? '¥' : ''}
              </span>
              <input 
                type="text" 
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={tradeType === 'buy' ? '10.00起购' : '最多可卖出 12,500.00 份'}
                className={`w-full h-14 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xl font-bold px-4 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${tradeType === 'buy' ? 'pl-10 focus:ring-primary/50' : 'focus:ring-warning/50'}`}
              />
              {tradeType === 'sell' && (
                <span className="absolute right-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  份
                </span>
              )}
            </div>
            {tradeType === 'sell' && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">可用金额: {fund.amount.toFixed(2)}</span>
                <button onClick={() => setAmount(fund.amount.toString())} className="text-xs font-bold text-warning hover:text-orange-600 transition-colors">全部卖出</button>
              </div>
            )}
            {tradeType === 'buy' && (
              <div className="flex gap-2 mt-2">
                {['1000', '5000', '10000'].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    ¥{val}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">交易费率</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {tradeType === 'buy' ? '0.15% (打1折)' : '0.50% (持有<7天 1.5%)'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">确认时间</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {tradeType === 'buy' ? 'T+1日确认份额' : 'T+1日确认金额'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => {
            if (!amount || isNaN(parseFloat(amount))) return;
            addTransaction(fund.id, {
              id: Date.now().toString(),
              type: tradeType,
              date: new Date().toISOString().split('T')[0],
              amount: parseFloat(amount),
              nav: parseFloat(fund.nav) || 1
            });
            alert(tradeType === 'buy' ? '买入委托已提交' : '卖出委托已提交');
            closeModal();
          }}
          disabled={!amount}
          className={`w-full h-14 rounded-xl font-bold text-white text-lg shadow-lg transition-all ${!amount ? 'bg-slate-300 dark:bg-slate-700 shadow-none cursor-not-allowed' : tradeType === 'buy' ? 'bg-primary shadow-primary/30 hover:bg-primary/90 active:scale-[0.98]' : 'bg-warning shadow-warning/30 hover:bg-warning/90 active:scale-[0.98]'}`}
        >
          {tradeType === 'buy' ? '确认买入' : '确认卖出'}
        </button>
      </div>
    </div>
  );
}
