import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function AddToGroupModal() {
  const { closeModal, funds, changeFundGroup, modalParams } = useContext(NavigationContext);
  const groupName = modalParams?.groupName || '';
  
  const ungroupedFunds = funds.filter(f => f.group === '未分组' || f.group !== groupName);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      changeFundGroup(selectedIds, groupName);
    }
    closeModal();
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#233648]">
        <div className="w-12"></div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">添加到 {groupName}</h2>
        <button onClick={closeModal} className="w-12 flex items-center justify-end text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {ungroupedFunds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
            <p>没有可添加的基金</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ungroupedFunds.map(fund => (
              <div 
                key={fund.id} 
                onClick={() => toggleSelect(fund.id)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center size-5 rounded border ${selectedIds.includes(fund.id) ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                    {selectedIds.includes(fund.id) && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{fund.name}</span>
                    <span className="text-xs text-slate-500">{fund.code} - 当前: {fund.group}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-[#233648] bg-white dark:bg-[#16212b]">
        <button 
          onClick={handleAdd} 
          disabled={selectedIds.length === 0}
          className="w-full h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-primary"
        >
          确认添加 ({selectedIds.length})
        </button>
      </div>
    </div>
  );
}
