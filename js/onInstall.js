console.debug("init onInstall.js");

// installed new version
chrome.runtime.onInstalled.addListener(details => {
   chrome.storage.sync.get(null, storage => {
      const manifest = chrome.runtime.getManifest();
      console.debug(`app ${details.reason} ${details.previousVersion} to ` + manifest.version);

      const defaultSettings = {"ad-skip-button":"on","channel-default-tab":"on","channel_default_tab":"videos","channel_default_tab_mode":"undefined","comments_disable_mode":"hide","custom-api-key":"","livechat_visibility_mode":"collapse","page_logo_url_mode":"https://youtube.com/feed/subscriptions","page_title_time_mode":"left","pause-background-tab":"on","player-float-scroll":"on","player-hotkeys-focused":"on","player_float_progress_bar_height":"3","player_float_progress_bar_opacity":"0.7","player_float_scroll_size_position":"top-right","player_float_scroll_size_ratio":"2.5","player_indicator_color":"#ff0000","player_indicator_type":"text-top","rate-wheel":"on","rate_default":"1","rate_hotkey":"altKey","rate_step":"0.25","rating_bar_height":"3","rating_dislike_color":"#dddddd","rating_like_color":"#3ea6ff","scroll-to-top":"on","square-avatars":"on","tabs":"on","thumbnails-title-normalize":"on","thumbnails_preview_timestamps":"hq2","thumbnails_title_normalize_smart_max_words":"2","time-jump":"on","time_jump_hotkey":"17","time_jump_step":"30","time_remaining_mode":"full","video-quality":"on","video_quality":"hd1080","volume-wheel":"on","volume_hotkey":"none","volume_level_default":"100","volume_step":"10"};

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
                  'comments-disable': 'comments-visibility',
                  'page-logo-url': 'page-logo',
                  'thumbnails-preview-clear': 'thumbnails-clear',
                  'thumbnails_preview_timestamps': 'thumbnails_clear_timestamps',
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
