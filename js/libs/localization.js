const i18n = msg => chrome.i18n.getMessage(msg);

function internationalize(name) {
	// "__MSG_name__"
	// return name.replace( /__MSG_([^_]+)__/g, function ( m, key ) {
	return name.replace(/__MSG_(\w+)__/g, function (m, key) {
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

document.addEventListener('DOMContentLoaded', () => setLocalization('html'));
