// https://adguard.com/kb/general/userscripts/

// support check start

if (typeof GM_info === 'undefined') {
   alert('Direct Chromium is not supported now');
   // errorAlert('plain Chrome (Or Opera, or scriptish, or Safari, or rarer)');
   // See https://stackoverflow.com/a/2401861/331508 for optional browser sniffing code.
}

// isMOSupported test
if (!('MutationObserver' in window)) {
   errorAlert('MutationObserver not supported');
}

// chaining operator test
try {
   // throw 'test';
   document?.body;
} catch (error) {
   errorAlert('Your browser does not support chaining operator');
}

// css ":has()" test
if (!CSS.supports('selector(:has(*))') && !localStorage.hasOwnProperty('nova_css_has_skipped')) {
   if (confirm('Your browser does not support css ":has()" operator.\nApproximately 5% of opportunities will be unavailable')) {
      localStorage.setItem('nova_css_has_skipped', true);
   }
   // errorAlert('Your browser does not support css ":has()" operator.\nApproximately 5% of opportunities will be unavailable', false);
}

switch (GM_info.scriptHandler) {
   // ok
   case 'Tampermonkey': // https://www.tampermonkey.net/
   case 'Violentmonkey': // https://github.com/violentmonkey/violentmonkey
   case 'ScriptCat': // https://github.com/scriptscat/scriptcat
      // console.debug('compatibility ok');
      break;

   // partially
   case 'FireMonkey': // https://github.com/erosman/support/tree/FireMonkey (https://addons.mozilla.org/fr/firefox/addon/firemonkey/)
      errorAlert(GM_info.scriptHandler + ' incomplete support', false);
      break;

   // bad
   case 'Greasemonkey': // https://github.com/greasemonkey/greasemonkey
      errorAlert(GM_info.scriptHandler + ' is not supported');
      break;

   // unknown monkey (not tested)
   default:
      if (typeof GM_getValue !== 'function') {
         errorAlert('Your ' + GM_info.scriptHandler + ' does not support/no access the API being used. Contact the developer')
      }
      break;
}

function errorAlert(text = '', stop_execute = true) {
   alert(GM_info.script.name + ' Error!\n' + text);
   if (stop_execute) {
      throw GM_info.script.name + ' crashed!\n' + text;
   }
}
