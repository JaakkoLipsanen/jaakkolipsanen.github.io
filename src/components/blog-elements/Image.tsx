import * as React from 'react';
import styled from 'styled-components';
import aws from '../../aws';
import { ImageQuality } from '../../common';
import { Image } from '../../blog';

const BlogImageContainer = styled.div`
	width: 100%;
	margin-bottom: 16px;
`;

const BlogImg = styled.img`
	width: 100%;
`;

const BlogImageText = styled.p`
	font-style: italic;
	text-align: center;
	margin: 0;
`;

type BlogImageProps = { blogPostName: string, quality: ImageQuality, image: Image };
const BlogImage = (props: BlogImageProps) => (
	<BlogImageContainer>
		<BlogImg src={aws.getImageUrl(props.blogPostName, ImageQuality.FullHD, props.image.filename)} />
		<BlogImageText>{props.image.imageText}</BlogImageText>
	</BlogImageContainer>
);

export default BlogImage;