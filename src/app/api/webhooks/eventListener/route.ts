import { publishEvent } from '@/app/services/publishEvent';
import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.text()
		const parsed = JSON.parse(body)

		const channelName = parsed.channel;
		const eventName = parsed.event;

		if (channelName !== 'default' || eventName !== 'activation.start') {
			return NextResponse.json({}, { status: 400 })
		}

		const activationName = parsed.activation;
		const userId = parsed.userId;

		const user = await db.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user) {
			return NextResponse.json(
				{
					message: 'User not found',
				},
				{
					status: 404,
					statusText: 'Not Found'
				}
			)
		}

		const list = await db.activation.findMany({
			where: {
				userId: user.id,
			}
		})

		if (list.some((activation) => activation.name === activationName)) {
			return NextResponse.json({
				message: 'Activation already exists',
			}, {
				status: 409,
				statusText: 'Conflict'
			})
		}

		await db.activation.create({
			data: {
				name: activationName,
				completed: false,
				userId: user.id,
			}
		})


		await publishEvent('default', 'activation.start', {
			userId: userId,
			activation: activationName
		})

		return NextResponse.json({ message: 'Success' }, { status: 200 })
	} catch (error) {
		console.log(error)

		return NextResponse.json({}, {
			status: 500,
			statusText: 'Internal Server Error'
		})
	}
}