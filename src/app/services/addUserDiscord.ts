import getUserData from "@/app/services/getUserData";
import {IUser} from "../../../types";

const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string

export async function addUserDiscord(formData: Record<string, string>): Promise<void>{

  await fetch('/api/user', {
    method: 'PATCH',
    body: JSON.stringify(formData),
  })
    .then(async (res) => {
      if (res.status === 409) {
        return await getUserData(formData['email']);
      } else if (!res.ok) {
        throw new Error('Erro');
      }

      const response = await res.json();

      return response.data.user as IUser;
    })
    .then((userData) => {
      localStorage.setItem(USERDATA_KEY, JSON.stringify(userData))
    })
}