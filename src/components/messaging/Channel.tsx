"use client";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { ChatMessage } from "@/types/chats";
import { api } from "@/util/API/firebaseAPI";
import ProfileCardModal from "../users/ProfileCardModal";
import { UserProfile } from "@/types/users";
import Message from "./Message";

interface ChatChannelProps {
  channelId: string;
}

const ChatChannel: React.FC<ChatChannelProps> = ({ channelId }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [messages, setMessages] = useState<Record<string, ChatMessage>>({});
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [profileToDisplay, setProfileToDisplay] = useState<UserProfile | null>(
    null,
  );
  const [displayProfile, setDisplayProfile] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    let subscription: any;

    // Fetch initial data and set up subscription
    const initializeChannel = async () => {
      const fetchedMessages = await api.messages.getChannelMessages(channelId);
      setMessages(fetchedMessages);

      const fetchedMembers = await api.messages.getChannelMembers(channelId);
      setMembers(
        fetchedMembers.map((member: any) => ({
          uid: member.id,
          email: member.email || "",
          bio: member.bio || "",
          displayName: member.displayName || "Unknown",
          photoURL: member.photoURL || "",
          pronouns: member.pronouns || "",
        })),
      );

      subscription = api.messages.subscribeToChannelMessages(
        channelId,
        (newMessage) => {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [newMessage.id]: newMessage,
          }));
        },
      );
    };

    initializeChannel();

    // Periodic session verification
    const intervalId = setInterval(() => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("Session ended. Unsubscribing from channel.");
        if (subscription) subscription.unsubscribe();
      }
    }, 300000); // 5 minutes

    // Cleanup on unmount
    return () => {
      if (subscription) subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, [channelId, auth]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

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
    const profile = members.find((member) => member.uid === userId);
    if (profile) setProfileToDisplay(profile);
    setDisplayProfile(true);
  };
  const handleCloseProfile = () => {
    setDisplayProfile(false);
  };

  const isMember = members.some((member) => member.uid === user?.uid);
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
                updatedMembers.map((member: any) => ({
                  uid: member.id,
                  email: member.email || "",
                  bio: member.bio || "",
                  displayName: member.displayName || "Unknown",
                  photoURL: member.photoURL || "",
                  pronouns: member.pronouns || "",
                })),
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
      className="flex h-full w-full flex-col justify-end gap-8"
    >
      <div
        id="messages"
        className="mt-auto flex h-full flex-col justify-end gap-2"
      >
        {Object.values(messages).map((message, index) => {
          const lastMessageAuthor = Object.values(messages)[index - 1]?.userId;
          const minuteSent = Math.floor(message.timestamp / 60000);
          const lastMessageSent = Math.floor(
            Object.values(messages)[index - 1]?.timestamp / 60000,
          );
          return (
            <Message
              key={message.id}
              message={message}
              handleClickProfile={() => handleClickProfile(message.userId)}
              memberProfile={
                members.find((m) => m.uid === message.userId) as UserProfile
              }
              contentOnly={
                message.userId == lastMessageAuthor &&
                minuteSent == lastMessageSent
              }
            />
          );
        })}
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
        isOpen={!!profileToDisplay && displayProfile}
        userProfile={profileToDisplay as UserProfile}
        onClose={handleCloseProfile}
      />
    </div>
  );
};

export default ChatChannel;
