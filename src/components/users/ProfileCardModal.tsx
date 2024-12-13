"use client";
import React from "react";

import { UserProfile } from "@/types/users";
import Modal from "../Modal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const ProfileCardModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <div className="max-h-[60svh] w-full max-w-[60ch]">
        <img
          src={
            userProfile?.photoURL ?
              userProfile?.photoURL
            : "/default-avatar.png"
          }
          alt="User Avatar"
          className="aspect-square max-h-52 w-full rounded object-contain"
        />
        <h2 className="profile-displayName">{userProfile?.displayName}</h2>
        <p className="profile-bio">{userProfile?.bio}</p>
      </div>
    </Modal>
  );
};

export default ProfileCardModal;
