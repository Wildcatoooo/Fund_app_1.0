import React, { useContext, useMemo } from 'react';
import { NavigationContext } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PortfolioChartScreen() {
  const { goBack, funds, navigate } = useContext(NavigationContext);

  const data = useMemo(() => {
    const groups: Record<string, number> = {};
    let total = 0;
    funds.forEach(f => {
      groups[f.group] = (groups[f.group] || 0) + f.amount;
      total += f.amount;
    });

    return Object.keys(groups).map(key => ({
      name: key,
      value: groups[key],
      percentage: total > 0 ? ((groups[key] / total) * 100).toFixed(2) : '0.00'
    })).sort((a, b) => b.value - a.value);
  }, [funds]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">持仓占比</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-[#192633] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/50">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">资产分布图</h3>
          {data.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `¥${value.toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">暂无持仓数据</div>
          )}
        </div>

        <div className="bg-white dark:bg-[#192633] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">各组合占比明细</h3>
            <button 
              onClick={() => navigate('target-rebalance')}
              className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              目标比例调仓
            </button>
          </div>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">¥{item.value.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
