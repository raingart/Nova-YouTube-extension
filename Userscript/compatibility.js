// support check

if (typeof GM_info === 'undefined') {
   alert('Direct Chromium is not supported now');
   // errorAlert('plain Chrome (Or Opera, or scriptish, or Safari, or rarer)');
   // See https://stackoverflow.com/a/2401861/331508 for optional browser sniffing code.
}

// chaining operator test
try {
   // throw 'test';
   document?.body;
} catch (error) {
   errorAlert('Your browser does not support chaining operator');
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
      errorAlert(GM_info.scriptHandler + ' incomplete support', true);
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

// isMOSupported test
if (!('MutationObserver' in window)) {
   errorAlert('MutationObserver not supported');
}

function errorAlert(text = '', continue_execute) {
   alert(GM_info.script.name + ' Error!\n' + text);
   if (!continue_execute) {
      throw GM_info.script.name + ' crashed!\n' + text;
   }
}
