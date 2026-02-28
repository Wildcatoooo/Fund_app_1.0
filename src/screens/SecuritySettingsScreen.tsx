import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function SecuritySettingsScreen() {
  const { goBack } = useContext(NavigationContext);
  const [name, setName] = useState('张三');
  const [phone, setPhone] = useState('138****8888');
  const [gender, setGender] = useState('男');

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">安全设置</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-[#192633] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">头像</span>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAe1M1nQ7Ytof2W74oL3c81uhXZIWKAoB-xaBPzwp2KHCIa-ToePr9BklrmAnFkB0XM0V2_k7TpZRZE0TP4yn2FjNOuqOp_TOnxaHnjiM6h-PClbcmX8wfe2F18mwP_87WaD3FHl4ahHVaR86LWpqg7zSJFjINkSUgPPnPjSfu3InSTgk6TI3oG-kuXiAbtGJlHDBRlpp1zj8gUJpm_Nflsq39Ies1imzr2dO9pbB9AdrgbAN7KKhvJy6KYvOPnA2ziG6UvdtpiQQ")' }}></div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">名称</span>
            <div className="flex items-center gap-2">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-right text-sm text-slate-900 dark:text-white bg-transparent outline-none w-32" />
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">性别</span>
            <div className="flex items-center gap-2">
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="text-right text-sm text-slate-900 dark:text-white bg-transparent outline-none appearance-none">
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="保密">保密</option>
              </select>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#192633] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">手机号</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{phone}</span>
              <button className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">更换</button>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">修改密码</span>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
