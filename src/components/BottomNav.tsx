import React, { useContext } from 'react';
import { NavigationContext } from '../App';

export default function BottomNav() {
  const { currentScreen, navigate, openModal } = useContext(NavigationContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-md items-end justify-around border-t border-slate-200 bg-background-light px-2 pb-6 pt-3 dark:border-slate-800 dark:bg-background-dark">
      <button onClick={() => navigate('home')} className={`flex flex-1 flex-col items-center justify-end gap-1 ${currentScreen === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'} transition-colors`}>
        <span className={`material-symbols-outlined text-[26px] ${currentScreen === 'home' ? 'filled' : ''}`}>home</span>
        <p className="text-[10px] font-bold tracking-wide">首页</p>
      </button>
      <button onClick={() => navigate('fund-detail')} className={`flex flex-1 flex-col items-center justify-end gap-1 ${currentScreen === 'fund-detail' ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'} transition-colors`}>
        <span className={`material-symbols-outlined text-[26px] ${currentScreen === 'fund-detail' ? 'filled' : ''}`}>monitoring</span>
        <p className="text-[10px] font-medium tracking-wide">行情</p>
      </button>
      <div className="relative -top-5 flex flex-col items-center justify-center">
        <button onClick={() => openModal('add-fund')} className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-all hover:bg-blue-600 active:scale-95">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>
      <button onClick={() => navigate('favorites')} className={`flex flex-1 flex-col items-center justify-end gap-1 ${currentScreen === 'favorites' ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'} transition-colors`}>
        <span className={`material-symbols-outlined text-[26px] ${currentScreen === 'favorites' ? 'filled' : ''}`}>star</span>
        <p className="text-[10px] font-medium tracking-wide">收藏</p>
      </button>
      <button onClick={() => navigate('profile')} className={`flex flex-1 flex-col items-center justify-end gap-1 ${currentScreen === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'} transition-colors`}>
        <span className={`material-symbols-outlined text-[26px] ${currentScreen === 'profile' ? 'filled' : ''}`}>person</span>
        <p className="text-[10px] font-medium tracking-wide">我的</p>
      </button>
    </div>
  );
}
