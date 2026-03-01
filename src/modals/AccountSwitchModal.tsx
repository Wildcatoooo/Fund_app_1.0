import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function AccountSwitchModal() {
  const { closeModal, accounts, currentAccountId, switchAccount, addAccount, deleteAccount } = useContext(NavigationContext);
  const [isAdding, setIsAdding] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  const handleSwitch = (id: string) => {
    switchAccount(id);
    closeModal();
  };

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      addAccount(newAccountName.trim());
      closeModal();
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除此账号吗？该账号的所有数据将被永久删除。')) {
      deleteAccount(id);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">切换账号</h2>
        <button onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        {accounts.map(account => {
          const isCurrent = account.id === currentAccountId;
          const isDefault = account.id === 'default';
          return (
            <div key={account.id} className="relative group">
              <button 
                onClick={() => handleSwitch(account.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all overflow-hidden ${
                  isCurrent 
                    ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2d3d] hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 border-2 border-transparent group-hover:border-primary/20 transition-colors overflow-hidden">
                    {account.avatarUrl ? (
                      <img src={account.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : isCurrent ? (
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe1M1nQ7Ytof2W74oL3c81uhXZIWKAoB-xaBPzwp2KHCIa-ToePr9BklrmAnFkB0XM0V2_k7TpZRZE0TP4yn2FjNOuqOp_TOnxaHnjiM6h-PClbcmX8wfe2F18mwP_87WaD3FHl4ahHVaR86LWpqg7zSJFjINkSUgPPnPjSfu3InSTgk6TI3oG-kuXiAbtGJlHDBRlpp1zj8gUJpm_Nflsq39Ies1imzr2dO9pbB9AdrgbAN7KKhvJy6KYvOPnA2ziG6UvdtpiQQ" alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[24px]">person</span>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-slate-900 dark:text-white text-base font-bold">{account.name} {isCurrent && '(当前)'}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">ID: {isDefault ? '88888888' : account.id.substring(4, 12)}</span>
                  </div>
                </div>
                {isCurrent && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white relative z-10">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                )}
              </button>
              {!isDefault && (
                <button
                  onClick={(e) => handleDelete(e, account.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 z-20"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          );
        })}

        {isAdding ? (
          <div className="p-4 rounded-xl border border-primary bg-primary/5 dark:bg-primary/10 mt-2">
            <input 
              type="text" 
              placeholder="输入新账号昵称" 
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-3 focus:outline-none focus:border-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">取消</button>
              <button onClick={handleAddAccount} className="flex-1 py-2 rounded-lg bg-primary text-white font-medium">创建</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full group flex items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1a2632] hover:border-primary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-slate-500 dark:text-slate-400 gap-2 mt-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-sm font-bold">添加新账号</span>
          </button>
        )}
      </div>
      <div className="h-6 w-full sm:hidden"></div>
    </div>
  );
}
