console.debug("init onInstall.js");

// installed new version
chrome.runtime.onInstalled.addListener(details => {
   chrome.storage.sync.get(null, storage => {
      const manifest = chrome.runtime.getManifest();
      console.debug(`app ${details.reason} ${details.previousVersion} to ` + manifest.version);

      const defaultSettings = {"ad-skip-button":"on","channel-default-tab":"on","channel_default_tab":"videos","channel_default_tab_mode":"undefined","custom-api-key":"","livechat_collapse_mode":"collapse","pause-background-tab":"on","player-indicator":"on","player_fixed_progress_bar_height":"3","player_fixed_progress_bar_opacity":"0.7","player_fixed_scroll_size_position":"top-right","player_fixed_scroll_size_ratio":"2.5","player_indicator_color":"#ff0000","player_indicator_type":"text-top","playlist-duration":"on","rate_default":"1","rate_hotkey":"altKey","rate_step":"0.25","rating_bar_height":"3","rating_dislike_color":"#dddddd","rating_like_color":"#3ea6ff","redirect-disable":"on","report_issues":"on","scroll-to-top":"on","scroll_to_top_autoplay":"on","square-avatars":"on","tabs":"on","thumbnails_preview_timestamps":"hq2","thumbnails_title_normalize_smart_max_words":"2","time-jump":"on","time_jump_hotkey":"17","time_jump_step":"30","time_remaining_mode":"full","video-quality":"on","video_quality":"hd1080","volume-wheel":"on","volume_hotkey":"none","volume_level_default":"100","volume_step":"15"};

      switch (details.reason) {
         case 'install':
            if (storage && Object.keys(storage).length) return;

            if (confirm(`${manifest.short_name}: no configuration data found!\nActivate default plugins and settings?`)) {
               Storage.setParams(defaultSettings, 'sync');
               console.debug('Apply initial configuration', defaultSettings);

            } else {
               chrome.runtime.openOptionsPage();
            }
            break;

         case 'update':
            // updateKeyStorage
            Storage.getParams(store => {
               const keyRenameTemplate = {
                  // oldKey: newKey,
                  'disable-comments': 'comments-disable',
                  'expand-comments': 'comments-expand',
                  'show-channel-videos-count': 'channel-videos-count',
                  'expand-description-video': 'video-description-expand',
                  'header-unpin': 'header-unfixed',
                  'disable-redirect-page': 'redirect-disable',
                  'mark-watched': 'thumbnails-watched',
                  'normalize-videos-title': 'thumbnails-title-normalize',
                  'global-rating-bars': 'thumbnails-rating',
                  'thumbnail-clear': 'thumbnails-preview-clear',
                  'fly-video-progress-bar': 'player-fixed-progress-bar',
                  'player-focused-onkeydown': 'player-hotkeys-focused',
                  'pause-autoplay': 'video-autopause',
                  'fixed-player-scroll': 'player-fixed-scroll',
                  'video-speed-wheel': 'rate-wheel',
                  'collapse-livechat': 'livechat-collapse',
                  'remaining-time': 'time-remaining',

                  'default_channel_tab': 'channel_default_tab',
                  'default_channel_tab_method': 'channel_default_tab_mode',
                  'ratio_bar_height': 'rating_bar_height',
                  'ratio_like_color': 'rating_like_color',
                  'ratio_dislike_color': 'rating_dislike_color',
                  'thumbnail_time_stamp': 'thumbnails_preview_timestamps',
                  'fly_progress_bar_height': 'player_fixed_progress_bar_height',
                  'fly_progress_bar_opacity': 'player_fixed_progress_bar_opacity',
                  'stop_autoplay_ignore_playlist': 'video_autopause_ignore_playlist',
                  'pin_player_size_ratio': 'player_fixed_scroll_size_ratio',
                  'pin_player_size_position': 'player_fixed_scroll_size_position',
                  'save_manual_quality_in_tab': 'video_quality_manual_save_tab',
                  'default_volume_level': 'volume_level_default',
                  'livechat': 'livechat_collapse_mode',
                  'default_playback_rate': 'rate_default',
                  'player_rate_step': 'rate_step',
                  'player_rate_hotkey': 'rate_hotkey',
                  'remaining_time_mode': 'time_remaining_mode',
                  'show_full_video_title': 'thumbnails_title_normalize_show_full',
                  'smart_normalize_title': 'thumbnails_title_normalize_smart',
                  'smart_normalize_title_max_words': 'thumbnails_title_normalize_smart_max_words',
                  'jump_step': 'time_jump_step',
                  'jump_hotkey': 'time_jump_hotkey',
               }
               Object.entries(store)
                  .forEach(([oldKey]) => {
                     const newKey = keyRenameTemplate[oldKey];
                     if (newKey) {
                        console.log(oldKey, '=>', newKey);
                        delete Object.assign(store, { [newKey]: store[oldKey] })[oldKey];
                     }
                  });
               console.debug('new updated storage:', store);
               Storage.setParams(store, 'sync');
            }, 'sync');

            break;
      }
   });
});
