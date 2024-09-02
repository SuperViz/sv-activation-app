'use client'

import { MobileUser } from "@/components/User";
import { ActivationColor, activations } from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import React, { useCallback } from "react";
import { useRealtime, useRealtimeParticipant } from "@superviz/react-sdk";
import { IUser, IUserActivation } from "../../../types";
import { ActivationType, ActivationTypePage } from '@/global/global.types';
import Link from "next/link";
import Image from "next/image";

export default function UserPageContent({ user, setUser, setPage }: { user: IUser, setUser: any, setPage: (page: ActivationTypePage) => void }) {
  const { subscribe } = useRealtime('default');
  const { update, isReady } = useRealtimeParticipant('default')
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

  React.useEffect(() => {
    update(user)
  }, [user, isReady])

  return (
    <div className='flex flex-col w-full h-screen mobileBg'>
      <div className="relative flex h-full overflow-auto overflow-x-hidden px-8 py-6 flex-col items-center z-10">
        <Link href={'https://superviz.com/codecon-summit'}>
          <Image src="/logo-sm.svg" width={109} height={80} alt="Logo Superviz" />
        </Link>
        <div>
          <div className="my-5 pb-5 w-screen border-b border-[#ffffff1a]">
            <MobileUser user={user} />
          </div>
          <p className="w-full text-center font-normal text-lg">Escolha uma ativação para participar</p>
          <div className='w-full p-5'>
            {activations.map(activation => (
              <div key={activation.color} className="w-full">
                <CardLink 
                  setPage={setPage}
                  user={user} 
                  activation={activation} 
                  userActivation={user.activations.find(act => act.name === activation.id)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}