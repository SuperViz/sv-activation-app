import * as React from "react";
import Image from "next/image";
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default function ActivationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col w-full h-screen mobileBg'>
      <div className="relative flex h-full overflow-auto overflow-x-hidden px-8 py-6 flex-col items-center z-10">
        <Link href={'https://superviz.com/codecon-summit'}>
          <Image src="/logo-sm.svg" width={109} height={80} alt="Logo Superviz" />
        </Link>
        {children}
      </div>
    </div>
  )
}