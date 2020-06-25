const Plugins_list = {
   lib: [ 'ytc_lib.js' ],
   // addEventListener
   runOnce: [
      'player/speed.js',
      'player/volume.js',
      'player/quality.js',
      'player/pause.js',
      'player/pause-tab.js',
      'player/focused.js',
      'player/pin.js',
      'player/theater-mode.js',
      'player/time-jump.js',
      // 'player/stop.js',
      'player/ad-click.js',


      'other/scroll-to-top.js',
      'other/rating-bars.js',
      'other/normalize-video-title.js',
      'other/thumbnail-clear.js',
   ],

   runOnTransition: [
      'player/annotations.js',

      'details/expand-description.js',
      'details/channel-video-count.js',

      'comments/disable-comments.js',

      'sidebar/livechat-hide.js',

      'other/default-tab.js',
      'other/disable-trailer.js',
      'other/collapse-navigation-panel.js',
   ],
}
