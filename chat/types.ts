
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isOnline: boolean;
  lastActiveAt?: number; // Unix timestamp in ms
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
}

export interface AppState {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
}
