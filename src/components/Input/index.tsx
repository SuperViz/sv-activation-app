import React from "react";

interface IInputProps {
  label: string,
  id: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
  type?: string
}
export default function Input({ label, id, onChange, value, type = 'text' }: IInputProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="font-black text-white text-4xl text-center flex flex-col justify-center items-center w-full mb-5">
        {label}
      </label>
      <input
        required
        type={type}
        id={id}
        name={id}
        className="py-6 px-4 mx-2 text-lg text-white text-center rounded-2xl bg-[#C9C4D114]"
        style={{
          width: 'calc(100% - .6rem);',
        }}
        onChange={(event) => onChange(event)}
        value={value}
      />
    </div>
  )
}