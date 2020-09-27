_plugins.push({
   name: 'Time jump',
   id: 'time-jump',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: '#movie_player',
         callback: videoPlayer => {
            doubleKeyPressListener(jumpTime, user_settings.jump_hotkey);

            function jumpTime(event) {
               if (document.activeElement.tagName.toLowerCase() !== "input" // search-input
                  && !document.activeElement.parentElement.slot.toLowerCase().includes('input') // comment-area
                  // && !window.getSelection()
               ) {
                  const sec = videoPlayer.getCurrentTime() + parseInt(user_settings.jump_step);
                  // console.debug('seekTo', sec);
                  videoPlayer.seekTo(sec);
               }
            }
         },
      });

      function doubleKeyPressListener(callback, keyCodeFilter) {
         let pressed;
         let lastPressed = parseInt(keyCodeFilter) || null;
         let isDoublePress;

         const handleDoublePresss = key => {
            // console.debug(key.key, 'pressed two times');
            if (callback && typeof (callback) === 'function') return callback(key);
         }

         const timeOut = () => setTimeout(() => isDoublePress = false, 500);

         const keyPress = key => {
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
         _elementType: 'input',
         label: 'Step',
         type: 'number',
         title: 'sec',
         placeholder: 'sec',
         step: 1,
         min: 1,
         max: 300,
         value: 30,
      },
      'jump_hotkey': {
         _elementType: 'select',
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
