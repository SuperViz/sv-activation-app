'use client'

import {usePathname} from "next/navigation";
import {activations} from "@/data/activationsData";

export default function ActivationCall() {
  const pathname = usePathname()
  const activation = activations.find(act => {
    const activePath = pathname.split(/\/activations\//)[1]
    return act.id === activePath.toUpperCase()
  })
  
  
  return (
    activation ? (
      <div
        className="mb-6 w-full flex flex-col justify-center items-center">
        <p className="text-white text-2xl font-bold">{activation.description}</p>
        <p className="text-2xl font-bold" style={{color: `#${activation.color}`}}>{activation.activationWord}</p>
        {activation.subtext && (
          <p className="mt-1 text-white text-base font-bold">{`${activation.subtext.description} `}
            <span className="text-base font-bold" style={{color: `#${activation.color}`}}>{activation.subtext.activationWord}</span></p>
        )}
      </div>
    ) : (
      <></>
    )
  )
}