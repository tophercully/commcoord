import React from "react";
interface InputWrapperProps {
  label: string;
  children: React.ReactNode;
}
const InputWrapper = ({ label, children }: InputWrapperProps) => {
  return (
    <div className="flex flex-col gap-0 text-lg">
      <h3 className="text-lg text-base-300">{label}</h3>
      {children}
    </div>
  );
};

export default InputWrapper;
