'use client'

import Input from "@/components/Input";
import Button from "@/components/Button";
import React from "react";

export default function DiscordPage() {
  const [ discordUser, setDiscordUser ] = React.useState<string>('')
  const [ validField, setValidField ] = React.useState<boolean>(false)

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const fieldValidity = event.target.validity.valid
    const value = event.target.value
    setDiscordUser(value)
    if(fieldValidity !== validField) {
      setValidField(fieldValidity)
    }
  }

  const handleSubmit = async () => {
    console.log('discordUser', discordUser)

    // router.push('/activations')
  }
  
  return (
    <>
      <form className="w-full h-full relative overflow-hidden flex flex-col justify-end">
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
    </>
  )
}