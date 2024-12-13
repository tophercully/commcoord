"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({
  open,
  onClose,
  children,
  contentClassName = "max-w-[60ch]",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
}) => {
  // Control mounting/unmounting
  const [mounted, setMounted] = useState(false);
  // Control animation states
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Small delay to ensure mount happens before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300); // Match this with your transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-[1000] flex h-[100svh] w-full items-center justify-center bg-base-950 bg-opacity-20 p-2 transition-opacity duration-300 ease-in-out dark:text-base-50 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      style={{ backdropFilter: "blur(4px)" }}
      onMouseDown={handleOutsideClick}
    >
      <div
        className={`relative flex max-h-[90vh] w-full flex-col gap-6 rounded-xl bg-white p-4 shadow-xl transition-all duration-300 ease-in-out md:p-10 dark:bg-base-900 ${contentClassName} ${
          isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <X
          className="absolute right-0 top-0 h-10 w-10 cursor-pointer rounded-tr-xl p-2 hover:bg-gray-100 dark:hover:bg-base-800"
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
