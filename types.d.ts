import {ActivationColor} from "@/data/activationsData";
import {ActivationType} from "@/global/global.types";

interface IActivation {
  id: ActivationType
  description: string
  activationWord: string
  color: ActivationColor
  link: string                
  subtext?: {
    description: string
    activationWord: string
  }
}

interface IUser {
  id: string
  name: string
  email: string
  activations: IUserActivation[]
  isOnline: boolean
}

interface IUserActivation {
  id: ActivationType
  completed: boolean
  quantity?: number
  color: ActivationColor
}

