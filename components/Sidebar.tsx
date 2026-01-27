
import React, { useState } from 'react';
import { User, Conversation } from '../types';

interface SidebarProps {
  currentUser: User;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const formatLastActive = (timestamp?: number) => {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Active now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Active ${days}d ago`;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter(c => {
    const partner = c.participants[0];
    const matchesSearch = partner.username.toLowerCase().includes(search.toLowerCase()) ||
                         partner.fullName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header - Minimal title only as per instructions */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[14px]"></i>
          <input 
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#262626] rounded-lg py-2 pl-10 pr-3 text-[14px] focus:outline-none placeholder:text-zinc-500 text-zinc-100 transition-colors"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto mt-2">
        <div className="flex flex-col">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => {
              const partner = conv.participants[0];
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === activeId;

              return (
                <div 
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${isActive ? 'bg-[#121212]' : 'hover:bg-zinc-900'}`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={partner.avatar} alt="" className="w-14 h-14 rounded-full border border-zinc-900 object-cover" />
                    {partner.isOnline && (
                      <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-white' : 'text-zinc-100'}`}>
                      {partner.fullName}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-white font-bold' : 'text-zinc-500'}`}>
                        {lastMsg ? lastMsg.text : (partner.isOnline ? 'Active now' : formatLastActive(partner.lastActiveAt))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <i className="fa-regular fa-comment-dots text-3xl opacity-20"></i>
              <p>No messages yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
