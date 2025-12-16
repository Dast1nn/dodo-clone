import { PaymentData } from '@/@types/yokassa'
import axios from 'axios'

interface Props {
	description: string
	amount: number
	orderId: number
}

export async function createPayment(details: Props) {
	const { data } = await axios.post<PaymentData>(
		'https://api.yookassa.ru/v3/payments',
		{
			amount: { value: details.amount, currency: 'RUB' },
			capture: true,
			description: details.description,
			metadata: {
				order_id: details.orderId,
			},
			confirmation: {
				type: 'redirect',
				return_url: process.env.YOOKASSA_CALLBACK_URL as string,
			},
		},
		{
			auth: {
				username: process.env.YOOKASSA_STORE_ID as string,
				password: process.env.YOOKASSA_API_KEY as string,
			},
			headers: {
				'Idempotence-Key': Math.random().toString(36).substring(7),
			},
		}
	)

	return data
}
