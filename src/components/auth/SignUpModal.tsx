"use client";
import { useAuth } from "@/contexts/authContext";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Modal from "../Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onPressSignIn: () => void;
}

const SignUpModal: React.FC<Props> = ({ open, onClose, onPressSignIn }) => {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formComplete = form.email && form.password && form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUp(form.email, form.password);
      onClose();
    } catch (error) {
      setError("Failed to create an account. Please try again.");
      console.error("Error signing up:", error);
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full rounded-md border p-2 pr-10 dark:border-base-700 dark:bg-base-800"
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ?
                <EyeOff color="gray" />
              : <Eye color="gray" />}
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={onPressSignIn}
            className="self-start text-xs hover:cursor-pointer hover:underline"
          >
            Already have an account? Sign In
          </button>
          <button
            type="submit"
            disabled={!formComplete || form.password !== form.confirmPassword}
            className="rounded-md bg-base-900 p-2 text-white disabled:cursor-not-allowed disabled:bg-base-500 dark:bg-base-100 dark:text-black"
          >
            Sign Up
          </button>
        </form>
      </Modal>
    );
  }

  return null;
};

export default SignUpModal;
