import React, { useContext, useState } from 'react';
import { NavigationContext } from '../App';

export default function NotificationSettingsScreen() {
  const { goBack } = useContext(NavigationContext);
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    sms: false,
    navUpdate: true,
    priceAlert: true,
    weeklyReport: true,
    systemNotice: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-50 dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#192633] border-b border-slate-100 dark:border-slate-800">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">提醒设置</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider">接收方式</h3>
          <div className="bg-white dark:bg-[#192633] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">App 推送通知</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">接收实时消息提醒</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.push} onChange={() => toggleSetting('push')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">邮件提醒</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">重要通知发送至邮箱</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.email} onChange={() => toggleSetting('email')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">短信提醒</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">仅限紧急安全通知</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.sms} onChange={() => toggleSetting('sms')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider">消息类型</h3>
          <div className="bg-white dark:bg-[#192633] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">净值更新提醒</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">每日基金净值更新后通知</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.navUpdate} onChange={() => toggleSetting('navUpdate')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">价格预警</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">达到设定的目标价或止损价时提醒</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.priceAlert} onChange={() => toggleSetting('priceAlert')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">每周收益报告</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">每周五发送本周收益总结</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.weeklyReport} onChange={() => toggleSetting('weeklyReport')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <span className="text-base font-medium text-slate-900 dark:text-white">系统公告</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">接收平台活动和重要更新通知</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.systemNotice} onChange={() => toggleSetting('systemNotice')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
