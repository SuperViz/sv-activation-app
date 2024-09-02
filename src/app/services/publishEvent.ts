export async function publishEvent(channel: string, event: string, data: any) {
	const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;
	const ROOM_ID = process.env.NEXT_PUBLIC_DASHBOARD_ROOM_ID as string;

	await fetch(`https://nodeapi.superviz.com/realtime/${ROOM_ID}/${channel}/publish`, {
		method: 'POST',
		headers: {
			'apiKey': DEVELOPER_KEY,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: event,
			data: data
		})
	})
}