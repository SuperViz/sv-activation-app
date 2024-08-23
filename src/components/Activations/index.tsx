import React from "react";
import {IActivation} from "../../../types";

interface IActivationsProps {
  activations: IActivation[]
}

export default function Activations({ activations }: IActivationsProps) {
  function Activation({activation}: { activation: IActivation }) {
    return (
      <div className="mt-6 tv:mt-[3.125rem] flex items-center" key={activation.activationWord}>
        <Circle color={activation.color} />
        <span className="text-2xl tv:text-[3rem] tv:leading-[4rem] font-black">
        {`${activation.description} `}
          <ActivationWord text={activation.activationWord} color={activation.color}/>
          {activation.subtext && <ActivationSubtext subtext={activation.subtext} color={activation.color} /> }
        </span>
      </div>
    )
  }

  function Circle({ color }: { color: string}) {
    return (
      <span className="mr-3 tv:mr-[1.625rem] activations">
      <div className="pinpoint">
        <div className="content"></div>
        <div className="pinpoint-ring">
          <svg viewBox="0 0 78 78">
            <circle className="circle" r="33" cx="39" cy="39" fill="#ffffff1a" stroke={`#${color}`}></circle>
          </svg>
        </div>
      </div>
    </span>
    )
  }

  function ActivationSubtext({subtext, color} : { subtext: Required<IActivation>['subtext'], color: string }) {
    return (
      <>
        <br/>
        <span className="text-lg tv:text-[2.25rem] tv:leading-[2.65rem]">{`${subtext.description} `}
          <ActivationWord text={subtext.activationWord} color={color} />
      </span>
      </>
    )
  }
  
  function ActivationWord({text, color}: { text: string, color: string }) {
    return (
      <span style={{color: `#${color}`}}>{text}</span>
    )
  }
  
  return (
    <div className="p-8 bg-[#7e7a88]/10 rounded-2xl h-fit tv:p-[4rem]">
      <p className="text-xl tv:text-[2.75rem] tv:leading-[3.2rem]">Ativações</p>
      {activations.map((act) => (
        <Activation key={act.color} activation={act} />
      ))}
    </div>
  )
}





