import * as React from 'react'
import styled from 'styled-components'

const variants = {
	body: styled.p``
}

type TextVariant = keyof typeof variants
type TextProps = {
	variant: TextVariant
	color: string
	children: React.ReactNode
	className?: string
}

export const Text = ({
	variant = 'body',
	children,
	className,
	color = 'black'
}: TextProps) => {
	const Element = variants[variant]
	return (
		<Element className={className} style={{ color }}>
			{children}
		</Element>
	)
}
