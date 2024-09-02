import { IActivation, IUser } from "../../types";
import { ActivationType, ActivationTypePage } from "@/global/global.types";

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
    page: ActivationTypePage.NEWSLETTER,
    color: ActivationColor.NEWSLETTER
  },
  {
    id: ActivationType.DISCORD,
    description: 'Junte-se ao nosso',
    activationWord: 'Discord',
    link: 'https://discord.com/invite/Zb2arax9nn',
    page: ActivationTypePage.DISCORD,
    color: ActivationColor.DISCORD
  },
  {
    id: ActivationType.GAME,
    description: 'Ganhe pontos no',
    activationWord: 'Super Game',
    link: '/activations/game',
    page: ActivationTypePage.GAME_ONBOARDING,
    color: ActivationColor.GAME
  },
  {
    id: ActivationType.HACKATHON,
    description: 'Inscreva-se no',
    activationWord: 'Hackathon',
    link: 'https://47xzvrbdgjk.typeform.com/to/cqzci1gD',
    page: ActivationTypePage.HACKATHON,
    color: ActivationColor.HACKATHON,
    subtext: {
      description: 'E concorra a',
      activationWord: '$5.000',
    }
  },
]