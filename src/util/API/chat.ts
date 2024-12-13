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
    await this.addMember(newChannel.id, user.uid);

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
  async getChannelsForMember(
    communityId: string,
    userId: string,
  ): Promise<ChatChannel[]> {
    const channelsRef = ref(rtdb, "channels");
    const snapshot = await get(channelsRef);
    const channels: ChatChannel[] = [];

    snapshot.forEach((childSnapshot) => {
      const channel = childSnapshot.val() as ChatChannel;
      if (channel.communityId === communityId) {
        channels.push(channel);
      }
    });

    const memberChannels: ChatChannel[] = [];
    for (const channel of channels) {
      const memberRef = ref(rtdb, `channel_members/${channel.id}/${userId}`);
      const memberSnapshot = await get(memberRef);
      if (memberSnapshot.exists()) {
        memberChannels.push(channel);
      }
    }

    return memberChannels;
  },
  async getUserDisplayName(userId: string): Promise<string | null> {
    try {
      const userRef = ref(rtdb, `users/${userId}/displayName`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log(`Display name found for user ${userId}: ${snapshot.val()}`);
        return snapshot.val();
      }
      console.log(`No display name found for user ${userId}`);
      return null;
    } catch (error) {
      console.error(`Failed to fetch display name for user ${userId}:`, error);
      return null;
    }
  },
  async getUserDisplayNames(
    userIds: string[],
  ): Promise<{ id: string; displayName: string | null }[]> {
    const displayNames = await Promise.all(
      userIds.map(async (userId) => {
        const displayName = await this.getUserDisplayName(userId);
        return { id: userId, displayName };
      }),
    );
    return displayNames;
  },
  async getChannelMembers(
    channelId: string,
  ): Promise<{ id: string; displayName: string | null }[]> {
    const membersRef = ref(rtdb, `channel_members/${channelId}`);
    const snapshot = await get(membersRef);
    const memberIds: string[] = [];

    snapshot.forEach((childSnapshot) => {
      memberIds.push(childSnapshot.key!);
    });

    const membersWithDisplayNames =
      await messagesAPI.getUserDisplayNames(memberIds);
    return membersWithDisplayNames;
  },
  async addMember(channelId: string, memberId: string): Promise<void> {
    const membersRef = ref(rtdb, `channel_members/${channelId}/${memberId}`);
    await set(membersRef, true);
  },
  async removeMember(channelId: string, memberId: string): Promise<void> {
    const memberRef = ref(rtdb, `channel_members/${channelId}/${memberId}`);
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
