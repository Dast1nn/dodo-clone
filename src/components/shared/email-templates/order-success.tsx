import { CartItemDTO } from '@/services/dto/cart.dto'
import React from 'react'

interface Props {
	orderId: number
	items: CartItemDTO[]
}

export const OrderSuccessTemplete: React.FC<Props> = ({ orderId, items }) => (
	<div>
		<h1>Спасибо за покупку!</h1>

		<p>Ваш заказ #${orderId} оплачен.Список товаров:</p>

		<hr />

		<ul>
			{items.map(items => (
				<li key={items.id}>
					{items.productItem.product.name} | {items.quantity} шт x
					{items.productItem.price} ₸ =
					{items.quantity * items.productItem.price} ₸
				</li>
			))}
		</ul>
	</div>
)
