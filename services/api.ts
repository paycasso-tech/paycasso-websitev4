
import { User, Conversation, Message } from '../types';

const API_BASE = 'http://localhost:3000/api';

export const api = {
  async fetchUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async fetchConversations(userId: string): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE}/conversations/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, senderId, text }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async createConversation(participantIds: string[]): Promise<{ id: string }> {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantIds }),
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    return res.json();
  }
};
