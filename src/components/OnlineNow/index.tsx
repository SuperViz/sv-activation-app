import React from "react";
import User from "@/components/User";
import {IUser} from "../../../types";           

interface IOnlineNowProps {
  users: IUser[]
}

export default function OnlineNow({ users }: IOnlineNowProps) {
  let firstUsers: IUser[]
  const hasMoreThanTenUsersOnline = users.length > 10
  
  if (hasMoreThanTenUsersOnline) {
    firstUsers = users.slice(0,9)
  } else {
    firstUsers = users
  }
  
  function OtherUsers() {
    return (
      <div
        className="ml-3 bg-white/40 h-9 w-9 tv:h-[4.5rem] tv:w-[4.5rem] rounded-full text-white text-lg font-black flex items-center justify-center">
        <span className="bg-white h-1 w-1 rounded-full"></span>
        <span className="ml-1 bg-white h-1 w-1 rounded-full"></span>
        <span className="ml-1 bg-white h-1 w-1 rounded-full"></span>
      </div>
    )
  }

  return (
    <>
      {firstUsers.map(user => (
        <span className="ml-3" key={user.name}>
          <User user={user} withActivations={false} withUsername={false}/>
        </span>
      ))}
      {hasMoreThanTenUsersOnline ? (
        <OtherUsers />
      ) : (
        <></>
      )}
    </>
  )

}