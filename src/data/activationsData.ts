import { IActivation, IUser } from "../../types";
import { ActivationType } from "@/global/global.types";

export enum ActivationColor {
  GAME = '957AFF',
  DISCORD = '0077FF',
  NEWSLETTER = 'DB6583',
  HACKATHON = '56E29E'
}

export const activations: IActivation[] = [
  {
    id: ActivationType.NEWSLETTER,
    description: 'Cadastre na nossa',
    activationWord: 'Newsletter',
    link: 'https://47xzvrbdgjk.typeform.com/to/eGJ6c0Ah',
    page: '/activations/newsletter',
    color: ActivationColor.NEWSLETTER
  },
  {
    id: ActivationType.DISCORD,
    description: 'Junte-se ao nosso',
    activationWord: 'Discord',
    link: 'https://discord.com/invite/Zb2arax9nn',
    page: '/activations/discord',
    color: ActivationColor.DISCORD
  },
  {
    id: ActivationType.GAME,
    description: 'Ganhe pontos no',
    activationWord: 'Super Game',
    link: '/activations/game',
    page: '/activations/game',
    color: ActivationColor.GAME
  },
  {
    id: ActivationType.HACKATHON,
    description: 'Inscreva-se no',
    activationWord: 'Hackathon',
    link: 'https://47xzvrbdgjk.typeform.com/to/cqzci1gD',
    page: '/activations/hackathon',
    color: ActivationColor.HACKATHON,
    subtext: {
      description: 'E concorra a',
      activationWord: '$5.000',
    }
  },
]

export const users: IUser[] = [
  {
    id: '111',
    name: 'Rhaenyra',
    email: 'Rhaenyra@Rhaenyra.com',
    isOnline: true,
    activations: [
      {
        name: ActivationType.HACKATHON,
        completed: true,
        color: ActivationColor.HACKATHON,
      },
      {
        name: ActivationType.DISCORD,
        completed: true,
        color: ActivationColor.DISCORD,
      },
      {
        name: ActivationType.GAME,
        completed: false,
        quantity: 2,
        color: ActivationColor.GAME,
      },
      {
        name: ActivationType.NEWSLETTER,
        completed: true,
        color: ActivationColor.NEWSLETTER,
      },
    ],
  },
  {
    id: '333',
    name: 'Rhaenyra',
    email: 'Rhaenyra@Rhaenyra.com',
    isOnline: true,
    activations: [

    ],
  },
  {
    id: '222',
    name: 'Corlys',
    email: 'Corlys@Corlys.com',
    isOnline: true,
    activations: [
      {
        name: ActivationType.NEWSLETTER,
        completed: true,
        color: ActivationColor.NEWSLETTER,
      },
      {
        name: ActivationType.DISCORD,
        completed: true,
        color: ActivationColor.DISCORD,
      },
      {
        name: ActivationType.HACKATHON,
        completed: false,
        color: ActivationColor.HACKATHON,
      },
    ],
  },
  // {
  //   name: 'Daemon',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.NEWSLETTER,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Rhaenys',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Alicent',
  //   activations: [],
  //   isOnline: true,
  // },
  // {
  //   name: 'Danaeris',
  //   activations: [],
  //   isOnline: false,
  // },
  // {
  //   name: 'Aemond',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Addam',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.NEWSLETTER,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Hugh',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.NEWSLETTER,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.GAME,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Jacaerys',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Aegon',
  //   activations: [
  //     {
  //       completed: false,
  //       color: ActivationColor.HACKATHON,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Vermax',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.DISCORD,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Vhagar',
  //   activations: [
  //     {
  //       completed: false,
  //       color: ActivationColor.HACKATHON,
  //     },
  //   ],
  //   isOnline: false,
  // },
  // {
  //   name: 'Alyn',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: false,
  // },
  // {
  //   name: 'Otto',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //   ],
  //   isOnline: false,
  // },
  // {
  //   name: 'Syrax',
  //   activations: [],
  //   isOnline: true,
  // },
  // {
  //   name: 'Seasmoke',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: false,
  // },
  // {
  //   name: 'Criston',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.GAME,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Rickard',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.GAME,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.NEWSLETTER,
  //     },
  //   ],
  //   isOnline: true,
  // },
  // {
  //   name: 'Caraxes',
  //   activations: [
  //     {
  //       completed: true,
  //       color: ActivationColor.HACKATHON,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.DISCORD,
  //     },
  //     {
  //       completed: true,
  //       color: ActivationColor.GAME,
  //     },
  //     {
  //       completed: false,
  //       color: ActivationColor.NEWSLETTER,
  //     },
  //   ],
  //   isOnline: false,
  // },
]