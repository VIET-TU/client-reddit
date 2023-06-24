import { ReactNode } from 'react'
import Navbar from './Navbar'
import { Wrapper } from './Wrapper'

export interface ILayoutProps {
	children: ReactNode
}

export default function Layout({ children }: ILayoutProps) {
	return (
		<>
			<Navbar></Navbar>
			<Wrapper>{children}</Wrapper>
		</>
	)
}
