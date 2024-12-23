"use client";
import { useAuth } from "@/contexts/authContext";
import { Community } from "@/types/communities";
import { api } from "@/util/API/firebaseAPI";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserCommunitiesList = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const response = await api.community.getUserCommunities(
          user?.uid as string,
        );
        setCommunities(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user communities:", error);
      }
    };
    if (user) {
      getCommunities();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2>Your communities:</h2>
      {communities.map((community: Community) => (
        <Link
          className="group"
          href={`/community/${community.id}`}
          key={community.id}
          prefetch
        >
          <div className="flex flex-col border border-black">
            <p className="bg-black px-4 py-2 text-2xl text-white group-hover:underline">
              {community.name}
            </p>
            <p className="p-4">{community.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserCommunitiesList;
