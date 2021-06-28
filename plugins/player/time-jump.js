_plugins_conteiner.push({
   id: 'time-jump',
   title: 'Time jump',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      YDOM.waitElement('#movie_player')
         .then(player => {
            doubleKeyPressListener(jumpTime, user_settings.time_jump_hotkey);

            function jumpTime() {
               if (document.activeElement.tagName.toLowerCase() !== 'input' // search-input
                  && !document.activeElement.parentElement.slot.toLowerCase().includes('input') // comment-area
                  // && !window.getSelection()
               ) {
                  const sec = player.getCurrentTime() + parseInt(user_settings.time_jump_step);
                  // console.debug('seekTo', sec);
                  player.seekTo(sec);

                  // show indicator
                  if (msg = `+${user_settings.time_jump_step} sec`) {
                     YDOM.bezelTrigger(msg); // show default indicator
                     window?.HUD.set(msg); // if the "player-indicator" plugin is enabled
                  }
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
            // console.debug('doubleKeyPressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);
            if (isDoublePress && pressed === lastPressed) {
               isDoublePress = false;
               handleDoublePresss(key);
            } else {
               isDoublePress = true;
               timeOut();
            }

            if (!keyCodeFilter) lastPressed = pressed;
         }
         document.addEventListener('keyup', keyPress);
      }

   },
   options: {
      time_jump_step: {
         _tagName: 'input',
         label: 'Step time',
         type: 'number',
         title: 'in sec',
         placeholder: 'sec',
         min: 3,
         max: 300,
         value: 30,
      },
      time_jump_hotkey: {
         _tagName: 'select',
         label: 'Hotkey (double tap)',
         options: [
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'alt', value: 18 },
            { label: 'shift', value: 16 },
            { label: 'ctrl', value: 17, selected: true },
         ],
      },
   },
});
