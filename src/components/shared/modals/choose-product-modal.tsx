'use client'
import { ProductWithRelations } from '@/@types/prisma'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ProductForm } from '..'

interface Props {
	product: ProductWithRelations
	className?: string
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
	const router = useRouter()
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
			router.back()
		} catch (err) {
			toast.error('Не удалось добавить товар в корзину')
			console.error(err)
		}
	}
	return (
		<Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
			<DialogContent
				className={cn(
					'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
					className
				)}
			>
				<ProductForm product={product} onSubmit={() => router.back()} />
			</DialogContent>
		</Dialog>
	)
}
