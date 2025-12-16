import { getUserSession } from '@/lib'
import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const user = await getUserSession()

		if (!user) {
			return NextResponse.json(
				{ message: 'Вы не авторизованы' },
				{ status: 401 }
			)
		}
		const data = await prisma.user.findUnique({
			where: { id: Number(user.id) },
			select: {
				fullName: true,
				email: true,
				password: false,
			},
		})
		return NextResponse.json(data)
	} catch (error) {}
}
