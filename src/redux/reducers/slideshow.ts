import { aws } from '../../aws'
import { ImageQuality } from '../../common'

const getImageQuality = () => {
	const height = window.innerHeight * Math.min(1.75, window.devicePixelRatio)
	if (height > 1300) {
		return ImageQuality.Original
	} else if (height > 800) {
		return ImageQuality.FullHD
	}

	return ImageQuality.HD
}

const IMAGE_QUALITY = getImageQuality()
const slideshowItems = [
	{
		src: `${aws.getImageUrl('and-back-again', IMAGE_QUALITY, '1060788.jpg')}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'angel-has-landed',
			IMAGE_QUALITY,
			'1070479.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl('colorado', IMAGE_QUALITY, '1100202.jpg')}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl('day-one', IMAGE_QUALITY, '1140612~2.jpg')}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'down-and-back-up-again',
			IMAGE_QUALITY,
			'1180150~2.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl('enter-capitol', IMAGE_QUALITY, '1080602.jpg')}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl('lockhart-basin', IMAGE_QUALITY, '1090621.jpg')}`,
		description: 'lockhart-basin',
		year: '2016'
	},

	{
		src: `${aws.getImageUrl(
			'negev-mitzpe-ramon-loop',
			IMAGE_QUALITY,
			'1160850~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'negev-mitzpe-ramon-loop',
			IMAGE_QUALITY,
			'1170226~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl('wadi-rum', IMAGE_QUALITY, '1170842~2.jpg')}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'through-west-bank-to-jerusalem',
			IMAGE_QUALITY,
			'1180639~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'the-green-israel',
			IMAGE_QUALITY,
			'1140788~2.jpg'
		)}`,
		description: 'The Green Israel',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'ruby-beach-and-rest-of-washington',
			IMAGE_QUALITY,
			'1120610.jpg'
		)}`,
		description: 'The Green Israel',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'oregon-coast-part-1',
			IMAGE_QUALITY,
			'P1120983.JPG'
		)}`,
		description: 'The Green Israel',
		year: '2016'
	}
]

export default (state = { items: slideshowItems }) => state
