import { findOrCreateCart } from '@/lib'
import { updateCartTotalAmount } from '@/lib/updata-cart-total-amount'
import { prisma } from '@/prisma/prisma-client'
import { CreateCartItemValues } from '@/services/dto/cart.dto'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		const userId = 1
		const token = req.cookies.get('cartToken')?.value
		if (!token) {
			return NextResponse.json({ totalAmount: 0, items: [] })
		}
		const userCart = await prisma.cart.findFirst({
			where: {
				OR: [
					{
						token,
					},
				],
			},
			include: {
				items: {
					orderBy: {
						createdAt: 'desc',
					},
					include: {
						productItem: {
							include: {
								product: true,
							},
						},
						ingredients: true,
					},
				},
			},
		})

		return NextResponse.json(userCart)
	} catch (error) {
		console.log('[CART_GET] Server error', error)
		return NextResponse.json(
			{ message: 'Не удалось получить корзину' },
			{ status: 500 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		let token = req.cookies.get('cartToken')?.value

		if (!token) {
			token = crypto.randomUUID()
		}
		const userCart = await findOrCreateCart(token)
		const data = (await req.json()) as CreateCartItemValues

		const cartItems = await prisma.cartItem.findMany({
			where: {
				cartId: userCart.id,
				productItemId: data.productItemId,
			},
			include: { ingredients: true },
		})
		const findCartItem = cartItems.find(item => {
			const oldIngr = item.ingredients.map(i => i.id).sort()
			const newIngr = [...(data.ingredients ?? [])].sort()
			return JSON.stringify(oldIngr) === JSON.stringify(newIngr)
		})

		if (findCartItem) {
			await prisma.cartItem.update({
				where: { id: findCartItem.id },
				data: { quantity: findCartItem.quantity + 1 },
			})
		} else {
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productItemId: data.productItemId,
					quantity: 1,
					ingredients: {
						connect: data.ingredients?.map(id => ({ id })),
					},
				},
			})
		}
		const updateUserCart = await updateCartTotalAmount(token)

		const resp = NextResponse.json(updateUserCart)
		resp.cookies.set('cartToken', token)
		return resp
	} catch (error) {
		console.log('[CART_POST] Server error', error)
		return NextResponse.json(
			{ message: 'Не удалось создать корзину' },
			{ status: 500 }
		)
	}
}
