'use client';

import React from 'react';
import Image from "next/image";
import fenderImg from '../../../public/fender-lego.png'
import qrcode from '../../../public/blob-para-qrcode.png'
import Activations from "@/components/Activations";
import OnlineNow from "@/components/OnlineNow";
import UsersDashboard from "@/components/UsersDashboard";
import {activations, users} from "@/data/activationsData";

export default function Dashboard() {


  return (
    <div className='grid grid-cols-12 gap-14 w-full h-screen px-12 py-10'>
      <div className="col-start-1 col-span-4 relative flex flex-col justify-between z-10">
        <div>
          <Image src="/logo-sm.svg" width={109} height={80} alt="Logo Superviz"/>
          <h1 className="mt-6 text-7xl font-black">
            Ganhe um LEGO<span className="text-3xl align-top">® </span>
            da Fender<span className="text-3xl align-top">®</span>
          </h1>
        </div>
        <div className="text-3xl mr-16 mb-10">
          <p>Participe de qualquer ativação e ganhe pontos para concorrer.</p>
          <p className="font-black">Quanto mais ativações, mais chances de ganhar.</p>
          <p className="mt-5">🕹️ Boa sorte!</p>
        </div>
      </div>
      <Image src={fenderImg} alt="Imagem de um Lego da Fender"  className="z-0 absolute top-0 left-0" />
      <div className="col-start-5 col-span-12 bg-[#C9C4D114] rounded-[40px] p-10 flex flex-col">
        <div className="flex justify-between">
          <div>
            <p className="font-black text-4xl">Veja quem já garantiu pontos e está concorrendo</p>
            <p className="text-2xl mt-1.5">Aponte a câmera para o QR code pra participar</p>
          </div>
          <div>
            <Image src={qrcode} width={107} height={107} alt="QR Code para ativação"/>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-9 mt-9 grow">
          <Activations activations={activations} />
          <UsersDashboard users={users} />
        </div>
        <div className="flex justify-between mt-9">
          <div className="flex items-center">
            <span>Online agora:</span>
            <OnlineNow users={users.filter(user => user.isOnline)} />
          </div>
          <div className="flex gap-3 items-center">
            <Image src="/sync-logo.svg" width={25} height={20} alt="ícone de sincronização"/>
            <span>Sincronização de dados por </span>
            <Image src="/logo-md.svg" width={80} height={15} alt="Superviz"/>
          </div>
        </div>
      </div>
    </div>
  );
};
