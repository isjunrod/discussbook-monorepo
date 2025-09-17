import MercadoPagoConfig, { Payment } from 'mercadopago';
import { revalidatePath } from 'next/cache';
import { addPremiumUser } from '../../../lib/db-service';

export const mercadopago = new MercadoPagoConfig({
	accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
	// Obtenemos el cuerpo de la petición que incluye información sobre la notificación
	const body: { data: { id: string } } = await request.json();

	// Obtenemos el pago
	const payment = await new Payment(mercadopago).get({ id: body.data.id });

	// // Si se aprueba, agregamos el mensaje
	if (payment.status === 'approved') {
		// Usar directamente la función de base de datos
		const response = await addPremiumUser(payment.metadata?.user_id);
		const result = await response.json();
		revalidatePath('/');
	}

	// Respondemos con un estado 200 para indicarle que la notificación fue recibida
	return new Response(null, { status: 200 });
}
