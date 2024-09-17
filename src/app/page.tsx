'use client';

import React from 'react';
import Image from "next/image";
import atariImg from '../../public/atari-user.png'
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

export default function App() {
  const router = useRouter()

  const handleParticipate = () => {
    const userData = localStorage.getItem(USERDATA_KEY)
    if (userData !== null) {
      router.push('/userPage')
    } else {
      router.push('/enter')
    }
  }

  return (
    <div className='flex flex-col w-full h-dvh px-8 py-6'>
      <div className="relative flex flex-col justify-between z-10 h-full">
        <div className="flex flex-col items-center">
          <Image src="./logo-sm.svg" width={109} height={80} alt="Logo Superviz" />
          <h1 className="title-lego mt-6 text-[64px]/[70px] font-black text-center">
            Ganhe um LEGO<span className="text-3xl align-top">® </span>
            da Atari<span className="text-3xl align-top">®</span>
          </h1>
        </div>
        <Button text="Participar" onClick={handleParticipate} type="button" />

      </div>
      <Image src={atariImg} alt="Imagem de um Lego do Atari" className="atari" />
    </div>
  );
};
