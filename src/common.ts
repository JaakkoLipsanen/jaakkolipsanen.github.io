export enum ImageQuality {
	Original = 'orig',
	FullHD = '1080p',
	HD = '720p',
	SD = '480p',
	LD = '360p',
	Thumbnail = '10p' // png
}

export interface DateRange { start: number; end: number; }

export function formatDateRange(dateRange: DateRange) {
	if (dateRange.start === 0 && dateRange.end === 0) {
		return 'Preparations';
	} else if (dateRange.start === dateRange.end) {
		return `Day ${dateRange.start}`;
	}
	
	return `Day ${dateRange.start}-${dateRange.end}`;
}