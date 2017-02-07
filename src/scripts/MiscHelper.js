
// http://stackoverflow.com/a/7934009
export function EnterFullScreen(element) {
	var func = element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen;
	func.call(element);
}

export function ExitFullScreen() {
	var func = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
	func.call(document);
}

export function IsFullScreen() {
	return (document.fullscreenElement && document.fullscreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen;
}

export function OnFullscreenChange(callback) {
	$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange", callback);
}

export function IsTouchDevice() {
	return "ontouchstart" in window || // works on most browsers
			"onmsgesturechange" in window; // works on ie10
};

export function Assert(condition, message) {
	if (!condition) {
		throw message || "Assertion failed";
	}
}

export function IsEmptyOrWhitespace(str) {
	return (str.length === 0 || !str.trim());
};

export function GetRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Shuffle(array) {
	let j, x, i;
	for (i = array.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = array[i - 1];
		array[i - 1] = array[j];
		array[j] = x;
	}

	return array;
}
