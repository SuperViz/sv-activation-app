import * as React from "react";
import Image from "next/image";

export const dynamic = "force-dynamic";;

export default function ActivationsLayout({
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col w-full h-screen px-8 py-6 mobileBg'>
      <div className="relative flex flex-col justify-between items-center z-10 h-full">
        <Image src="/logo-sm.svg" width={109} height={80} alt="Logo Superviz"/>
        {children}
      </div>
    </div>
  )
}