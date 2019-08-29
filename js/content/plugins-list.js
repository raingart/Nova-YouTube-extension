const Plugins_list = {
   lib: [ 'ytc_lib.js' ],

   runOnce: [ // addEventListener
      'player/speed.js',
      'player/volume.js',
      'player/quality.js',
      'player/pause.js',
      'player/pin.js',
      'player/focused.js',
      'player/time-jump.js',
      // 'player/stop.js',

      'other/scroll-to-top.js',
      'other/dark-theme.js',
      'other/rating-bars.js',
      // 'other/H264.js',
      // 'player/30-fps.js',
   ],

   runOnTransition: [
      'player/annotations.js',

      'details/expand-description.js',
      'details/channel-video-count.js',
      'details/video-age.js',

      'comments/disable-comments.js',

      'sidebar/livechat-hide.js',

      'channel/collapse-navigation-panel.js',
      'channel/default-tab.js',

      'other/disable-trailer.js',
   ],
}
