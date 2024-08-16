import React from "react";
import {IUser} from "@/app/page";           

interface IOnlineNowProps {
  users: IUser[]
}

export default function OnlineNow({ users }: IOnlineNowProps) {
  let firstUsers: IUser[]
  const usersLetters: string[] = []
  const hasMoreThanTenUsersOnline = users.length > 10
  
  if (hasMoreThanTenUsersOnline) {
    firstUsers = users.slice(0,9)
  } else {
    firstUsers = users
  }
  
  for (const user of firstUsers) {
    const firstLetter = user.name.at(0) ?? 'U'
    usersLetters.push(firstLetter.toUpperCase())
  }
  
  const otherUsers = (
    <div
      className="ml-3 bg-white/40 h-9 w-9 rounded-full text-white text-lg font-black flex items-center justify-center">
      <span className="bg-white h-1 w-1 rounded-full"></span>
      <span className="ml-1 bg-white h-1 w-1 rounded-full"></span>
      <span className="ml-1 bg-white h-1 w-1 rounded-full"></span>
    </div>
  )

  const userCircle = (letter: string) => (
    <div
      className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center">
      <span>{letter}</span>
    </div>
  )

  return (
    <>
      {usersLetters.map(user => userCircle(user))}
      {hasMoreThanTenUsersOnline ? (
        <>
          {otherUsers}
        </>
      ) : (
        <></>
      )}
    </>
  )

}