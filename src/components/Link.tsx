import * as React from 'react'
import { history } from '../routing/history'

type LinkProps = { children: JSX.Element[]; href: string }
export const Link = (props: LinkProps) => (
	<a
		{...props}
		onClick={e => {
			e.preventDefault()
			history.push(props.href)
		}}
	>
		{props.children}
	</a>
)
