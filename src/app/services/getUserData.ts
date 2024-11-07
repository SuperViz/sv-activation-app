import { IUserResponse } from "../../../types";

export async function getUserData(email: string): Promise<IUserResponse> {
  const params = new URLSearchParams({ email: email });

  return await fetch(`/api/user?${params}`, {
    headers: {
      cache: "no-store",
    },
  })
    .then(async (res) => {
      return await res.json();
    })
    .then((res) => res.data.user);
}

export function getUsers(): Promise<IUserResponse[]> {
  return fetch(`/api/users`, {
    headers: {
      cache: "no-store",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => res.data.users);
}

export async function getOnlineUsersIds(): Promise<string[]> {
  return await fetch(`/api/dashboard`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => {
      return [];
    });
}

export function patchUser(email: string, data: Partial<IUserResponse>) {
  return fetch(`/api/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      ...data,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
}

export function updateUser(email: string, data: Partial<IUserResponse>) {
  return fetch(`/api/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      ...data,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
}
