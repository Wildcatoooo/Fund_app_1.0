import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function DataImportScreen() {
  const { goBack } = useContext(NavigationContext);
  const [importSource, setImportSource] = useState('file');

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">数据导入</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-[#192633] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 mb-4">
            <span className="material-symbols-outlined text-3xl">upload</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">导入您的资产数据</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            您可以从其他平台或备份文件中导入您的基金持仓和交易记录，快速恢复数据。
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">选择导入来源</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setImportSource('file')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${importSource === 'file' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192633] text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">description</span>
              <span className="text-sm font-bold">本地文件</span>
              <span className="text-xs opacity-80 mt-1">CSV / JSON</span>
            </button>
            <button 
              onClick={() => setImportSource('platform')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${importSource === 'platform' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192633] text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">cloud_download</span>
              <span className="text-sm font-bold">第三方平台</span>
              <span className="text-xs opacity-80 mt-1">支付宝/天天基金</span>
            </button>
          </div>
        </div>

        {importSource === 'file' && (
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">upload_file</span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">点击选择文件</p>
            <p className="text-xs text-slate-500 mt-1">支持 .csv, .json 格式</p>
          </div>
        )}

        {importSource === 'platform' && (
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-slate-800/50 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              请选择要导入的平台，我们将引导您完成授权或账单导出流程。
            </p>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-bold">支</div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">支付宝账单</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center font-bold">天</div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">天天基金</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => {
            alert('请先选择文件或平台');
          }}
          className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all mt-4"
        >
          下一步：预览数据
        </button>
      </div>
    </div>
  );
}
