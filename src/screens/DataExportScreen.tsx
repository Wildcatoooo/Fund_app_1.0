import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function DataExportScreen() {
  const { goBack } = useContext(NavigationContext);
  const [exportFormat, setExportFormat] = useState('csv');

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">数据导出</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 mb-4">
            <span className="material-symbols-outlined text-3xl">download</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">导出您的资产数据</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            您可以将您的持仓、交易记录和收益数据导出为文件，以便在其他应用中使用或进行备份。
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">选择导出格式</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setExportFormat('csv')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${exportFormat === 'csv' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192633] text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
            >
              <span className="text-xl font-bold mb-1">CSV</span>
              <span className="text-xs opacity-80">适合Excel查看</span>
            </button>
            <button 
              onClick={() => setExportFormat('json')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${exportFormat === 'json' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192633] text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
            >
              <span className="text-xl font-bold mb-1">JSON</span>
              <span className="text-xs opacity-80">适合程序处理</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">选择导出内容</h4>
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-slate-800/50 overflow-hidden">
            <label className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">当前持仓数据</span>
            </label>
            <label className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">历史交易记录</span>
            </label>
            <label className="flex items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">收益统计数据</span>
            </label>
          </div>
        </div>

        <button 
          onClick={() => {
            alert(`已开始导出 ${exportFormat.toUpperCase()} 格式数据`);
            goBack();
          }}
          className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all mt-4"
        >
          下一步：生成文件
        </button>
      </div>
    </div>
  );
}
