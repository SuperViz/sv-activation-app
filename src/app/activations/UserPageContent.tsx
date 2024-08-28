import User from "@/components/User";
import {activations, users} from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import React from "react";
import {useRealtime} from "@superviz/react-sdk";
import {IUser} from "../../../types";

export default function UserPageContent({ user }: { user: IUser}) {
  const { subscribe } = useRealtime('default');

  React.useEffect(() => {
    subscribe("activation", (e) => console.log('evento!', e));
  }, []);
  
  return (
    <>
      <div className="my-5 pb-5 w-screen border-b border-[#ffffff1a]">
        <User user={user} withActivations={true} withUsername={true} withStar={false} />
      </div>
      <p className="w-full text-center font-normal text-lg">Escolha uma ativação para participar</p>
      {activations.map(activation => (
        <div key={activation.color} className="w-full">
          <CardLink activation={activation} />
        </div>
      ))}
    </>
  )
}