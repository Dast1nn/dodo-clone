'use client'
import { ProductWithRelations } from '@/@types/prisma'
import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category'
import React from 'react'
import { useIntersection } from 'react-use'
import { ProductCart } from './product-cart'
import { Title } from './title'

interface Props {
	title: string
	items: ProductWithRelations[]
	categoryId: number
	listClassName?: string
	className?: string
}

export const ProductsGroupList: React.FC<Props> = ({
	title,
	items,
	categoryId,
	listClassName,
	className,
}) => {
	const setActiveCategoryId = useCategoryStore(state => state.setActiveId)
	const intersectionRef = React.useRef<HTMLDivElement>(null)
	const intersection = useIntersection(
		intersectionRef as React.RefObject<HTMLElement>,
		{
			threshold: 0.4,
		}
	)

	React.useEffect(() => {
		if (intersection?.isIntersecting) {
			setActiveCategoryId(categoryId)
		}
	}, [categoryId, intersection?.isIntersecting, title])
	return (
		<div className={className} id={title} ref={intersectionRef}>
			<Title text={title} size='lg' className='font-extrabold mb-5' />

			<div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
				{items.map((product, index) => (
					<ProductCart
						key={product.id}
						id={product.id}
						name={product.name}
						imageUrl={product.imageUrl}
						price={product.items[0].price}
						ingredients={product.ingredients}
					/>
				))}
			</div>
		</div>
	)
}
