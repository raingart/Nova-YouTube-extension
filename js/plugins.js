const Plugins = {
   list: [
      // 'plugins/_blank_plugin.js', // for example

      'player/speed.js',
      'player/volume.js',
      'player/osd.js',
      'player/quality.js',
      'player/autostop.js',
      'player/theater-mode.js',
      'player/background-pause.js',
      'player/resize-ratio.js',
      'player/embed-popup.js',
      'player/pin.js',
      'player/no-sleep.js',
      'player/resume-playback.js',
      'player/auto-buffer.js',
      'player/subtitle-style.js',
      'player/unblock-region.js',
      'player/unblock-warn-content.js',
      'player/fullscreen-scroll.js',
      'player/sponsor-block.js',
      'player/zoom.js',
      // 'player/ad-skip-button.js',
      // 'player/autopause.js',
      // 'player/fullscreen-on-playback.js',
      // 'player/-thumb-pause.js',
      // 'player/subtitle-lang.js',
      // 'player/next-autoplay.js',
      // 'player/block-embed.js',

      'control-panel/control-below.js',
      'control-panel/control-autohide.js',
      'control-panel/progress-bar-color.js',
      'control-panel/progress-bar-float.js',
      'control-panel/embed-control.js',
      'control-panel/hotkeys.js',
      'control-panel/time-jump.js',
      'control-panel/loop.js',
      'control-panel/hide-elements.js',
      'control-panel/quick-buttons.js',
      'control-panel/save-for-channel.js',
      'control-panel/time-remaining.js',
      'control-panel/live-duration.js',
      'control-panel/download-video.js',

      'thumbs/block-title.js',
      'thumbs/block-channel.js',
      'thumbs/filter.js',
      'thumbs/preview-clear.js',
      'thumbs/title-normalize.js',
      'thumbs/watched.js',
      'thumbs/not-interested.js',
      'thumbs/watch-later.js',
      'thumbs/row-count.js',
      'thumbs/title-lang.js',
      // 'thumbs/shorts-time.js',
      // 'thumbs/quality.js',
      // 'thumbs/rating.js',
      // 'thumbs/preview-stop.js',
      // 'thumbs/sort.js',
      // 'thumbs/sort.js',

      'other/scrollbar-hide.js',
      'other/title-time.js',
      'other/channel-trailer-stop.js',
      'other/channel-tab.js',
      'other/miniplayer-disable.js',
      'other/pages-clear.js',
      'other/rss.js',
      'other/scroll-to-top.js',
      'other/copy-url.js',
      'other/shorts-redirect.js',
      // 'other/collapse-navigation-panel.js',
      // 'other/channel-thumbs-row.js',
      // 'other/dark-theme.js',
      // 'other/lang.js',

      'details/show-date.js',
      'details/videos-count.js',
      'details/buttons-hide.js',
      'details/ad-state.js',
      'details/auto-likes.js',
      'details/return-dislike.js',
      'details/description-popup.js',
      'details/transcript.js',
      'details/video-title-hashtag.js',
      'details/metadata-hide.js',
      'details/timestamps-scroll.js',
      'details/redirect-clear.js',
      'details/save-to-playlist.js',
      // 'details/description-expand.js',

      'comments/visibility.js',
      'comments/square-avatars.js',
      'comments/popup.js',
      'comments/expand.js',
      'comments/sort.js',

      'sidebar/related-visibility.js',
      'sidebar/livechat-visibility.js',
      'sidebar/toggle-mode.js',
      'sidebar/move-to-sidebar.js',
      'sidebar/channel-link.js',
      // 'sidebar/livechat-filter.js',

      'playlist/collapse.js',
      'playlist/extended.js',
      'playlist/autoplay.js',
      'playlist/duration.js',
      'playlist/reverse.js',
      // 'playlist/skip-liked.js',

      'header/search.js',
      'header/compact.js',
      'header/unfixed.js',
      'header/logo.js',
      'header/subscriptions-home.js',
   ],

   // for test
   // list: [
   //    // 'plugin_example.js'
   // ],

   load(list) {
      (list || this.list)
         .forEach(plugin => {
            try {
               this.injectScript(browser.runtime.getURL('/plugins/' + plugin));
               // browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
               //    browser.scripting.executeScript(
               //       {
               //          target: { tabId: tab.id, allFrames: true },
               //          files: [browser.runtime.getURL('/plugins/' + plugin)],
               //          // function: () => {}, // files or function, both do not work.
               //       })
               // })
               //    .then(() => console.log("script injected in all frames"));
               // async function getCurrentTabId() {
               //    const queryOptions = {
               //       active: true,
               //       currentWindow: true
               //    };
               //    let [tab] = await browser.tabs.query(queryOptions);
               //    return tab.id;
               // }
               // browser.scripting.executeScript({
               //    target: { tabId: await getCurrentTabId(), allFrames: true },
               //    files: [browser.runtime.getURL('/plugins/' + plugin)],
               //    // function: () => {}, // files or function, both do not work.
               // });
            } catch (error) {
               console.error(`plugin loading failed: ${plugin}\n${error.stack}`);
            }
         })
   },

   injectScript(source = required()) {
      // console.debug('injectScript:', ...arguments);
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
         // console.debug('script injected:', script.src || script.textContent.substr(0, 100));
         script.remove(script); // Remove <script> node after injectScript runs.
      };
   },

   // injectFunction(func, args) {
   //    // console.debug('injectFunction', ...arguments);
   //    this.injectScript(`(${func})(${args});`);
   // },

   run: ({ user_settings, app_ver }) => {
      console.debug('plugins_executor', ...arguments);
      if (!window.nova_plugins?.length) return console.error('nova_plugins empty', window.nova_plugins);
      if (!user_settings) return console.error('user_settings empty', user_settings);

      // alt - DetectPageType() (https://greasyfork.org/en/scripts/6034-youtube-hd-override)

      // error 404. Open the channel and refresh page (press F5)
      // https://www.youtube.com/@glp (https://www.youtube.com/channel/UCM8XzXipyTsylZ_WsGKmdKQ)
      // https://www.youtube.com/@divr (https://www.youtube.com/channel/UC7tD6Ifrwbiy-BoaAHEinmQ)

      NOVA.currentPage = (function () {
         // Strategy 1. Optimize
         const
            pathnameArray = location.pathname.split('/').filter(Boolean),
            { page, channelTab } = identifyCurrentPage(pathnameArray[0], pathnameArray.pop());

         NOVA.channelTab = channelTab;

         return page;
         // Strategy 2. Clearly
         // const
         //    pathnameArray = location.pathname.split('/').filter(Boolean),
         //    [page, channelTab] = [pathnameArray[0], pathnameArray.pop()];
         // // https://www.youtube.com/@channel/search?query=11
         // // NOVA.channelTab = ['featured', 'videos', 'shorts', 'streams', 'podcasts', 'playlists', 'community', 'channels', 'about', 'search'].includes(channelTab) ? channelTab : false;

         // // Excluding channelId (https://www.youtube.com/channel/UCE5yTn9ljzSnC_oMp9Jnckg). Error in emdeb - https://www.youtube.com/embed/H-3fre7943U?enablejsapi=1&wmode=opaque&autoplay=1
         // // NOVA.channelTab = channelTab?.startsWith('UC') ? false : channelTab;

         // // fix for "/[A-Z\d_]/.test(page)" (https://www.youtube.com/live_chat, https://www.youtube.com/live_chat_replay)
         // if (page?.includes('live_chat')) return 'live_chat';

         // // fix non-standard link:
         // // https://www.youtube.com/pencilmation
         // // https://www.youtube.com/rhino
         // return (NOVA.channelTab
         //       || ['channel', 'c', 'user'].includes(page)
         //       || page?.startsWith('@') // https://www.youtube.com/@ALBO
         //       || /[A-Z\d_]/.test(page) // containsUppercase(without unicode) https://www.youtube.com/ProTradingSkills and number - https://www.youtube.com/deadp47, underline - https://www.youtube.com/live_games_it
         //       // https://www.youtube.com/clip/Ugkx2Z62NxoBfx_ZR2nIDpk3F2f90TV4_uht
         //    ) ? 'channel' : (page == 'clip') ? 'watch' : page || 'home';
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

      function identifyCurrentPage(page = 'home', channel_tab) {
         switch (page) {
            case '': page = 'home'; break;

            case 'live_chat':
            case 'live_chat_replay':
               page = 'live_chat'; break;

            // channel
            case 'channel':
            case 'c':
            case 'user':
               page = 'channel';
               break;

            // watch
            case 'watch':
            case 'clip':
               page = 'watch';
               break;

            default:
               // if (page?.includes('live_chat')) page = 'live_chat';
               if (page?.startsWith('@') // https://www.youtube.com/@ALBO
                  || /[A-Z\d_]/.test(page) // containsUppercase(without unicode)) (skip - https://www.youtube.com/kansas)
               ) {
                  page = 'channel';
               }
               break;
         }

         switch (channel_tab) {
            case 'featured':
            case 'videos':
            case 'shorts':
            case 'streams':
            case 'podcasts':
            case 'releases':
            case 'playlists':
            case 'community':
            case 'channels':
            case 'about':
            case 'search': // https://www.youtube.com/@channel/search?query=11
               page = 'channel';
               channel_tab = channel_tab;
               break;
            default:
               if (channel_tab?.startsWith('UC')) page = 'channel';
               channel_tab = false;
               break;
         }

         return {
            'page': page,
            'channelTab': channel_tab,
         };
      }

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
