import { Nunito } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-nunito',
	weight: ['400', '500', '600', '700', '800', '900'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<head>
				<link href='/logo.png' data-rh='true' rel='icon' />
			</head>
			<body className={`${nunito.variable}  antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
