import React, { useContext, useState, useEffect } from 'react';
import { NavigationContext } from '../App';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

export default function FundDetailScreen() {
  const { goBack, openModal, funds, screenParams, updateFund, refreshData } = useContext(NavigationContext);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '1m' | '3m' | '1y'>('1m');
  const [navHistory, setNavHistory] = useState<any[]>([]);
  const [managerInfo, setManagerInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fundId = screenParams?.fundId;
  const portfolioFunds = funds.filter(f => f.inPortfolio !== false);
  const fund = fundId ? funds.find(f => f.id === fundId) : portfolioFunds[0];

  const [takeProfit, setTakeProfit] = useState(fund?.targetTakeProfit?.toString() || '');
  const [stopLoss, setStopLoss] = useState(fund?.targetStopLoss?.toString() || '');
  const [isEditingAlerts, setIsEditingAlerts] = useState(false);

  useEffect(() => {
    if (fund && /^\d{6}$/.test(fund.code)) {
      fetchFundDetails(fund.code, timeRange);
    }
  }, [fund?.code, timeRange]);

  const fetchFundDetails = async (code: string, range: string) => {
    setIsLoading(true);
    try {
      let pageSize = 30;
      if (range === '7d') pageSize = 7;
      if (range === '3m') pageSize = 90;
      if (range === '1y') pageSize = 365;

      const historyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNHisNetList?pageIndex=1&pageSize=${pageSize}&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&FCODE=${code}`)}`;
      const historyResponse = await fetch(historyUrl);
      const historyData = await historyResponse.json();
      
      if (historyData && historyData.Datas) {
        const formattedData = historyData.Datas.reverse().map((item: any) => ({
          date: item.FSRQ.substring(5), // MM-DD
          fullDate: item.FSRQ,
          nav: parseFloat(item.DWJZ),
          change: parseFloat(item.JZZZL)
        }));
        setNavHistory(formattedData);
      }

      // Fetch manager info
      const managerUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNManagerList?plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=1&FCODE=${code}`)}`;
      const managerResponse = await fetch(managerUrl);
      const managerData = await managerResponse.json();
      
      if (managerData && managerData.Datas && managerData.Datas.length > 0) {
        setManagerInfo(managerData.Datas[0]);
      }
    } catch (error) {
      console.error('Failed to fetch fund details', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    if (fund && /^\d{6}$/.test(fund.code)) {
      await fetchFundDetails(fund.code, timeRange);
    }
    setIsRefreshing(false);
  };

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

  // Map transactions to chart data points
  const getTransactionDots = () => {
    if (!fund.transactions || navHistory.length === 0) return [];
    
    return fund.transactions.map(t => {
      const point = navHistory.find(h => h.fullDate === t.date);
      if (!point) return null;
      
      let color = '#137fec'; // buy
      if (t.type === 'add') color = '#10b981';
      if (t.type === 'sell') color = '#f97316';

      return (
        <ReferenceDot 
          key={t.id} 
          x={point.date} 
          y={point.nav} 
          r={4} 
          fill={color} 
          stroke="#fff" 
          strokeWidth={2}
          onClick={() => setActiveTooltip(activeTooltip === t.id ? null : t.id)}
        />
      );
    }).filter(Boolean);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const transactions = fund.transactions?.filter(t => t.date === data.fullDate) || [];
      
      return (
        <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-50">
          <p className="font-bold mb-1">{data.fullDate}</p>
          <p>净值: {data.nav.toFixed(4)}</p>
          <p>涨跌: <span className={data.change >= 0 ? 'text-red-400' : 'text-green-400'}>{data.change >= 0 ? '+' : ''}{data.change}%</span></p>
          {transactions.map(t => (
            <div key={t.id} className="mt-1 pt-1 border-t border-slate-600">
              <p className={t.type === 'sell' ? 'text-orange-400' : 'text-blue-400'}>
                {t.type === 'buy' ? '买入' : t.type === 'add' ? '加仓' : '卖出'}: ¥{t.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold truncate max-w-[200px]">{fund.name}</h2>
        <button onClick={handleRefresh} className={`relative flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}>
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">refresh</span>
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
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button onClick={() => setTimeRange('7d')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '7d' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>7天</button>
              <button onClick={() => setTimeRange('1m')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '1m' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>1月</button>
              <button onClick={() => setTimeRange('3m')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '3m' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>3月</button>
              <button onClick={() => setTimeRange('1y')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '1y' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>1年</button>
            </div>
          </div>

          <div className="relative h-64 w-full select-none touch-pan-x">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 z-10">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
              </div>
            ) : navHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={navHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#137fec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} minTickGap={20} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="nav" stroke="#137fec" strokeWidth={2} fillOpacity={1} fill="url(#colorNav)" />
                  {getTransactionDots()}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">暂无走势数据</div>
            )}
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
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {fund.amount > 0 && fund.totalReturnRate !== undefined ? 
                `¥${(parseFloat(fund.nav) / (1 + fund.totalReturnRate / 100)).toFixed(4)}` : '未知'}
            </p>
            <p className="text-xs text-slate-400 mt-1">估算成本价</p>
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

      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">基金经理</h3>
          </div>
          {managerInfo ? (
            <>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative flex-shrink-0">
                  {managerInfo.PHOTOURL ? (
                    <img alt={managerInfo.MGRNAME} className="w-full h-full object-cover" src={managerInfo.PHOTOURL} />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">person</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{managerInfo.MGRNAME}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">任职天数: {managerInfo.TOTALDAYS}天</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {managerInfo.RESUME || '暂无简介'}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">暂无基金经理信息</p>
          )}
        </div>
      </div>

      {fund.transactions && fund.transactions.length > 0 && (
        <div className="px-4 mt-6 mb-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 px-1">交易记录</h3>
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {fund.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t, index) => (
              <div key={t.id} className={`p-4 flex items-center justify-between ${index !== fund.transactions!.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center ${
                    t.type === 'buy' ? 'bg-primary/10 text-primary' : 
                    t.type === 'add' ? 'bg-emerald-500/10 text-emerald-500' : 
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {t.type === 'buy' ? 'shopping_cart' : t.type === 'add' ? 'add_circle' : 'remove_circle'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {t.type === 'buy' ? '买入' : t.type === 'add' ? '加仓' : '卖出'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">¥{t.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">净值: {t.nav.toFixed(4)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
