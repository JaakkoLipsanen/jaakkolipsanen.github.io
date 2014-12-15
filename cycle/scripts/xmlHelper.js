// this function still fails in chrome in local mode. the online version works
function loadXML(filePath) {
	var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); // ActiveX == for old IE's			
					
	xhttp.open("GET", filePath, false);
	xhttp.setRequestHeader('Content-Type', 'text/xml');
	xhttp.send();
					
	// xhttp.responseXml does not for some reason work on chrome or IE. so instead, use xhttp.responseText and parse "manually"
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
	return xmlDoc;
} 