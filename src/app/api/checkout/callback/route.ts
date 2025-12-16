import { PaymentCallbackData } from '@/@types/yokassa'
import { OrderSuccessTemplete } from '@/components/shared/email-templates/order-success'
import { sendEmail } from '@/lib'
import { prisma } from '@/prisma/prisma-client'
import { CartItemDTO } from '@/services/dto/cart.dto'
import { OrderStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as PaymentCallbackData

		const order = await prisma.order.findFirst({
			where: {
				id: Number(body.object.metadata.order_id),
			},
		})
		if (!order) {
			return NextResponse.json({ error: 'Order not found' })
		}
		const isSucceeded = body.object.status === 'succeeded'

		await prisma.order.update({
			where: { id: order.id },
			data: {
				status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
			},
		})

		const items = JSON.parse(order?.items as string) as CartItemDTO[]
		if (isSucceeded) {
			const template = React.createElement(OrderSuccessTemplete, {
				orderId: order.id,
				items,
			})
			await sendEmail(
				order.email,
				'Next Pizza / Ваш заказ успешно оформлен 🎉',
				template
			)
		} else {
			// Письмо о неуспешной оплате
		}
	} catch (error) {
		console.log('[Checkout Callback] Error', error)
		return NextResponse.json({ error: 'Error server' })
	}
}
