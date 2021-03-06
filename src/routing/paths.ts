export const paths = {
	home: '/',
	blogList: '/blog',
	gear: '/gear',
	tours: '/tours',

	blogPostTemplate: '/blog/:name',
	buildBlogPostPath: (postName: string) => `/blog/${postName}`
}
