import React, { useContext, useState, useRef } from 'react';
import { NavigationContext, AppMessage } from '../App';
import { motion, AnimatePresence } from 'motion/react';

const SwipeableMessageItem = ({ message, onDelete, onClick }: { message: AppMessage, onDelete: () => void, onClick: () => void }) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    if (diff < 0) {
      setOffset(Math.max(diff, -80));
    } else {
      setOffset(0);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offset < -40) {
      setOffset(-80);
    } else {
      setOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-2">
      <div className="absolute inset-y-0 right-0 flex items-center justify-end w-20 bg-red-500 rounded-xl">
        <button onClick={onDelete} className="w-full h-full flex flex-col items-center justify-center text-white">
          <span className="material-symbols-outlined">delete</span>
          <span className="text-[10px]">删除</span>
        </button>
      </div>
      <motion.div
        animate={{ x: offset }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (offset === 0) onClick();
          else setOffset(0);
        }}
        className="relative bg-white dark:bg-[#1a2632] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-start gap-4">
          <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${message.type === 'alert' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-primary/10 dark:bg-primary/20 text-primary'}`}>
            <span className="material-symbols-outlined">{message.type === 'alert' ? 'warning' : 'notifications'}</span>
            {!message.read && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a2632]"></span>
            )}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`text-sm font-bold truncate ${message.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{message.title}</h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                {new Date(message.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <p className={`mt-1 text-xs leading-relaxed line-clamp-2 ${message.read ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
              {message.content}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function MessagesScreen() {
  const { goBack, messages, markMessageRead, markAllMessagesRead, deleteMessage } = useContext(NavigationContext);
  const [selectedMessage, setSelectedMessage] = useState<AppMessage | null>(null);

  const handleMessageClick = (msg: AppMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessageRead(msg.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center justify-between px-2 py-3 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">消息中心</h1>
        <button onClick={markAllMessagesRead} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-2xl">done_all</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
            <p className="text-sm">暂无消息</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <SwipeableMessageItem 
                  message={msg} 
                  onDelete={() => deleteMessage(msg.id)} 
                  onClick={() => handleMessageClick(msg)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white truncate pr-4">{selectedMessage.title}</h3>
                <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <p className="text-xs text-slate-400 mb-4">{new Date(selectedMessage.date).toLocaleString()}</p>
                <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.content}
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="w-full py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
