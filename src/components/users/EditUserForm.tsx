"use client";
import { useAuth } from "@/contexts/authContext";
import { useNotif } from "@/contexts/notificationContext";
import { UserProfileForm } from "@/types/users";
import { api } from "@/util/API/firebaseAPI";
import { useEffect, useState } from "react";

export default function EditProfileForm() {
  const { user } = useAuth();
  const { showNotif } = useNotif();
  const [customPronouns, setCustomPronouns] = useState("");
  const [formData, setFormData] = useState<UserProfileForm>({
    displayName: "",
    photoURL: "",
    email: "",
    bio: "",
    pronouns: "",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      if (user) {
        try {
          const profile = await api.auth.getUserProfile(user.uid);
          setFormData({
            displayName: profile.displayName || "",
            photoURL: profile.photoURL || "",
            email: profile.email || "",
            bio: profile.bio || "",
            pronouns: profile.pronouns || "",
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    getUserProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (formData.pronouns === "other") {
      formData.pronouns = customPronouns;
    }
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
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[80ch] flex-col gap-4"
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
      <div>
        <label
          htmlFor="pronouns"
          className="block text-sm font-medium text-gray-700"
        >
          Pronouns
        </label>
        <select
          id="pronouns"
          name="pronouns"
          value={formData.pronouns}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
        >
          <option value="">Select pronouns</option>
          <option value="he/him">He/Him</option>
          <option value="she/her">She/Her</option>
          <option value="they/them">They/Them</option>
          <option value="other">Other</option>
        </select>
        {formData.pronouns === "other" && (
          <input
            type="text"
            id="customPronouns"
            name="customPronouns"
            placeholder="Enter your pronouns"
            value={customPronouns || ""}
            onChange={(e) => setCustomPronouns(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        )}
      </div>
      <button
        type="submit"
        className="self-end rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Save Changes
      </button>
    </form>
  );
}
