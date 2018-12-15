function i18n(msg) {
   return chrome.i18n.getMessage(msg);
}

function internationalize(str) {
	// "__MSG_name__"
	// return str.replace( /__MSG_([^_]+)__/g, function ( m, key ) {
	return str.replace(/__MSG_(\w+)__/g, function (m, key) {
		if (i18n(key) !== "undefined" && i18n(key) !== "") {
			return i18n(key);
		} else {
			return '[i18n error: ' + key + ']';
		}
	});
}

function setLocalization(parent) {
	let html = document.getElementsByTagName(parent || "body")[0];
	html.innerHTML = internationalize(html.innerHTML)
}

document.addEventListener('DOMContentLoaded', function () {
// window.addEventListener('load', function (evt) {
   setLocalization('html');
});
