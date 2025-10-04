import { useRouter } from 'next/navigation'
import qs from 'qs'
import React from 'react'
import { Filters } from './use-filters'

export const useQueryFilters = (filters: Filters) => {
	const prevQueryRef = React.useRef<string>('')
	const isMounted = React.useRef(false)
	const router = useRouter()
	React.useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true
			return
		}

		const params = {
			...filters.prices,
			pizzaTypes: Array.from(filters.pizzaTypes),
			sizes: Array.from(filters.sizes),
			ingredients: Array.from(filters.selectedIngredients),
		}

		const query = qs.stringify(params, { arrayFormat: 'comma' })

		const search = `?${query}`
		if (prevQueryRef.current !== search) {
			prevQueryRef.current = search
			router.push(search, { scroll: false })
		}

		console.log(filters, 999)
	}, [filters, router])
}
