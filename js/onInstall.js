console.debug("init onInstall.js");

// installed new version
chrome.runtime.onInstalled.addListener(details => {
   chrome.storage.sync.get(null, storage => {
      const manifest = chrome.runtime.getManifest();
      console.debug(`app ${details.reason} ${details.previousVersion} to ` + manifest.version);

      const initialStorage = {"ad-skip-button":"on","collapse-livechat":"on","custom-api-key":"","default_channel_tab":"videos","default_channel_tab_method":"undefined","default_playback_rate":"1","default_volume_level":"100","disable-page-sleep":"on","fixed-player-scroll":"on","global-rating-bars":"on","jump_hotkey":"17","jump_step":"30","livechat":"collapse","normalize-videos-title":"on","pause-background-tab":"on","pin_player_size_position":"top-right","pin_player_size_ratio":"2.5","player-focused-onkeydown":"on","player_disable_bezel":"on","player_rate_hotkey":"altKey","player_rate_step":"0.25","playlist-duration":"on","ratio_bar_height":"2","ratio_dislike_color":"#dddddd","ratio_like_color":"#3ea6ff","report_issues":"on","save_manual_quality_in_tab":"on","scroll-to-top":"on","set-default-channel-tab":"on","show-channel-videos-count":"on","show_full_video_title":"on","smart_normalize_title":"on","smart_normalize_title_max_words":"2","stop_autoplay_ignore_playlist":"on","tabs":"on","theater-mode":"on","thumbnail-clear":"on","thumbnail_time_stamp":"hq2","time-jump":"on","video-quality":"on","video-speed-wheel":"on","video_quality":"hd1080","volume-indicator":"on","volume-wheel":"on","volume_hotkey":"none","volume_indicator":"text","volume_indicator_color":"#ff0000","volume_step":"10"};

      switch (details.reason) {
         case 'install':
            if (Object.keys(storage).length) return;

            if (confirm(`${manifest.short_name}: no configuration data found!\nActivate default plugins and settings?`)) {
               Storage.setParams(initialStorage, 'sync');
               console.debug('Apply initial configuration', initialStorage);

            } else {
               chrome.runtime.openOptionsPage();
            }
            break;
         // case 'update':
         //    break;
      }
   });
});
