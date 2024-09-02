import Image from "next/image";
import * as React from "react";
import ActivationCall from "@/app/activations/ActivationCall";
import Link from 'next/link';
import { ActivationTypePage } from "@/global/global.types";

export default function ActivationLayout({
  children,
  setPage,
}: Readonly<{
  children: React.ReactNode;
  setPage: (page: ActivationTypePage) => void
}>) {
  return (
    <div className={`flex flex-col w-screen h-screen mobileBg`}>
      <button 
        className='flex items-center w-full px-7 py-5 bg-[#C9C4D11A]' 
        onClick={() => {
          setPage(ActivationTypePage.LINKS)
        }}
      >
        <Image src="/arrow_to_left.svg" alt="voltar" width={18} height={0} />
        <p className='ml-2 font-bold text-xs text-white'>voltar</p>
        <Link className='ml-auto' href={'https://superviz.com/codecon-summit'}>
          <Image src="/logo-sm.svg" width={109} height={80} alt="Logo Superviz" />
        </Link>
      </button>
      <div className='flex flex-col w-full flex-grow px-4 py-4'>
        {children}
      </div>
    </div>
  )
}