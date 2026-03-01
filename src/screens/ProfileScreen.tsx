import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function ProfileScreen() {
  const { openModal, navigate } = useContext(NavigationContext);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="w-10"></div>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">我的</h2>
        <div className="flex w-10 items-center justify-end relative">
          <button onClick={() => navigate('messages')} className="flex items-center justify-center text-slate-900 dark:text-slate-100 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px]">chat_bubble_outline</span>
          </button>
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-[#111a22]"></span>
        </div>
      </div>

      <div className="flex flex-col items-center px-4 pt-4 pb-8">
        <div className="relative mb-4 group cursor-pointer">
          <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAe1M1nQ7Ytof2W74oL3c81uhXZIWKAoB-xaBPzwp2KHCIa-ToePr9BklrmAnFkB0XM0V2_k7TpZRZE0TP4yn2FjNOuqOp_TOnxaHnjiM6h-PClbcmX8wfe2F18mwP_87WaD3FHl4ahHVaR86LWpqg7zSJFjINkSUgPPnPjSfu3InSTgk6TI3oG-kuXiAbtGJlHDBRlpp1zj8gUJpm_Nflsq39Ies1imzr2dO9pbB9AdrgbAN7KKhvJy6KYvOPnA2ziG6UvdtpiQQ")' }}>
          </div>
          <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white dark:ring-slate-800">
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold leading-tight">张三</h3>
            <button onClick={() => openModal('account-switch')} className="flex items-center gap-0.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">sync_alt</span>
              <span>切换账号</span>
            </button>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ID: 88888888</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            <span>专业版会员</span>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-6 grid grid-cols-3 gap-3">
        <div onClick={() => navigate('favorites')} className="flex flex-col items-center rounded-xl bg-white dark:bg-[#192633] p-4 shadow-sm border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">12</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">关注基金</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-white dark:bg-[#192633] p-4 shadow-sm border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">5</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">持有组合</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-white dark:bg-[#192633] p-4 shadow-sm border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">283</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">交易记录</span>
        </div>
      </div>

      <div className="mx-4 flex flex-col gap-3">
        <div className="overflow-hidden rounded-xl bg-white dark:bg-[#192633] shadow-sm border border-slate-100 dark:border-slate-800/50">
          <button onClick={() => navigate('security-settings')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">安全设置</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
          <button onClick={() => navigate('data-export')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500 dark:bg-green-500/20">
                <span className="material-symbols-outlined">download</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">数据导出</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
          <button onClick={() => navigate('data-import')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 dark:bg-teal-500/20">
                <span className="material-symbols-outlined">upload</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">数据导入</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
          <button onClick={() => navigate('memory-bank')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
                <span className="material-symbols-outlined">memory</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">基金记忆库</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
          <button onClick={() => navigate('notification-settings')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">提醒设置</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white dark:bg-[#192633] shadow-sm border border-slate-100 dark:border-slate-800/50">
          <button onClick={() => alert('帮助与反馈功能开发中')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
                <span className="material-symbols-outlined">help</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">帮助与反馈</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
          <button onClick={() => alert('关于我们功能开发中')} className="w-full group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-500/10 text-slate-500 dark:bg-slate-500/20">
                <span className="material-symbols-outlined">info</span>
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-slate-100">关于我们</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">chevron_right</span>
          </button>
        </div>

        <button onClick={() => alert('已退出登录')} className="mt-4 w-full rounded-xl bg-white dark:bg-[#192633] p-4 text-center text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors shadow-sm border border-slate-100 dark:border-slate-800/50">
          退出登录
        </button>
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">v2.4.1 (Build 20231027)</p>
      </div>
    </div>
  );
}
