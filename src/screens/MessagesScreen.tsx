import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function MessagesScreen() {
  const { goBack } = useContext(NavigationContext);

  return (
    <div className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto pb-24">
      <header className="sticky top-0 z-50 flex items-center justify-between px-2 py-3 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">消息中心</h1>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-2xl">done_all</span>
        </button>
      </header>

      <div className="flex items-center justify-center py-4">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">今日</span>
      </div>

      <div className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2632] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#23303e] active:scale-[0.99]">
        <div className="flex items-start gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined">warning</span>
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a2632]"></span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">基金A跌破止损线</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">09:41</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
              您关注的“前海开源公用事业股票”净值已跌破预设止损线 -5.0%，当前净值 2.3456，请及时查看并调整策略。
            </p>
          </div>
        </div>
      </div>

      <div className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2632] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#23303e] active:scale-[0.99] mt-2">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">月度投资报告已生成</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">08:30</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
              您的10月份投资组合表现报告已生成。本月收益率 +3.2%，跑赢沪深300指数。点击查看详细归因分析。
            </p>
            <button className="mt-3 w-fit rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              查看报告
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-4 mt-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">昨天</span>
      </div>

      <div className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2632] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#23303e] active:scale-[0.99]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">新基金发售提醒</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">14:20</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
              热门经理张三拟任，“招商中证白酒指数C”将于下周一（11月4日）正式开启认购，限额100亿。
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-4 mt-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">10月25日</span>
      </div>

      <div className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2632] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#23303e] active:scale-[0.99]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined">build</span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">系统维护通知</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">10:00</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
              为了提供更优质的服务，我们将于本周日凌晨 02:00 - 04:00 进行核心交易系统升级维护，期间将暂停部分查询和委托服务。
            </p>
          </div>
        </div>
      </div>

      <div className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2632] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#23303e] active:scale-[0.99] mt-2 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">定投扣款成功</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">09:15</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
              您设置的“沪深300指数增强”周定投已扣款成功，金额 1000.00 元。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
