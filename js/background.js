// Check whether new version is installed
chrome.runtime.onInstalled.addListener(details => {
   chrome.storage.sync.get(null, storage => {
      const manifest = chrome.runtime.getManifest();
      console.log('app ' + details.reason + ' ' + details.previousVersion + ' to ' + manifest.version);

      const initialStorage = { "collapse-livechat":"on","collapse-navigation-panel":"on","custom-api-key":"","dark-theme":"on","default_channel_tab":"videos","default_playback_rate":"1.5","default_volume_level":"75","disable-channel-trailer":"on","fixed-player-scroll":"on","global-rating-bars":"on","hide-annotations":"on","jump_hotkey":"17","jump_step":"30","livechat":"disable","normalize-video-title":"on","pause-background-tab":"on","pin_player_size_position":"top-right","pin_player_size_ratio":"2.5","player-focused-onkeydown":"on","player_rate_hotkey":"altKey","player_rate_step":"0.25","ratio_bar_height":"2","ratio_dislike_color":"#dddddd","ratio_like_color":"#3ea6ff","save_manual_quality_in_tab":"on","scroll-to-top":"on","show-channel-video-count":"on","show_full_video_title":"on","show_volume_indicator":"text","show_volume_indicator_color":"#ff0000","tabs":"on","thumbnail-clear":"on","thumbnail_time_stamp":"hq2","time-jump":"on","video-quality":"on","video-speed-wheel":"on","video_quality":"hd1080","volume-wheel":"on","volume_hotkey":"none","volume_step":"10" };

      console.log(details.reason);
      switch (details.reason) {
         case 'install':
            if (!Object.keys(storage).length &&
               confirm(`${manifest.short_name}: no configuration data found!\nActivate default plugins and settings?`)) {
               Storage.setParams(initialStorage, 'sync');
               console.log('Apply initial configuration', JSON.stringify(initialStorage));
            }
            break;
         case 'update':
            break;
      }
   });
});


let YOUTUBE_API_KEYS = [];

// no internet connection
let interval_update_keys = setInterval(() => {
   if (YOUTUBE_API_KEYS.length) clearInterval(interval_update_keys);
   else update_YOUTUBE_API_KEYS();
}, 30 * 1000); // 1 mins

function update_YOUTUBE_API_KEYS() {
   // https://gist.github.com/raingart/c685f14d7186a8c9bf009a83b41d1f66/
   fetch('https://gist.githubusercontent.com/raingart/c685f14d7186a8c9bf009a83b41d1f66/raw/youtube_api_keys.json')
      .then(res => res.json())
      .then(data => YOUTUBE_API_KEYS = data)
      .then(() => console.log('get keys:', JSON.stringify(YOUTUBE_API_KEYS)))
      .catch(error => console.error(error))
}

// init
update_YOUTUBE_API_KEYS();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   console.log('onMessage request: %s', JSON.stringify(request.action || request));

   // const sendMessage_ = out => chrome.tabs.query({url: "*://www.youtube.com/*"}, tabs => // need "permissions": ["tabs"]
   const sendMessage_ = out => chrome.tabs.query({ "currentWindow": true }, tabs =>
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, out)));

   switch (request.action || request) {
      case 'setOptions': break;

      case 'REQUESTING_YOUTUBE_API_KEYS':
         sendMessage_({
            action: 'YOUTUBE_API_KEYS',
            options: YOUTUBE_API_KEYS,
         });
         break;

      default:
         console.warn('onMessage not indicated', request);
   }
});
