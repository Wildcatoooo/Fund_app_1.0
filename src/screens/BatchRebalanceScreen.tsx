import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function BatchRebalanceScreen() {
  const { goBack, funds, addTransaction } = useContext(NavigationContext);
  const portfolioFunds = funds.filter(f => f.inPortfolio !== false);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [rebalanceData, setRebalanceData] = useState<Record<string, { amount: number, date: string, timeSlot: 'before' | 'after' }>>({});

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

  const getEffectiveDate = (opDateStr: string, timeSlot: 'before' | 'after') => {
    const d = new Date(opDateStr);
    let daysToAdd = timeSlot === 'after' ? 2 : 1;
    
    while (daysToAdd > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        daysToAdd--;
      }
    }
    return d.toISOString().split('T')[0];
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedIds.length === 0) return;
    
    // Initialize rebalance data for selected funds
    const initialData: Record<string, { amount: number, date: string, timeSlot: 'before' | 'after' }> = {};
    const todayStr = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const defaultTimeSlot = currentHour >= 15 ? 'after' : 'before';
    
    selectedIds.forEach(id => {
      const fund = portfolioFunds.find(f => f.id === id);
      if (fund) {
        initialData[id] = {
          amount: fund.amount,
          date: todayStr,
          timeSlot: defaultTimeSlot
        };
      }
    });
    
    setRebalanceData(initialData);
    setStep(2);
  };

  const handleConfirm = () => {
    // Apply updates
    Object.entries(rebalanceData).forEach(([id, data]: [string, { amount: number, date: string, timeSlot: 'before' | 'after' }]) => {
      const fund = portfolioFunds.find(f => f.id === id);
      if (fund) {
        const diff = data.amount - fund.amount;
        if (diff !== 0) {
          const effectiveDate = getEffectiveDate(data.date, data.timeSlot);
          addTransaction(id, {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            type: diff > 0 ? 'buy' : 'sell',
            date: effectiveDate,
            amount: Math.abs(diff),
            nav: parseFloat(fund.nav) || 1, // Use current nav or 1
          });
        }
      }
    });
    goBack();
  };

  const updateRebalanceData = (id: string, field: 'amount' | 'date' | 'timeSlot', value: any) => {
    setRebalanceData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-border-color">
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <button onClick={step === 1 ? goBack : () => setStep(1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex-1 text-center tracking-tight">
            {step === 1 ? '选择调仓基金' : '批量调仓'}
          </h1>
          <div className="flex w-10 items-center justify-end">
            {step === 1 && (
              <button 
                onClick={() => setSelectedIds(selectedIds.length === portfolioFunds.length ? [] : portfolioFunds.map(f => f.id))}
                className="text-sm font-medium text-primary"
              >
                {selectedIds.length === portfolioFunds.length ? '全不选' : '全选'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {step === 1 ? (
          <div className="flex flex-col gap-2">
            {portfolioFunds.map(fund => (
              <div 
                key={fund.id}
                onClick={() => toggleSelection(fund.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${
                  selectedIds.includes(fund.id) 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2936]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{fund.name}</span>
                  <span className="text-xs text-slate-500">{fund.code}</span>
                </div>
                <div className={`flex items-center justify-center size-6 rounded-full border ${
                  selectedIds.includes(fund.id)
                    ? 'bg-primary border-primary text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {selectedIds.includes(fund.id) && <span className="material-symbols-outlined text-[16px]">check</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {selectedIds.map(id => {
              const fund = portfolioFunds.find(f => f.id === id);
              if (!fund) return null;
              const data = rebalanceData[id];
              
              return (
                <div key={id} className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2936] gap-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{fund.name}</span>
                    <span className="text-sm text-slate-500">当前: ¥{fund.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-500">调仓后金额 (¥)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={data.amount}
                        onChange={(e) => updateRebalanceData(id, 'amount', parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      />
                      <select 
                        onChange={(e) => {
                          const fraction = parseFloat(e.target.value);
                          if (fraction > 0) {
                            updateRebalanceData(id, 'amount', fund.amount * (1 - fraction));
                          }
                        }}
                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        defaultValue="0"
                      >
                        <option value="0" disabled>快捷减仓</option>
                        <option value="0.5">减仓二分之一</option>
                        <option value="0.33333333">减仓三分之一</option>
                        <option value="0.25">减仓四分之一</option>
                        <option value="1">全部清仓</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-500">调仓时间</label>
                    <div className="flex gap-2">
                      <select 
                        value={data.date}
                        onChange={(e) => updateRebalanceData(id, 'date', e.target.value)}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      >
                        {dateOptions.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <select
                        value={data.timeSlot}
                        onChange={(e) => updateRebalanceData(id, 'timeSlot', e.target.value as 'before' | 'after')}
                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="before">15:00 前</option>
                        <option value="after">15:00 后</option>
                      </select>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      预计确认日期: {getEffectiveDate(data.date, data.timeSlot)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            <button 
              onClick={handleNext}
              disabled={selectedIds.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
                selectedIds.length > 0 ? 'bg-primary hover:bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
              }`}
            >
              下一步 ({selectedIds.length})
            </button>
          ) : (
            <button 
              onClick={handleConfirm}
              className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 transition-colors"
            >
              确认调仓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
