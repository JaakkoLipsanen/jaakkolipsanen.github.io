import * as React from 'react'
import styled from 'styled-components'

const Centered = styled.h1`
	position: absolute;
	top: 0;
	margin: 0;
	width: 100vw;
	height: 100vh;

	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	pointer-events: none;
`

export const NotFound = () => <Centered>Page not found</Centered>
