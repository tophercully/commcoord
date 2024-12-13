"use client";
import React, { useState } from "react";
import { User } from "firebase/auth";
import { messagesAPI } from "@/util/API/chat";
import { ChatChannel } from "@/types/chats";
import Modal from "../Modal";

interface CreateChannelModalProps {
  user: User;
  communityId: string;
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: (channel: ChatChannel) => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  user,
  communityId,
  isOpen,
  onClose,
  onChannelCreated,
}) => {
  const [channelName, setChannelName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      setError("Channel name cannot be empty");
      return;
    }

    console.log("Creating channel...");
    console.log("User:", user);
    console.log("Channel name:", channelName);
    console.log("Community ID:", communityId);

    setLoading(true);
    setError(null);

    try {
      const newChannel = await messagesAPI.createChannel(user, {
        name: channelName.trim(),
        communityId,
      });
      onChannelCreated(newChannel);
      onClose();
    } catch (err) {
      setError("Failed to create channel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <div className="rounded bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Create New Channel</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Channel Name"
          className="mb-4 w-full rounded border p-2"
        />
        <div className="flex justify-end">
          <button
            className="mr-2 rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleCreateChannel}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateChannelModal;
