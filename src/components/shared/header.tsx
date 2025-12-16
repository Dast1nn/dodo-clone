'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { AuthModal, CartButton, ProfileButton, SearchInput } from '.'
import { Container } from './container'

interface Props {
	hasSearch?: boolean
	hasCart?: boolean
	className?: string
}

export const Header: React.FC<Props> = ({
	className,
	hasSearch = true,
	hasCart = true,
}) => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [openAuthModal, setOpenAuthModal] = React.useState(false)
	React.useEffect(() => {
		let toasMessage = ''
		if (searchParams.has('paid')) {
			toasMessage = 'Заказ оплачен успешно! Спасибо за покупку 😊'
		}
		if (searchParams.has('verified')) {
			toasMessage = 'Почта успешно подтверждена!'
		}
		if (toasMessage) {
			setTimeout(() => {
				router.replace('/')
				toast.success(toasMessage, {
					duration: 3000,
				})
			}, 1000)
		}
	}, [])

	return (
		<header className={cn('border-b', className)}>
			<Container className='flex items-center justify-between py-8 '>
				<Link href='/'>
					<div className='flex items-center gap-4'>
						<Image src='/logo.png' alt='logo' width={35} height={35}></Image>
						<div>
							<h1 className='text-2xl uppercase font-black'>Next Pizza</h1>
							<p className='text-sm text-gray-400 leading-3'>
								вкусно уже некуда
							</p>
						</div>
					</div>
				</Link>

				{hasSearch && (
					<div className='flex-1 mx-10'>
						<SearchInput />
					</div>
				)}
				<div className='flex items-center gap-3'>
					<AuthModal
						open={openAuthModal}
						onClose={() => setOpenAuthModal(false)}
					/>

					<ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />
					{hasCart && <CartButton />}
				</div>
			</Container>
		</header>
	)
}
