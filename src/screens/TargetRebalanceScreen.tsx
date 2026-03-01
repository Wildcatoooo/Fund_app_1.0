import React, { useContext, useState, useMemo } from 'react';
import { NavigationContext } from '../App';

export default function TargetRebalanceScreen() {
  const { goBack, funds } = useContext(NavigationContext);

  const totalAssets = useMemo(() => funds.reduce((sum, f) => sum + f.amount, 0), [funds]);
  
  const initialGroups = useMemo(() => {
    const groups: Record<string, number> = {};
    funds.forEach(f => {
      groups[f.group] = (groups[f.group] || 0) + f.amount;
    });
    return Object.keys(groups).map(key => ({
      name: key,
      currentAmount: groups[key],
      currentPercentage: totalAssets > 0 ? (groups[key] / totalAssets) * 100 : 0,
      targetPercentage: totalAssets > 0 ? (groups[key] / totalAssets) * 100 : 0
    }));
  }, [funds, totalAssets]);

  const [targets, setTargets] = useState(initialGroups);

  const handleTargetChange = (index: number, value: number) => {
    const newTargets = [...targets];
    newTargets[index].targetPercentage = value;
    setTargets(newTargets);
  };

  const totalTargetPercentage = targets.reduce((sum, t) => sum + t.targetPercentage, 0);

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">目标比例调仓</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-[#192633] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 mb-4">
            <span className="material-symbols-outlined text-3xl">tune</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">设定目标仓位比例</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            调整各组合的目标占比，系统将自动计算出为了达到该比例，每个组合需要买入或卖出的金额。
          </p>
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">当前总资产</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">¥{totalAssets.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">各组合目标比例</h4>
            <span className={`text-xs font-bold ${Math.abs(totalTargetPercentage - 100) > 0.1 ? 'text-red-500' : 'text-green-500'}`}>
              总计: {totalTargetPercentage.toFixed(1)}%
            </span>
          </div>
          
          {targets.map((group, index) => {
            const targetAmount = (group.targetPercentage / 100) * totalAssets;
            const diff = targetAmount - group.currentAmount;
            const isBuy = diff > 0;
            
            return (
              <div key={group.name} className="bg-white dark:bg-[#192633] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 dark:text-white">{group.name}</span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    当前: {group.currentPercentage.toFixed(1)}%
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    value={group.targetPercentage}
                    onChange={(e) => handleTargetChange(index, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                  />
                  <div className="w-16 text-right">
                    <span className="font-bold text-primary">{group.targetPercentage.toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    目标金额: ¥{targetAmount.toFixed(2)}
                  </div>
                  <div className={`text-sm font-bold flex items-center gap-1 ${Math.abs(diff) < 1 ? 'text-slate-400' : isBuy ? 'text-red-500' : 'text-green-500'}`}>
                    {Math.abs(diff) < 1 ? '无需操作' : (
                      <>
                        {isBuy ? '需买入' : '需卖出'}
                        <span>¥{Math.abs(diff).toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
