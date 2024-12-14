import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Community } from "@/types/communities";
import { api } from "@/util/API/firebaseAPI";
import CommunityPageContent from "@/components/communities/CommunityPageContent";

async function fetchCommunity(community_id: string): Promise<Community | null> {
  try {
    const data = await api.community.getCommunity(community_id);
    return data ? (data as Community) : null;
  } catch (error) {
    console.error("Error fetching community data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ community_id: string }>;
}): Promise<Metadata> {
  const { community_id } = await params;
  const community = await fetchCommunity(community_id);

  if (!community) {
    return {
      title: "Community Not Found",
      description: "The requested community could not be found",
    };
  }

  return {
    title: `${community.name} Community`,
    description: `Explore the ${community.name} community`,
    openGraph: {
      title: `${community.name} Community`,
      description: `Join and explore the ${community.name} community`,
      type: "website",
    },
  };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ community_id: string }>;
}) {
  const { community_id } = await params;
  const community = await fetchCommunity(community_id);

  if (!community) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl">{community.name}</h1>
      <div>
        <p className="text-base-400">{community.description}</p>
      </div>
      <CommunityPageContent community={community} />
    </div>
  );
}
