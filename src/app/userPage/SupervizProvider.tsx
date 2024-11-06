import { SuperVizRoomProvider } from "@superviz/react-sdk";
import UserPageContent from "@/components/ActivationsPages/UserPageContent";
import React, { useState } from "react";
import { IActivationResponse, IUser, IUserActivation } from "../../../types";
import { ActivationColor } from "@/data/activationsData";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../services/getUserData";
import { ActivationTypePage } from "@/global/global.types";
import DiscordActivation from "@/components/ActivationsPages/DiscordActivation";
import GitHubActivation from "@/components/ActivationsPages/GitHubActivation";
import GameOnboarding from "@/components/ActivationsPages/GameActivationOnboardLayout";
import GameActivationPlayLayout from "@/components/ActivationsPages/GameActivationPlayLayout";

const DASHBOARD_ROOM_ID = process.env.NEXT_PUBLIC_DASHBOARD_ROOM_ID as string;
const DASHBOARD_GROUP_ID = process.env.NEXT_PUBLIC_DASHBOARD_GROUP_ID as string;
const DASHBOARD_GROUP_NAME = process.env
  .NEXT_PUBLIC_DASHBOARD_GROUP_NAME as string;
const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;

export default function SupervizProvider({ userEmail }: { userEmail: string }) {
  const [user, setUser] = React.useState<IUser>();
  const { data, isLoading } = useQuery({
    queryKey: [userEmail],
    queryFn: async () => await getUserData(userEmail),
  });
  const [page, setPage] = useState<ActivationTypePage>(
    ActivationTypePage.LINKS
  );

  React.useEffect(() => {
    if (data) {
      const { id, name, email, discordUser, activations } = data;
      const parsedActivations = parseUserActivation(activations);
      const parsedUser: IUser = {
        id,
        name,
        email,
        discordUser,
        activations: parsedActivations,
        isOnline: true,
      };
      setUser(parsedUser);
    }
  }, [data]);

  const parseUserActivation = (userActivations: IActivationResponse[] = []) => {
    return userActivations.map((userActivation) => {
      const activationBase: IUserActivation = {
        name: userActivation.name,
        completed: userActivation.completed,
        quantity: undefined,
        color: ActivationColor[userActivation.name],
      };
      if (userActivation.quantity) {
        return {
          ...activationBase,
          quantity: userActivation.quantity,
        };
      }
      return activationBase;
    });
  };

  if (isLoading) {
    return <></>;
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
      {page === ActivationTypePage.LINKS && (
        <UserPageContent setUser={setUser} user={user} setPage={setPage} />
      )}
      {page === ActivationTypePage.DISCORD && (
        <DiscordActivation setPage={setPage} />
      )}
      {page === ActivationTypePage.GITHUB && (
        <GitHubActivation setPage={setPage} />
      )}
      {page === ActivationTypePage.GAME_ONBOARDING && (
        <GameOnboarding setPage={setPage} />
      )}
      {page === ActivationTypePage.GAME_PLAY && (
        <GameActivationPlayLayout setPage={setPage} />
      )}
    </SuperVizRoomProvider>
  ) : (
    <></>
  );
}
