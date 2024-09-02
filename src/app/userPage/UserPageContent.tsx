'use client'

import { MobileUser } from "@/components/User";
import { ActivationColor, activations } from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import React, { useCallback } from "react";
import { useRealtime } from "@superviz/react-sdk";
import { IUser, IUserActivation } from "../../../types";
import { ActivationType } from '@/global/global.types';

export default function UserPageContent({ user, setUser }: { user: IUser, setUser: any }) {
  const { subscribe } = useRealtime('default');
  function completeActivation(activationName: ActivationType, completed: boolean) {
    let copyUser = { ...user };

    if (!completed && !copyUser.activations.some(activation => activation.name === activationName)) {
      const activation: IUserActivation = {
        name: activationName,
        completed: completed,
        color: ActivationColor[activationName]
      }
      copyUser.activations.push(activation);
    } else {
      const activation = copyUser.activations.find(activation => activation.name === activationName);
      if (activation)
        activation.completed = true;
    }

    setUser(copyUser);
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

  const handleGameUpdate = useCallback((message: any) => {
    console.log('message', message);
    const userId = message.data.userId;
    const points = message.data.points;

    if (user.id === userId) {
      user.activations.forEach(activation => {
        if (activation.name === ActivationType.GAME) {
          activation.quantity = points;
        }
      })
    }
  }, []);

  React.useEffect(() => {
    subscribe("activation.start", handleActivationStart);
    subscribe("activation.game.update", handleGameUpdate);
    subscribe("activation.complete", handleActivationClick);
  }, []);

  return (
    <div>
      <div className="my-5 pb-5 w-screen border-b border-[#ffffff1a]">
        <MobileUser user={user} />
      </div>
      <p className="w-full text-center font-normal text-lg">Escolha uma ativação para participar</p>
      <div className='w-full p-5'>
        {activations.map(activation => (
          <div key={activation.color} className="w-full">
            <CardLink user={user} activation={activation} userActivation={user.activations.find(act => act.name === activation.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}