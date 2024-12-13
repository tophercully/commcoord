import React from "react";
import InputWrapper from "./InputWrapper";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ label, value, onChange }: TextInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <InputWrapper label={label}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="w-full rounded-md bg-base-100 p-2 shadow-inner dark:bg-base-800"
      />
    </InputWrapper>
  );
};

export default TextInput;
