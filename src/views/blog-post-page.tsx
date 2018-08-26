import * as React from 'react'
import styled from 'styled-components'

import { BlogPost, BlogPostElement } from '../blog'
import { ImageQuality } from '../common'
import {
	Header,
	Image,
	ImageGroup,
	Text,
	Unknown
} from '../components/blog-elements'
import { CoverImage } from '../components/cover-image'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers'
import { blogPostByNameSelector } from '../redux/selectors/blog'

const BlogPostPageLayout = styled.div`
	width: 100vw;
	margin: 0;
	position: absolute;
	top: 0;
`

const BlogContentBackground = styled.div`
	background-color: white;
`

const BlogContentContainer = styled.div`
	max-width: 1000px;
	padding: 0 24px;
	margin: auto;
	overflow: hidden;
`

type BlogContentProps = { elements: BlogPostElement[]; blogPostName: string }
const BlogContent = (props: BlogContentProps) => {
	const Element = ({ element }: { element: BlogPostElement }) => {
		switch (element.type) {
			case 'text':
				return <Text>{element.text}</Text>
			case 'header':
				return <Header>{element.title}</Header>
			case 'image':
				return (
					<Image
						blogPostName={props.blogPostName}
						image={element.image}
						quality={ImageQuality.FullHD}
					/>
				)
			case 'image-group':
				return (
					<ImageGroup
						blogPostName={props.blogPostName}
						images={element.images}
					/>
				)
			default:
				return <Unknown element={element} />
		}
	}

	return (
		<BlogContentBackground>
			<BlogContentContainer>
				{props.elements.map((element, i) => (
					<Element key={i} element={element} />
				))}
			</BlogContentContainer>
		</BlogContentBackground>
	)
}

interface BlogPostPageProps {
	name: string
	blogPost?: BlogPost
}

const _BlogPostPage = ({ blogPost }: BlogPostPageProps) => {
	if (!blogPost) {
		return null
	}

	return (
		<BlogPostPageLayout>
			<CoverImage blogPost={blogPost} height={'85vh'} />
			<BlogContent
				blogPostName={blogPost.name}
				elements={blogPost.content}
			/>
		</BlogPostPageLayout>
	)
}

export const BlogPostPage = connect(
	(state: RootState, props: BlogPostPageProps) => ({
		blogPost: blogPostByNameSelector(props.name)(state)
	})
)(_BlogPostPage)
