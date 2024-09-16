"use client";

import { ActivationTypePage } from "@/global/global.types";
import ActivationLayout from "./ActivationLayout";
import Input from '../Input';
import Button from '../Button';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { addUserGitHub } from '@/app/services/addUserGitHub';

export default function GitHubActivation({ setPage }: { setPage: (page: ActivationTypePage) => void }) {
  const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

  const router = useRouter();
  const [githubUser, setGitHubUser] = useState<string>("");
  const [validField, setValidField] = useState<boolean>(false);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValidity = event.target.validity.valid;
    const value = event.target.value;
    setGitHubUser(value);
    if (fieldValidity !== validField) {
      setValidField(fieldValidity);
    }
  };

  const handleSubmit = async () => {
    const email = JSON.parse(localStorage.getItem(USERDATA_KEY)!) as string;

    await addUserGitHub({ githubUser: githubUser, email });

    router.push("https://github.com/SuperViz/superviz");
  };

  return (
    <ActivationLayout setPage={setPage}>
      <form className="w-full h-full relative overflow-hidden flex flex-col justify-end px-1">
        <div
          className={`absolute bottom-[40%] left-0 w-full transition-all duration-700 ease-in-out transform`}
        >
          <Input
            label={`Qual seu user no GitHub?`}
            id={`discord`}
            onChange={handleChangeInput}
            value={githubUser}
            type={`text`}
          />
        </div>
        <Button
          text="Dar estrela"
          onClick={handleSubmit}
          type="button"
          disabled={!validField}
        />
      </form>
    </ActivationLayout>
  );
}