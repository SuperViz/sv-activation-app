"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { createUser } from "@/app/services/createUser";
import { useRouter } from "next/navigation";

export default function Enter() {
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, string>>({ "name": "", "email": "" });
  const [validField, setValidField] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.getAttribute("id") as string;
    const value = event.target.value;

    const isValidEmail = fieldName === 'email' ? validateEmail(value) : true;

    setFormData({
      ...formData,
      [fieldName]: value,
    });

    setValidField(isValidEmail);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let existingSave = localStorage.getItem("saved_game");
    if (existingSave) localStorage.removeItem("saved_game");

    await createUser(formData).catch((error) => {
      console.error("Erro interno", error);
      return;
    });

    router.push("/userPage");
  };

  return (
    <form className="w-full h-full relative overflow-hidden flex flex-col pt-20">
      <Input
        label={'Como gostaria de ser chamado(a)?'}
        id={'name'}
        onChange={handleChangeInput}
        value={formData['name']}
        type={'text'}
      />
      <br />
      <br />
      <Input
        label={'Qual seu email?'}
        id={'email'}
        onChange={handleChangeInput}
        value={formData['email']}
        onKeyDown={onKeyDown}
        type={'email'}
        description={'Use este e-mail na hora de cadastrar no nosso hackathon para conseguir pontuar! Ao participar desta ativação, seu e-mail será registrado na nossa Newsletter.'}
      />
      <div style={{
        marginTop: 'auto',
      }} >
        <Button
          text="Começar"
          onClick={handleSubmit}
          type="button"
          disabled={!validField}
        />
      </div>
    </form >
  );
}
