import { Realtime, SuperVizRoomProvider } from "@superviz/react-sdk";
import UserPageContent from "@/app/userPage/UserPageContent";
import React from "react";
import { IActivationResponse, IUser, IUserActivation, IUserResponse } from "../../../types";
import { ActivationColor } from "@/data/activationsData";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from '../services/getUserData';

const DASHBOARD_ROOM_ID = process.env.NEXT_PUBLIC_DASHBOARD_ROOM_ID as string
const DASHBOARD_GROUP_ID = process.env.NEXT_PUBLIC_DASHBOARD_GROUP_ID as string
const DASHBOARD_GROUP_NAME = process.env.NEXT_PUBLIC_DASHBOARD_GROUP_NAME as string
const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;

export default function SupervizProvider({ userEmail }: { userEmail: string }) {
  const [user, setUser] = React.useState<IUser>()
  const [userActivations, setUserActivations] = React.useState<IUserActivation[]>([])
  const { data, isLoading } = useQuery({ queryKey: [userEmail], queryFn: async () => await getUserData(userEmail) })


  React.useEffect(() => {
    if (data) {
      const { id, name, email, discordUser, activations } = data
      const parsedActivations = parseUserActivation(activations)
      setUserActivations(parsedActivations)
      const parsedUser: IUser = {
        id,
        name,
        email,
        discordUser,
        activations: parsedActivations
      }
      setUser(parsedUser)
    }
  }, [data])

  const parseUserActivation = (userActivations: IActivationResponse[] = []) => {
    return userActivations.map((userActivation) => {
      const activationBase = {
        name: userActivation.name,
        completed: userActivation.completed,
        quantity: undefined,
        color: ActivationColor[userActivation.name]
      }
      if (userActivation.quantity) {
        return {
          ...activationBase,
          quantity: userActivation.quantity,
        }
      }
      return activationBase as IUserActivation
    })
  }

  if (isLoading) {
    return <></>
  }

  return user ? (
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
      <UserPageContent user={user} userActivations={userActivations} />
    </SuperVizRoomProvider>
  ) :
    (
      <></>
    )
}