import { getCartDetails, TCartStateItem } from '@/lib/get-cart-details'
import { Api } from '@/services/api-clients'
import { CreateCartItemValues } from '@/services/dto/cart.dto'
import { create } from 'zustand'

export interface CartState {
	loading: boolean
	error: boolean
	totalAmount: number
	items: TCartStateItem[]
	fetchCartItems: () => Promise<void>
	updateItemsQuantity: (id: number, quantity: number) => Promise<void>
	addCartItems: (values: CreateCartItemValues) => Promise<void>
	removeCartItem: (id: number) => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	error: false,
	loading: true,
	totalAmount: 0,

	fetchCartItems: async () => {
		try {
			set({ loading: true, error: false })
			const data = await Api.cart.getCart()
			set(getCartDetails(data))
		} catch (error) {
			console.error(error)
			set({ error: true })
		} finally {
			set({ loading: false })
		}
	},

	updateItemsQuantity: async (id: number, quantity: number) => {
		try {
			set({ loading: true, error: false })
			const data = await Api.cart.updateItemQuantity(id, quantity)
			set(getCartDetails(data))
		} catch (error) {
			console.error(error)
			set({ error: true })
		} finally {
			set({ loading: false })
		}
	},

	addCartItems: async (values: CreateCartItemValues) => {
		try {
			set({ loading: true, error: false })
			const data = await Api.cart.addCartItem(values)
			set(getCartDetails(data))
		} catch (error) {
			console.error(error)
			set({ error: true })
		} finally {
			set({ loading: false })
		}
	},

	removeCartItem: async (id: number) => {
		try {
			set(state => ({
				loading: true,
				error: false,
				items: state.items.map(item =>
					item.id === id ? { ...item, disabled: true } : item
				),
			}))
			const data = await Api.cart.removeCartItem(id)
			set(getCartDetails(data))
		} catch (error) {
			console.error(error)
			set({ error: true })
		} finally {
			set(state => ({
				loading: false,
				items: state.items.map(item => ({ ...item, disabled: false })),
			}))
		}
	},
}))
