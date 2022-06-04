try {
   // throw 'test';
   document?.body;
} catch (error) {
   return alert(GM_info.script.name + ' Error!\nYour browser does not support chaining operator.');
}

if (GM_info?.scriptHandler == 'Greasemonkey') {
   return alert(GM_info.script.name + ' Error!\nGreasemonkey is not supported.');
}

// isMOSupported
if (!('MutationObserver' in window)) {
   return alert(GM_info.script.name + ' Error!\nMutationObserver not supported.');
}
