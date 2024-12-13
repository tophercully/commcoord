import {
  ref,
  push,
  set,
  get,
  query,
  limitToLast,
  onChildAdded,
  off,
} from "firebase/database";
import { User } from "firebase/auth";

import { ChatChannel, ChatMessage } from "@/types/chats";
import { rtdb } from "../../../firebaseConfig";

export interface MessageSubscription {
  unsubscribe: () => void;
}

export const messagesAPI = {
  async createChannel(
    user: User,
    channelData: Omit<ChatChannel, "id" | "createdAt" | "createdBy">,
  ): Promise<ChatChannel> {
    const channelRef = push(ref(rtdb, "channels"));
    const newChannel: ChatChannel = {
      id: channelRef.key!,
      ...channelData,
      createdAt: Date.now(),
      createdBy: user.uid,
    };
    await set(channelRef, newChannel);
    return newChannel;
  },
  async getChannels(communityId: string): Promise<ChatChannel[]> {
    const channelsRef = ref(rtdb, "channels");
    const snapshot = await get(channelsRef);
    const channels: ChatChannel[] = [];

    snapshot.forEach((childSnapshot) => {
      const channel = childSnapshot.val() as ChatChannel;
      if (channel.communityId === communityId) {
        channels.push(channel);
      }
    });

    return channels;
  },
  async getChannelMembers(
    channelId: string,
  ): Promise<{ id: string; displayName: string }[]> {
    const membersRef = ref(rtdb, `channels/${channelId}/members`);
    const snapshot = await get(membersRef);
    const members: { id: string; displayName: string }[] = [];

    snapshot.forEach((childSnapshot) => {
      const member = childSnapshot.val();
      members.push({ id: childSnapshot.key!, displayName: member.displayName });
    });

    return members;
  },
  async addMember(
    channelId: string,
    member: { id: string; displayName: string },
  ): Promise<void> {
    const membersRef = ref(rtdb, `channels/${channelId}/members/${member.id}`);
    await set(membersRef, member);
  },
  async removeMember(channelId: string, memberId: string): Promise<void> {
    const memberRef = ref(rtdb, `channels/${channelId}/members/${memberId}`);
    await set(memberRef, null);
  },
  async getChannelInfo(channelId: string): Promise<ChatChannel | null> {
    const channelRef = ref(rtdb, `channels/${channelId}`);
    const snapshot = await get(channelRef);
    if (snapshot.exists()) {
      return snapshot.val() as ChatChannel;
    }
    return null;
  },

  async sendMessage(
    user: User,
    messageData: Omit<ChatMessage, "id" | "timestamp" | "userId">,
  ): Promise<ChatMessage> {
    // Add explicit validation
    if (!user) {
      throw new Error("User must be authenticated");
    }

    if (!messageData.channelId) {
      throw new Error("Channel ID is required");
    }

    if (!messageData.content || messageData.content.trim() === "") {
      throw new Error("Message content cannot be empty");
    }

    const channelMessagesRef = ref(rtdb, `messages/${messageData.channelId}`);

    const messageRef = push(channelMessagesRef);

    const newMessage: ChatMessage = {
      id: messageRef.key!,
      channelId: messageData.channelId, // Explicitly set channelId
      content: messageData.content.trim(), // Trim whitespace
      userId: user.uid,
      timestamp: Date.now(),
      ...(messageData.attachments && { attachments: messageData.attachments }),
    };

    try {
      await set(messageRef, newMessage);
      return newMessage;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  async getChannelMessages(
    channelId: string,
    limit = 50,
  ): Promise<Record<string, ChatMessage>> {
    const messagesRef = ref(rtdb, `messages/${channelId}`);
    const messagesQuery = query(messagesRef, limitToLast(limit));
    const snapshot = await get(messagesQuery);
    return snapshot.val() || {};
  },

  subscribeToChannelMessages(
    channelId: string,
    onMessageReceived: (message: ChatMessage) => void,
  ): MessageSubscription {
    const messagesRef = ref(rtdb, `messages/${channelId}`);

    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const message = snapshot.val() as ChatMessage;
      onMessageReceived(message);
    });

    return {
      unsubscribe: () => off(messagesRef, "child_added", unsubscribe),
    };
  },

  async updateMessage(message: ChatMessage): Promise<void> {
    const messageRef = ref(rtdb, `messages/${message.channelId}/${message.id}`);
    await set(messageRef, {
      ...message,
      edited: true,
    });
  },

  async deleteMessage(message: ChatMessage): Promise<void> {
    const messageRef = ref(rtdb, `messages/${message.channelId}/${message.id}`);
    await set(messageRef, null);
  },
};
