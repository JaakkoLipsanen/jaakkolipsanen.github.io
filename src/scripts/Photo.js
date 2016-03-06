export const PhotoQuality = {
	Original: "orig",
	FullHD: "1080p",
}

export class Photo {
	constructor(folder, fileName, width = -1, height = -1) {
		this.Folder = folder;
		this.FileName = fileName;
		this.Width = width;
		this.Height = height;
	}

	get AspectRatio() {
		return this.Width / this.Height;
	}

	FullPath(photoQuality = PhotoQuality.FullHD) {
		return this.Folder + "/" + photoQuality + "/" + this.FileName;
	}

	get IsPortrait() {
		return this.AspectRatio < 1;
	}
}
