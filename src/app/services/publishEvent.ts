export async function publishEvent(channel: string, event: string, data: any) {
  await fetch(`https://nodeapi.superviz.com/realtime/${channel}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      secret: process.env.SECRET_KEY as string,
      client_id: process.env.CLIENT_ID as string,
    },
    body: JSON.stringify({
      name: event,
      data: data,
    }),
  });
}
