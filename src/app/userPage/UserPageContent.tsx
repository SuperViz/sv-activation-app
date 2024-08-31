'use client'

import User from "@/components/User";
import { activations } from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import React from "react";
import { useRealtime } from "@superviz/react-sdk";
import { IUser, IUserActivation} from "../../../types";

export default function UserPageContent({ user, userActivations}: { user: IUser, userActivations: IUserActivation[] }) {
  const { subscribe } = useRealtime('default');
  
  //TODO: tirar o link quando a ativação estiver "completed"

  function handleActivationStart(message: any) {
    const userId = message.data.userId;
    const activation = message.data.activation;
    console.log('Iniciou a ativação', userId, activation);
  }

  function handleActivationClick(message: any) {
    const userId = message.data.userId;
    const completedActivation = message.data.activation;
    console.log('ativação concluida', userId, completedActivation);
  }

  function handleGameUpdate(message: any) {
    const userId = message.data.userId;
    const points = message.data.points;
    console.log('Atualizou os pontos do usuário', userId, points);
  }

  React.useEffect(() => {
    subscribe("activation.start", handleActivationStart);
    subscribe("activation.game.update", handleGameUpdate);
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
          <CardLink user={user} activation={activation} userActivation={userActivations.find(act => act.name === activation.id)} />
        </div>
      ))}
    </>
  )
}