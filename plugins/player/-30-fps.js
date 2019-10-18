_plugins.push({
   name: 'Force 30 FPS',
   id: 'block-60fps',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Disable YouTube 60 FPS',
   _runtime: user_settings => {

      window.MediaSource.isTypeSupported.bind(window.MediaSource)

      window.MediaSource.isTypeSupported = videoType => {
         const injectedTooLate = !(!window.ytplayer || Object.getOwnPropertyNames(window.ytplayer).length === 0);
         if (!injectedTooLate) {
            console.log('videoType:', JSON.stringify(videoType));

            const matches = videoType.match(/framerate=(\d+)/);

            if (matches && (matches[1] > 30)) {
               console.log('Blocking High-FPS format: "' + videoType + '"');
               return false;
            }
         } else {
            console.log('err', injectedTooLate);
         }
      }

      // window.MediaSource.isTypeSupported(window.MediaSource)


   },
});
