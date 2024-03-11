console.log('%c /• %s •/', 'color:#0096fa; font-weight:bold;', GM_info.script.name + ' v.' + GM_info.script.version);

// for Greasemonkey
// (async () => {
// if (typeof GM_setValue != 'function') {
//    GM_getValue = async (n) => await GM.getValue(n);
//    GM_setValue = (n,d) => GM.setValue(n, d);
//    GM_openInTab = (t) => GM.openInTab(t);
//    //GM_registerMenuCommand = () => GM.registerMenuCommand(...arguments);
//    GM_registerMenuCommand = (t, fn) => GM.registerMenuCommand(t, fn);
// }

const
   // configPage = 'https://raingart.github.io/nova/', // ?tabs=tab-plugins
   configPage = 'https://raingart.github.io/options.html', // ?tabs=tab-plugins
   configStoreName = 'user_settings',
   user_settings = GM_getValue(configStoreName, null);
// user_settings = await GM_getValue(configStoreName) || {}; // for Greasemonkey

// console.debug(`current ${configStoreName}:`, user_settings);

// renameStorageKeys({
//    // 'oldKey': 'newKey',
// });

// Disabled script if youtube is embedded (is iframe)
if (user_settings?.exclude_iframe && (window.self !== window.top)) {
   return console.warn(GM_info.script.name + ': processed in the iframe disable');
}

registerMenuCommand();

// is configPage
if (location.hostname === new URL(configPage).hostname) setupConfigPage();
else {
   // Disabled the script if iframe in not "embed" (is frame)
   if ((window.self !== window.top)
      && (!location.pathname.startsWith('/embed') && !location.pathname.startsWith('/live_chat'))
   ) {
      return console.warn('iframe skiped:', location.pathname);
   }

   if (!user_settings?.disable_setting_button) insertSettingButton();

   // is user_settings empty
   if (!user_settings || !Object.keys(user_settings).length) {
      if (confirm('Active plugins undetected. Open the settings page now?')) window.open(configPage, '_blank');
      // if (confirm('Active plugins undetected. Open the settings page now?')) GM_openInTab(configPage);

      // default plugins settings
      user_settings['report_issues'] = 'on';
      GM_setValue(configStoreName, user_settings);
   }
   else {
      appLander();

      // export conf
      const exportedSettings = Object.assign({}, user_settings);
      delete exportedSettings['user-api-key'];
      delete exportedSettings['sponsor_block'];
      delete exportedSettings['sponsor_block_category'];
      delete exportedSettings['sponsor_block_url'];
      delete exportedSettings['thumbs_filter_title_blocklist'];
      delete exportedSettings['search_filter_channels_blocklist'];
      delete exportedSettings['thumbs_hide_live_channels_exception'];
      delete exportedSettings['comments_sort_words_blocklist'];
      delete exportedSettings['download_video_mode'];
      delete exportedSettings['video_unblock_region_domain'];
      unsafeWindow.window.nova_settings = exportedSettings;
   }
}

function setupConfigPage() {
   // form submit
   document.addEventListener('submit', event => {
      // console.debug('submit', event.target);
      event.preventDefault();

      let obj = {};
      for (const [key, value] of new FormData(event.target)) {
         // SerializedArray
         if (obj.hasOwnProperty(key)) {
            obj[key] += ',' + value; // add new
            obj[key] = obj[key].split(','); // to array [old, new]
         }
         else {
            // convert string to boolean
            switch (value) {
               case 'true': obj[key] = true; break;
               case 'false': obj[key] = false; break;
               // case 'undefined': obj[key] = undefined; break;
               case 'undefined': delete obj[key]; break; // remove unless storage
               default: obj[key] = value;
            }
         };
      }
      // fix tab reassignment
      // if (obj.tabs) delete obj.tabs;

      console.debug(`update ${configStoreName}:`, obj);
      GM_setValue(configStoreName, obj);
   }, { capture: true });

   window.addEventListener('DOMContentLoaded', () => {
      localizePage(user_settings?.lang_code);
      storeData = user_settings; // export(sync) settings to page
      // allow to export plugins
      unsafeWindow.window.nova_plugins = window.nova_plugins;
      // unsafeWindow.Plugins.load = () => { };
      // unsafeWindow.Plugins ={ };
   });

   window.addEventListener('load', () => {
      // unlock if synchronized
      document.body?.classList?.remove('preload');
      // alert('PopulateForm:' + typeof PopulateForm); // test for Greasemonkey

      document.body.querySelector('a[href$="issues/new"]')
         .addEventListener('click', ({ target }) => {
            target.href += '?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent);
         });
   });
}

