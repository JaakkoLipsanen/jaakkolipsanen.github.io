import * as React from 'react';
import styled from 'styled-components';
import * as blog from '../blog';

import BlogPostPreview from '../components/BlogPostPreview';

const BlogListPageLayout = styled.div`
	width: 70vw;
	max-width: 800px;
	margin: auto;
`;

class BlogListPage extends React.Component<{}, {}> {
	render() {
		const blogPostInfosToRender = blog.getBlogPostInfos().slice().reverse();
		return (
			<BlogListPageLayout>
				{blogPostInfosToRender.map(blogPost => 
					<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} /> 
				)}
			</BlogListPageLayout>
		);
	}
}

export default BlogListPage;
