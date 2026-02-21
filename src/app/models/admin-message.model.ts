export interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doorman' | 'admin';
  message: string;
  timestamp: Date;
  read: boolean;
  avatarUrl?: string;
}

export interface AdminChatThread {
  id: string;
  participants: string[];
  lastMessage: AdminMessage;
  unreadCount: number;
}
