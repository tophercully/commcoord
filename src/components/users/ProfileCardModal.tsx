"use client";
import React from "react";

import { UserProfile } from "@/types/users";
import Modal from "../Modal";
import { User } from "lucide-react";

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
      <div className="flex max-h-[60svh] w-full max-w-[60ch] flex-col items-center gap-8">
        {userProfile?.photoURL ?
          <img
            src={userProfile?.photoURL}
            alt="User Avatar"
            className="aspect-square max-h-52 w-full rounded object-contain"
          />
        : <User
            size={52}
            strokeWidth={0.5}
            className="h-52 w-52"
          />
        }
        <div>
          <h4 className="text-3xl">{userProfile?.displayName}</h4>
          <p className="text-lg text-base-300"> {userProfile?.pronouns}</p>
        </div>

        <p className="mt-8 w-full text-left text-lg">{userProfile?.bio}</p>
      </div>
    </Modal>
  );
};

export default ProfileCardModal;
