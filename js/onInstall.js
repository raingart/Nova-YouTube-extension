console.debug("init onInstall.js");

// installed new version
browser.runtime.onInstalled.addListener(details => {
   browser.storage.sync.get(null, storage => {
      const manifest = browser.runtime.getManifest();
      console.debug(`app ${details.reason} ${details.previousVersion} to ` + manifest.version);

      switch (details.reason) {
         case 'install':
            if (storage && Object.keys(storage).length) return;

            // notify(
            //    "Welcome!",
            //    "Thanks for installing the extension. To get started please visit the options menu by clicking here.",
            //    -1
            // );

            // Default options
            // if (confirm(`${manifest.short_name}: no configuration data found!\nActivate default plugins and settings?`)) {
            //    const defaultSettings = { };
            //    Storage.setParams(defaultSettings, 'sync');
            //    console.debug('Apply default configuration');

            // } else {
            browser.runtime.openOptionsPage();
            // }
            break;

         case 'update':
            // notify(
            //    "Update installed!",
            //    "NovaTube has just been updated, please click here to visit the options menu & enable any new settings.",
            //    10000
            // );

            // updateKeyStorage
            Storage.getParams(settings => {
               const keyRenameTemplate = {
                  // 'oldKey': 'newKey',
                  'disable_in_frame': 'exclude_iframe',
                  'custom-api-key': 'user-api-key',
                  'shorts-disable': 'thumbs_hide_shorts',
                  'shorts_disable': 'thumbs_hide_shorts',
                  'premiere-disable': 'thumbs_hide_premieres',
                  'premieres-disable': 'thumbs_hide_premieres',
                  'premieres_disable': 'thumbs_hide_premieres',
                  'thumbs_min_duration': 'thumbs_hide_min_duration',
                  'shorts_disable_min_duration': 'thumbs_hide_min_duration',
                  'streams-disable': 'thumbs_hide_live',
                  'streams_disable': 'thumbs_hide_live',
                  'live_disable': 'thumbs_hide_live',
                  'thumbnails-mix-hide': 'thumbs_hide_mix',
                  'thumb_mix_disable': 'thumbs_hide_mix',
                  'mix_disable': 'thumbs_hide_mix',
                  'player_fullscreen_mode_exit': 'player_fullscreen_mode_onpause',
                  'subtitle-transparent': 'subtitle_transparent',
                  'video-description-expand': 'description-expand',
                  'video_quality_in_music': 'video_quality_in_music_playlist',
                  'player_float_progress_bar_color': 'player_progress_bar_color',
                  'header-short': 'header-compact',
                  'player-buttons-custom': 'player-quick-buttons',
                  'shorts_thumbnails_time': 'shorts-thumbnails-time',
                  'comments-sidebar-position-exchange': 'move-to-sidebar',
                  'move-in-sidebar': 'move-to-sidebar',
                  'move_in_sidebar_target': 'move_to_sidebar_target',
                  'comments_sidebar_position_exchange_target': 'move_in_sidebar_target',
                  'streamed_disable_channel_exception': 'thumbs_hide_live_channels_exception',
                  'streamed_disable_channels_exception': 'thumbs_hide_live_channels_exception',
                  'video_quality_in_music_quality': 'video_quality_for_music',
                  'volume_normalization': 'volume_loudness_normalization',
                  'button_no_labels_opacity': 'details_buttons_opacity',
                  'details_button_no_labels_opacity': 'details_buttons_opacity',
                  'button-no-labels': 'details_buttons_label_hide',
                  'details_button_no_labels': 'details_buttons_label_hide',
                  'volume-wheel': 'video-volume',
                  'rate-wheel': 'video-rate',
                  'video-stop-preload': 'video-autostop',
                  'stop_preload_ignore_playlist': 'video_autostop_ignore_playlist',
                  'stop_preload_ignore_live': 'video_autostop_ignore_live',
                  'stop_preload_embed': 'video_autostop_embed',
                  'disable-video-cards': 'pages-clear',
                  'volume_level_default': 'volume_default',
                  'thumb_filter_title_blocklist': 'thumbs_filter_title_blocklist',
                  'search_filter_channel_blocklist': 'search_filter_channels_blocklist',
                  'streamed_disable': 'thumbs_hide_streamed',
                  'watched_disable': 'thumbs_hide_watched',
                  'watched_disable_percent_complete': 'thumbs_hide_watched_percent_complete',
                  'sidebar-channel-links-patch': 'sidebar-thumbs-channel-link-patch',
                  'skip_into_step': 'skip_into_sec',
                  'miniplayer-disable': 'default-miniplayer-disable',
                  'thumbnails_title_normalize_show_full': 'thumbs_title_show_full',
                  'thumbnails_title_normalize_smart_max_words': 'thumbs_title_normalize_smart_max_words',
                  'thumbnails_title_clear_emoji': 'thumbs_title_clear_emoji',
                  'thumbnails_title_clear_symbols': 'thumbs_title_clear_symbols',
                  'thumbnails-clear': 'thumbs-clear',
                  'thumbnails_clear_preview_timestamp': 'thumbs_clear_preview_timestamp',
                  'thumbnails_clear_overlay': 'thumbs_clear_overlay',
                  'thumbnails-grid-count': 'thumbs-grid-count',
                  'thumbnails_grid_count': 'thumbs_grid_count',
                  'thumbnails-watched': 'thumbs-watched',
                  'thumbnails_watched_frame_color': 'thumbs_watched_frame_color',
                  'thumbnails_watched_title': 'thumbs_watched_title',
                  'thumbnails_watched_title_color': 'thumbs_watched_title_color',
               };
               for (const oldKey in settings) {
                  if (newKey = keyRenameTemplate[oldKey]) {
                     console.log(oldKey, '=>', newKey);
                     delete Object.assign(settings, { [newKey]: settings[oldKey] })[oldKey];
                  }
               }
               console.debug('new updated settings:', settings);
               Storage.setParams(settings, 'sync');
            }, 'sync');

            break;
      }
   });
});
