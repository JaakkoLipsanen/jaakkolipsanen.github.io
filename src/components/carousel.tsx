import * as React from 'react'
import styled from 'styled-components'

const CarouselContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`

const ItemContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
`

type CarouselState = { index: number }
type CarouselProps<T> = {
	render: (item: { item: T }) => JSX.Element
	items: ReadonlyArray<T>
	className?: string
	autoplayTime?: number
}

export class Carousel<T> extends React.Component<
	CarouselProps<T>,
	CarouselState
> {
	state = { index: 0 }
	private _intervalTimer?: NodeJS.Timer

	componentDidMount() {
		this._intervalTimer = setInterval(
			() => this.setState(state => ({ index: state.index + 1 })),
			this.props.autoplayTime || 3000
		)
	}

	componentWillUnmount() {
		clearInterval(this._intervalTimer!)
	}

	render() {
		const { index } = this.state
		const { render, items, className } = this.props

		return (
			<CarouselContainer className={className}>
				<ItemContainer key={index % items.length}>
					{render({ item: items[index % items.length] })}
				</ItemContainer>
			</CarouselContainer>
		)
	}
}
