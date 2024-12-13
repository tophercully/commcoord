"use client";
import { useAuth } from "@/contexts/authContext";
import CreateCommunityModal from "./CreateCommunityModal";
import { useState } from "react";

const CreateCommunityButton = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-base-950 px-2 py-1 text-base-50 hover:bg-base-700"
      >
        Create Community
      </button>
      <CreateCommunityModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default CreateCommunityButton;
