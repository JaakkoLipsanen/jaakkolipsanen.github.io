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

	get FullPath() {
		return this.Folder + "/" + this.FileName;
	}

	get IsPortrait() {
		return this.AspectRatio < 1;
	}
}
