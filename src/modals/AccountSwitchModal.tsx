import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function AccountSwitchModal() {
  const { closeModal } = useContext(NavigationContext);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">切换账号</h2>
        <button onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <button className="w-full group flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 transition-all relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAe1M1nQ7Ytof2W74oL3c81uhXZIWKAoB-xaBPzwp2KHCIa-ToePr9BklrmAnFkB0XM0V2_k7TpZRZE0TP4yn2FjNOuqOp_TOnxaHnjiM6h-PClbcmX8wfe2F18mwP_87WaD3FHl4ahHVaR86LWpqg7zSJFjINkSUgPPnPjSfu3InSTgk6TI3oG-kuXiAbtGJlHDBRlpp1zj8gUJpm_Nflsq39Ies1imzr2dO9pbB9AdrgbAN7KKhvJy6KYvOPnA2ziG6UvdtpiQQ")' }}></div>
            <div className="flex flex-col items-start">
              <span className="text-slate-900 dark:text-white text-base font-bold">张三 (当前)</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">ID: 88888888</span>
            </div>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white relative z-10">
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
        </button>

        <button className="w-full group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2d3d] hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 border-2 border-transparent group-hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-slate-900 dark:text-white text-base font-bold">李四</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">ID: 12345678</span>
            </div>
          </div>
        </button>

        <button onClick={() => {
          alert('功能开发中');
          closeModal();
        }} className="w-full group flex items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1a2632] hover:border-primary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-slate-500 dark:text-slate-400 gap-2 mt-2">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm font-bold">添加新账号</span>
        </button>
      </div>
      <div className="h-6 w-full sm:hidden"></div>
    </div>
  );
}
