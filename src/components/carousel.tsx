import * as React from 'react'
import posed, { PoseGroup } from 'react-pose'
import styled from 'styled-components'

const CarouselContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	background: rgba(0, 0, 0, 0.1);
`

const ItemContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;

	will-change: opacity;
`

const PosedItemContainer = posed(ItemContainer)({
	preEnter: { opacity: 0 },
	enter: { opacity: 1, transition: { duration: 1500, ease: 'easeInOut' } },
	exit: { opacity: 1, transition: { duration: 1500 } } // no exit animation
})

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
				<PoseGroup animateOnMount preEnterPose="preEnter">
					<PosedItemContainer key={index % items.length}>
						{render({ item: items[index % items.length] })}
					</PosedItemContainer>
				</PoseGroup>
			</CarouselContainer>
		)
	}
}
