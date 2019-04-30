const Plugins_list = {
   lib: [ 'ytc_lib.js' ],

   runOnce: [ // addEventListener
      'player/speed.js',
      'player/volume.js',
      'player/quality.js',
      'player/pause.js',
      'player/pin.js',
      'player/focused.js',
      // 'player/stop.js',

      'other/scroll-to-top.js',
      'other/dark-theme.js',
      'other/disable-trailer.js',
      'other/rating-bars.js',
      // 'other/H264.js',
   ],
   
   runOnTransition: [
      'player/annotations.js',
      'player/timeline-color.js',

      'details/expand-description.js',
      'details/channel-video-count.js',
      'details/video-age.js',

      'comments/disable-comments.js',

      'sidebar/livechat-hide.js',
      
      'channel/collapse-navigation-panel.js',
      'channel/default-tab.js',
   ],
}
