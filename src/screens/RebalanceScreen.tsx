import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function RebalanceScreen() {
  const { goBack, funds, addTransaction, screenParams } = useContext(NavigationContext);
  const fundId = screenParams?.fundId;
  const fund = funds.find(f => f.id === fundId);

  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<'before' | 'after'>(new Date().getHours() >= 15 ? 'after' : 'before');

  const dateOptions = React.useMemo(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      options.push(d.toISOString().split('T')[0]);
    }
    return options;
  }, []);

  const getEffectiveDate = (opDateStr: string, slot: 'before' | 'after') => {
    const d = new Date(opDateStr);
    let daysToAdd = slot === 'after' ? 2 : 1;
    
    while (daysToAdd > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        daysToAdd--;
      }
    }
    return d.toISOString().split('T')[0];
  };

  const handleConfirm = () => {
    if (!fund || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;
    
    const effectiveDate = getEffectiveDate(date, timeSlot);
    addTransaction(fund.id, {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      type: type,
      date: effectiveDate,
      amount: parseFloat(amount),
      nav: parseFloat(fund.nav) || 1,
    });
    goBack();
  };

  if (!fund) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-slate-500">未找到该基金</p>
        <button onClick={goBack} className="ml-4 text-primary">返回</button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-md mx-auto bg-slate-50 dark:bg-background-dark pb-32 overflow-y-auto">
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <div onClick={goBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-slate-900 dark:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-lg font-bold leading-tight flex-1 text-center text-slate-900 dark:text-white">基金调仓</h2>
          <div className="flex size-10 items-center justify-center">
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{fund.name}</h3>
          <p className="text-sm text-slate-500 font-mono mb-4">{fund.code}</p>
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
            <span className="text-sm text-slate-600 dark:text-slate-400">当前持仓</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">¥ {fund.amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 space-y-5">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setType('buy')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'buy' ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              加仓
            </button>
            <button 
              onClick={() => setType('sell')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'sell' ? 'bg-white dark:bg-slate-700 text-green-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              减仓
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{type === 'buy' ? '加仓金额' : '减仓金额'}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-slate-500 font-bold text-lg">¥</span>
              </div>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pl-8 pr-4 text-lg font-bold focus:border-primary focus:ring-primary placeholder:text-slate-300" 
                placeholder="0.00" 
              />
            </div>
            {type === 'sell' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => setAmount((fund.amount / 4).toFixed(2))} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">1/4</button>
                <button onClick={() => setAmount((fund.amount / 3).toFixed(2))} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">1/3</button>
                <button onClick={() => setAmount((fund.amount / 2).toFixed(2))} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">1/2</button>
                <button onClick={() => setAmount(fund.amount.toFixed(2))} className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">全部</button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">操作时间</label>
            <div className="flex gap-2">
              <select 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 text-sm font-medium focus:border-primary focus:ring-primary"
              >
                {dateOptions.map(d => (
                  <option key={d} value={d}>{d === new Date().toISOString().split('T')[0] ? '今天' : d}</option>
                ))}
              </select>
              <select 
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as 'before' | 'after')}
                className="w-32 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 text-sm font-medium focus:border-primary focus:ring-primary"
              >
                <option value="before">15:00 前</option>
                <option value="after">15:00 后</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              预计确认日期: <span className="font-bold text-primary">{getEffectiveDate(date, timeSlot)}</span>
            </p>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          className="w-full h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          确认调仓
        </button>
      </div>
    </div>
  );
}
