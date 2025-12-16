'use server'
import { PayOrderTemplate, VerificationUserTemplate } from '@/components/shared'
import { CheckoutFormValues } from '@/constants'
import { createPayment, getUserSession, sendEmail } from '@/lib'
import { prisma } from '@/prisma/prisma-client'
import { OrderStatus, Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { cookies } from 'next/headers'
import React from 'react'

export async function createOrder(data: CheckoutFormValues) {
	try {
		const cookieStore = cookies()
		const cartToken = (await cookieStore).get('cartToken')?.value

		if (!cartToken) {
			throw new Error('Cart token not found')
		}

		const userCart = await prisma.cart.findFirst({
			include: {
				user: true,
				items: {
					include: {
						ingredients: true,
						productItem: {
							include: {
								product: true,
							},
						},
					},
				},
			},
			where: {
				token: cartToken,
			},
		})
		if (!userCart) {
			throw new Error('Cart not found')
		}
		if (userCart.totalAmount === 0) {
			throw new Error('Cart is empty')
		}

		const order = await prisma.order.create({
			data: {
				token: cartToken,
				fullName: data.firstName + ' ' + data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address,
				comment: data.comment,
				totalAmount: userCart.totalAmount,
				status: OrderStatus.PENDING,
				items: userCart.items,
			},
		})
		await prisma.cart.update({
			where: { id: userCart.id },
			data: {
				totalAmount: 0,
			},
		})

		await prisma.cartItem.deleteMany({
			where: {
				cartId: userCart.id,
			},
		})

		const paymentData = await createPayment({
			amount: order.totalAmount,
			orderId: order.id,
			description: `Оплата заказа #${order.id}`,
		})

		if (!paymentData) {
			throw new Error('Payment creation failed')
		}
		const paymentUrl = paymentData.confirmation.confirmation_url
		const template = React.createElement(PayOrderTemplate, {
			orderId: order.id,
			totalAmount: order.totalAmount,
			paymentUrl,
		})
		await prisma.order.update({
			where: { id: order.id },
			data: {
				paymentId: paymentData.id,
			},
		})

		await sendEmail(
			data.email,
			`Dast1nn Pizza / Оплатите заказ #${order.id}`,
			template
		)
		return paymentUrl
	} catch (error) {
		console.log('CreateOrder error', error)
	}
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
	try {
		const currentUser = await getUserSession()

		if (!currentUser) {
			throw new Error('Пользователь не найден')
		}

		const findUser = await prisma.user.findFirst({
			where: {
				id: Number(currentUser.id),
			},
		})

		await prisma.user.update({
			where: {
				id: Number(currentUser.id),
			},
			data: {
				fullName: body.fullName,
				email: body.email,
				password: body.password
					? hashSync(body.password as string, 10)
					: findUser?.password,
			},
		})
	} catch (err) {
		console.log('Error [UPDATE_USER]', err)
		throw err
	}
}

export async function registerUser(body: Prisma.UserCreateInput) {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		})
		if (user) {
			if (!user.verified) {
				throw new Error('Почта не подтверждена')
			}
			throw new Error('Пользователь уже существует')
		}
		const createdUser = await prisma.user.create({
			data: {
				fullName: body.fullName,
				email: body.email,
				password: hashSync(body.password, 10),
			},
		})

		const code = Math.floor(100000 + Math.random() * 900000).toString()

		await prisma.verificationCode.create({
			data: {
				code,
				userId: createdUser.id,
			},
		})
		const template = React.createElement(VerificationUserTemplate, {
			code,
		})
		await sendEmail(
			createdUser.email,
			`Dast1nn Pizza / Подтверждение регистрации`,
			template
		)
	} catch (err) {
		console.log('Error [REGISTER_USER]', err)
		throw err
	}
}