function appLander() {
   // on page init
   if (document.readyState == 'loading') {
      document.addEventListener('DOMContentLoaded', appRun);
   }
   else {
      appRun();
   }

   let prevURL = document.URL;
   const isURLChanged = () => prevURL == document.URL ? false : prevURL = document.URL;

   // on page updated url
   // Strategy 1 (HTML). Skip first page transition
   if (isMobile = (location.host == 'm.youtube.com')) {
      window.addEventListener('transitionend', ({ target }) => target.id == 'progress' && isURLChanged() && appRun());
   }
   // Strategy 2 (API)
   else {
      document.addEventListener('yt-navigate-start', () => isURLChanged() && appRun());

      // miniplayer fix (https://github.com/raingart/Nova-YouTube-extension/issues/145)
      document.addEventListener('yt-action', reloadAfterMiniplayer);
      function reloadAfterMiniplayer(evt) {
         // if (!location.search.includes('list=')) return;

         // if ([
         //    'yt-miniplayer-endpoint-changed',
         //    'yt-cache-miniplayer-page-action',
         // ]
         //    .includes(evt.detail?.actionName)
         // ) {

         if (location.pathname == '/watch'
            // && evt.detail?.actionName.includes('miniplayer')
            && (evt.detail?.actionName == 'yt-cache-miniplayer-page-action')
            && isURLChanged()
         ) {
            // console.debug(evt.detail?.actionName);
            document.removeEventListener('yt-action', reloadAfterMiniplayer);
            appRun();
            // location.reload();
         }
      }
   }

   function appRun() {
      console.groupCollapsed('plugins status');

      // PluginsFn.run({
      Plugins.run({
         'user_settings': user_settings,
         'app_ver': GM_info.script.version,
      });
   }
}

// There are problems in this way / try remove initialization plugins delay (only userscript)
// function initPlugins() {
//    // page: init
//    console.groupCollapsed('plugins status');
//    PluginsFn.run({
//       'user_settings': user_settings,
//       'app_ver': GM_info.script.version,
//    });
//    // page: url change
//    let prevURL = document.URL;
//    const isURLChanged = () => (prevURL == document.URL) ? false : prevURL = document.URL;
//    // skip first page transition
//    document.addEventListener('yt-navigate-start', () => isURLChanged() && initPlugins());
// }

function registerMenuCommand() {
   GM_registerMenuCommand('Settings', () => window.open(configPage, '_blank'));
   // GM_registerMenuCommand('Settings', () => GM_openInTab(configPage));
   GM_registerMenuCommand('Import settings', () => {
      // if (navigator.userAgent.match(/firefox|fxios/i)) {
      if (json = JSON.parse(prompt('Enter json file context'))) {
         saveImportSettings(json);
      }
      // else alert('Import failed');
      // }
      else if (confirm('Import via file?')) {
         const f = document.createElement('input');
         f.type = 'file';
         f.accept = 'application/JSON';
         f.style.display = 'none';
         f.addEventListener('change', function () {
            if (f.files.length !== 1) return alert('file empty');
            const rdr = new FileReader();
            rdr.addEventListener('load', function () {
               try {
                  saveImportSettings(JSON.parse(rdr.result));
               }
               catch (err) {
                  alert(`Error parsing settings\n${err.name}: ${err.message}`);
               }
            });
            rdr.addEventListener('error', error => alert('Error loading file\n' + rdr?.error || error));
            rdr.readAsText(f.files[0]);
         });
         document.body.append(f);
         f.click();
         f.remove();
      }

      function saveImportSettings(json) {
         GM_setValue(configStoreName, json);
         renameStorageKeys({
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
            'comments-sidebar-position-exchange': 'move-in-sidebar',
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
            'move-in-sidebar': 'move-to-sidebar',
            'move_in_sidebar_target': 'move_to_sidebar_target',
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
         });
         // alert('Settings imported successfully!');
         alert('Settings imported!');
         location.reload();
      }
   });
   GM_registerMenuCommand('Export settings', () => {
      const d = document.createElement('a');
      d.style.display = 'none';
      d.download = 'nova_backup.json';
      d.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings));
      document.body.append(d);
      d.click();
      d.remove();
   });
}

