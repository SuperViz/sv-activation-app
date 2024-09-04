import React from "react";

interface IInputProps {
  label: string;
  id: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  value: string;
  type?: string;
  description?: string;
}
export default function Input({
  label,
  onKeyDown,
  id,
  onChange,
  value,
  description,
  type = "text",
}: IInputProps) {
  return (
    <div className="w-full px-1 flex flex-col align-center">
      <label
        htmlFor={id}
        className="font-black text-white text-4xl text-center flex flex-col justify-center items-center w-full mb-5"
      >
        {label}
      </label>
      {description && (
        <p className="text-white text-center text-lg mb-5">{description}</p>
      )}
      <input
        required
        type={type}
        id={id}
        name={id}
        className="py-6 px-4 text-lg text-white text-center rounded-2xl bg-[#C9C4D114] w-full"
        onChange={(event) => onChange(event)}
        onKeyDown={onKeyDown}
        value={value}
      />
    </div>
  );
}
