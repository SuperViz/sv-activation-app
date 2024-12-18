import { ActivationColor } from "@/data/activationsData";
import { ActivationType, ActivationTypePage } from "@/global/global.types";

interface IActivation {
  id: ActivationType;
  description: string;
  activationWord: string;
  color: ActivationColor;
  link: string;
  page: ActivationTypePage;
  subtext?: {
    description: string;
    activationWord: string;
  };
}

interface IUser {
  id: string;
  name: string;
  email: string;
  discordUser?: string;
  activations: IUserActivation[];
  isOnline?: boolean;
}

interface IUserActivation {
  name: ActivationType;
  completed: boolean;
  quantity?: number;
  color: ActivationColor;
}

interface IUserResponse {
  id: string;
  name: string;
  discordUser?: string;
  email: string;
  activations: IActivationResponse[];
  timesRevoked: number;
}

interface IActivationResponse {
  id: string;
  name: ActivationType;
  completed: boolean;
  quantity: number;
  userId: string;
}
