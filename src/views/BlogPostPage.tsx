import * as React from 'react';
import styled from 'styled-components';

import history from '../history';
import { BlogPostElement } from '../blog';
import { findBlogPostInfoByName, loadBlogPost, BlogPost } from '../blog';
import { ImageQuality } from '../common';
import CoverImage from '../components/CoverImage';
import { Image, ImageGroup, Text, Header, Unknown } from '../components/blog-elements';

const BlogPostPageLayout = styled.div`
	width: 100vw;
	margin: 0;
	position: absolute;
	top: 0;
`;

const BlogContentBackground = styled.div`
	background-color: white;
`;

const BlogContentContainer = styled.div`
	max-width: 1000px;
	padding: 0 24px;
	margin: auto;
	overflow: hidden;
`;

type BlogContentProps = { elements: BlogPostElement[], blogPostName: string };
const BlogContent = (props: BlogContentProps) => {
	const Element = ({ element }: { element: BlogPostElement }) => {
		switch (element.type) {
			case 'text': return <Text>{element.text}</Text>;
			case 'header': return <Header>{element.title}</Header>;
			case 'image': return <Image blogPostName={props.blogPostName} image={element.image} quality={ImageQuality.FullHD} />;
			case 'image-group': return <ImageGroup blogPostName={props.blogPostName} images={element.images} />;
			default: return <Unknown element={element} />;
		}
	};

	return (
		<BlogContentBackground>
			<BlogContentContainer>
				{props.elements.map((element, i) => <Element key={i} element={element} />)}
			</BlogContentContainer>
		</BlogContentBackground>
	);
};

interface BlogPostPageProps { name: string; }
interface BlogPostPageState { blogPost: BlogPost | null; }
class BlogPostPage extends React.Component<BlogPostPageProps, BlogPostPageState> {
	state: BlogPostPageState = {
		blogPost: null
	};

	async componentDidMount() {
		const blogPostInfo = findBlogPostInfoByName(this.props.name);
		if (!blogPostInfo) {
			return history.push('/404');
		}

		this.setState({ blogPost: await loadBlogPost(blogPostInfo) });
	}

	render() {
		if (!this.state.blogPost) {
			return null;
		}

		return (
			<BlogPostPageLayout>
				<CoverImage blogPost={this.state.blogPost} height={'85vh'} />
				<BlogContent blogPostName={this.state.blogPost.name} elements={this.state.blogPost.content} />
			</BlogPostPageLayout>
		);
	}
}

export default BlogPostPage;
