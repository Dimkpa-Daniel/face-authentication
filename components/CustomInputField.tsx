import React from "react";

interface CustomInputFieldProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const CustomInputField:React.FC<CustomInputFieldProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="p-2 border border-gray-300 rounded w-full mb-3"
    />
  );
};

export default CustomInputField;
