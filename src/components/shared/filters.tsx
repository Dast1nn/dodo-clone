'use client'
import { useFilters, useIngredients, useQueryFilters } from '@/hooks'
import React from 'react'
import { Input } from '../ui'
import { CheckboxFiltersGroup } from './checkbox-filters-group'
import { RangeSlider } from './range-slider'
import { Title } from './title'

interface Props {
	className?: string
}

export const Filters: React.FC<Props> = ({ className }) => {
	const { ingredients, loading } = useIngredients()
	const filters = useFilters()

	const items = ingredients.map(item => ({
		value: String(item.id),
		text: item.name,
	}))

	useQueryFilters(filters)

	const updatePrice = (prices: number[]) => {
		filters.setPrices('priceFrom', prices[0])
		filters.setPrices('priceTo', prices[1])
	}
	return (
		<div className={className}>
			<Title text='Фильтрация ' size='sm' className='font-bold mb-5' />
			<CheckboxFiltersGroup
				title='Тип теста'
				className='mt-5'
				name='pizzaTypes'
				selected={filters.pizzaTypes}
				onClickCheckBox={filters.setPizzaTypes}
				items={[
					{
						text: 'Тонкое',
						value: '1',
					},
					{
						text: 'Традиционное',
						value: '2',
					},
				]}
			/>
			<CheckboxFiltersGroup
				title='Размеры'
				className='mt-5'
				name='sizes'
				selected={filters.sizes}
				onClickCheckBox={filters.setSizes}
				items={[
					{
						text: '20 см',
						value: '20',
					},
					{
						text: '30 см',
						value: '30',
					},
					{
						text: '40 см',
						value: '40',
					},
				]}
			/>
			<div className='mt-5 border-y border-y-neutral-100 py-6 pb-7'>
				<p className='font-bold mb-3'>Цены от и до:</p>
				<div className='flex gap-3 mb-5'>
					<Input
						type='number'
						placeholder='0'
						min={0}
						max={1000}
						value={String(filters.prices.priceFrom)}
						onChange={e =>
							filters.setPrices('priceFrom', Number(e.target.value))
						}
					/>
					<Input
						type='number'
						placeholder='3000'
						min={100}
						max={3000}
						value={String(filters.prices.priceTo)}
						onChange={e => filters.setPrices('priceTo', Number(e.target.value))}
					/>
				</div>
				<RangeSlider
					min={0}
					max={3000}
					step={10}
					value={[
						filters.prices.priceFrom || 0,
						filters.prices.priceTo || 3000,
					]}
					onValueChange={updatePrice}
				/>
			</div>

			<CheckboxFiltersGroup
				title='Ингредиенты'
				className='mt-5'
				limit={6}
				defaultItems={items.slice(0, 6)}
				items={items}
				loading={loading}
				onClickCheckBox={filters.setSelectedIngredients}
				name='ingredients'
				selected={filters.selectedIngredients}
			/>
		</div>
	)
}
