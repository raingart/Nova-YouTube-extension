try {
   // throw 'test';
   document?.body;
} catch (error) {
   return alert(GM_info.script.name + ' Error!\nYour browser does not support chaining operator.');
}
if (GM_info?.scriptHandler == 'Greasemonkey') alert(GM_info.script.name + ' Error!\nGreasemonkey is not supported.');
