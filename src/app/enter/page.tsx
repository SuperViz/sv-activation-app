"use client";

import React from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { createUser } from "@/app/services/createUser";
import { useRouter } from "next/navigation";

export default function Enter() {
  const [step, setStep] = React.useState<number>(0);
  const router = useRouter();
  const questions = [
    {
      id: "email",
      type: "email",
      question: "Qual seu email?",
      description:
        "Use este e-mail na hora de cadastrar na newsletter e no nosso hackathon para conseguir pontuar!",
    },
    {
      id: "name",
      type: "text",
      question: "Como gostaria de ser chamado(a)?",
    },
  ];

  const initialValues = questions.reduce((prev, question) => {
    return {
      ...prev,
      [question.id]: "",
    };
  }, {});

  const [formData, setFormData] =
    React.useState<Record<string, string>>(initialValues);
  const [validField, setValidField] = React.useState<boolean>(false);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.getAttribute("id") as string;

    const value = event.target.value;
    const isValidEmail = fieldName === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : true;
  
    setFormData({
      ...formData,
      [fieldName]: value,
    });

    setValidField(isValidEmail);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (step < questions.length - 1) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
    setValidField(false);
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
    <form className="w-full h-full relative overflow-hidden flex flex-col justify-end">
      {questions.map((question, index) => {
        return (
          <div
            key={question.id}
            className={`absolute bottom-[40%] left-0 w-full transition-all duration-700 ease-in-out transform ${
              step === index
                ? "translate-x-0 opacity-100"
                : index < step
                ? "-translate-x-full opacity-0 pointer-events-none"
                : "translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            <Input
              label={question.question}
              id={question.id}
              onChange={handleChangeInput}
              value={formData[question.id]}
              onKeyDown={onKeyDown}
              type={question.type}
              description={question.description}
            />
          </div>
        );
      })}
      {step < questions.length - 1 ? (
        <Button
          text="Próximo"
          onClick={handleNext}
          type="button"
          disabled={!validField}
        />
      ) : (
        <Button
          text="Começar"
          onClick={handleSubmit}
          type="button"
          disabled={!validField}
        />
      )}
    </form>
  );
}
