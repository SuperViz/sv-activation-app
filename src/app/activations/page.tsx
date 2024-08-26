'use client'

import React from "react";
import {Realtime, SuperVizRoomProvider} from "@superviz/react-sdk";
import UserPageContent from "@/app/activations/UserPageContent";
import {IUser} from "../../../types";

const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;
const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

export default function Activations() {
  const [ user, setUser ] = React.useState<IUser>()
  
  React.useEffect(() => {
    if(window) {
      const userData = localStorage.getItem(USERDATA_KEY) as string
      //TODO: caso não tenha um usuário salvo, direcionar para a página de formulário
      
      setUser(JSON.parse(userData))
    }
  }, [])
  
  
  return user !== undefined ? (
    <SuperVizRoomProvider
      developerKey={DEVELOPER_KEY}
      group={{
        id: "dashboardGroup",
        name: "Dashboard",
      }}
      participant={{
        id: user.id,
        name: user.name,
      }}
      roomId="superviz_dashboard"
    >
      <Realtime />
      <UserPageContent user={user} />
    </SuperVizRoomProvider>
  ) : 
  (
    <></>
  )
    
}