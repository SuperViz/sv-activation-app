import React from "react";
import { IUser, IUserActivation } from "../../../types";
import { ActivationColor } from "@/data/activationsData";
import { ActivationType } from "@/global/global.types";
import "./user.scss"

export function TVUser({ user }: { user: IUser }) {
  const firstLetter = user.name.at(0) ?? 'U'
  const activationsNumber = user.activations.length
  const userHasStar = activationsNumber === Object.keys(ActivationColor).length && user.activations.every(activation => activation.completed)

  return (
    <div className={`flex flex-col items-center justify-center ${user.isOnline ? 'opacity-100' : 'opacity-20'}`} >
      {userHasStar && <p className="mb-1 tv:text-[1.75rem]">⭐️</p>}
      <div className={`relative w-[11.5rem] h-[11.5rem]`}>
        <TVActivations userActivations={user.activations} />
        <div
          className="baseUser">
          <span className="text-[#26242A] text-lg tv:text-[2.25rem] font-black">{firstLetter.toUpperCase()}</span>
        </div>
      </div>
      <p className="text-[1rem] tv:text-[2rem] mt-1.5 max-w-[12.125rem] break-words text-center">{user.name}</p>
    </div>
  )
}

function TVActivations({ userActivations }: { userActivations: IUserActivation[] }) {
  const ringClasses = (index: number) => {
    if (!userActivations[index]) {
      return ''
    }

    if (userActivations[index].name === ActivationType.GAME) {
      return `GAME GAME-${userActivations[index].quantity || 0}`
    }

    if (userActivations[index].completed) {
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

export function MobileUser({ user }: { user: IUser }) {
  const firstLetter = user.name.at(0) ?? 'U'
  const activationsNumber = user.activations.length
  const userHasStar = activationsNumber === Object.keys(ActivationColor).length && user.activations.every(activation => activation.completed)

  return (
    <div className={`flex flex-col items-center justify-center`} >
      {userHasStar && <p className="mb-1 tv:text-[1.75rem]">⭐️</p>}
      <div className={`relative w-[6.5rem] h-[6.5rem]`}>
        <MobileActivations userActivations={user.activations} />
        <div
          className="baseUser">
          <span className="text-[#26242A] text-lg tv:text-[2.25rem] font-black">{firstLetter.toUpperCase()}</span>
        </div>
      </div>
      <p className="text-[1rem] mt-1.5 max-w-[6.5rem] break-words text-center">{user.name}</p>
    </div>
  )
}

function MobileActivations({ userActivations }: { userActivations: IUserActivation[] }) {
  const ringClasses = (index: number) => {
    if (!userActivations[index]) {
      return ''
    }

    if (userActivations[index].name === ActivationType.GAME) {
      return `GAME GAME-${userActivations[index].quantity || 0}`
    }

    if (userActivations[index].completed) {
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