try {
   // throw "test";
   document?.body;
} catch (error) {
   return alert(GM_info.script.name + " ERROR!\nYour browser does not support chaining operator.");
}
if (GM_info?.scriptHandler == 'Greasemonkey') return alert(GM_info.script.name + " doesn't work with GreaseMonkey!");
