
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import CallOverlay from './components/CallOverlay';
import { User, Conversation, Message } from './types';
import { CURRENT_USER, INITIAL_CONVERSATIONS } from './mockData';
import { api } from './services/api';
import { signalingService, IncomingCall } from './services/signaling';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Call state
  const [activeCallPartner, setActiveCallPartner] = useState<User | null>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);

  // Connect to signaling server on mount
  useEffect(() => {
    const connectSignaling = async () => {
      try {
        await signalingService.connect(CURRENT_USER.id);
        console.log('Connected to signaling server');

        // Set up incoming call handler
        signalingService.setCallbacks({
          onIncomingCall: (call) => {
            console.log('Incoming call from:', call.callerName);
            setIncomingCall(call);
            setIsIncomingCall(true);
            setIsVideoCall(call.isVideo);
            setCurrentCallId(call.callId);

            // Create a user object for the caller
            setActiveCallPartner({
              id: call.callerId,
              username: call.callerName.toLowerCase().replace(' ', '_'),
              fullName: call.callerName,
              avatar: call.callerAvatar,
              isOnline: true
            });
          }
        });
      } catch (err) {
        console.warn('Could not connect to signaling server:', err);
      }
    };

    connectSignaling();

    return () => {
      signalingService.disconnect();
    };
  }, []);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const convs = await api.fetchConversations(CURRENT_USER.id);

        const sortedConvs = convs.sort((a, b) => {
          const lastA = a.messages?.[a.messages.length - 1]?.timestamp || 0;
          const lastB = b.messages?.[b.messages.length - 1]?.timestamp || 0;
          return new Date(lastB).getTime() - new Date(lastA).getTime();
        });
        setConversations(sortedConvs);
        if (sortedConvs.length > 0) setActiveId(sortedConvs[0].id);
        setIsOffline(false);
      } catch (err) {
        console.warn("Backend unavailable, falling back to local mock data.");
        setConversations(INITIAL_CONVERSATIONS);
        if (INITIAL_CONVERSATIONS.length > 0) setActiveId(INITIAL_CONVERSATIONS[0].id);
        setIsOffline(true);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Polling for "Real-time" effect
  useEffect(() => {
    if (isOffline) return;

    const interval = setInterval(async () => {
      if (activeId) {
        try {
          const updatedConvs = await api.fetchConversations(CURRENT_USER.id);
          setConversations(prev => {
            const sorted = updatedConvs.sort((a, b) => {
              const lastA = a.messages?.[a.messages.length - 1]?.timestamp || 0;
              const lastB = b.messages?.[b.messages.length - 1]?.timestamp || 0;
              return new Date(lastB).getTime() - new Date(lastA).getTime();
            });
            const prevTotal = prev.reduce((acc, c) => acc + (c.messages?.length || 0), 0);
            const nextTotal = sorted.reduce((acc, c) => acc + (sorted.find(s => s.id === c.id)?.messages?.length || 0), 0);
            if (prevTotal !== nextTotal) return sorted;
            return prev;
          });
        } catch (e) { /* silent fail for polling */ }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeId, isOffline]);

  const activeConversation = conversations.find(c => c.id === activeId);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!activeId || !text.trim()) return;

    const currentConv = conversations.find(c => c.id === activeId);
    if (!currentConv) return;

    // Optimistic Update
    const tempMsgId = 'temp-' + Date.now();
    const optimisticMsg: Message = {
      id: tempMsgId,
      senderId: CURRENT_USER.id,
      text,
      timestamp: Date.now(),
      isRead: false,
    };

    // Update UI immediately
    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === activeId
          ? { ...conv, messages: [...(conv.messages || []), optimisticMsg] }
          : conv
      );
      return [...updated].sort((a, b) => {
        const lastA = a.messages?.[a.messages.length - 1]?.timestamp || 0;
        const lastB = b.messages?.[b.messages.length - 1]?.timestamp || 0;
        return new Date(lastB).getTime() - new Date(lastA).getTime();
      });
    });

    if (!isOffline) {
      try {
        const savedMsg = await api.sendMessage(activeId, CURRENT_USER.id, text);
        setConversations(prev => prev.map(conv =>
          conv.id === activeId
            ? { ...conv, messages: conv.messages.map(m => m.id === tempMsgId ? savedMsg : m) }
            : conv
        ));
      } catch (err) {
        console.error("Failed to persist message:", err);
      }
    }
  }, [activeId, conversations, isOffline]);

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleStartCall = (partner: User, video: boolean = false) => {
    setIsVideoCall(video);
    setActiveCallPartner(partner);
    setIsIncomingCall(false);
    setCurrentCallId(null);
  };

  const handleEndCall = () => {
    setActiveCallPartner(null);
    setIncomingCall(null);
    setIsIncomingCall(false);
    setCurrentCallId(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-800 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest animate-pulse">Initializing Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-black text-[#f5f5f5] overflow-hidden">
      {/* Call Overlay */}
      {activeCallPartner && (
        <CallOverlay
          partner={activeCallPartner}
          currentUser={CURRENT_USER}
          videoEnabled={isVideoCall}
          onEndCall={handleEndCall}
          isIncoming={isIncomingCall}
          callId={currentCallId || undefined}
        />
      )}

      {/* Offline Banner */}
      {isOffline && (
        <div className="absolute top-0 left-0 w-full bg-amber-900/20 border-b border-amber-900/30 py-1 text-center z-50">
          <span className="text-[9px] text-amber-500 uppercase tracking-widest font-bold">Local Archive Mode (Server Unreachable)</span>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-full md:w-[320px]' : 'hidden md:block md:w-[320px]'} border-r border-zinc-800 bg-black flex flex-col transition-all duration-300 pt-6`}>
        <Sidebar
          currentUser={CURRENT_USER}
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Main Chat View */}
      <div className={`${!isSidebarOpen ? 'w-full' : 'hidden md:flex md:flex-1'} flex flex-col bg-black pt-6`}>
        {activeConversation ? (
          <ChatView
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onBack={() => setIsSidebarOpen(true)}
            onStartCall={(video) => handleStartCall(activeConversation.participants[0], video)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 border border-zinc-500 rounded-full flex items-center justify-center mb-4">
              <i className="fa-regular fa-paper-plane text-3xl"></i>
            </div>
            <h2 className="text-lg font-medium mb-1">Your Messages</h2>
            <p className="text-zinc-500 text-sm mb-4">Select a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
