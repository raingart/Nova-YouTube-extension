const Plugins = {
   list: [
      // 'plugins/_blank_plugin.js', // for example

      // 'player/ad-skip-button.js',
      'player/speed.js',
      'player/volume.js',
      'player/hud.js',
      'player/quality.js',
      'player/autostop.js',
      // 'player/autopause.js',
      'player/theater-mode.js',
      'player/background-pause.js',
      // 'player/fullscreen-on-playback.js',
      'player/resize-ratio.js',
      'player/progress-bar-color.js',
      'player/progress-bar-float.js',
      'player/control-below.js',
      'player/control-autohide.js',
      'player/embed-popup.js',
      'player/embed-control.js',
      'player/hotkeys.js',
      'player/pin.js',
      'player/time-jump.js',
      'player/no-sleep.js',
      'player/loop.js',
      'player/resume-playback.js',
      // 'player/-thumb-pause.js',
      'player/quick-buttons.js',
      'player/hide-elements.js',
      'player/scrollbar-hide.js',
      'player/subtitle-style.js',
      // 'player/subtitle-lang.js',
      'player/unblock-region.js',
      'player/unblock-warn-content.js',
      // 'player/next-autoplay.js',
      'player/fullscreen-scroll.js',
      'player/time-remaining.js',
      'player/live-duration.js',
      'player/title-time.js',
      'player/save-for-channel.js',
      'player/sponsor-block.js',
      // 'player/block-embed.js',

      'other/pages-clear.js',
      'other/block-title.js',
      'other/block-channel.js',
      'other/thumbs-filter.js',
      'other/thumbs-clear.js',
      'other/thumbs-title-normalize.js',
      'other/thumbs-watched.js',
      // 'other/thumbs-shorts-time.js',
      'other/thumbs-row-count.js',
      // 'other/thumbs-quality.js',
      // 'other/thumbs-rating.js',
      'other/thumbs-preview-stop.js',
      'other/channel-trailer-stop.js',
      'other/channel-tab.js',
      // 'other/channel-thumbs-row.js',
      // 'other/dark-theme.js',
      // 'other/lang.js',
      'other/scroll-to-top.js',
      'other/shorts-redirect.js',
      'other/rss.js',
      // 'other/thumbs-sort.js',
      // 'other/thumbs-sort.js',
      'other/miniplayer-disable.js',
      'other/collapse-navigation-panel.js',

      'details/videos-count.js',
      'details/description-expand.js',
      'details/description-popup.js',
      'details/video-date.js',
      'details/buttons.js',
      'details/auto-likes.js',
      'details/return-dislike.js',
      'details/transcript.js',
      'details/metadata-hide.js',
      'details/timestamps-scroll.js',
      'details/redirect-clear.js',
      'details/save-to-playlist.js',

      'comments/visibility.js',
      'comments/square-avatars.js',
      'comments/popup.js',
      'comments/expand.js',
      'comments/sort.js',

      'sidebar/related-visibility.js',
      'sidebar/playlist-collapse.js',
      'sidebar/playlist-extended.js',
      'sidebar/playlist-autoplay.js',
      'sidebar/playlist-duration.js',
      'sidebar/playlist-reverse.js',
      'sidebar/livechat.js',
      'sidebar/move-to-sidebar.js',
      'sidebar/channel-link.js',
      // 'sidebar/playlist-skip-liked.js',

      'header/search.js',
      'header/compact.js',
      'header/unfixed.js',
      'header/logo.js',
      'header/subscriptions-home.js',
   ],

   // for test
   // list: [
   //    // 'plugin_example.js'
   //    // 'header/test.js',
   //    // 'player/test.js',
   //    // 'sidebar/test.js',
   //    // 'comments/test.js',
   //    // 'other/test.js',
   // ],

   load(list) {
      (list || this.list)
         .forEach(plugin => {
            try {
               this.injectScript(browser.runtime.getURL('/plugins/' + plugin));
            } catch (error) {
               console.error(`plugin loading failed: ${plugin}\n${error.stack}`);
            }
         })
   },

   injectScript(source = required()) {
      const script = document.createElement('script');

      if (source.endsWith('.js')) {
         script.src = source;
         script.defer = true; // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer:~:text=defer,-This
         // script.async = true;
      }
      // injectCode
      else {
         script.textContent = source.toString();
         // script.src = "data:text/plain;base64," + btoa(source);
         // script.src = 'data:text/javascript,' + encodeURIComponent(source)
      }

      (document.head || document.documentElement).append(script);

      script.onload = () => {
         // console.log('script injected:', script.src || script.textContent.substr(0, 100));
         script.remove(script); // Remove <script> node after injectScript runs.
      };
   },

   // injectFunction(func, args) {
   //    // console.debug('injectFunction', ...arguments);
   //    this.injectScript(`(${func})(${args});`);
   // },

   run: ({ user_settings, app_ver }) => {
      // console.debug('plugins_executor', ...arguments);
      if (!window.nova_plugins?.length) return console.error('nova_plugins empty', window.nova_plugins);
      if (!user_settings) return console.error('user_settings empty', user_settings);

      // alt - DetectPageType() (https://greasyfork.org/en/scripts/6034-youtube-hd-override)

      // error 404. Open the channel and refresh page (press F5)
      // https://www.youtube.com/@glp (https://www.youtube.com/channel/UCM8XzXipyTsylZ_WsGKmdKQ)
      // https://www.youtube.com/@divr (https://www.youtube.com/channel/UC7tD6Ifrwbiy-BoaAHEinmQ)

      NOVA.currentPage = (function () {
         // const [page, channelTab] = location.pathname.split('/').filter(Boolean);
         // Strategy 1
         // return identifyCurrentPage(page, channelTab);
         // Strategy 2. Known tabs list
         const pathnameArray = location.pathname.split('/').filter(Boolean);
         const [page, channelTab] = [pathnameArray[0], pathnameArray.pop()];
         // https://www.youtube.com/@channel/search?query=11
         NOVA.channelTab = ['featured', 'videos', 'shorts', 'streams', 'playlists', 'community', 'channels', 'about', 'search'].includes(channelTab) ? channelTab : false;

         // Strategy 3. Excluding channelId (https://www.youtube.com/channel/UCE5yTn9ljzSnC_oMp9Jnckg). Error in emdeb - https://www.youtube.com/embed/H-3fre7943U?enablejsapi=1&wmode=opaque&autoplay=1
         // NOVA.channelTab = channelTab?.startsWith('UC') ? false : channelTab;

         return (!page?.includes('live_chat')) // fix for "/[A-Z\d_]/.test(page)" (https://www.youtube.com/live_chat, https://www.youtube.com/live_chat_replay)
            && (['channel', 'c', 'user'].includes(page)
               || page?.startsWith('@') // https://www.youtube.com/@ALBO
               || /[A-Z\d_]/.test(page) // containsUppercase(without unicode) https://www.youtube.com/ProTradingSkills and number - https://www.youtube.com/deadp47, underline - https://www.youtube.com/live_games_it
               // fix non-standard link:
               // https://www.youtube.com/pencilmation
               // https://www.youtube.com/rhino
               || NOVA.channelTab
               // https://www.youtube.com/clip/Ugkx2Z62NxoBfx_ZR2nIDpk3F2f90TV4_uht
            ) ? 'channel' : (page == 'clip') ? 'watch' : page || 'home';
      })();
      // console.debug('NOVA.currentPage:', NOVA.currentPage);

      NOVA.isMobile = location.host == 'm.youtube.com';

      let logTableArray = [],
         logTableStatus,
         logTableTime;

      // console.groupCollapsed('plugins status');

      window.nova_plugins?.forEach(plugin => {
         const pagesAllowList = plugin?.run_on_pages?.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
         // reset logTable
         logTableTime = 0;
         logTableStatus = false;

         if (!pluginChecker(plugin)) {
            console.error('Plugin invalid\n', plugin);
            alert('Plugin invalid: ' + plugin?.id);
            logTableStatus = 'INVALID';
         }
         else if (plugin.was_init && !plugin.restart_on_location_change) {
            logTableStatus = 'skiped';
         }
         else if (!user_settings.hasOwnProperty(plugin.id)) {
            logTableStatus = 'off';
         }
         else if (
            (
               pagesAllowList?.includes(NOVA.currentPage)
               || (pagesAllowList?.includes('*') && !pagesAllowList?.includes('-' + NOVA.currentPage))
            )
            && (!NOVA.isMobile || (NOVA.isMobile && !pagesAllowList?.includes('-mobile')))
         ) {
            try {
               const startTableTime = performance.now();
               plugin.was_init = true;
               plugin._runtime(user_settings);
               // plugin._runtime.apply(plugin, [user_settings])
               logTableTime = (performance.now() - startTableTime).toFixed(2);
               logTableStatus = true;

            } catch (err) {
               console.groupEnd('plugins status'); // out-of-group display
               console.error(`[ERROR PLUGIN] ${plugin.id}\n${err.stack}\n\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=` + encodeURIComponent(app_ver + ' | ' + navigator.userAgent));

               if (user_settings.report_issues) {
                  _pluginsCaptureException({
                     'trace_name': plugin.id,
                     'err_stack': err.stack,
                     'app_ver': app_ver,
                     'confirm_msg': `ERROR in Nova YouTube™\n\nCrash plugin: "${plugin.title || plugin.id}"\nPlease report the bug or disable the plugin\n\nSend the bug raport to developer?`,
                  });
               }

               console.groupCollapsed('plugins status'); // resume console group
               logTableStatus = 'ERROR';
            }
         }

         logTableArray.push({
            'launched': logTableStatus,
            'name': plugin?.id,
            'time init (ms)': logTableTime,
         });
      });
      console.table(logTableArray);
      console.groupEnd('plugins status');

      // function identifyCurrentPage(page, channelTab) {
      //    switch (page) {
      //       case 'channel':
      //       case 'c':
      //       case 'user':
      //          return 'channel';
      //          break;

      //       case 'watch':
      //       case 'clip':
      //          return 'watch'; break;
      //       case 'live_chat': return 'live_chat'; break;
      //    }

      //    if (page?.startsWith('@') // https://www.youtube.com/@ALBO
      //       || /[A-Z\d_]/.test(page) // containsUppercase(without unicode))
      //    ) {
      //       return 'channel'
      //    }

      //    switch (channelTab) {
      //       case 'featured':
      //       case 'videos':
      //       case 'shorts':
      //       case 'streams':
      //       case 'playlists':
      //       case 'community':
      //       case 'channels':
      //       case 'about':
      //          return 'channel';
      //          break;
      //    }
      //    return page;
      // }

      function pluginChecker(plugin) {
         const result = plugin?.id && plugin.run_on_pages && 'function' === typeof plugin._runtime;
         if (!result) {
            console.error('plugin invalid:\n', {
               'id': plugin?.id,
               'run_on_pages': plugin?.run_on_pages,
               '_runtime': 'function' === typeof plugin?._runtime,
            });
         }
         return result;
      }
   },
}
