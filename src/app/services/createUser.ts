import { IUser } from "../../../types";
import { getUserData } from "./getUserData";

const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

export async function createUser(
  formData: Record<string, string>
): Promise<void> {
  await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(formData),
  })
    .then(async (res) => {
      if (res.status === 409) {
        return await getUserData(formData["email"]);
      } else if (!res.ok) {
        throw new Error("Erro");
      }

      const response = await res.json();

      return response.data.user as IUser;
    })
    .then((userData) => {
      localStorage.setItem(USERDATA_KEY, JSON.stringify(userData.email));
    });
}
