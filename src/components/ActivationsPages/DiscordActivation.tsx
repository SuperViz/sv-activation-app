'use client'

import Input from "@/components/Input";
import Button from "@/components/Button";
import React from "react";
import { addUserDiscord } from "@/app/services/addUserDiscord";
import { IUser } from "../../../types";
import { useRouter } from "next/navigation";
import ActivationLayout from "./ActivationLayout";
import { ActivationTypePage } from "@/global/global.types";

const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

export default function DiscordActivation({ setPage }: { setPage: (page: ActivationTypePage) => void }) {
  const router = useRouter()
  const [discordUser, setDiscordUser] = React.useState<string>('')
  const [validField, setValidField] = React.useState<boolean>(false)

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValidity = event.target.validity.valid
    const value = event.target.value
    setDiscordUser(value)
    if (fieldValidity !== validField) {
      setValidField(fieldValidity)
    }
  }

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem(USERDATA_KEY)!) as IUser
    const userEmail = userData.email

    await addUserDiscord({ discordUser, email: userEmail })

    router.push('https://discord.com/invite/Zb2arax9nn')
  }

  return (
    <ActivationLayout setPage={setPage}>
      <form className="w-full h-full relative overflow-hidden flex flex-col justify-end px-1">
        <div
          className={`absolute bottom-[40%] left-0 w-full transition-all duration-700 ease-in-out transform`}
        >
          <Input
            label={`Qual seu nome de usuário no Discord?`}
            id={`discord`}
            onChange={handleChangeInput}
            value={discordUser}
            type={`text`}
          />
        </div>
        <Button text="Começar" onClick={handleSubmit} type="button" disabled={!validField} />
      </form>
    </ActivationLayout>
  )
}