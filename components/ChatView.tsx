
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Conversation, Message } from '../types';
import MessageBubble from './MessageBubble';
import { CURRENT_USER } from '../mockData';

interface ChatViewProps {
  conversation: Conversation;
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onStartCall: (video: boolean) => void;
}

const formatLastActive = (timestamp?: number) => {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Active now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  return `Active today`;
};

// Format date for separator (like WhatsApp)
const formatDateSeparator = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  // Format as "January 27, 2026"
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get date string for grouping (YYYY-MM-DD)
const getDateKey = (timestamp: number) => {
  return new Date(timestamp).toDateString();
};

// Format timestamp for export (human-readable)
const formatExportTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const ChatView: React.FC<ChatViewProps> = ({ conversation, onSendMessage, onBack, onStartCall }) => {
  const [inputText, setInputText] = useState('');
  const [msgSearch, setMsgSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partner = conversation.participants[0];

  useEffect(() => {
    if (scrollRef.current && !isSearching) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages, isSearching]);

  const filteredMessages = useMemo(() => {
    if (!msgSearch.trim()) return conversation.messages;
    return conversation.messages.filter(m =>
      m.text.toLowerCase().includes(msgSearch.toLowerCase())
    );
  }, [conversation.messages, msgSearch]);

  // Group messages by date for separators
  const messagesWithDates = useMemo(() => {
    const result: { type: 'date' | 'message'; date?: string; message?: Message }[] = [];
    let lastDateKey = '';

    filteredMessages.forEach((msg) => {
      const dateKey = getDateKey(msg.timestamp);
      if (dateKey !== lastDateKey) {
        result.push({ type: 'date', date: formatDateSeparator(msg.timestamp) });
        lastDateKey = dateKey;
      }
      result.push({ type: 'message', message: msg });
    });

    return result;
  }, [filteredMessages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleCall = (video: boolean) => {
    onSendMessage(`📞 Outgoing ${video ? 'video ' : ''}call to ${partner.fullName}...`);
    onStartCall(video);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(`📎 Attachment: ${file.name}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const exportToJson = () => {
    // Create export data with human-readable timestamps
    const exportData = {
      conversationId: conversation.id,
      exportedAt: formatExportTimestamp(Date.now()),
      participants: conversation.participants.map(p => ({
        id: p.id,
        name: p.fullName,
        username: p.username
      })),
      messages: conversation.messages.map(msg => ({
        id: msg.id,
        sender: msg.senderId === CURRENT_USER.id ? CURRENT_USER.fullName : partner.fullName,
        senderId: msg.senderId,
        text: msg.text,
        timestamp: formatExportTimestamp(msg.timestamp),
        timestampRaw: msg.timestamp,
        isRead: msg.isRead
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chat_${partner.username}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-900 z-10 bg-black/95 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 hover:bg-zinc-900 rounded-full transition-colors mr-1">
            <i className="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <div className="relative">
            <img src={partner.avatar} alt="" className="w-10 h-10 rounded-full border border-zinc-800 object-cover" />
            {partner.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-zinc-100">{partner.fullName}</span>
            <span className={`text-[11px] leading-tight ${partner.isOnline ? 'text-emerald-500' : 'text-zinc-500'}`}>
              {partner.isOnline ? 'Active now' : formatLastActive(partner.lastActiveAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => {
              setIsSearching(!isSearching);
              if (isSearching) setMsgSearch('');
            }}
            className={`p-2 rounded-md transition-colors ${isSearching ? 'text-blue-400 bg-blue-400/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
          >
            <i className="fa-solid fa-circle-info text-sm"></i>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#1a1a1a] border border-zinc-800 rounded shadow-xl z-50 animate-in fade-in zoom-in duration-100 origin-top-right">
              <button
                onClick={exportToJson}
                className="w-full text-left px-4 py-3 text-[12px] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors border-b border-zinc-800/50 flex items-center gap-2"
              >
                <i className="fa-solid fa-file-export text-[10px]"></i>
                Export Chat History
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-3 text-[12px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Internal Search Bar (Conditional) */}
      {isSearching && (
        <div className="px-3 py-2 border-b border-zinc-900 bg-[#0a0a0a] animate-in slide-in-from-top duration-200">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Search messages..."
              value={msgSearch}
              onChange={(e) => setMsgSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] rounded-lg px-3 py-2 text-[12px] focus:outline-none text-zinc-200 border border-zinc-800"
            />
            {msgSearch && (
              <button
                onClick={() => setMsgSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 scroll-smooth"
        onClick={() => setShowMenu(false)}
      >
        {messagesWithDates.length > 0 ? (
          messagesWithDates.map((item, index) => (
            item.type === 'date' ? (
              // Date Separator (WhatsApp style)
              <div key={`date-${index}`} className="flex items-center justify-center my-3">
                <div className="bg-zinc-800/60 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wide">
                    {item.date}
                  </span>
                </div>
              </div>
            ) : (
              <MessageBubble
                key={item.message!.id}
                message={item.message!}
                isMine={item.message!.senderId === CURRENT_USER.id}
                showAvatar={false}
                partnerAvatar={partner.avatar}
                onJoinCall={() => onStartCall(item.message!.text.includes('video'))}
              />
            )
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
            <img src={partner.avatar} alt="" className="w-20 h-20 rounded-full border border-zinc-800 object-cover" />
            <div className="text-center">
              <h3 className="font-bold text-white text-lg">{partner.fullName}</h3>
              <p className="text-zinc-500 text-sm">@{partner.username}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 sticky bottom-0 bg-black">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3"
        >
          <div className="flex-1 flex items-center gap-3 border border-zinc-800 rounded-full px-4 py-2.5 bg-[#0a0a0a] focus-within:border-zinc-700 transition-colors">
            <button
              type="button"
              onClick={handleAttachClick}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-paperclip text-lg"></i>
            </button>

            <input
              type="text"
              placeholder="Message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent text-[14px] focus:outline-none text-zinc-200 placeholder:text-zinc-600"
            />

            {/* Call buttons consolidated here with increased spacing */}
            <div className="flex items-center gap-5 mr-1">
              <button
                type="button"
                onClick={() => handleCall(false)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                title="Audio Call"
              >
                <i className="fa-solid fa-phone text-lg"></i>
              </button>
              <button
                type="button"
                onClick={() => handleCall(true)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                title="Video Call"
              >
                <i className="fa-solid fa-video text-lg"></i>
              </button>
            </div>
          </div>

          <button
            disabled={!inputText.trim()}
            type="submit"
            className={`text-[14px] font-bold transition-all px-2 ${inputText.trim()
                ? 'text-blue-500 hover:text-white cursor-pointer'
                : 'text-blue-500/40 cursor-not-allowed'
              }`}
          >
            Send
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatView;
