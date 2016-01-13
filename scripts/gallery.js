var ImageLoadDirection = {
	Current : 0,
	Previous: -1,
	Next: 1,
};

var ImageQuality = {
	LowQuality: 0,
	HighQuality: 1,
	UltraHighQuality: 2,
};

var ImageQualityToFolder = [
	"720p",
	"1080p",
	"fullsize",
];

var ImageQualityToText = [
	"LQ",
	"HQ",
	"UHQ",
];

function ImagePreloader() {
	this.IsPreloadCompleted = true;

	var preloadedImage = new Image();
	preloadedImage.onload = function() {
		this.IsPreloadCompleted = true;
	}.bind(this);
	
	this.PreloadImage = function(url) {
		this.IsPreloadCompleted = false;
		preloadedImage.src = url; 
	}.bind(this);
}

function Photo(photoName, description) {
	this.PhotoName = photoName;
	this.Description = description;
}

function GallerySource(galleryTitle, galleryFolder) {
	this.Folder = galleryFolder;
	this.Photos = LoadGalleryPhotos(galleryFolder + "/gallery-description.txt");
	this.PhotoCount = this.Photos.length;
	this.GalleryTitle = galleryTitle;
}

function Gallery(containerElement, gallerySourceFolder) {
	this.CurrentSource = null;
	this.CurrentImageQuality = IsMobile() ? ImageQuality.LowQuality : ImageQuality.HighQuality;
		
	var currentImageIndex = 0;
	var preloader = new ImagePreloader();

	var currentImageElementIndex = 0;
	var previousImageIndex = -1;
	
	$(containerElement).append(LoadTextFile(gallerySourceFolder + "gallery.html"));
	
	if($("#gallery-style").exists() == false) {
		$("body").append("<link rel='stylesheet' type='text/css' href='styles/gallery.css' />");
	}

	var updateImageStyles = function() {
		var image0 = $(containerElement).find(".gallery-image-0");
		var image1 = $(containerElement).find(".gallery-image-1");

		var updateImageStyle = function(img) {
			if(img.naturalWidth / $(containerElement).width() > img.naturalHeight / ($(containerElement).height())) {
				img.style.width = "100%";
				img.style.height = "auto";
			}
			else {
				img.style.width = "auto";
				img.style.height = "100%";
			}
		};
	
		updateImageStyle(image0[0]);
		updateImageStyle(image1[0]);
	};
	
	var updateImage = function(imageLoadDirection) {	
	
		var newIndex = currentImageIndex + imageLoadDirection;
		if(newIndex < 0 || newIndex >= this.PhotoCount) {
			return;
		}
		
		currentImageIndex = newIndex;
	
		var currentImage = $(containerElement).find(".gallery-image-" + (currentImageElementIndex % 2));
		var previousImage = $(containerElement).find(".gallery-image-" + ((currentImageElementIndex + 1) % 2));
		
		var onImageLoaded = function() {
			$(containerElement).find(".gallery-image-fade").css("opacity", "0");
			currentImage.css("opacity", "1");
			previousImage.css("opacity", "0");
			
			updateImageStyles();
		};
		
		var getPhotoSource = function(photoIndex) {
			return this.CurrentSource.Folder + "/" + ImageQualityToFolder[this.CurrentImageQuality] + "/" + this.CurrentSource.Photos[photoIndex].PhotoName
		}.bind(this);

		currentImageElementIndex++;
		currentImage.load(function() {
			onImageLoaded();
		});

		var newImageSource = GetAbsolutePath(getPhotoSource(currentImageIndex));
		if(currentImage.attr("src") != newImageSource) {
			currentImage.attr("src", newImageSource);
			
			// if image is not loaded OR the preloading is not completed and the new image is the next one (== the same one as what is being preloaded)
			if(!IsImageLoaded(newImageSource) || (!preloader.IsPreloadCompleted && imageLoadDirection == ImageLoadDirection.Next)) {
				$(containerElement).find(".gallery-image-fade").css("opacity", "0.5");
			}
		}
		else {
			onImageLoaded();
		}
		
		$(containerElement).find(".gallery-current-description").text(this.CurrentSource.Photos[currentImageIndex].Description);
		$(containerElement).find(".gallery-current-image-index").text(currentImageIndex + 1);
		
		previousImageIndex = currentImageIndex;
		
		if(currentImageIndex < this.CurrentSource.PhotoCount - 1) {
			preloader.PreloadImage(getPhotoSource(currentImageIndex + 1));
		}
		
	}.bind(this);
	
	this.MovePrevious = function() {
		updateImage(ImageLoadDirection.Previous);
	};
	
	this.MoveNext = function() {
		updateImage(ImageLoadDirection.Next);
	};

	var containerStyle = containerElement.style;
	var containerStyleDefaultValues = {
		maxWidth: containerStyle.maxWidth,
		maxHeight: containerStyle.maxHeight,
		width: containerStyle.width,
		height: containerStyle.height,
	};
	
	var onFullScreenChange = function() {
		if(IsFullScreen()) {
			$(containerElement).find(".gallery-toggle-fullscreen").attr("src", gallerySourceFolder + "../icons/reduce.png");
			containerElement.style.maxWidth = "100%";
			containerElement.style.maxHeight = "100%";
			containerElement.style.width = "100%";
			containerElement.style.height = "100%";
		}
		else {
			$(containerElement).find(".gallery-toggle-fullscreen").attr("src", gallerySourceFolder + "../icons/expand.png");
			containerElement.style.maxWidth = containerStyleDefaultValues.maxWidth;
			containerElement.style.maxHeight= containerStyleDefaultValues.maxHeight;
			containerElement.style.width = containerStyleDefaultValues.width;
			containerElement.style.height= containerStyleDefaultValues.height;
		}
		
		updateImageStyles();
	};
	
	$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange", function() {	
		onFullScreenChange();
	}.bind(this));
	
	$(containerElement).find(".gallery-toggle-fullscreen").click(function() {
		if(!IsFullScreen()) {	
			EnterFullScreen(containerElement);
		}
		else {
			ExitFullScreen();
		}
	}.bind(this));
	
	$(containerElement).find(".gallery-previous-button").click(function() {
		this.MovePrevious();
	}.bind(this));
	
	$(containerElement).find(".gallery-next-button").click(function() {
		this.MoveNext();
	}.bind(this));
	
	onFullScreenChange();

	$(containerElement).find(".gallery-previous-button").attr("src", gallerySourceFolder + "../icons/gallery/previous-icon.png");
	$(containerElement).find(".gallery-next-button").attr("src", gallerySourceFolder + "../icons/gallery/next-icon.png");
	
	$(containerElement).find(".gallery-toggle-quality").text(ImageQualityToText[this.CurrentImageQuality]);
	$(containerElement).find(".gallery-toggle-quality").click(function() {
		this.CurrentImageQuality++;
		if(this.CurrentImageQuality > ImageQuality.UltraHighQuality) {
			this.CurrentImageQuality = ImageQuality.LowQuality;
		}
		
		$(containerElement).find(".gallery-toggle-quality").text(ImageQualityToText[this.CurrentImageQuality]);
		updateImage(ImageLoadDirection.Current);
	}.bind(this));
	
	var inputState = new InputState();
	inputState.OnKeyPressed = function(key) {
		if(key == KeyCode.Left && IsFullScreen()) {
			this.MovePrevious();
		}
		else if(key == KeyCode.Right && IsFullScreen()) {
			this.MoveNext();
		}
	}.bind(this);
	
	$(window).resize(function() { 	
		updateImageStyles();
	});

	this.AssignSource = function(source) {
		this.CurrentSource = source;
		currentImageIndex = 0;
		previousImageIndex = -1;

		updateImage(ImageLoadDirection.Current);
		$(containerElement).find(".gallery-topbar-title").text(source.GalleryTitle);
		$(containerElement).find(".gallery-total-image-count").text(source.PhotoCount);

	}.bind(this);
}

function LoadGalleryPhotos(galleryDescriptionFilePath) {
	 /*
     * File Format:
     * 
     * Line 1. Version string ( eg. "v0.1" )
     * Line 2. Photo Count (eg. "123" )
     * Line 3. Are thumbnails generated (eg. "1" )
     * Line 4-end. <Photo Count> x photo format
     * 
     * 
     * Photo Format:
     * 
     * Line 1. Photo name
     * Line 2. Photo description
     * 
     * */
	
	var text = LoadTextFile(galleryDescriptionFilePath);
	var lines = text.split("\n");
	
	var versionString = lines[0];
	var photoCount = parseInt(lines[1]);
	var hasThumbnails = (lines[2] == "1");
	
	var photos = [];
	for(var i = 0, currentIndex = 3; i < photoCount; i++) {
		photos.push(new Photo(lines[currentIndex++], lines[currentIndex++]));
	}
	
	return photos;
}