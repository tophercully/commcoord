"use client";
import { useAuth } from "@/contexts/authContext";
import { useNotif } from "@/contexts/notificationContext";
import { UserProfileForm } from "@/types/users";
import { api } from "@/util/API/firebaseAPI";
import { get } from "http";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const { user } = useAuth();
  const { showNotif } = useNotif();
  const [formData, setFormData] = useState<UserProfileForm>({
    displayName: "",
    photoURL: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      if (user) {
        try {
          const profile = await api.auth.getUserProfile(user.uid);
          setFormData(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    getUserProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    if (!user) {
      console.log("No user found");
      return;
    }
    try {
      await api.auth.updateUserProfile(user.uid, formData);
      console.log("User profile updated successfully");
      showNotif("Profile updated successfully", "success", 5000);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName as string}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio as string}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="photoURL"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Photo URL
          </label>
          <input
            type="text"
            id="photoURL"
            name="photoURL"
            value={formData.photoURL as string}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="self-end rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
