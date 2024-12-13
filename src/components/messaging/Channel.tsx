"use client";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { ChatMessage } from "@/types/chats";
import { api } from "@/util/API/firebaseAPI";
import ProfileCardModal from "../users/ProfileCardModal";
import { UserProfile } from "@/types/users";

interface ChatChannelProps {
  channelId: string;
}

const ChatChannel: React.FC<ChatChannelProps> = ({ channelId }) => {
  const user = getAuth().currentUser;
  const [messages, setMessages] = useState<Record<string, ChatMessage>>({});
  const [members, setMembers] = useState<{ id: string; displayName: string }[]>(
    [],
  );
  const isMember = members.some((member) => member.id === user?.uid);
  const [profileToDisplay, setProfileToDisplay] = useState<UserProfile | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
  const auth = getAuth();

  console.log(`members:`);
  console.log(members);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const fetchedMessages = await api.messages.getChannelMessages(channelId);
      setMessages(fetchedMessages);
    };
    const fetchMembers = async () => {
      const fetchedMembers = await api.messages.getChannelMembers(channelId);
      setMembers(fetchedMembers as { id: string; displayName: string }[]);
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

  const handleClickProfile = async (userId: string) => {
    try {
      const profile = await api.auth.getUserProfile(userId);
      setProfileToDisplay(profile as UserProfile);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  if (!isMember) {
    return (
      <button
        onClick={async () => {
          if (user) {
            try {
              await api.messages.addMember(channelId, user.uid);
              const updatedMembers =
                await api.messages.getChannelMembers(channelId);
              setMembers(
                updatedMembers as { id: string; displayName: string }[],
              );
            } catch (error) {
              console.error("Failed to join channel", error);
            }
          }
        }}
      >
        Join Channel
      </button>
    );
  }

  return (
    <div
      id="channel-chat"
      className="flex w-full flex-col gap-8"
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
            <span>
              <button
                onClick={() => handleClickProfile(message.userId)}
                className="text-base-300 hover:text-base-950 hover:underline"
              >{`${getMemberDisplayNameById(message.userId)}: `}</button>
              <span>{`${message.content}`}</span>
            </span>
            {message.edited && (
              <span className="edited-indicator">(edited)</span>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        id="message-input"
        className="flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full rounded border p-2"
        />
        <button
          type="submit"
          className="hover:underline"
        >
          Send
        </button>
      </form>
      <ProfileCardModal
        isOpen={!!profileToDisplay}
        userProfile={profileToDisplay as UserProfile}
        onClose={() => setProfileToDisplay(null)}
      />
    </div>
  );
};

export default ChatChannel;
