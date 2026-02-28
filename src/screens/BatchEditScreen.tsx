import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function BatchEditScreen() {
  const { goBack } = useContext(NavigationContext);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden w-full bg-background-light dark:bg-background-dark">
      <div className="flex flex-col bg-white dark:bg-slate-900 z-10 sticky top-0 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between p-4 pb-2">
          <button onClick={goBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">批量核对 - 全表编辑</h2>
        </div>
        <div className="px-4 pb-3 pt-1 flex justify-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex w-full max-w-[240px]">
            <button className="flex-1 py-1.5 px-3 rounded text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              卡片视图
            </button>
            <button className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-700 rounded shadow-sm text-xs font-bold text-primary flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              表格视图
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 sticky top-0 z-10">
          <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 text-left">名称/代码</div>
          <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-right">金额</div>
          <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-right">收益率</div>
          <div className="p-3 pr-4 text-right">日期</div>
        </div>

        <div className="overflow-y-auto flex-1 pb-32">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-100 dark:border-slate-800 items-stretch hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">景顺长城新兴成长</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">260108</div>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="5,178.00" />
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-green-600 dark:text-green-400 font-medium focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="+12.45%" />
            </div>
            <div className="relative">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 pr-4 text-sm font-mono text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="05-20" />
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-100 dark:border-slate-800 items-stretch bg-amber-50/50 dark:bg-amber-900/10">
            <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-0 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">易方达蓝筹精选</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">005827</div>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <div className="absolute inset-0 bg-amber-100/50 dark:bg-amber-900/20 pointer-events-none"></div>
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-amber-700 dark:text-amber-400 font-bold focus:ring-2 focus:ring-inset focus:ring-amber-500 placeholder-amber-300" type="text" defaultValue="1,?80.00" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-red-500 dark:text-red-400 font-medium focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="-5.20%" />
            </div>
            <div className="relative">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 pr-4 text-sm font-mono text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="05-20" />
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-100 dark:border-slate-800 items-stretch hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">招商中证白酒</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">161725</div>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="6,027.00" />
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-500 dark:text-slate-400 font-medium focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="0.00%" />
            </div>
            <div className="relative">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 pr-4 text-sm font-mono text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="05-20" />
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-100 dark:border-slate-800 items-stretch bg-red-50/50 dark:bg-red-900/10">
            <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-0 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
              <div className="text-sm font-bold text-red-700 dark:text-red-400 truncate italic">待确认基金名称...</div>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-inset focus:ring-red-500 placeholder-red-300" placeholder="--" type="text" />
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="--%" />
            </div>
            <div className="relative">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 pr-4 text-sm font-mono text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="05-21" />
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-100 dark:border-slate-800 items-stretch hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">中欧医疗健康</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">003095</div>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="7,728.00" />
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-green-600 dark:text-green-400 font-medium focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="+3.15%" />
            </div>
            <div className="relative">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 pr-4 text-sm font-mono text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="05-20" />
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 border-b border-slate-100 dark:border-slate-800 items-stretch hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="p-3 pl-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">富国天惠成长</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">161005</div>
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="2,890.00" />
            </div>
            <div className="relative border-r border-slate-100 dark:border-slate-800">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 text-sm font-mono text-red-500 dark:text-red-400 font-medium focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="-1.28%" />
            </div>
            <div className="relative">
              <input className="w-full h-full bg-transparent border-0 text-right p-3 pr-4 text-sm font-mono text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary placeholder-slate-300" type="text" defaultValue="05-20" />
            </div>
          </div>

          <button className="w-full py-4 text-center text-sm font-medium text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            添加一行数据
          </button>
          <div className="h-20"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">1</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">需人工确认</span>
            </div>
            <div className="text-xs text-slate-400">
              共 6 条数据
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">image</span>
              查看原图
            </button>
            <button onClick={goBack} className="flex-[2] h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[22px]">save</span>
              保存全部
            </button>
          </div>
        </div>
        <div className="h-6 w-full"></div>
      </div>
    </div>
  );
}
