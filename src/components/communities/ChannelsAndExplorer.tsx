import React from "react";
import ListChannels from "@/components/messaging/ListChannels";
import Channel from "@/components/messaging/Channel";

interface ChannelsAndExplorerProps {
  communityId: string;
  channelId: string;
}

const ChannelsAndExplorer: React.FC<ChannelsAndExplorerProps> = ({
  communityId,
  channelId,
}) => {
  return (
    <div className="flex h-full gap-4 rounded-lg border border-base-150 p-4 shadow-md">
      <ListChannels communityId={communityId} />
      <Channel channelId={channelId} />
    </div>
  );
};

export default ChannelsAndExplorer;
