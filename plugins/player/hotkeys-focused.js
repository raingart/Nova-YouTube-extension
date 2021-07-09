_plugins_conteiner.push({
   id: 'player-hotkeys-focused',
   title: 'Player hotkeys always active',
   run_on_pages: 'watch',
   section: 'player',
   // desc: 'Player hotkeys always active [SPACE/F] etc.',
   _runtime: user_settings => {

      document.addEventListener('keydown', ({ target = document.activeElement }) => {
         // console.debug('activePlayer', ...arguments);
         if (!["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
            && !target.slot?.toLowerCase().includes('input') // comment-area
            && !target.isContentEditable
         ) {
            // target.style.border = "2px solid red"; // mark for test
            document.querySelector('video')?.focus();
         }
      });

   },
});
