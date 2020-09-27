_plugins.push({
   name: 'Player hotkeys always active',
   id: 'player-focused-onkeydown',
   section: 'player',
   depends_page: 'watch',
   desc: 'shortcuts priority [SPACE/F] etc.',
   _runtime: user_settings => {

      ["keydown", "yt-navigate-start", /*, "focus"*/]
         .forEach(event => {
            document.addEventListener(event, captureFocus);
         });

      function captureFocus(event) {
         // console.debug('captureFocus', document.activeElement);

         if (document.activeElement.tagName != "INPUT" // search-input
            && document.activeElement.tagName != "TEXTAREA"
            && !document.activeElement.parentElement.slot.toLowerCase().includes('input') // comment-area
            && !document.activeElement.isContentEditable
            // && !window.getSelection()
         ) {
            // document.activeElement.style.border = "2px solid red";
            document.querySelector("video").focus();
         }
      }

   },
});
