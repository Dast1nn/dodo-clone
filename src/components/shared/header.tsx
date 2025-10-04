import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CartButton, SearchInput } from '.'
import { Button } from '../ui'
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
					<Button variant='outline' className='flex items-center gap-1'>
						{' '}
						<User size={16} />
						Войти
					</Button>
					{hasCart && <CartButton />}
				</div>
			</Container>
		</header>
	)
}
