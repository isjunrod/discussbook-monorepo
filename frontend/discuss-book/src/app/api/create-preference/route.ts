import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
	try {
		const { userId } = await request.json();

		const mercadopago = new MercadoPagoConfig({
			accessToken: process.env.MP_ACCESS_TOKEN!,
		});

		const preference = await new Preference(mercadopago).create({
			body: {
				items: [
					{
						id: 'premium-subscription',
						unit_price: 9.99,
						currency_id: 'USD',
						quantity: 1,
						title: 'Premium Subscription - DiscussBook',
					},
				],
				metadata: {
					userId,
				},
				back_urls: {
					success: `${
						process.env.NEXT_PUBLIC_APP_URL ||
						'http://localhost:3000/'
					}`,
					failure: `${
						process.env.NEXT_PUBLIC_APP_URL ||
						'http://localhost:3000'
					}/payment/failure`,
				},
				auto_return: 'approved',
			},
		});

		return NextResponse.json({ init_point: preference.init_point });
	} catch (error) {
		console.error('Error creating preference:', error);
		return NextResponse.json(
			{ error: 'Failed to create preference' },
			{ status: 500 },
		);
	}
}
