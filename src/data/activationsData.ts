import {IActivation, IUser} from "../../types";

export enum ActivationColor {
  GAME = '957AFF',
  DISCORD = '0077FF',
  NEWSLETTER = 'DB6583',
  HACKATHON = '56E29E'
}

export const activations: IActivation[] = [
    {
      description: 'Cadastre na nossa',
      activationWord: 'Newsletter',
      link: 'https://47xzvrbdgjk.typeform.com/to/eGJ6c0Ah',
      color: ActivationColor.NEWSLETTER
    },
    {
      description: 'Junte-se ao nosso',
      activationWord: 'Discord',
      link: 'https://discord.com/invite/Zb2arax9nn',
      color: ActivationColor.DISCORD
    },
    {
      description: 'Experimente nosso',
      activationWord: 'Jogo',
      link: '/onboarding-game',
      color: ActivationColor.GAME
    },
    {
      description: 'Inscreva-se no',
      activationWord: 'Hackathon',
      link: 'https://47xzvrbdgjk.typeform.com/to/cqzci1gD',
      color: ActivationColor.HACKATHON,
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
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
      {
        isCompleted: true,
        color: ActivationColor.NEWSLETTER,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Corlys',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.NEWSLETTER,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationColor.HACKATHON,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Daemon',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationColor.NEWSLETTER,
      },
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Rhaenys',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationColor.GAME,
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
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationColor.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Addam',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationColor.NEWSLETTER,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Hugh',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.NEWSLETTER,
      },
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Jacaerys',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: false,
        color: ActivationColor.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Aegon',
    activations: [
      {
        isCompleted: false,
        color: ActivationColor.HACKATHON,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Vermax',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: false,
        color: ActivationColor.DISCORD,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Vhagar',
    activations: [
      {
        isCompleted: false,
        color: ActivationColor.HACKATHON,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Alyn',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Otto',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
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
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: false,
        color: ActivationColor.GAME,
      },
    ],
    isOnline: false,
  },
  {
    name: 'Criston',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Rickard',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
      {
        isCompleted: false,
        color: ActivationColor.NEWSLETTER,
      },
    ],
    isOnline: true,
  },
  {
    name: 'Caraxes',
    activations: [
      {
        isCompleted: true,
        color: ActivationColor.HACKATHON,
      },
      {
        isCompleted: true,
        color: ActivationColor.DISCORD,
      },
      {
        isCompleted: true,
        color: ActivationColor.GAME,
      },
      {
        isCompleted: false,
        color: ActivationColor.NEWSLETTER,
      },
    ],
    isOnline: false,
  },
]