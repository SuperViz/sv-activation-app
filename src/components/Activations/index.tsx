import React from "react";

interface IActivation {
  description: string
  activationWord: string
  color: string
  subtext?: {
    description: string
    activationWord: string
  }
}

export default function Activations() {
  const activations: IActivation[] = [
    {
      description: 'Experimente nosso',
      activationWord: 'Jogo',
      color: '957AFF'
    },
    {
      description: 'Junte-se ao nosso',
      activationWord: 'Discord',
      color: '0077FF'
    },
    {
      description: 'Cadastre na nossa',
      activationWord: 'Newsletter',
      color: 'DB6583'
    },
    {
      description: 'Inscreva-se no',
      activationWord: 'Hackathon',
      color: '56E29E',
      subtext: {
        description: 'E concorra a',
        activationWord: '$5.000',
      }
    },
  ]
  
  const circle = (color: string) => {
    return (
      <span className="mr-3 activations">
        <div className="pinpoint">
          <div className="content"></div>
          <div className="pinpoint-ring">
            <svg viewBox="0 0 36 36">
              <circle className="circle" r="16" cx="18" cy="18" fill="transparent" stroke={`#${color}`}></circle>
            </svg>
          </div>
        </div>
      </span>
    )
  }
  
  const activation = (activation: IActivation) => {
    return (
      <>
        {circle(activation.color)}
        <span className="text-2xl font-black">
          {`${activation.description} `} 
          <span className={`text-[#${activation.color}]`}>{activation.activationWord}</span>
          {activation.subtext ? (
            <>
              <br/>
              <span className="text-lg">{activation.subtext.description} <span className={`text-[#${activation.color}]`}>$5.000</span></span>
            </>
          ) : 
          (<></>)
          }
        </span>
      </>
  )
  }

  return (
    <div className="col-start-1 col-span-4 p-8 bg-[#7e7a88]/10 rounded-2xl h-fit">
      <p className="text-xl">Ativações</p>
      {activations.map((act) => {
        return (
          <div className="mt-6 flex align-center">
            {activation(act)}
          </div>
        )
      })}
    </div>
  )
}