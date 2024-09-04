import { getUserData } from './getUserData';

export async function addUserDiscord(formData: Record<string, string>): Promise<void> {
  await fetch('/api/user', {
    headers: { cache: 'no-store' },
    method: 'PATCH',
    body: JSON.stringify(formData),
  })
    .then(async (res) => {
      if (res.status === 409) {
        return await getUserData(formData['email']);
      } else if (!res.ok) {
        throw new Error('Erro');
      }
    })
}