import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Community } from "@/types/communities";

import { api } from "@/util/API/firebaseAPI";
import { ChatChannel } from "@/types/chats";
import Channel from "@/components/messaging/Channel";

async function fetchCommunity(communityId: string): Promise<Community | null> {
  try {
    const community = await api.community.getCommunity(communityId);
    return (community as Community) ?? null;
  } catch (error) {
    console.error("Failed to fetch community:", error);
    return null;
  }
}

async function fetchChannel(channelId: string): Promise<ChatChannel | null> {
  try {
    const channel = await api.messages.getChannelInfo(channelId);
    return channel;
  } catch (error) {
    console.error("Failed to fetch channel:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ community_id: string; channel_id: string }>;
}): Promise<Metadata> {
  const { community_id, channel_id } = await params;
  const community = await fetchCommunity(community_id);
  const channel = await fetchChannel(channel_id);

  if (!community || !channel) {
    return {
      title: "Channel Not Found",
      description: "The requested channel could not be found",
    };
  }

  return {
    title: `${channel.name} - ${community.name} Community`,
    description: `Chat in the ${channel.name} channel of the ${community.name} community`,
    openGraph: {
      title: `${channel.name} - ${community.name} Community`,
      description: `Join the conversation in the ${channel.name} channel of the ${community.name} community`,
      type: "website",
    },
  };
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ community_id: string; channel_id: string }>;
}) {
  const { community_id, channel_id } = await params;
  const community = await fetchCommunity(community_id);
  const channel = await fetchChannel(channel_id);

  if (!community || !channel) {
    notFound();
  }

  return (
    <div>
      <h1>
        {channel.name} Channel in {community.name} Community
      </h1>
      <div>
        <p>{community.description}</p>
      </div>
      <Channel channelId={channel_id} />
    </div>
  );
}
