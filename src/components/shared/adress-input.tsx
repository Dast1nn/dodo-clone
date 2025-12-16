'use client'
import React from 'react'
import 'react-dadata/dist/react-dadata.css'
interface Props {
	onChange?: (value?: string) => void
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
	return (
		<input
			type='text'
			placeholder='Введите адрес...'
			className='border rounded-md p-2 w-full'
			onChange={e => onChange?.(e.target.value)}
		/>
	)
}
// AIzaSyBi4xRZmkJNN4_ulLNO_7uoxGoNicLqmJw
