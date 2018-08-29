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
	preload: (args: { item: T; index: number }) => Promise<unknown>
}

export class Carousel<T> extends React.Component<
	CarouselProps<T>,
	CarouselState
> {
	state = { index: 0 }
	private _isNextOneLoaded = false
	private _nextItemLoadPromise?: Promise<unknown>
	private _timeoutTimer?: NodeJS.Timer

	componentDidMount() {
		this._scheduleMoveToNext()
		this._preloadNextItem()
	}

	componentWillUnmount() {
		clearTimeout(this._timeoutTimer!)
	}

	_wrapIndex = (i: number) => i % this.props.items.length
	_scheduleMoveToNext = () => {
		this._timeoutTimer = setTimeout(
			this._moveToNextItem,
			this.props.autoplayTime || 3000
		)
	}

	_moveToNextItem = async () => {
		if (!this._isNextOneLoaded && this._nextItemLoadPromise) {
			await this._nextItemLoadPromise
		}

		this.setState(
			state => ({ index: this._wrapIndex(state.index + 1) }),
			() => {
				this._isNextOneLoaded = false
				this._nextItemLoadPromise = undefined

				this._scheduleMoveToNext()
				this._preloadNextItem()
			}
		)
	}

	_preloadNextItem = () => {
		const { index } = this.state
		const { preload, items } = this.props

		this._isNextOneLoaded = false
		this._nextItemLoadPromise = preload({
			item: items[this._wrapIndex(index + 1)],
			index: this._wrapIndex(index + 1)
		}).catch(_ => true)
	}

	render() {
		const { index } = this.state
		const { render, items, className } = this.props

		return (
			<CarouselContainer className={className}>
				<PoseGroup animateOnMount preEnterPose="preEnter">
					<PosedItemContainer key={index}>
						{render({ item: items[index] })}
					</PosedItemContainer>
				</PoseGroup>
			</CarouselContainer>
		)
	}
}
