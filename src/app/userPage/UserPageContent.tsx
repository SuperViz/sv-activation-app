'use client'

import User from "@/components/User";
import { ActivationColor, activations } from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import React from "react";
import { useRealtime } from "@superviz/react-sdk";
import { IUser, IUserActivation } from "../../../types";
import { ActivationType } from '@/global/global.types';

export default function UserPageContent({ user }: { user: IUser }) {
  const { subscribe } = useRealtime('default');


  function completeActivation(activationName: ActivationType, completed: boolean) {
    if (!completed) {
      console.log('ativação iniciada', activationName, completed, user);
      const activation: IUserActivation = {
        name: activationName,
        completed: completed,
        color: ActivationColor[activationName]
      }
      user.activations.push(activation);
    } else {
      console.log('ativação completa', activationName, completed, user);
      const activation = user.activations.find(activation => activation.name === activationName);
      if (activation) {
        activation.completed = true;
        //TODO: tirar o link quando a ativação estiver "completed"
      }
    }
  }

  function handleActivationStart(message: any) {
    const userId = message.data.userId;
    const activation = message.data.activation;

    if (user.id === userId) {
      completeActivation(activation, false);
    }
  }

  function handleActivationClick(message: any) {
    const userId = message.data.userId;
    const completedActivation = message.data.activation;
    if (user.id === userId) {
      completeActivation(completedActivation, false);
    }
  }

  function handleGameUpdate(message: any) {
    const userId = message.data.userId;
    const points = message.data.points;
    console.log('Atualizou os pontos do usuário', userId, points);

    if (user.id === userId) {
      user.activations.forEach(activation => {
        if (activation.name === ActivationType.GAME) {
          activation.quantity = points;
        }
      })
    }
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
          <CardLink user={user} activation={activation} userActivation={user.activations.find(act => act.name === activation.id)} />
        </div>
      ))}
    </>
  )
}