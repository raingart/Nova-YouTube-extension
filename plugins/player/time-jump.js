_plugins_conteiner.push({
   name: 'Time jump',
   id: 'time-jump',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(player => {
            doubleKeyPressListener(jumpTime, user_settings.jump_hotkey);

            function jumpTime(event) {
               if (document.activeElement.tagName.toLowerCase() !== "input" // search-input
                  && !document.activeElement.parentElement.slot.toLowerCase().includes('input') // comment-area
                  // && !window.getSelection()
               ) {
                  const sec = player.getCurrentTime() + +user_settings.jump_step;
                  // console.debug('seekTo', sec);
                  player.seekTo(sec);
               }
            }
         });

      function doubleKeyPressListener(callback, keyCodeFilter) {
         let
            pressed,
            isDoublePress,
            lastPressed = parseInt(keyCodeFilter) || null;

         const
            timeOut = () => setTimeout(() => isDoublePress = false, 500),
            handleDoublePresss = key => {
               // console.debug(key.key, 'pressed two times');
               if (callback && typeof callback === 'function') return callback(key);
            };

         function keyPress(key) {
            pressed = key.keyCode;
            // console.log('doubleKeyPressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);
            if (isDoublePress && pressed === lastPressed) {
               isDoublePress = false;
               handleDoublePresss(key);
            } else {
               isDoublePress = true;
               timeOut();
            }

            if (!keyCodeFilter) lastPressed = pressed;
         }
         // window.onkeyup = key => keyPress(key);
         document.addEventListener("keyup", keyPress);
      }

   },
   opt_export: {
      'jump_step': {
         _tagName: 'input',
         label: 'Step',
         type: 'number',
         title: 'sec',
         placeholder: 'sec',
         min: 3,
         max: 300,
         value: 30,
      },
      'jump_hotkey': {
         _tagName: 'select',
         label: 'Hotkey (double tap)',
         options: [
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'alt', value: 18 },
            { label: 'shift', value: 16 },
            { label: 'ctrl', value: 17, selected: true },
         ]
      },
   },
});
