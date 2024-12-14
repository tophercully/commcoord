"use client";
import { Community } from "@/types/communities";
import ListChannels from "../messaging/ListChannels";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { api } from "@/util/API/firebaseAPI";
import AuthDisplay from "../auth/AuthDisplay";
import { useParams } from "next/navigation";
import Loader from "../Loader";

const CommunityPageContent = ({ community }: { community: Community }) => {
  const { user, authInitializing } = useAuth();
  const { community_id } = useParams();
  const [members, setMembers] = useState<string[]>([]);
  const isMember = user && members.includes(user.uid);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(members);

  useEffect(() => {
    const getCommunityMembers = async () => {
      if (!user) {
        return;
      }
      try {
        const communityMembers = await api.community.getMembers(
          community_id as string,
        );
        setMembers(communityMembers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to check member status:", error);
        setLoading(false);
      }
    };

    getCommunityMembers();
  }, [community.id, user]);

  const handleJoinCommunity = async () => {
    if (!user) {
      return;
    }

    try {
      await api.community.addMember(community_id as string, user.uid);
      setMembers((prevMembers) => [...prevMembers, user.uid]);
    } catch (error) {
      console.error("Failed to join community:", error);
    }
  };

  if (authInitializing || loading) {
    return <Loader />;
  }

  if (!user) {
    return <AuthDisplay />;
  }

  if (!isMember) {
    return (
      <div className="mx-auto flex flex-col items-center gap-2">
        <p className="text-xl font-semibold">{`${members.length} member${members.length == 1 ? "" : "s"}`}</p>
        <button
          onClick={handleJoinCommunity}
          className="rounded-lg bg-base-950 px-4 py-3 text-3xl font-medium text-white shadow hover:bg-base-700"
        >
          Join this community
        </button>
      </div>
    );
  }

  return <ListChannels communityId={community_id as string} />;
};

export default CommunityPageContent;
