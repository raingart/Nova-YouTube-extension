const Plugins_list = {
   lib: [ 'ytc_lib.js' ],
   plugins_init: [ 'plugins_init.js' ],

   strong_dependent: [
      'player/video-speed-wheel.js', // addEventListener
      'player/volume-wheel.js', // addEventListener
   ],
   strong_self: [
      'player/pin-player-onscroll.js', // addEventListener
      'player/player-force-focused.js', // addEventListener
   ],
   one_off_dependent: [
      'player/video-quality.js',
      'player/pause-video.js',
      'player/stop-preload-video.js',
   ],
   one_off: [
      // 'player/remove-video-annotations.js',
      // 'player/loop-video.js',

      'details/reveal-description-video.js',
      'details/show-channel-video-count.js',
      'details/show-video-age.js',

      'comments/disable-comments.js',

      // 'sidebar/stop-play-next.js',

      // 'channel/-autopause-homepage-video.js',
      'channel/collapse-navigation-panel.js',
      'channel/default-channel-tab.js',

      // '/other/scroll-to-top.js',
   ],
   plugins_end: [ 'plugins_loading.js' ],
}
