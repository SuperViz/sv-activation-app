"use client";

import React from "react";
import Image from "next/image";
import atariImg from "../../../public/atari-user.png";
import qrcode from "../../../public/qrcode_events.superviz.com.png";
import Activations from "@/components/Activations";
import UsersDashboard from "@/components/UsersDashboard";
import { activations } from "@/data/activationsData";
import { Realtime, SuperVizRoomProvider } from "@superviz/react-sdk";
import { ToastContainer } from 'react-toastify';
import { v4 as uuid } from 'uuid'
import './UserDashboard.scss'
import { useRouter } from "next/navigation";

const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;
const DASHBOARD_GROUP_ID = process.env.NEXT_PUBLIC_DASHBOARD_GROUP_ID as string;
const DASHBOARD_GROUP_NAME = process.env
  .NEXT_PUBLIC_DASHBOARD_GROUP_NAME as string;
const DASHBOARD_PARTICIPANT_ID = uuid();
const DASHBOARD_PARTICIPANT_NAME = process.env
  .NEXT_PUBLIC_DASHBOARD_PARTICIPANT_NAME as string;

const DASHBOARD_ROOM_ID = process.env.NEXT_PUBLIC_DASHBOARD_ROOM_ID as string;

export default function Dashboard() {
  const router = useRouter();

  const handleQRCodeClick = () => {
    router.push("/giveaway");
  };

  return (
    <SuperVizRoomProvider
      developerKey={DEVELOPER_KEY}
      group={{
        id: DASHBOARD_GROUP_ID,
        name: DASHBOARD_GROUP_NAME,
      }}
      participant={{
        id: DASHBOARD_PARTICIPANT_ID,
        name: DASHBOARD_PARTICIPANT_NAME,
      }}
      roomId={DASHBOARD_ROOM_ID}
    >
      <div className="flex w-full h-screen relative p-[1.25rem] tv:p-[2.5rem] tvBg">
        <div className="flex flex-col z-10 p-[2.5rem] tv:p-[5rem] shrink">
          <Image
            src="/logo-sm.svg"
            width={108}
            height={20}
            alt="Logo Superviz"
            className="tv:w-[13.5rem] object-contain"
          />
          <h1 className="font-black mt-[2rem] text-7xl tv:mt-[4rem] tv:text-[9.5rem] tv:leading-[10.5rem]">
            Ganhe um LEGO
            <span className="text-3xl tv:text-[5rem] tv:leading-[6rem] align-top">
              ®{" "}
            </span>
            do Atari
            <span className="text-3xl tv:text-[5rem] tv:leading-[6rem] align-top">
              ®
            </span>
          </h1>
          <div className="text-3xl mt-[3.125rem] tv:mt-[6.25rem] tv:text-[4rem] tv:leading-[5.5rem]">
            <p>Participe de qualquer ativação e ganhe pontos para concorrer.</p>
            <p className="font-black">
              Quanto mais ativações, mais chances de ganhar.
            </p>
          </div>
          <button onClick={handleQRCodeClick}>
            <Image src={qrcode} alt="QR Code para ativação" className="mt-[3.125rem] w-[50%] tv:mt-[6.25rem]" />
          </button>
        </div>
        <Image
          src={atariImg}
          alt="Imagem de um Lego da Fender"
          className="z-0 absolute bottom-[2.5rem] tv:bottom-[5rem] left-0 max-w-[27vw] object-contain"
        />
        <div className="user-canva flex flex-col bg-[#C9C4D114] py-10 rounded-[2rem] min-w-[100.375rem] tv:py-20 tv:rounded-[4rem] tv:min-w-[75%] grow">
          <div className="px-10 tv:px-20">
            <p className="font-black text-4xl tv:text-[5rem] tv:leading-[6rem]">
              Participantes em tempo real
            </p>
          </div>
          <div className="grow">
            <Realtime />
            <UsersDashboard />
          </div>
          <div className="flex justify-between mt-9 px-10 tv:px-20">
            <Activations activations={activations} />
            <div className="flex gap-3 items-center sv-shadow">
              <Image
                src="/sync-logo.svg"
                width={25}
                height={20}
                alt="ícone de sincronização"
                className="tv:w-[3.125rem] object-contain"
              />
              <span className="tv:text-[2.12rem] tv:leading-[2.5rem]">
                Sincronização de dados por{" "}
              </span>
              <Image
                src="/logo-md.svg"
                width={80}
                height={15}
                alt="Superviz"
                className="tv:w-[9.7rem] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={5} />
    </SuperVizRoomProvider>
  );
}
