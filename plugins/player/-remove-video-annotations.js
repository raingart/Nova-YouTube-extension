_plugins.push({
   name: 'Remove Annotations',
   id: 'remove-video-annotations',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   // desc: '',
   // version: '0.1',
   _runtime: function (user_settings) {

      // PolymerYoutube.waitFor('[class~=annotation]', function (playerId) {
         var s = '<style>\
            [class~=annotation]{\
               display:none!important\
            }\
         </style>';
         Plugins.injectStyle(s);
      // });

   },
});
