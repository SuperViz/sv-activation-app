import React from "react";
import {IUser, IUserActivation} from "../../../types";
import {ActivationColor} from "@/data/activationsData";
import {ActivationType} from "@/global/global.types";
import "./user.scss"

interface IUserProps {
  user: IUser
  withActivations: boolean
}

export default function User({ user, withActivations }: IUserProps) {
  const firstLetter = user.name.at(0) ?? 'U'
  const activationsNumber = user.activations.length
  const usernameMargin = 8 - (4 - activationsNumber) * 15
  const userHasStar = activationsNumber === Object.keys(ActivationColor).length && user.activations.every(activation => activation.completed)
  
    return (
      <div className={`${user.isOnline ? '' : 'opacity-20'} flex flex-col items-center justify-center relative`} >
        {userHasStar && <p className="mb-1 tv:text-[1.75rem]">⭐️</p>}
        {withActivations ? (
          <UserWithActivations user={user}/>
        ) : (
          <UserBase letter={firstLetter.toUpperCase()} />
        )}
        <p style={{ marginTop: `calc(${usernameMargin}px + 1rem)`}} className="text-[1rem] tv:text-[2rem]">{user.name}</p>
      </div>
    )
}

function UserWithActivations({ user }: { user: IUser}) {
  const firstLetter = user.name.at(0) ?? 'U'
  const size = user.activations.length * 30 + 80
  
  return (
    <div>
      <div>
        <UserBase letter={firstLetter.toUpperCase()}/>
      </div>
      <UserActivations user={user}/>
    </div>
  )
}

function UserBase({letter}: { letter: string }) {
  return (
    <div
      className="bg-white rounded-full flex items-center justify-center h-[3rem] w-[3rem] tv:h-[4.5rem] tv:w-[4.5rem]">
      <span className="text-[#26242A] text-lg tv:text-[2.25rem] font-black">{letter}</span>
    </div>
  )
}

function UserActivations({ user }: { user: IUser}) {
  const size = user.activations.length * 30 + 80
  
  // raios dos usuários por quantidade de ativações celular || tv
  // 0 = 40 || 80
  // 1 = 55 || 110
  // 2 = 70 || 140
  // 3 = 85 || 170
  // 4 = 100 || 200
  
  return (
    <div className="flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="scale-50 tv:scale-100">
      {Object.keys(ActivationColor).map((activation) => (
        <defs key={activation}>
          <radialGradient id={`gradientRing-${ActivationColor[activation as keyof typeof ActivationColor]}`} cx="0" cy="0%" r="1" gradientUnits="userSpaceOnUse">
            <stop stopColor={`#${ActivationColor[activation as keyof typeof ActivationColor]}`} />
            <stop offset="0.13" stopColor={`#${ActivationColor[activation as keyof typeof ActivationColor]}`} />
            <stop offset="1" stopColor={`#${ActivationColor[activation as keyof typeof ActivationColor]}`} stopOpacity={0} />
          </radialGradient>
        </defs>
      ))}
      {user.activations.map((activation, index) => {
        const radius = 45 + index * 15
          return (
            <ActivationsRings key={index} activation={activation} radius={radius} username={user.name} />
          )
        })}
      </svg>
    </div>
  )
}

function ActivationsRings({username, activation, radius}: {username: string, activation: IUserActivation, radius: number}) {
  return (
    <circle key={`${username}-${activation.color}`} className={activation.completed ? '' : 'spin'} cx="100" cy="100" r={radius} fill="none"
            stroke={`${activation.completed ? `#${activation.color}` : `url(#gradientRing-${activation.color})`}`} strokeWidth="11"/>
  )
}

export function MobileUser({ user} : { user: IUser}) {
  const firstLetter = user.name.at(0) ?? 'U'
  const activationsNumber = user.activations.length
  const userHasStar = activationsNumber === Object.keys(ActivationColor).length && user.activations.every(activation => activation.completed)

  return (
    <div className={`flex flex-col items-center justify-center`} >
      {userHasStar && <p className="mb-1 tv:text-[1.75rem]">⭐️</p>}
      <div className={`relative w-[6.5rem] h-[6.5rem]`}>
        <MobileActivationsDiv userActivations={user.activations}/>
        <div
          className="baseUser">
          <span className="text-[#26242A] text-lg tv:text-[2.25rem] font-black">{firstLetter.toUpperCase()}</span>
        </div>
      </div>
      <p className="text-[1rem] mt-1.5">{user.name}</p>
    </div>
  )
}

function MobileActivationsDiv({userActivations}: { userActivations: IUserActivation[] }) {
  const ringClasses = (index: number) => {
    if(!userActivations[index]) {
      return ''
    }
    
    if(userActivations[index].name === ActivationType.GAME) {
      return `GAME GAME-${userActivations[index].quantity || 1}`
    }
    
    if(userActivations[index].completed) {
      return `${userActivations[index].name} completed`
    }

    return `${userActivations[index].name} incomplete`
  }
  
  return (
    <>
      <div className={`firstRing ${ringClasses(0)}`}></div>
      <div className={`secondRing ${ringClasses(1)}`}></div>
      <div className={`thirdRing ${ringClasses(2)}`}></div>
      <div className={`fourthRing ${ringClasses(3)}`}></div>
    </>
  )
}