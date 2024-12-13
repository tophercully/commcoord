"use client";
import { useAuth } from "@/contexts/authContext";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Modal from "../Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onPressSignUp: () => void;
}

const SignInModal: React.FC<Props> = ({ open, onClose, onPressSignUp }) => {
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(form.email, form.password);
      onClose();
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      console.error("Error signing in:", error);
    }
  };

  if (open) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        contentClassName="max-w-[40ch]"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-md border p-2 dark:border-base-700 dark:bg-base-800"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border p-2 pr-10 dark:border-base-700 dark:bg-base-800"
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ?
                <EyeOff color="gray" />
              : <Eye color="gray" />}
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={onPressSignUp}
            className="self-start text-xs hover:cursor-pointer hover:underline"
          >
            New here? Sign Up
          </button>
          <button
            type="submit"
            disabled={!form.email || !form.password}
            className="rounded-md bg-base-900 p-2 text-white disabled:bg-base-500 disabled:hover:cursor-not-allowed dark:bg-base-100 dark:text-black"
          >
            Sign In
          </button>
        </form>
      </Modal>
    );
  }

  return null;
};

export default SignInModal;
