import Image from "next/image";
import * as React from "react";
import ActivationCall from "@/app/activations/ActivationCall";

export default function ActivationLayout({
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div className={`flex flex-col w-screen h-screen mobileBg`}>
      <a className='flex items-center w-full px-7 py-5 bg-[#C9C4D11A]' href={`/userPage`}>
        <Image src="/arrow_to_left.svg" alt="voltar" width={18} height={0}/>
        <p className='ml-2 font-bold text-xs text-white'>voltar</p>
      </a>
      <div className='flex flex-col w-full flex-grow px-4 py-4'>
        <ActivationCall />
        {children}
      </div>
    </div>
  )
}