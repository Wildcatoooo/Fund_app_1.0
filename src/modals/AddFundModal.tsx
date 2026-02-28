import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function AddFundModal() {
  const { closeModal, openModal } = useContext(NavigationContext);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/50">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">添加基金</h2>
        <button onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="px-6 pt-6 pb-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
          请选择一种方式来添加您的基金持仓。我们支持智能图片识别，方便快捷。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6">
        <button onClick={() => openModal('manual-entry')} className="group flex items-center p-4 gap-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#1e2d3d] hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary group-hover:scale-110 transition-transform duration-200">
            <span className="material-symbols-outlined text-[28px]">keyboard</span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-slate-900 dark:text-white text-base font-bold mb-0.5 group-hover:text-primary transition-colors">手动录入</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">通过搜索基金代码或名称添加</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all">
            <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </button>

        <button onClick={() => openModal('image-scan')} className="group flex items-center p-4 gap-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-[#1e2d3d] hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary group-hover:scale-110 transition-transform duration-200 z-10">
            <span className="material-symbols-outlined text-[28px]">document_scanner</span>
          </div>
          <div className="flex flex-col flex-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-white text-base font-bold mb-0.5 group-hover:text-primary transition-colors">图片识别</span>
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">推荐</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-xs">上传持仓截图，AI 自动识别导入</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all z-10">
            <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </button>
      </div>

      <div className="p-6 pt-0 sm:hidden">
        <button onClick={closeModal} className="w-full flex items-center justify-center h-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          取消
        </button>
      </div>
      <div className="h-6 w-full bg-white dark:bg-[#192633] sm:hidden"></div>
    </div>
  );
}
