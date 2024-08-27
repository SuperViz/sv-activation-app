import React from "react";
import {IActivation} from "../../../types";

interface IActivationsProps {
  activations: IActivation[]
}

export default function Activations({ activations }: IActivationsProps) {
  function Activation({activation}: { activation: IActivation }) {
    return (
      <div className="flex items-center ml-[2rem] tv:ml-[4rem]">
        <Circle color={activation.color} />
        <span className="text-2xl tv:text-[3rem] tv:leading-[4rem] font-black">
        {activation.activationWord}
        </span>
      </div>
    )
  }

  function Circle({ color }: { color: string}) {
    return (
    <span className="mr-[1rem] tv:mr-[1.875rem]">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="w-[1.875rem] h-[1.875rem] tv:w-[3.75rem] tv:h-[3.75rem]">
        <circle cx="30" cy="30" r="25" stroke={`#${color}`} strokeWidth="10"/>
      </svg>
    </span>
    )
  }
  
  return (
    <div className="bg-[#7e7a88]/10 flex items-center px-[2.25rem] py-[1rem] rounded-2xl tv:px-[4.5rem] tv:py-[1.875rem] tv:rounded-[2rem]">
      <p className="text-xl tv:text-[2.75rem] tv:leading-[3.2rem]">Ativações</p>
        {activations.map((act) => (
          <Activation key={act.color} activation={act} />
        ))}
    </div>
  )
}





