
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showAvatar?: boolean;
  partnerAvatar: string;
  onJoinCall?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine, showAvatar, partnerAvatar, onJoinCall }) => {
  const isAttachment = message.text.startsWith('📎 Attachment:');
  const isCall = message.text.includes('📞');
  const fileName = isAttachment ? message.text.replace('📎 Attachment: ', '') : '';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dummyContent = `Simulated content for: ${fileName}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleJoinCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoinCall) onJoinCall();
  };

  return (
    <div className={`flex flex-col gap-0.5 max-w-[92%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
      <div className={`
        px-3 py-2 rounded-lg text-[12px] leading-relaxed break-words border flex items-center gap-3
        ${isMine 
          ? 'bg-blue-600/10 text-blue-100 border-blue-500/30' 
          : 'bg-[#1a1a1a] text-zinc-300 border-zinc-800'}
        ${(isAttachment || isCall) ? 'cursor-default min-w-[220px] justify-between' : ''}
        ${isCall && !isMine ? 'border-emerald-500/30 bg-emerald-500/5' : ''}
      `}>
        <span className="flex-1">{message.text}</span>
        
        {isAttachment && (
          <button 
            onClick={handleDownload}
            title="Download Document"
            className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded transition-colors ${
              isMine ? 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
            }`}
          >
            <i className="fa-solid fa-download text-[10px]"></i>
          </button>
        )}

        {isCall && (
          <button 
            onClick={handleJoinCall}
            className={`flex-shrink-0 px-2 h-7 flex items-center justify-center rounded transition-colors text-[9px] font-bold uppercase tracking-widest ${
              isMine 
                ? 'bg-blue-600/30 text-blue-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
            }`}
          >
            {isMine ? 'Waiting' : 'Join Call'}
          </button>
        )}
      </div>
      
      <div className={`flex items-center gap-2 px-1 text-[9px] text-zinc-600 uppercase tracking-tighter`}>
        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {isMine && (
          <i className={`fa-solid fa-check-double ${message.isRead ? 'text-blue-500' : 'text-zinc-700'}`}></i>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
