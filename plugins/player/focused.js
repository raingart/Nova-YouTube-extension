_plugins_conteiner.push({
   name: 'Player hotkeys always active',
   id: 'player-focused-onkeydown',
   depends_on_pages: 'watch',
   opt_section: 'player',
   desc: 'shortcuts priority [SPACE/F] etc.',
   _runtime: user_settings => {

      const events = ["keydown", "yt-navigate-start", /*, "focus"*/];
      Array.from(events, e => document.addEventListener(e, setFocus));

      function setFocus(event) {
         // console.debug('setFocus', document.activeElement);

         if (document.activeElement.tagName != "INPUT" // search-input
            && document.activeElement.tagName != "TEXTAREA"
            && !document.activeElement.parentElement.slot?.toLowerCase().includes('input') // comment-area
            && !document.activeElement.isContentEditable
            // && !window.getSelection()
         ) {
            // document.activeElement.style.border = "2px solid red";
            document.querySelector("video").focus();
         }
      }

   },
});
