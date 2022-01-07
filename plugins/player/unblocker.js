// https://www.youtube.com/watch?v=3U2UGM0ldGg - https://watannetwork.com/tools/blocked/#url=3U2UGM0ldGg

window.nova_plugins.push({
   id: 'video-unblocker',
   title: 'Unblock video',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: "attempt fix 'is not available in your country'",
   _runtime: user_settings => {

      NOVA.waitElement('ytd-watch[player-unavailable]')
         .then(() => {
            location.hostname = 'hooktube.com';
            // location.replace(`https://watannetwork.com/tools/blocked/#url=${NOVA.queryURL.get('v')}:~:text=Allowed%20countries`);

            // tubeunblock.com is shut down
            // location.replace('https://tubeunblock.com/watch' + location.search); // save time mark
         });

   },
});
