import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function FeedbackScreen() {
  const { navigate } = useContext(NavigationContext);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="flex items-center justify-between p-4 pb-2 z-10">
        <div onClick={() => navigate('home')} className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">操作反馈</h2>
      </div>

      <div className="flex flex-col items-center px-6 pt-8 pb-10">
        <div className="flex items-center justify-center size-20 rounded-full bg-blue-50 dark:bg-slate-800 mb-6 ring-1 ring-blue-100 dark:ring-slate-700">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-5xl">check_circle</span>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">调仓已完成</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed max-w-xs">
            您的基金调仓申请已成功提交，预计将在 T+1 日确认份额。
          </p>
        </div>
      </div>

      <div className="px-4">
        <div className="flex flex-col rounded-xl bg-white dark:bg-[#1e2024] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-slate-900 dark:text-slate-100 font-bold text-lg">调仓明细</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 px-2 py-1 rounded bg-blue-50 dark:bg-slate-800">处理中</span>
          </div>
          <div className="p-5 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">源基金</span>
                <p className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate">华夏成长混合</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-mono">000001</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">arrow_forward</span>
              </div>
              <div className="flex flex-col gap-1 flex-1 text-right">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">目标基金</span>
                <p className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate">易方达蓝筹</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-mono">005827</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#15171a]">
              <div className="flex items-end justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">调仓金额</span>
                <span className="text-slate-900 dark:text-slate-100 text-xl font-bold font-mono">¥ 50,000.00</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500">手续费预估</span>
                <span className="text-slate-500 dark:text-slate-300 font-medium">¥ 5.00</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 relative pl-2">
              <div className="absolute top-2 bottom-2 left-[5px] w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex gap-4 relative items-start">
                <div className="size-2.5 rounded-full bg-blue-500 mt-1.5 z-10 shrink-0"></div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">申请提交成功</span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">今天 14:30</span>
                </div>
              </div>
              <div className="flex gap-4 relative items-start opacity-60">
                <div className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 z-10 shrink-0 box-content border-2 border-white dark:border-[#1e2024]"></div>
                <div className="flex flex-col">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">确认份额</span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">预计 10月25日 (T+1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-cover bg-center flex flex-col items-start justify-center rounded-xl p-5 shadow-sm h-32 relative overflow-hidden group" style={{ backgroundImage: 'linear-gradient(90deg, rgba(20,20,25,0.95) 0%, rgba(30,30,35,0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDD2a91tma0jz-DcXwssEnaSBrl1Vx0DJzkF7mEvXQNcm7RApSQFIORkvTUR7CwyHmNiW6i2hkyIUZvLG2K6fif0WTmEbPCSoOYs2fIn0jwP7UjjUGIv8QJn3qGdznM6-yBt01AYzF-xt93Gw3JtiL-jpG3XdO7Rm5wZcS38V8IVjmmCaJH7h6JV6cRn7fS6Bqu4vgNQMmKJyEssCs7wUVtzLgCVU6_kkvju9HLBEcHLuSJ8u6XTzZWR3f1_DbiW_wtC3B5mJtZ4g")' }}>
          <div className="relative z-10 max-w-[70%]">
            <p className="text-white text-base font-bold mb-1">了解智能定投</p>
            <p className="text-slate-300 text-xs leading-relaxed">分散风险，长期稳健收益，开启您的财富增值计划。</p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white backdrop-blur-sm">
            <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 z-20">
        <button onClick={() => navigate('home')} className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg bg-slate-200 dark:bg-[#1e2024] hover:bg-slate-300 dark:hover:bg-[#2c3036] text-slate-900 dark:text-slate-100 transition-colors text-base font-bold leading-normal tracking-[0.015em] border border-transparent dark:border-slate-700">
          <span className="truncate">返回首页</span>
        </button>
        <button onClick={() => navigate('fund-detail')} className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20">
          <span className="truncate">查看详情</span>
        </button>
      </div>
    </div>
  );
}
