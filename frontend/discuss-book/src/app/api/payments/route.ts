import { addPremiumUser, isPremiumUser } from '@/src/lib/db-service';

// Endpoint to add a premium user
export async function POST(request: Request) {
	const { userId } = await request.json();

	try {
		await addPremiumUser(userId);
		return Response.json({ success: true });
	} catch (error) {
		return Response.json(
			{ error: 'Failed to add payment' },
			{ status: 500 },
		);
	}
}

// Endpoint to check if a user is premium
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get('userId');

	if (!userId) {
		return Response.json({ error: 'userId is required' }, { status: 400 });
	}

	try {
		const response = await isPremiumUser(userId);
		const data = await response.json();

		return Response.json(data);
	} catch (error) {
		return Response.json(
			{ error: 'Failed to check status' },
			{ status: 500 },
		);
	}
}
