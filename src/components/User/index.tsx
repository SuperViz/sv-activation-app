import React from "react";
import {IUser, IUserActivation} from "../../../types";
import {ActivationEnum} from "@/data/activationsData";

interface IUserProps {
  user: IUser
  withActivations: boolean
  withUsername: boolean
  withStar?: boolean
}

export default function User({ user, withActivations, withUsername, withStar = false }: IUserProps) {
  const firstLetter = user.name.at(0) ?? 'U'
  const activationsNumber = user.activations.length
  const usernameMargin = 8 - (4 - activationsNumber) * 7
  const userHasStar = activationsNumber === Object.keys(ActivationEnum).length && user.activations.every(activation => activation.isCompleted)
  
  if (!withActivations) {
    return (
      <div className={user.isOnline ? '' : 'opacity-20'} >
        {userHasStar && withStar && <p className="mb-1">⭐️</p>}
        <UserBase letter={firstLetter.toUpperCase()} />
        {withUsername && <p className="mt-2">{user.name}</p>}
      </div>
    )
  }

  return (
    <div className={`${user.isOnline ? '' : 'opacity-20'} flex flex-col items-center justify-center`}>
      {userHasStar && withStar && <p className="mb-1">⭐️</p>}
      <div className="relative h-24 w-24">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <UserBase letter={firstLetter.toUpperCase()}/>
        </div>
        <UserActivations user={user} /> 
      </div>
      {withUsername && <p style={{ marginTop: `${usernameMargin}px`}}>{user.name}</p>}
    </div>
  )
}

function UserBase({letter}: { letter: string }) {
  return (
    <div
      className="bg-white h-8 w-8 rounded-full flex items-center justify-center">
      <span className="text-[#26242A] text-lg font-black">{letter}</span>
    </div>
  )
}

function UserActivations({ user }: { user: IUser}) {
  return (
    <div className="flex items-center justify-center">
      <svg viewBox={`0 0 90 90`}>
      {Object.keys(ActivationEnum).map((activation) => (
        <defs key={activation}>
          <linearGradient id={`gradientRing-${ActivationEnum[activation as keyof typeof ActivationEnum]}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="30%" style={{stopColor: `#${ActivationEnum[activation as keyof typeof ActivationEnum]}`, stopOpacity: 1}}/>
            <stop offset="90%" style={{stopColor: 'transparent', stopOpacity: 1}}/>
          </linearGradient>
        </defs>
      ))}
      {user.activations.map((activation, index) => {
        const radius = 21 + index * 7
          return (
            <ActivationsRings activation={activation} radius={radius} username={user.name} />
          )
        })}
      </svg>
    </div>
  )
}

function ActivationsRings({username, activation, radius}: {username: string, activation: IUserActivation, radius: number}) {
  return (
    <circle key={`${username}-${activation.color}`} className={activation.isCompleted ? '' : 'spin'} cx="45" cy="45" r={radius} fill="none"
            stroke={`${activation.isCompleted ? `#${activation.color}` : `url(#gradientRing-${activation.color})`}`} strokeWidth="5"/>
  )
}