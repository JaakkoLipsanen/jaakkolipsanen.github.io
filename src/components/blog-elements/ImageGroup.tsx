import * as React from 'react'
import styled from 'styled-components'
import aws from '../../aws'
import { Image } from '../../blog'
import { ImageQuality } from '../../common'

const isPortrait = (img: Image) => img.resolution.height > img.resolution.width

type ImageRow = { images: Image[] }
const generateRows = (images: Image[]): ImageRow[] => {
	const rows = []

	let currentIndex = 0
	let lastRowImageCount = 0

	const getNextRowImageCount = () => {
		const remaining = images.length - currentIndex
		const currentImage = images[currentIndex]

		if (remaining <= 2) return remaining
		if (lastRowImageCount === 1) return 2
		else {
			return isPortrait(currentImage) ? 2 : 1
		}
	}

	while (currentIndex < images.length) {
		const rowImageCount = getNextRowImageCount()
		const rowImages = images.splice(currentIndex, rowImageCount)

		currentIndex += rowImageCount
		lastRowImageCount = rowImageCount

		rows.push({ images: rowImages })
	}

	return rows
}

const ImageGroupContainer = styled.div`
	width: 100%;
	margin-bottom: 16px;
`

const GroupRowContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const GroupImage = styled.img``

type GroupRowProps = { images: Image[]; blogPostName: string }
const GroupRow = (props: GroupRowProps) => {
	return (
		<GroupRowContainer>
			{props.images.map(img => (
				<GroupImage
					key={img.filename}
					src={aws.getImageUrl(
						props.blogPostName,
						ImageQuality.FullHD,
						img.filename
					)}
				/>
			))}
		</GroupRowContainer>
	)
}

type ImageGroupProps = { blogPostName: string; images: Image[] }
export const ImageGroup = (props: ImageGroupProps) => {
	const rows = generateRows(props.images)

	return (
		<ImageGroupContainer>
			{rows.map((row, i) => (
				<GroupRow
					key={i}
					images={row.images}
					blogPostName={props.blogPostName}
				/>
			))}
		</ImageGroupContainer>
	)
}
