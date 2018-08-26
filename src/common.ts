export enum ImageQuality {
	Original = 'orig',
	FullHD = '1080p',
	HD = '720p',
	SD = '480p',
	LD = '360p',
	Thumbnail = '10p' // png
}

export interface Size {
	width: number
	height: number
}

export interface DateRange {
	start: number
	end: number
}

export function parseSize(str: string) {
	const [width, height] = str.split('x')
	return { width: parseInt(width, 10), height: parseInt(height, 10) }
}

export function formatDateRange(dateRange: DateRange) {
	if (dateRange.start === 0 && dateRange.end === 0) {
		return 'Preparations'
	} else if (dateRange.start === dateRange.end) {
		return `Day ${dateRange.start}`
	}

	return `Day ${dateRange.start}-${dateRange.end}`
}

export function shuffle<T>(_arr: ReadonlyArray<T>) {
	const arr = [..._arr]
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}

	return arr
}
