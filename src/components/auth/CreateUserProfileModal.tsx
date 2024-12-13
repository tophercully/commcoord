"use client";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import Modal from "../Modal";
import { useNotif } from "@/contexts/notificationContext";
interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateUserProfileModal: React.FC<Props> = ({ open, onClose }) => {
  const { showNotif } = useNotif();
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({
    username: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("updating profile");
    if (form.username == "") {
      showNotif("Please enter a username", "error");
      return;
    } else {
      try {
        await updateUserProfile(form.username);
        onClose();
      } catch (error) {
        console.error("Error updating profile:", error);
        showNotif("Failed to create profile. Please try again.", "error");
      }
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="40ch"
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Create a profile</h1>
        <p className="text-base-400">Welcome! Let's create your profile.</p>
        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            name="username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="rounded-md border p-2 dark:border-base-700 dark:bg-base-800"
          />
          <button
            type="submit"
            className="rounded-md bg-base-500 p-2 text-white"
          >
            Create profile
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUserProfileModal;
