import { PizzaSize, PizzaType } from '@/constants/pizza'
import { getCartItemDetails } from '@/lib'
import { TCartStateItem } from '@/lib/get-cart-details'
import { CheckoutItem } from '../checkout-item'
import { CheckoutItemSkeleton } from '../checkout-item-skeleton'
import { WhiteBlock } from '../white-block'

interface Props {
	items: TCartStateItem[]
	onClickCountButton: (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => void
	removeCartItem: (id: number) => void
	className?: string
	loading?: boolean
}

export const CheckoutCart: React.FC<Props> = ({
	className,
	items,
	onClickCountButton,
	removeCartItem,
	loading,
}) => {
	return (
		<WhiteBlock title='1. Корзина' className={className}>
			<div className='flex flex-col gap-5'>
				{loading
					? [...Array(4)].map((_, index) => (
							<CheckoutItemSkeleton key={index} />
					  ))
					: items.map(item => (
							<CheckoutItem
								key={item.id}
								id={item.id}
								imageUrl={item.imageUrl}
								details={getCartItemDetails(
									item.ingredients,
									item.pizzaType as PizzaType,
									item.pizzaSize as PizzaSize
								)}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								disabled={item.disabled}
								onClickCountButton={type =>
									onClickCountButton(item.id, item.quantity, type)
								}
								onClickRemove={() => removeCartItem(item.id)}
							/>
					  ))}
			</div>
		</WhiteBlock>
	)
}
