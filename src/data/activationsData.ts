import {IActivation, IUser} from "../../types";

export enum ActivationEnum {
  GAME = '957AFF',
  DISCORD = '0077FF',
  NEWSLETTER = 'DB6583',
  HACKATHON = '56E29E'
}

export const activations: IActivation[] = [
    {
      description: 'Cadastre na nossa',
      activationWord: 'Newsletter',
      link: 'teste',
      color: ActivationEnum.NEWSLETTER
    },
    {
      description: 'Junte-se ao nosso',
      activationWord: 'Discord',
      link: 'https://discord.com/invite/Zb2arax9nn',
      color: ActivationEnum.DISCORD
    },
    {
      description: 'Experimente nosso',
      activationWord: 'Jogo',
      link: 'teste',
      color: ActivationEnum.GAME
    },
    {
      description: 'Inscreva-se no',
      activationWord: 'Hackathon',
      link: 'teste',
      color: ActivationEnum.HACKATHON,
      subtext: {
        description: 'E concorra a',
        activationWord: '$5.000',
      }
    },
  ]

export const users: IUser[] = [
  {
    name: 'Rhaenyra',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
      {
        isCompleted: true,
        color: ActivationEnum.NEWSLETTER,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Corlys',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.NEWSLETTER,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationEnum.HACKATHON,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Daemon',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationEnum.NEWSLETTER,
      },
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Rhaenys',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Alicent',
    activations: [],
    isOnline: true,
  },
  {
    name: 'Danaeris',
    activations: [],
    isOnline: false,
  },
  {
    name: 'Aemond',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Addam',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationEnum.NEWSLETTER,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Hugh',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.NEWSLETTER,
      },
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Jacaerys',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: false,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Aegon',
    activations: [
      {
        isCompleted: false,
        color: ActivationEnum.HACKATHON,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Vermax',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: false,
        color: ActivationEnum.DISCORD,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Vhagar',
    activations: [
      {
        isCompleted: false,
        color: ActivationEnum.HACKATHON,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Alyn',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Otto',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Syrax',
    activations: [],
    isOnline: true,
  },
  {
    name: 'Seasmoke',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Criston',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Rickard',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
      {
        isCompleted: false,
        color: ActivationEnum.NEWSLETTER,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Caraxes',
    activations: [
      {
        isCompleted: true,
        color: ActivationEnum.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationEnum.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationEnum.GAME,
      },
      {
        isCompleted: false,
        color: ActivationEnum.NEWSLETTER,
      },
    ],
    isOnline: false,
  },
]