import { aws } from '../../aws'
import { ImageQuality } from '../../common'

const slideshowItems = [
	{
		src: `${aws.getImageUrl(
			'and-back-again',
			ImageQuality.Original,
			'1060788.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'angel-has-landed',
			ImageQuality.Original,
			'1070479.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'colorado',
			ImageQuality.Original,
			'1100202.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'day-one',
			ImageQuality.Original,
			'1140612~2.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'down-and-back-up-again',
			ImageQuality.Original,
			'1180150~2.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'enter-capitol',
			ImageQuality.Original,
			'1080602.jpg'
		)}`,
		description: 'Zion National Park',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'lockhart-basin',
			ImageQuality.Original,
			'1090621.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},

	{
		src: `${aws.getImageUrl(
			'negev-mitzpe-ramon-loop',
			ImageQuality.Original,
			'1160850~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'negev-mitzpe-ramon-loop',
			ImageQuality.Original,
			'1170226~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'wadi-rum',
			ImageQuality.Original,
			'1170842~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'through-west-bank-to-jerusalem',
			ImageQuality.Original,
			'1180639~2.jpg'
		)}`,
		description: 'lockhart-basin',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'the-green-israel',
			ImageQuality.Original,
			'1140788~2.jpg'
		)}`,
		description: 'The Green Israel',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'ruby-beach-and-rest-of-washington',
			ImageQuality.Original,
			'1120610.jpg'
		)}`,
		description: 'The Green Israel',
		year: '2016'
	},
	{
		src: `${aws.getImageUrl(
			'oregon-coast-part-1',
			ImageQuality.Original,
			'P1120983.JPG'
		)}`,
		description: 'The Green Israel',
		year: '2016'
	}
]

export default (state = { items: slideshowItems }) => state
