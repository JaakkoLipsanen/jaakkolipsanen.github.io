import { Trip } from './api/trip'
import { ImageQuality } from './common'

const AWS_BASE_URL = 'https://s3.eu-central-1.amazonaws.com/flai'

const transformImageFilename = (quality: ImageQuality, filename: string) =>
	quality !== ImageQuality.Thumbnail
		? filename
		: filename.replace('.jpg|.jpeg|.JPG|.JPEG', '.png')

export const aws = {
	BASE_URL: AWS_BASE_URL,
	blogPostsListUrl: `${AWS_BASE_URL}/cycle/blog/posts.txt`,
	getBlogPostUrl: (blogPostName: string) =>
		`${AWS_BASE_URL}/cycle/blog/posts/${blogPostName}/post.txt`,
	tripInfosUrl: `${AWS_BASE_URL}/cycle/tours.json`,
	getRouteUrl: (trip: Trip) =>
		`${AWS_BASE_URL}/cycle/routes/${trip.shortName
			.toLowerCase()
			.replace(/ /g, '')}/route.txt`,
	getImageUrl: (
		blogPostName: string,
		imageQuality: ImageQuality,
		imageFilename: string
	) =>
		`${AWS_BASE_URL}/cycle/blog/posts/${blogPostName}/` +
		`${imageQuality}/${transformImageFilename(imageQuality, imageFilename)}`
}
