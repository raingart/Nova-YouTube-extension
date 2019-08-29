_plugins.push({
   name: 'Time jump',
   id: 'time-jump',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      YDOM.waitFor('.html5-video-player', playerId => {

         YDOM.addDoublePressListener(jumpTime, user_settings.jump_hotkey);

         function jumpTime(event) {
            if (document.activeElement.tagName.toLowerCase() !== "input" // search-input
               && document.activeElement.parentElement.slot.toLowerCase().indexOf('input') === -1 // comment-area
               // && !window.getSelection()
            ) {
               const SEC = playerId.getCurrentTime() + parseInt(user_settings.jump_step);
               // console.log('seekTo', SEC);
               playerId.seekTo(SEC);
            }
         }

      });

   },
   export_opt: (function () {
      return {
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
      };
   }()),
});
