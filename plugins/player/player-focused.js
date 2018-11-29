_plugins.push({
   name: 'Force player focused',
   id: 'player-focused',
   section: 'player',
   depends_page: 'watch',
   // sandbox: false,
   desc: 'Hotkeys affect only the player',
   // version: '0.1',
   _runtime: function (user_settings) {
      
      // document.addEventListener('focus', captureFocus);
      document.addEventListener('keydown', captureFocus);
      // document.addEventListener('click', captureFocus);

      function captureFocus(event) {
         // console.log('captureFocus', document.activeElement);
         if (document.activeElement.tagName.toLowerCase() !== "input" &&
            document.activeElement.slot.toLowerCase() !== "input"
            // && !window.getSelection()
         ) {
            // document.activeElement.style.border = "2px solid red";
            document.getElementById("movie_player").focus();
            // console.log('focused');
         }
      }

   },
});
