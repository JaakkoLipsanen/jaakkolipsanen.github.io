
export async function LoadTextAsync(filePath) {
	return new Promise(function(resolve, reject) {
		try {
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", filePath, true);
			xhttp.overrideMimeType('text/plain');

			xhttp.onload = function(e) {
				resolve(xhttp.responseText);
			};

			xhttp.send();
		}
		catch(err) {
			reject(err);
		}
	});
}

export async function LoadXmlAsync(filePath) {
	return new Promise(function(resolve, reject) {
		try {
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", filePath, true);
			xhttp.overrideMimeType('text/xml');

			xhttp.onload = function(e) {
				// xhttp.responseXml does not for some reason work on chrome or IE. so instead, use xhttp.responseText and parse "manually"
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
				resolve(xmlDoc);
			};

			xhttp.send();
		}
		catch(err) {
			reject(err);
		}
	});
}

export function GetUriDirectory(url) {
	return url.substring(0, url.lastIndexOf("/")).trim();
}

export function GetUriFileName(url) {
	return url.substring(url.lastIndexOf("/")).trim();
}
