import AuthDisplay from "@/components/auth/AuthDisplay";
import CreateCommunityButton from "@/components/communities/CreateCommunityButton";
import UserCommunitiesList from "@/components/communities/UserCommunitiesList";

export default function Home() {
  return (
    <div className="flex max-w-[80ch] flex-col gap-4">
      <h1 className="text-7xl">CommCoord</h1>
      <p className="text-xl">A community coordination platform.</p>
      <AuthDisplay />
      <UserCommunitiesList />
      <CreateCommunityButton />
    </div>
  );
}
