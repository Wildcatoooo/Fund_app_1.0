import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function RebalanceScreen() {
  const { goBack, navigate } = useContext(NavigationContext);

  return (
    <div className="flex-1 w-full max-w-md mx-auto bg-background-light dark:bg-background-dark pb-32 overflow-y-auto">
      <div className="sticky top-0 z-20 bg-primary dark:bg-slate-900 shadow-md border-b border-primary-dark/20 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full text-white">
          <div onClick={goBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center">基金调仓</h2>
          <div className="flex size-10 items-center justify-center">
            <button className="text-white/90 text-sm font-medium leading-normal shrink-0 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full">记录</button>
          </div>
        </div>
      </div>

      <div className="bg-primary pb-8 -mt-1 pt-4 rounded-b-[2rem] shadow-sm relative z-0">
        <div className="flex w-full flex-row items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-white ring-4 ring-white/30"></div>
            <span className="text-[10px] text-white/90 font-medium mt-1">设置</span>
          </div>
          <div className="h-px w-16 bg-white/40"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-white/40"></div>
            <span className="text-[10px] text-white/60 font-medium mt-1">确认</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </div>
              <h3 className="text-slate-800 dark:text-slate-100 text-base font-bold leading-tight">卖出 / 减仓</h3>
            </div>
            <span className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">步骤 1</span>
          </div>
          <div className="p-4 space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal flex justify-between">
                <span>选择基金</span>
                <span className="text-primary text-xs font-normal">持仓: 1,240.56 份</span>
              </label>
              <div className="relative group">
                <select className="form-select w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-12 pl-4 pr-10 text-sm font-medium focus:border-primary focus:ring-primary appearance-none transition-shadow group-hover:bg-white dark:group-hover:bg-slate-800" defaultValue="">
                  <option disabled value="">请选择持仓基金</option>
                  <option value="1">易方达蓝筹精选混合 (005827)</option>
                  <option value="2">招商中证白酒指数 (161725)</option>
                  <option value="3">中欧医疗健康混合A (003095)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">卖出份额</label>
                <div className="relative">
                  <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-12 pl-4 pr-10 text-base font-medium focus:border-primary focus:ring-primary placeholder:text-slate-300" placeholder="0.00" type="number" />
                  <span className="absolute right-3 top-3 text-sm text-slate-400 font-medium">份</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">预估回款</label>
                <div className="relative">
                  <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 h-12 pl-4 pr-10 text-base font-medium focus:border-primary focus:ring-0 cursor-not-allowed" placeholder="0.00" readOnly type="number" value="0.00" />
                  <span className="absolute right-3 top-3 text-sm text-slate-400 font-medium">元</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all">25%</button>
              <button className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all">50%</button>
              <button className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all">75%</button>
              <button className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all">全部</button>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-6 relative z-20">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-full p-1.5 border-[3px] border-background-light dark:border-background-dark shadow-sm text-primary">
            <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <span className="material-symbols-outlined text-[16px]">add</span>
              </div>
              <h3 className="text-slate-800 dark:text-slate-100 text-base font-bold leading-tight">买入 / 加仓</h3>
            </div>
            <span className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">步骤 2</span>
          </div>
          <div className="p-4 space-y-5">
            <div className="flex items-center justify-between bg-primary/5 dark:bg-primary/10 p-3.5 rounded-xl border border-primary/10 transition-colors hover:bg-primary/10">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm text-primary">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">资金联动</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">使用卖出回款直接买入</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal flex justify-between">
                <span>目标基金</span>
                <span className="text-primary text-xs font-normal cursor-pointer hover:underline">+ 添加自选</span>
              </label>
              <div className="relative group">
                <select className="form-select w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-12 pl-4 pr-10 text-sm font-medium focus:border-primary focus:ring-primary appearance-none transition-shadow group-hover:bg-white dark:group-hover:bg-slate-800" defaultValue="">
                  <option disabled value="">请选择买入基金</option>
                  <option value="4">广发纳斯达克100ETF联接A (006479)</option>
                  <option value="5">华宝油气 (162411)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
              <div className="flex justify-between items-center pl-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">最新净值: <span className="font-medium text-slate-700 dark:text-slate-300">2.1450</span> (10-24)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">买入金额</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-slate-500 font-bold text-lg">¥</span>
                  </div>
                  <input className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-12 pl-8 pr-4 text-lg font-bold focus:border-primary focus:ring-primary placeholder:text-slate-300" placeholder="0.00" type="number" />
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    预计确认份额: <span className="font-bold text-primary dark:text-blue-400">--</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 flex items-start gap-3 bg-white/50 dark:bg-slate-900/50">
          <span className="material-symbols-outlined text-slate-400 text-[20px] mt-0.5">lightbulb</span>
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="font-medium text-slate-700 dark:text-slate-300 block mb-1">温馨提示</strong>
            调仓将于下一个交易日确认。卖出款项到账后会自动转入买入基金，无需手动操作。
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">预计手续费</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">¥ 2.50</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">确认日期</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">2023-10-25 (周三)</span>
          </div>
        </div>
        <button onClick={() => navigate('feedback')} className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-base font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">sync_alt</span>
          确认调仓
        </button>
      </div>
    </div>
  );
}
