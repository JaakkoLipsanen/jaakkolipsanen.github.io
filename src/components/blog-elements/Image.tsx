import * as React from 'react'
import styled from 'styled-components'

import { Image as ImageDescription } from '../../api/blog'
import { aws } from '../../aws'
import { ImageQuality } from '../../common'

const BlogImageContainer = styled.div`
	width: 100%;
	margin-bottom: 16px;
`

const BlogImg = styled.img`
	width: 100%;
`

const BlogImageText = styled.p`
	font-style: italic;
	text-align: center;
	margin: 0;
`

type BlogImageProps = {
	blogPostName: string
	quality: ImageQuality
	image: ImageDescription
}

export const Image = (props: BlogImageProps) => (
	<BlogImageContainer>
		<BlogImg
			src={aws.getImageUrl(
				props.blogPostName,
				ImageQuality.FullHD,
				props.image.filename
			)}
		/>
		<BlogImageText>{props.image.imageText}</BlogImageText>
	</BlogImageContainer>
)
