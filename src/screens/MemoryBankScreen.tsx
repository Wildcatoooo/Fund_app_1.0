import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function MemoryBankScreen() {
  const { goBack, fundMemory, upsertFundMemory } = useContext(NavigationContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  const filteredMemory = fundMemory.filter(f => 
    f.fundCode.includes(searchTerm) || f.fundName.includes(searchTerm)
  ).sort((a, b) => b.updatedAt - a.updatedAt);

  const handleAdd = () => {
    if (newCode && newName) {
      upsertFundMemory(newCode, newName);
      setNewCode('');
      setNewName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">基金记忆库</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-[24px]">{isAdding ? 'close' : 'add'}</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-[#192633] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            记忆库自动收录您使用过的基金信息，用于在进行图片识别时提供更准确的参考匹配。
          </p>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="搜索基金代码或名称..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {isAdding && (
          <div className="bg-white dark:bg-[#192633] rounded-2xl p-4 shadow-sm border border-primary/30">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">手动添加基金</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="基金代码 (如: 005827)" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input 
                type="text" 
                placeholder="基金名称" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                onClick={handleAdd}
                disabled={!newCode || !newName}
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                保存到记忆库
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filteredMemory.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">暂无匹配的基金记录</div>
          ) : (
            filteredMemory.map(fund => (
              <div key={fund.fundCode} className="flex items-center justify-between p-4 bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{fund.fundName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{fund.fundCode}</div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(fund.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
