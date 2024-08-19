import React from "react";
import {IActivation} from "../../../types";

interface IActivationsProps {
  activations: IActivation[]
}

export default function Activations({ activations }: IActivationsProps) {
  return (
    <div className="col-start-1 col-span-4 p-8 bg-[#7e7a88]/10 rounded-2xl h-fit">
      <p className="text-xl">Ativações</p>
      {activations.map((act) => (
        <Activation key={act.color} activation={act} />
      ))}
    </div>
  )
}

function Activation({activation}: { activation: IActivation }) {
  return (
    <div className="mt-6 flex align-center" key={activation.activationWord}>
      <Circle color={activation.color} />
      <span className="text-2xl font-black">
        {`${activation.description} `}
        <ActivationWord text={activation.activationWord} color={activation.color}/>
        {activation.subtext && <ActivationSubtext subtext={activation.subtext} color={activation.color} /> }
        </span>
    </div>
  )
}

function Circle({ color }: { color: string}) {
  return (
    <span className="mr-3 activations">
      <div className="pinpoint">
        <div className="content"></div>
        <div className="pinpoint-ring">
          <svg viewBox="0 0 36 36">
            <circle className="circle" r="16" cx="18" cy="18" fill="#ffffff1a" stroke={`#${color}`}></circle>
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
      <span className="text-lg">{subtext.description}
        <ActivationWord text={subtext.activationWord} color={color} />
      </span>
    </>
  )
}


function ActivationWord({text, color}: { text: string, color: string }) {
  return (
    <span className={`text-[#${color}]`}>{text}</span>
  )
}

