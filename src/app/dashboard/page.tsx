'use client';

import React from 'react';
import Image from "next/image";
import fenderImg from '../../../public/fender-lego-tv.png'
import qrcode from '../../../public/qrcode_events.superviz.com.png'
import Activations from "@/components/Activations";
import OnlineNow from "@/components/OnlineNow";
import UsersDashboard from "@/components/UsersDashboard";
import {activations, users} from "@/data/activationsData";

export default function Dashboard() {


  return (
    <div className='grid grid-cols-12 gap-14 w-full h-screen px-12 py-10 tv:px-[9.625rem] tv:py-[5.625rem]'>
      <div className="col-start-1 col-span-4 flex flex-col justify-between z-10">
        <div>
          <Image src="/logo-sm.svg" width={109} height={80} alt="Logo Superviz" className="tv:w-[13.5rem] object-contain"/>
          <h1 className="mt-6 text-7xl font-black tv:text-[9.5rem] tv:leading-[10.5rem]">
            Ganhe um LEGO<span className="text-3xl tv:text-[5rem] align-top">® </span>
            da Fender<span className="text-3xl tv:text-[5rem] align-top">®</span>
          </h1>
        </div>
        <div className="text-3xl tv:text-[4rem] tv:leading-[5.5rem] mb-10">
          <p>Participe de qualquer ativação e ganhe pontos para concorrer.</p>
          <p className="font-black">Quanto mais ativações, mais chances de ganhar.</p>
          <p className="mt-5">🕹️ Boa sorte!</p>
        </div>
      </div>
      <Image src={fenderImg} alt="Imagem de um Lego da Fender"  className="z-0 absolute top-0 left-0 max-w-[27vw] object-contain" />
      <div className="col-start-5 col-span-12 bg-[#C9C4D114] rounded-[40px] p-10 flex flex-col tv:px-[4rem] tv:py-[5.375rem]">
        <div className="flex justify-between">
          <div>
            <p className="font-black text-4xl tv:text-[5rem] tv:leading-[8.10rem]">Veja quem já garantiu pontos e está concorrendo</p>
            <p className="text-2xl mt-1.5 tv:text-[3rem] tv:leading-[4.05rem]">Aponte a câmera para o QR code pra participar</p>
          </div>
          <div>
            <Image src={qrcode} width={107} height={107} alt="QR Code para ativação"/>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-9 mt-9 grow">
          <div className="col-start-1 col-span-4">
            <Activations activations={activations} />
          </div>
          <div className="col-start-5 col-span-12">
            <UsersDashboard users={users} />
          </div>
        </div>
        <div className="flex justify-between mt-9">
          <div className="flex items-center tv:text-[2.12rem] tv:leading-[2.5rem]">
            <span className="tv:text-[2.12rem] tv:leading-[2.5rem]">Online agora:</span>
            <OnlineNow users={users.filter(user => user.isOnline)} />
          </div>
          <div className="flex gap-3 items-center">
            <Image src="/sync-logo.svg" width={25} height={20} alt="ícone de sincronização" className="tv:w-[3.125rem] object-contain"/>
            <span className="tv:text-[2.12rem] tv:leading-[2.5rem]">Sincronização de dados por </span>
            <Image src="/logo-md.svg" width={80} height={15} alt="Superviz" className="tv:w-[9.7rem] object-contain"/>
          </div>
        </div>
      </div>
    </div>
  );
};
