import React, { ReactNode } from 'react'

type WrapperSize = 'regular' | 'small'

interface IWrapperProps {
	children: ReactNode
	size?: WrapperSize
}

export const Wrapper = ({ children, size = 'regular' }: IWrapperProps) => {
	return (
		<div className={`mt-[40px] mx-auto ${size === 'small' ? 'max-w-[900px]' : 'max-w-[600px]'}`}>
			{children}
		</div>
	)
}
