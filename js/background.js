// installed new version
chrome.runtime.onInstalled.addListener(details => {
   chrome.storage.sync.get(null, storage => {
      const manifest = chrome.runtime.getManifest();
      console.debug(`app ${details.reason} ${details.previousVersion} to ` + manifest.version);

      const initialStorage = { "collapse-navigation-panel": "on", "custom-api-key": "", "default_channel_tab": "videos", "default_playback_rate": "1", "default_volume_level": "100", "disable-channel-trailer": "on", "fixed-player-scroll": "on", "global-rating-bars": "on", "jump_hotkey": "17", "jump_step": "30", "livechat": "disable", "normalize-video-title": "on", "pause-background-tab": "on", "pin_player_size_position": "top-right", "pin_player_size_ratio": "2.5", "player-focused-onkeydown": "on", "player_rate_hotkey": "altKey", "player_rate_step": "0.25", "ratio_bar_height": "2", "ratio_dislike_color": "#dddddd", "ratio_like_color": "#3ea6ff", "save_manual_quality_in_tab": "on", "scroll-to-top": "on", "set-default-channel-tab": "on", "show-channel-video-count": "on", "show_full_video_title": "on", "show_volume_indicator": "text", "show_volume_indicator_color": "#ff0000", "tabs": "on", "theater-mode": "on", "thumbnail-clear": "on", "thumbnail_time_stamp": "hq2", "time-jump": "on", "video-quality": "on", "video-speed-wheel": "on", "video_quality": "hd1080", "volume-wheel": "on", "volume_hotkey": "none", "volume_step": "10" };

      console.debug(details.reason);
      switch (details.reason) {
         case 'install':
            if (!Object.keys(storage).length &&
               confirm(`${manifest.short_name}: no configuration data found!\nActivate default plugins and settings?`)) {
               Storage.setParams(initialStorage, 'sync');
               console.debug('Apply initial configuration', JSON.stringify(initialStorage));
            }
            break;
         case 'update':
            break;
      }
   });
});
