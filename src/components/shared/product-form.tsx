'use client'
import { ProductWithRelations } from '@/@types/prisma'
import { useCartStore } from '@/store'
import toast from 'react-hot-toast'
import { ChoosePizzaForm } from './choose-pizza-form'
import { ChooseProductForm } from './choose-product-form'

interface Props {
	product: ProductWithRelations
	onSubmit?: VoidFunction
}

export const ProductForm: React.FC<Props> = ({
	product,
	onSubmit: _onSubmit,
}) => {
	const firstItem = product.items[0]
	const isPizzaForm = Boolean(firstItem.pizzaType)
	const addCartItem = useCartStore(state => state.addCartItems)
	const loading = useCartStore(state => state.loading)

	const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
		try {
			const itemId = productItemId ?? firstItem.id

			await addCartItem({
				productItemId: itemId,
				ingredients,
			})

			toast.success(product.name + ' добавлена в корзину')
			_onSubmit?.()
		} catch (err) {
			toast.error('Не удалось добавить товар в корзину')
			console.error(err)
		}
	}

	if (isPizzaForm) {
		return (
			<ChoosePizzaForm
				imageUrl={product.imageUrl}
				name={product.name}
				price={0}
				ingredients={product.ingredients}
				items={product.items}
				onSubmit={onSubmit}
				loading={loading}
			/>
		)
	}
	return (
		<ChooseProductForm
			imageUrl={product.imageUrl}
			name={product.name}
			price={firstItem.price}
			onSubmit={onSubmit}
			loading={loading}
		/>
	)
}
