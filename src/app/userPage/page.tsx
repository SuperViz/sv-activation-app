'use client'

import React from "react";
import { Realtime, SuperVizRoomProvider } from "@superviz/react-sdk";
import UserPageContent from "@/app/userPage/UserPageContent";
import { IUser } from "../../../types";
import { useRouter } from "next/navigation";
import { users } from '@/data/activationsData';

const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;
const DASHBOARD_ROOM_ID = process.env.NEXT_PUBLIC_DASHBOARD_ROOM_ID as string
const DASHBOARD_GROUP_ID = process.env.NEXT_PUBLIC_DASHBOARD_GROUP_ID as string
const DASHBOARD_GROUP_NAME = process.env.NEXT_PUBLIC_DASHBOARD_GROUP_NAME as string

export default function Activations() {
  const [user, setUser] = React.useState<IUser>()
  const router = useRouter()

  React.useEffect(() => {
    if (window) {
      const userData = users[0]
      // const userData = localStorage.getItem(USERDATA_KEY)

      if (userData == null) {
        router.push('/activations/enter')
      } else {
        setUser(userData)
        // setUser(JSON.parse(userData))
      }
    }
  }, [])


  return user !== undefined ? (
    <SuperVizRoomProvider
      developerKey={DEVELOPER_KEY}
      group={{
        id: DASHBOARD_GROUP_ID,
        name: DASHBOARD_GROUP_NAME,
      }}
      participant={{
        id: user.id,
        name: user.name,
      }}
      roomId={DASHBOARD_ROOM_ID}
    >
      <Realtime />
      <UserPageContent user={user} />
    </SuperVizRoomProvider>
  ) :
    (
      <></>
    )

}