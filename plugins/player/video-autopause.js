_plugins.push({
   name: 'Video AutoPause',
   id: 'video-autopause',
   group: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {

      Array.from(document.getElementsByTagName("video")).map((vid) => {
         // for (const vid of videos) {
         vid.pause();
      })

   },
});
