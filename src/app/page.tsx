'use client';

import React from 'react';
import Image from "next/image";
import fenderImg from '../../public/fender-lego.png'
import Button from "@/components/Button";

export default function App() {

  return (
    <div className='flex flex-col w-full h-screen px-8 py-6'>
      <div className="relative flex flex-col justify-between z-10 h-full">
        <div className="flex flex-col items-center">
          <Image src="./logo-sm.svg" width={109} height={80} alt="Logo Superviz"/>
          <h1 className="mt-6 text-[64px]/[70px] font-black text-center">
            Ganhe um LEGO<span className="text-3xl align-top">® </span>
            da Fender<span className="text-3xl align-top">®</span>
          </h1>
        </div>
        <Button text="Participar" linkTo="/activations/enter" type="link"/>
          
      </div>
      <Image src={fenderImg} alt="Imagem de um Lego da Fender"  className="z-0 absolute top-28 left-0" />
    </div>
  );
};
