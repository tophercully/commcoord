"use client";
import EditProfileForm from "@/components/users/EditUserForm";

export default function EditProfilePage() {
  return (
    <div className="flex w-full max-w-[80ch] flex-col gap-8">
      <h1 className="text-3xl">Edit Profile</h1>
      <EditProfileForm />
    </div>
  );
}
