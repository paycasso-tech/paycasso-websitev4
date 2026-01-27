
import { User, Conversation } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  username: 'alex_v',
  fullName: 'Alex Vardas',
  avatar: 'https://picsum.photos/seed/ops/200',
  isOnline: true,
};

export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    username: 'michael_v',
    fullName: 'Michael Vance',
    avatar: 'https://picsum.photos/seed/vance/200',
    isOnline: true,
  },
  {
    id: 'user2',
    username: 'sthompson',
    fullName: 'Sarah Thompson',
    avatar: 'https://picsum.photos/seed/thompson/200',
    isOnline: false,
    // Fix: Changed lastActive to lastActiveAt and assigned a numeric timestamp
    lastActiveAt: Date.now() - 720000,
  },
  {
    id: 'user3',
    username: 'rchen_finance',
    fullName: 'Robert Chen',
    avatar: 'https://picsum.photos/seed/chen/200',
    isOnline: true,
  },
  {
    id: 'user4',
    username: 'erossi',
    fullName: 'Elena Rossi',
    avatar: 'https://picsum.photos/seed/rossi/200',
    isOnline: false,
    // Fix: Changed lastActive to lastActiveAt and assigned a numeric timestamp
    lastActiveAt: Date.now() - 3600000,
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    participants: [MOCK_USERS[0]],
    messages: [
      { id: 'm1', senderId: 'user1', text: 'Payment for Transaction #8829 has been received.', timestamp: Date.now() - 3600000, isRead: true },
      { id: 'm2', senderId: 'me', text: 'Understood. Please initiate the release sequence.', timestamp: Date.now() - 3000000, isRead: true },
      { id: 'm3', senderId: 'user1', text: 'Sequence initiated. Estimated completion in 15 minutes.', timestamp: Date.now() - 2400000, isRead: true },
    ],
    unreadCount: 0,
  },
  {
    id: 'conv2',
    participants: [MOCK_USERS[2]],
    messages: [
      { id: 'm4', senderId: 'user3', text: 'Invoice #440-B is overdue by 3 days.', timestamp: Date.now() - 86400000, isRead: true },
    ],
    unreadCount: 1,
  },
];
