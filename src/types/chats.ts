export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  communityId: string;
  createdAt: number;
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  timestamp: number;
  // Optional metadata like edited status, attachments, etc.
  edited?: boolean;
  attachments?: string[];
}