function renameStorageKeys(key_template_obj = required()) {
   let needSave;
   for (const oldKey in user_settings) {
      if (newKey = key_template_obj[oldKey]) {
         console.log(oldKey, '=>', newKey);
         needSave = true;
         delete Object.assign(user_settings, { [newKey]: user_settings[oldKey] })[oldKey];
      }
      if (needSave) GM_setValue(configStoreName, user_settings);
   }
}

function insertSettingButton() {
   NOVA.waitSelector('#masthead #end')
      .then(menu => {
         const
            titleMsg = 'Nova Settings',
            a = document.createElement('a'),
            SETTING_BTN_ID = 'nova_settings_button';

         a.id = SETTING_BTN_ID;
         // a.href = configPage + '?tabs=tab-plugins';
         a.href = configPage;
         a.target = '_blank';
         // a.textContent = '▷';
         a.innerHTML =
            `<yt-icon-button class="style-scope ytd-button-renderer style-default size-default">
               <svg viewBox="-4 0 20 16">
                  <radialGradient id="nova-gradient" gradientUnits="userSpaceOnUse" cx="6" cy="22" r="18.5">
                     <stop class="nova-gradient-start" offset="0"/>
                     <stop class="nova-gradient-stop" offset="1"/>
                  </radialGradient>
                  <g fill="deepskyblue">
                     <polygon points="0,16 14,8 0,0"/>
                  </g>
               </svg>
            </yt-icon-button>`;
         // `<svg viewBox="0 0 24 24" style="height:24px;">
         //     <path d="M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z"/>
         // </svg>`;
         // a.textContent = '►';
         // a.style.cssText = '';
         // Object.assign(a.style, {
         //    'font-size': '24px',
         //    'color': 'deepskyblue !important',
         //    'text-decoration': 'none',
         //    'padding': '0 10px',
         // });
         a.addEventListener('click', null, { capture: true }); // fix hide <tp-yt-iron-dropdown>

         // append tooltip
         // a.setAttribute('tooltip', titleMsg); // css (ahs bug on hover search buttom)
         // yt-api
         a.title = titleMsg;
         const tooltip = document.createElement('tp-yt-paper-tooltip');
         tooltip.className = 'style-scope ytd-topbar-menu-button-renderer';
         // tooltip.setAttribute('role', 'tooltip');
         tooltip.textContent = titleMsg;
         a.appendChild(tooltip);

         // const style = document.createElement('style');
         // style.innerHTML += `#${SETTING_BTN_ID} button {display: contents;}`;
         // style.innerHTML += (
         NOVA.css.push(
            `#${SETTING_BTN_ID}[tooltip]:hover:after {
               position: absolute;
               top: 50px;
               transform: translateX(-50%);
               content: attr(tooltip);
               text-align: center;
               min-width: 3em;
               max-width: 21em;
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
               padding: 1.8ch 1.2ch;
               border-radius: 0.6ch;
               background-color: #616161;
               box-shadow: 0 1em 2em -0.5em rgb(0 0 0 / 35%);
               color: #fff;
               z-index: 1000;
            }

            #${SETTING_BTN_ID} {
               position: relative;
               opacity: .3;
               transition: opacity .3s ease-out;
            }

            #${SETTING_BTN_ID}:hover {
               opacity: 1 !important;
            }

            #${SETTING_BTN_ID} path,
            #${SETTING_BTN_ID} polygon {
               fill: url(#nova-gradient);
            }

            #${SETTING_BTN_ID} .nova-gradient-start,
            #${SETTING_BTN_ID} .nova-gradient-stop {
               transition: .6s;
               stop-color: #7a7cbd;
            }

            #${SETTING_BTN_ID}:hover .nova-gradient-start {
               stop-color: #0ff;
            }

            #${SETTING_BTN_ID}:hover .nova-gradient-stop {
               stop-color: #0095ff;
               /*stop-color: #fff700;*/
            }`);

         // a.appendChild(style);
         // menu.attachShadow({ mode: 'open' });
         // menu.shadowRoot.prepend(a);
         menu.prepend(a);

         // const btn = document.createElement('button');
         // btn.className = 'ytd-topbar-menu-button-renderer';
         // btn.title = 'Nova Settings';
         // btn.innerHTML =
         //    `<svg width="24" height="24" viewBox="0 0 24 24">
         //       <g fill="deepskyblue">
         //          <polygon points='21 12 3,1.8 3 22.2' />
         //          <path d='M3 1.8v20.4L21 12L3 1.8z M6 7l9 5.1l-9 5.1V7z' />
         //       </g>
         //    </svg>`;
         // btn.style.cssText = '';
         // Object.assign(btn.style, {
         //    // color: 'var(--yt-spec-text-secondary)',
         //    padding: '0 24px',
         //    border: 0,
         //    outline: 0,
         //    cursor: 'pointer',
         // });
         // btn.addEventListener('click', () => parent.open(configPage + '?tabs=tab-plugins'));
         // // menu.insertBefore(btn, menu.lastElementChild);
         // menu.prepend(btn);
      });
}

