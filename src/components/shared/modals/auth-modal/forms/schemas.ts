import { z } from 'zod'
export const passwordSchema = z
	.string()
	.min(4, { message: 'Пароль должен содержать не менее 4 символов' })

export const formLoginSchema = z.object({
	email: z.string().email({ message: 'Введите корректный email' }),
	password: passwordSchema,
})

export const formRegisterSchema = formLoginSchema
	.merge(
		z.object({
			fullName: z.string().min(2, { message: 'Введите имя и фамилия' }),
			confirmPassword: passwordSchema,
		})
	)
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли должны совпадать',
		path: ['confirmPassword'],
	})

export type TFormLoginValues = z.infer<typeof formLoginSchema>
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>
