import styled from 'styled-components'

type TakeHeightProps = { height: string }
export const TakeHeight = styled.div<TakeHeightProps>`
	height: ${props => props.height};
`
