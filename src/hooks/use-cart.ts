import { TCartStateItem } from '@/lib/get-cart-details'
import { CreateCartItemValues } from '@/services/dto/cart.dto'
import { useCartStore } from '@/store'
import React from 'react'
type ReturnProps = {
	totalAmount: number
	items: TCartStateItem[]
	loading: boolean
	updateItemQuantity: (id: number, quantity: number) => void
	removeCartItem: (id: number) => void
	addCartItem: (values: CreateCartItemValues) => void
}
export const useCart = (): ReturnProps => {
	const totalAmount = useCartStore(state => state.totalAmount)
	const fetchCartItems = useCartStore(state => state.fetchCartItems)
	const items = useCartStore(state => state.items)
	const updateItemQuantity = useCartStore(state => state.updateItemsQuantity)
	const removeCartItem = useCartStore(state => state.removeCartItem)
	const loading = useCartStore(state => state.loading)
	const addCartItem = useCartStore(state => state.addCartItems)

	React.useEffect(() => {
		fetchCartItems()
	}, [fetchCartItems])
	return {
		totalAmount,
		items,
		loading,
		updateItemQuantity,
		removeCartItem,
		addCartItem,
	}
}
