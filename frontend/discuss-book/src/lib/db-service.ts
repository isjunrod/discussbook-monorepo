// En lib/db-service.ts (o similar)
import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

async function getMongoClient(): Promise<any> {
	const uri = process.env.MONGODB_URI;

	const client = new MongoClient(uri!, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	});

	return client;
}

export async function addPremiumUser(userId: string): Promise<NextResponse> {
	if (!userId) {
		return NextResponse.json(
			{ error: 'userId is required' },
			{ status: 400 },
		);
	}

	const client = await getMongoClient();

	try {
		await client.connect();
		const db = client.db('discuss-book');
		const collection = db.collection('payments');

		// Verificar que el usuario no exista o tenga false en paid
		const existingPayment = await collection.findOne({ userId });

		if (existingPayment && existingPayment.paid) {
			return NextResponse.json(
				{ error: 'Payment already exists' },
				{ status: 409 },
			);
		}

		// Guardar la fecha actual como fecha de pago
		const paidAt = new Date();
		// Calcular la fecha de expiración (30 días después)
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 30);

		// Si el usuario ya existe, actualizamos su estado
		if (existingPayment) {
			await collection.updateOne(
				{ userId },
				{ $set: { paid: true, paidAt, expiresAt } },
			);
			return NextResponse.json(
				{ message: 'Payment updated' },
				{ status: 200 },
			);
		} else {
			// Si no existe, creamos un nuevo registro
			await collection.insertOne({
				userId,
				paid: true,
				paidAt,
				expiresAt,
			});

			return NextResponse.json(
				{ message: 'Paid success' },
				{ status: 200 },
			);
		}
	} catch (error) {
		console.error('Error checking premium status:', error);
		return NextResponse.json(
			{ error: 'Unexpected error occurred' },
			{ status: 500 },
		);
	} finally {
		await client.close();
	}
}

export async function isPremiumUser(userId: string): Promise<NextResponse> {
	if (!userId) {
		return NextResponse.json(
			{ error: 'userId is required' },
			{ status: 400 },
		);
	}

	const client = await getMongoClient();

	try {
		await client.connect();
		const db = client.db('discuss-book');
		const collection = db.collection('payments');

		const payment = await collection.findOne({ userId });

		// Si no existe un pago o paid es false, no es premium
		if (!payment || !payment.paid) {
			return NextResponse.json({ isPremium: false });
		}

		// Verificar si ha expirado
		const now = new Date();
		// Si la fecha actual es posterior a la fecha de expiración
		if (now > payment.expiresAt) {
			// Actualizar el estado a no pagado
			await collection.updateOne({ userId }, { $set: { paid: false } });
			return NextResponse.json({ isPremium: false });
		}

		return NextResponse.json({
			isPremium: true,
			expiresAt: payment.expiresAt,
		});
	} catch (error) {
		console.error('Error checking premium status:', error);
		return NextResponse.json(
			{ error: 'Failed to check premium status' },
			{ status: 500 },
		);
	} finally {
		await client.close();
	}
}
