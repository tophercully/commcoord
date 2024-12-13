import { useState } from "react";
import Modal from "../Modal";
import TextInput from "../forms/TextInput";
import { api } from "@/util/API/firebaseAPI";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateCommunityModal: React.FC<Props> = ({ open, onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    private: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("creating community");
    const newCommunityId = await api.community.createCommunity(
      form,
      user?.uid as string,
    );
    console.log(newCommunityId);
    router.push(`/community/${newCommunityId}`);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <h1 className="text-5xl">New Community</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <TextInput
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e })}
          label="Community Name"
        />
        <TextInput
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e })}
          label="Description"
        />
        <button className="ml-auto w-fit rounded-lg bg-base-950 px-2 py-1 text-base-50 hover:bg-base-700">
          Create
        </button>
      </form>
    </Modal>
  );
};

export default CreateCommunityModal;
