import "jquery";

export function Load(callback) {
	const ScriptID = "_gmapsSource";
 /* if($("#" + ScriptID).exists()) {
		return $("#" + ScriptID);
	} */

	const googleMapsScript = document.createElement("SCRIPT");
	googleMapsScript.setAttribute("id", ScriptID);
	googleMapsScript.setAttribute("src", "https://maps.google.com/maps/api/js?libraries=geometry&sensor=true&region=ES");

	googleMapsScript.onreadystatechanged = () => {
		callback();
	};

	document.body.appendChild(googleMapsScript);
}
