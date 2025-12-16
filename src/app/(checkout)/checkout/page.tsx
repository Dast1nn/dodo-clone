'use client'
import { createOrder } from '@/app/actions'
import { CheckoutSidebar, Container, Title } from '@/components/shared'
import {
	CheckoutAddressForm,
	CheckoutCart,
	CheckoutPersonalForm,
} from '@/components/shared/checkout'
import { checkoutFormSchema, CheckoutFormValues } from '@/constants'
import { useCart } from '@/hooks'
import { Api } from '@/services/api-clients'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
export default function CheckoutPage() {
	const { totalAmount, items, updateItemQuantity, removeCartItem, loading } =
		useCart()
	const [submitting, setSubmitting] = React.useState(false)
	const { data: session } = useSession()
	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			comment: '',
		},
	})
	React.useEffect(() => {
		async function fetchUserInfo() {
			const data = await Api.auth.getMe()
			const [firstName, lastName] = data.fullName.split(' ')
			form.setValue('firstName', firstName)
			form.setValue('lastName', lastName)
			form.setValue('email', data.email)
		}
		if (session) {
			fetchUserInfo()
		}
	}, [session])

	const onClickCountButton = (
		id: number,
		quantity: number,
		type: 'plus' | 'minus'
	) => {
		const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1
		updateItemQuantity(id, newQuantity)
	}

	const onSubmit = async (data: CheckoutFormValues) => {
		try {
			setSubmitting(true)
			const url = await createOrder(data)

			toast.error('Заказ успешно оформлен! 📝 Переход на оплату... ', {
				icon: '✅',
			})

			if (url) {
				location.href = url
			}
		} catch (err) {
			console.log(err)
			setSubmitting(false)
			toast.error('Не удалось создать заказ', {
				icon: '❌',
			})
		}
	}
	return (
		<Container className='mt-10'>
			<Title
				className='font-extrabold mb-8 text-[36px]'
				text='Оформление заказа'
			/>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex gap-10'>
						<div className='flex  flex-col gap-10 flex-1 mb-20'>
							<CheckoutCart
								items={items}
								onClickCountButton={onClickCountButton}
								removeCartItem={removeCartItem}
								loading={loading}
							/>

							<CheckoutPersonalForm
								className={loading ? 'opacity-40 pointer-events-none' : ''}
							/>

							<CheckoutAddressForm
								className={loading ? 'opacity-40 pointer-events-none' : ''}
							/>
						</div>

						<div className='w-[450px]'>
							<CheckoutSidebar
								totalAmount={totalAmount}
								loading={loading || submitting}
							/>
						</div>
					</div>
				</form>
			</FormProvider>
		</Container>
	)
}
