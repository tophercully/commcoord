"use client";
import React, { useEffect, useState } from "react";
import { messagesAPI } from "@/util/API/chat";
import { ChatChannel } from "@/types/chats";
import CreateChannelModal from "./CreateChannelModal";
import { useAuth } from "@/contexts/authContext";
import { User } from "firebase/auth";
import Link from "next/link";

interface ListChannelsProps {
  communityId: string;
}

const ListChannels: React.FC<ListChannelsProps> = ({ communityId }) => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsSnapshot = await messagesAPI.getChannels(communityId);
        const channelsList = channelsSnapshot as ChatChannel[];
        setChannels(channelsList);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [communityId]);

  if (loading) {
    return <div>Loading channels...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Channels</h2>
      <ul className="mb-4">
        {channels.map((channel) => (
          <Link
            href={`/community/${communityId}/channel/${channel.id}`}
            key={channel.id}
            className="mb-2 rounded border p-2"
          >
            {channel.name}
          </Link>
        ))}
      </ul>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Channel
      </button>
      <CreateChannelModal
        user={user as User}
        communityId={communityId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onChannelCreated={(channel) => {
          setChannels([...channels, channel]);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ListChannels;
