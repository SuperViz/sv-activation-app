import {ActivationEnum} from "@/app/page";


interface IActivation {
  description: string
  activationWord: string
  color: ActivationEnum
  subtext?: {
    description: string
    activationWord: string
  }
}

interface IUser {
  name: string
  activations: IUserActivation[]
  isOnline: boolean
}

interface IUserActivation {
  isCompleted: boolean,
  color: ActivationEnum,
}