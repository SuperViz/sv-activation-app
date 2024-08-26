import {ActivationEnum} from "@/app/page";

interface IActivation {
  description: string
  activationWord: string
  color: ActivationEnum
  link: string                
  subtext?: {
    description: string
    activationWord: string
  }
}

interface IUser {
  id: string
  name: string
  discordUser: string
  email: string
  activations: IUserActivation[]
  isOnline: boolean
}

interface IUserActivation {
  id: string
  name: ActivationTypes
  completed: boolean
  color: ActivationEnum
}