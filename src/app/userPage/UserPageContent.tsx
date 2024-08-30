'use client'

import User from "@/components/User";
import { activations } from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import React from "react";
import { useRealtime } from "@superviz/react-sdk";
import { IUser } from "../../../types";
import { ActivationType } from '@/global/global.types';

export default function UserPageContent({ user }: { user: IUser }) {
  const { subscribe } = useRealtime('default');

  function handleActivationClick(message: any) {
    const completedActivation = ActivationType.DISCORD;
    // TODO: Completou uma ativação, marcar a ativação que usuário tem como completada (que ação foi feita)
  }

  React.useEffect(() => {
    subscribe("activation.complete", handleActivationClick);
  }, []);

  return (
    <>
      <div className="my-5 pb-5 w-screen border-b border-[#ffffff1a]">
        <User user={user} withActivations={true} withUsername={true} withStar={false} />
      </div>
      <p className="w-full text-center font-normal text-lg">Escolha uma ativação para participar</p>
      {activations.map(activation => (
        <div key={activation.color} className="w-full">
          <CardLink user={user} activation={activation} userActivation={user.activations.find(act => act.id === activation.id)} />
        </div>
      ))}
    </>
  )
}