function _pluginsCaptureException({ trace_name, err_stack, confirm_msg, app_ver }) {
   // GM_notification({ text: GM_info.script.name + ' an error occurred', timeout: 4000, onclick: openBugReport });

   if (confirm(confirm_msg || `Error in ${GM_info.script.name}. Send the bug raport to developer?`)) {
      openBugReport();
   }

   function openBugReport() {
      // const userAgent = navigator.userAgent || JSON.stringify(navigator.userAgentData.brands.find(i => !i.brand.includes('Brand')));
      // const userAgent = navigator.userAgent || Object.values(navigator.userAgentData.brands.find(i => !i.brand.includes('Brand'))).join(' ');
      window.open(
         // GM_openInTab(
         'https://docs.google.com/forms/u/0/d/e/1FAIpQLScfpAvLoqWlD5fO3g-fRmj4aCeJP9ZkdzarWB8ge8oLpE5Cpg/viewform' +
         '?entry.35504208=' + encodeURIComponent(trace_name) +
         '&entry.151125768=' + encodeURIComponent(err_stack) +
         '&entry.744404568=' + encodeURIComponent(document.URL) +
         '&entry.1416921320=' + encodeURIComponent(app_ver + ' | ' + navigator.userAgent + ' [' + window.navigator.language + ']')
         // );
         , '_blank');
   }
}

// Disabled for minified version
user_settings.report_issues && window.addEventListener('unhandledrejection', err => {
   // if (user_settings.report_issues && err.reason.stack.includes('/Nova%20YouTube.user.js'))
   if ((err.reason?.stack || err.stack)?.includes('Nova')) {
      console.error('[ERROR PROMISE]\n', err.reason, '\nPlease report the bug: https://github.com/raingart/Nova-YouTube-extension/issues/new?body=' + encodeURIComponent(GM_info.script.version + ' | ' + navigator.userAgent));

      _pluginsCaptureException({
         'trace_name': 'unhandledRejection',
         'err_stack': err.reason.stack || err.stack,
         'app_ver': GM_info.script.version,
         'confirm_msg': `Failure when async-call of one "${GM_info.script.name}" plugin.\nDetails in the console\n\nOpen tab to report the bug?`,
      });
   }
});

// })(); // for Greasemonkey
