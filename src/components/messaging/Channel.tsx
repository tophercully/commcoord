"use client";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { ChatMessage } from "@/types/chats";
import { api } from "@/util/API/firebaseAPI";

interface ChatChannelProps {
  channelId: string;
}

const ChatChannel: React.FC<ChatChannelProps> = ({ channelId }) => {
  const [messages, setMessages] = useState<Record<string, ChatMessage>>({});
  const [members, setMembers] = useState<{ id: string; displayName: string }[]>(
    [],
  );
  const [newMessage, setNewMessage] = useState("");
  const auth = getAuth();

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const fetchedMessages = await api.messages.getChannelMessages(channelId);
      setMessages(fetchedMessages);
    };
    const fetchMembers = async () => {
      const fetchedMembers = await api.messages.getChannelMembers(channelId);
      setMembers(fetchedMembers);
    };

    // Set up real-time listener
    const subscription = api.messages.subscribeToChannelMessages(
      channelId,
      (newMessage) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [newMessage.id]: newMessage,
        }));
      },
    );

    fetchMessages();
    fetchMembers();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [channelId]);

  const getMemberDisplayNameById = (id: string) => {
    const member = members.find((m) => m.id === id);
    return member?.displayName || "Unknown";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      await api.messages.sendMessage(user, {
        channelId,
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div
      id="channel-chat"
      className="flex flex-col gap-8"
    >
      <div
        id="messages"
        className="flex flex-col gap-2"
      >
        {Object.values(messages).map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === auth.currentUser?.uid ? "self" : "other"}`}
          >
            <span>{`${getMemberDisplayNameById(message.userId)}:${message.content}`}</span>
            {message.edited && (
              <span className="edited-indicator">(edited)</span>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="message-input"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatChannel;
