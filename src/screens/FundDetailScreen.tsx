import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function FundDetailScreen() {
  const { goBack, openModal, funds, screenParams, updateFund } = useContext(NavigationContext);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '1m' | '3m' | '1y'>('1m');

  const fundId = screenParams?.fundId;
  const portfolioFunds = funds.filter(f => f.inPortfolio !== false);
  const fund = fundId ? funds.find(f => f.id === fundId) : portfolioFunds[0];

  const [takeProfit, setTakeProfit] = useState(fund?.targetTakeProfit?.toString() || '');
  const [stopLoss, setStopLoss] = useState(fund?.targetStopLoss?.toString() || '');
  const [isEditingAlerts, setIsEditingAlerts] = useState(false);

  const handleSaveAlerts = () => {
    if (!fund) return;
    const tp = parseFloat(takeProfit);
    const sl = parseFloat(stopLoss);
    updateFund(fund.id, {
      targetTakeProfit: isNaN(tp) ? undefined : tp,
      targetStopLoss: isNaN(sl) ? undefined : sl
    });
    setIsEditingAlerts(false);
  };

  if (!fund) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">未找到基金信息</p>
      </div>
    );
  }

  const handleMarkerClick = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold">{fund.name}</h2>
        <button className="relative flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>
      </div>

      <div className="px-6 py-4 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">当前净值 ({fund.netValueDate || '未知'})</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">¥{fund.nav}</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className={`flex items-center font-bold px-2 py-0.5 rounded-full text-sm ${fund.isUp ? 'text-up bg-red-500/10' : 'text-down bg-green-500/10'}`}>
            <span className="material-symbols-outlined text-sm mr-0.5">{fund.isUp ? 'trending_up' : 'trending_down'}</span>
            {fund.isUp ? '+' : ''}{fund.returnRate.toFixed(2)}%
          </span>
          <span className={`text-sm font-medium ${fund.isUp ? 'text-up' : 'text-down'}`}>{fund.isUp ? '+' : ''}{(fund.amount * fund.returnRate / 100).toFixed(2)} (日涨跌)</span>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              净值走势
              <span className="text-[10px] font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">可缩放</span>
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button onClick={() => setTimeRange('7d')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '7d' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>7天</button>
              <button onClick={() => setTimeRange('1m')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '1m' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>1月</button>
              <button onClick={() => setTimeRange('3m')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '3m' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>3月</button>
              <button onClick={() => setTimeRange('1y')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '1y' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>1年</button>
            </div>
          </div>

          <div className="relative h-64 w-full select-none touch-pan-x">
            <div 
              className="absolute left-[28.5%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 group cursor-pointer chart-marker transition-transform"
              onClick={() => handleMarkerClick('buy')}
            >
              <div className="size-3 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm"></div>
              {activeTooltip === 'buy' && (
                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-20">
                  <p>净值: 2.1000</p>
                  <p>买入: ¥10,000</p>
                  <p>总金额: ¥10,000</p>
                </div>
              )}
            </div>
            <div 
              className="absolute left-[62.8%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 group cursor-pointer chart-marker transition-transform"
              onClick={() => handleMarkerClick('add')}
            >
              <div className="size-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm"></div>
              {activeTooltip === 'add' && (
                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-20">
                  <p>净值: 2.2500</p>
                  <p>加仓: ¥5,000</p>
                  <p>总金额: ¥15,000</p>
                </div>
              )}
            </div>
            <div 
              className="absolute left-[85.7%] top-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 group cursor-pointer chart-marker transition-transform"
              onClick={() => handleMarkerClick('reduce')}
            >
              <div className="size-3 bg-orange-500 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm"></div>
              {activeTooltip === 'reduce' && (
                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-20">
                  <p>净值: 2.4000</p>
                  <p>减仓: ¥3,000</p>
                  <p>总金额: ¥12,000</p>
                </div>
              )}
            </div>

            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 350 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <line className="text-slate-100 dark:text-slate-700" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="350" y1="50" y2="50"></line>
              <line className="text-slate-100 dark:text-slate-700" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="350" y1="100" y2="100"></line>
              <line className="text-slate-100 dark:text-slate-700" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="350" y1="150" y2="150"></line>
              <path d="M0,160 C40,160 60,140 100,110 C140,80 180,100 220,60 C260,20 300,50 350,30 L350,200 L0,200 Z" fill="url(#chartGradient)"></path>
              <path d="M0,160 C40,160 60,140 100,110 C140,80 180,100 220,60 C260,20 300,50 350,30" fill="none" stroke="#137fec" strokeLinecap="round" strokeWidth="3"></path>
            </svg>
          </div>

          <div className="flex justify-between mt-2 px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>05-01</span>
            <span>05-08</span>
            <span>05-15</span>
            <span>05-22</span>
            <span>05-29</span>
          </div>

          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 bg-primary rounded-full"></div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">买入</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">加仓</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 bg-orange-500 rounded-full"></div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">减仓</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 px-1">业绩概览</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">持仓成本</p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">¥1.8200</p>
            <p className="text-xs text-slate-400 mt-1">平均买入价</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500 text-sm">savings</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">累计收益</p>
            </div>
            <p className={`text-lg font-bold ${fund.totalReturnRate >= 0 ? 'text-up' : 'text-down'}`}>
              {fund.totalReturnRate >= 0 ? '+' : ''}¥{(fund.amount * fund.totalReturnRate / 100).toFixed(2)}
            </p>
            <p className={`text-xs mt-1 ${fund.totalReturnRate >= 0 ? 'text-up/80' : 'text-down/80'}`}>
              {fund.totalReturnRate >= 0 ? '+' : ''}{fund.totalReturnRate.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-500 text-sm">pie_chart</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">持有金额</p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">¥{fund.amount.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">当前市值</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500 text-sm">grade</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">评级</p>
            </div>
            <div className="flex gap-0.5">
              <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
              <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
              <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
              <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
              <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">晨星五年五星</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">自定义报警 (净值)</h3>
            {isEditingAlerts ? (
              <button onClick={handleSaveAlerts} className="text-primary text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full">保存</button>
            ) : (
              <button onClick={() => setIsEditingAlerts(true)} className="text-slate-500 text-sm font-semibold hover:text-primary">设置</button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">止盈线 (&gt;=)</span>
              </div>
              {isEditingAlerts ? (
                <input 
                  type="number" 
                  step="0.0001"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="如: 1.5000"
                  className="w-24 px-2 py-1 text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:border-primary"
                />
              ) : (
                <span className="text-sm font-bold text-slate-900 dark:text-white">{fund?.targetTakeProfit ? `¥${fund.targetTakeProfit.toFixed(4)}` : '未设置'}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">止损线 (&lt;=)</span>
              </div>
              {isEditingAlerts ? (
                <input 
                  type="number" 
                  step="0.0001"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="如: 1.0000"
                  className="w-24 px-2 py-1 text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:border-primary"
                />
              ) : (
                <span className="text-sm font-bold text-slate-900 dark:text-white">{fund?.targetStopLoss ? `¥${fund.targetStopLoss.toFixed(4)}` : '未设置'}</span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">当基金净值达到设定的止盈或止损线时，系统将在消息中心发送提醒。</p>
        </div>
      </div>

      <div className="px-4 mt-6 mb-8">
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">基金经理</h3>
            <a className="text-primary text-sm font-semibold" href="#">查看资料</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
              <img alt="Manager" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYFK0VQuQIwkjBZJFWTJuMgArZG_2eV7dy8KdmlHEFdcpkLfeFpMOU7jVVBY-F_zamVBpjKSiMNsn1NW3s1593lzU_f5KuEuyLJf9F-3YamqjW0d06IqYh5z-8oAvorWTUVqfVFdN21UgXiTURD7ZP2ERAWp9BoQz10V7vKGmVACihjNN1yxzc5x7LIWWghcV6FSyWa6cZdls2EPM2JX6dZNMgD2l7EZ3JmUS9jzM8sAi0Mpj-VLbnkqETenGlmKJI6evUbjSVaA" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-slate-100">陈志明</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">12年从业经验 • 擅长科技成长</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            重点关注包括人工智能、云计算和半导体制造在内的高增长科技行业。通过深度产业链研究...
          </p>
        </div>
      </div>

      <div className="fixed bottom-[88px] left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-20 flex gap-4 max-w-md mx-auto pointer-events-none">
        <div className="flex gap-4 w-full pointer-events-auto">
          <button onClick={() => openModal('trade', { type: 'sell' })} className="flex-1 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-warning shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            卖出
          </button>
          <button onClick={() => openModal('trade', { type: 'buy' })} className="flex-1 py-3.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
            买入
          </button>
        </div>
      </div>
    </div>
  );
}
