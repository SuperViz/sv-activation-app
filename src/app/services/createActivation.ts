import {ActivationType} from "@/global/global.types";

interface ICreateActivationProps {
  name: ActivationType, 
  userEmail: string
}

export async function createActivation(props : ICreateActivationProps): Promise<void> {
  await fetch('/api/user/activation', {
    method: 'POST',
    body: JSON.stringify(props),
  })
    .then(async (res) => {
      return res.json()
    })
}