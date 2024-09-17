import { IActivation } from "../../types";
import { ActivationType, ActivationTypePage } from "@/global/global.types";

export enum ActivationColor {
  GAME = '957AFF',
  DISCORD = '0077FF',
  GITHUB = 'DB6583',
  HACKATHON = '56E29E'
}

export const activations: IActivation[] = [
  {
    id: ActivationType.GITHUB,
    description: 'Dê uma estrela no',
    activationWord: 'GitHub',
    link: 'https://github.com/SuperViz/superviz',
    page: ActivationTypePage.GITHUB,
    color: ActivationColor.GITHUB
  },
  {
    id: ActivationType.DISCORD,
    description: 'Junte-se ao',
    activationWord: 'Discord',
    link: 'https://discord.com/invite/Zb2arax9nn',
    page: ActivationTypePage.DISCORD,
    color: ActivationColor.DISCORD
  },
  {
    id: ActivationType.HACKATHON,
    description: 'Inscreva-se no',
    activationWord: 'Hackathon Online',
    link: 'https://47xzvrbdgjk.typeform.com/to/cqzci1gD#ativacao=true',
    page: ActivationTypePage.HACKATHON,
    color: ActivationColor.HACKATHON,
    subtext: {
      description: 'E concorra a',
      activationWord: '$5.000',
    }
  },
  {
    id: ActivationType.GAME,
    description: 'Ganhe pontos no',
    activationWord: 'Super Game',
    link: '/activations/game',
    page: ActivationTypePage.GAME_ONBOARDING,
    color: ActivationColor.GAME
  },

]