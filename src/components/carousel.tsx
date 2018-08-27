import * as React from 'react'
import posed, { PoseGroup } from 'react-pose'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'

const CarouselContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	background: rgba(0, 0, 0, 0.1);
	z-index: -1;
`

const ItemContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;

	opacity: 1;
	transition: opacity 2.5s ease-in-out;

	&.fade-enter:not(.fade-enter-active) {
		opacity: 0;
	}

	&.fade-exit-active,
	&.fade-exit {
		z-index: -1;
	}
`

const PosedItemContainer = posed(ItemContainer)({
	preEnter: { opacity: 0 },
	enter: { opacity: 1, transition: { duration: 2500, ease: 'easeInOut' } },
	exit: { opacity: 1, transition: { duration: 2500 } } // no exit animation
})

type CarouselState = { index: number; pose: boolean }
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
	state = { index: 0, pose: true }
	_z = 0
	private _intervalTimer?: NodeJS.Timer

	componentDidMount() {
		this._intervalTimer = setInterval(
			() => this.setState(state => ({ index: state.index + 1 })),
			this.props.autoplayTime || 3000
		)

		window.addEventListener(
			'keydown',
			e => e.key === 'a' && this.setState({ pose: !this.state.pose })
		)
	}

	componentWillUnmount() {
		clearInterval(this._intervalTimer!)
	}

	render() {
		const { index, pose } = this.state
		const { render, items, className } = this.props

		return (
			<CarouselContainer className={className}>
				{pose && (
					<PoseGroup animateOnMount preEnterPose="preEnter">
						<PosedItemContainer
							key={index % items.length}
							style={{ transition: 'none' }}
						>
							{render({ item: items[index % items.length] })}
						</PosedItemContainer>
					</PoseGroup>
				)}
				{!pose && (
					<TransitionGroup component={null} appear>
						<CSSTransition
							key={index % items.length}
							classNames="fade"
							timeout={2500}
						>
							<ItemContainer key={index % items.length}>
								{render({ item: items[index % items.length] })}
							</ItemContainer>
						</CSSTransition>
					</TransitionGroup>
				)}
				<p
					style={{
						position: 'absolute',
						top: '50vh',
						color: 'white',
						zIndex: 1000000
					}}
					onClick={_ => this.setState({ pose: !pose })}
				>
					{pose ? 'pose' : 'rtg'}
				</p>
			</CarouselContainer>
		)
	}
}
