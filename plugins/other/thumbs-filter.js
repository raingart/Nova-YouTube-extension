// for test
// https://www.youtube.com/channel/UC9qr4fem8L5HEx0IDoktEpw/videos - many live

window.nova_plugins.push({
   id: 'thumbs-hide',
   title: 'Thumbnails filter',
   'title:zh': '缩略图过滤',
   'title:ja': 'サムネイルのフィルタリング',
   'title:ko': '썸네일 필터링',
   'title:id': 'Pemfilteran gambar mini',
   'title:es': 'Filtrado de miniaturas',
   'title:pt': 'Filtragem de miniaturas',
   'title:fr': 'Filtrage des vignettes',
   'title:it': 'Filtraggio miniature',
   // 'title:tr': 'Küçük resim filtreleme',
   'title:de': 'Filtrowanie miniatur',
   'title:pl': 'Ukryj kilka miniatur',
   'title:ua': 'Фільтрування мініатюр',
   run_on_pages: 'home, results, feed, channel, watch, -mobile',
   section: 'other',
   _runtime: user_settings => {

      // alt1 - https://github.com/EvHaus/youtube-hide-watched
      // alt2 - https://greasyfork.org/en/scripts/446507-youtube-sub-feed-filter-2

      const
         SELECTOR_THUMBS_HIDE_CLASS_NAME = 'nova-thumbs-hide',
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel, feed
            'ytd-video-renderer', // results
            // 'ytd-grid-video-renderer', // feed (old)
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            'ytm-item-section-renderer' // mobile /subscriptions page
         ]
            .map(i => `${i}:not(.${SELECTOR_THUMBS_HIDE_CLASS_NAME})`)
            .join(',');

      // page update event
      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         if ([
            'yt-append-continuation-items-action', // home, results, feed, channel, watch
            'ytd-update-grid-state-action', // feed, channel
            'yt-rich-grid-layout-refreshed', // feed
            // 'ytd-rich-item-index-update-action', // home, channel
            'yt-store-grafted-ve-action', // results, watch
            // 'ytd-update-elements-per-row-action', // feed

            // universal
            // 'ytd-update-active-endpoint-action',
            // 'yt-window-scrolled',
            // 'yt-service-request', // results, watch
         ]
            .includes(evt.detail?.actionName)
         ) {
            // console.log(evt.detail?.actionName); // flltered
            switch (NOVA.currentPage) {
               case 'home':
                  thumbRemove.live();
                  thumbRemove.mix();
                  thumbRemove.watched();
                  break;

               case 'results':
                  thumbRemove.live();
                  thumbRemove.shorts();
                  // thumbRemove.durationLimits();
                  thumbRemove.mix();
                  // thumbRemove.watched();
                  break;

               case 'feed':
                  thumbRemove.live();
                  thumbRemove.streamed();
                  thumbRemove.shorts();
                  thumbRemove.durationLimits();
                  thumbRemove.premieres();
                  thumbRemove.mix();
                  thumbRemove.watched();
                  break;

               // case 'channel':
               //    thumbRemove.live();
               //    thumbRemove.streamed();
               //    // thumbRemove.shorts();
               //    thumbRemove.premieres();
               //    thumbRemove.watched();
               //    break;

               case 'watch':
                  thumbRemove.live();
                  thumbRemove.mix();
                  thumbRemove.watched();
                  break;

               // default:
               //    thumbRemove.live();
               //    break;
            }
         }
      });

      // inset filter-switch button
      // alt - https://greasyfork.org/en/scripts/446507-youtube-sub-feed-filter-2
      // NOVA.waitSelector('#voice-search-button', { destroy_after_page_leaving: true })
      NOVA.waitSelector('#filter-button, ytd-shelf-renderer #title-container a[href="/feed/channels"]', { destroy_after_page_leaving: true })
         .then(container => {
            const filterBtn = document.createElement('button');
            filterBtn.className = 'style-scope yt-formatted-string bold yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--text';
            // filterBtn.textContent = 'Filter Switch';
            filterBtn.innerHTML =
               `<span class="yt-spec-button-shape-next__icon" style="height:100%">
                  <svg viewBox="-50 -50 400 400" height="100%" width="100%">
                     <g fill="currentColor">
                        <path d="M128.25,175.6c1.7,1.8,2.7,4.1,2.7,6.6v139.7l60-51.3v-88.4c0-2.5,1-4.8,2.7-6.6L295.15,65H26.75L128.25,175.6z" />
                     </g>
                  </svg>
               </span>`;
            filterBtn.title = 'Toggle NOVA plugin [thumbs-hide]';
            Object.assign(filterBtn.style, {
               border: 0,
               cursor: 'pointer',
               scale: .7,
            });
            filterBtn.addEventListener('click', () => {
               document.body.classList.toggle('nova-thumbs-unhide');
            });
            container.after(filterBtn);
         });

      // button css-switch
      NOVA.css.push(
         `body.nova-thumbs-unhide .${SELECTOR_THUMBS_HIDE_CLASS_NAME} {
            border: 2px dashed orange;
         }
         body:not(.nova-thumbs-unhide) .${SELECTOR_THUMBS_HIDE_CLASS_NAME} {
            display: none
         }`);

      if (user_settings.thumbs_hide_shorts) {
         const stylesList = [
            // https://www.reddit.com/r/uBlockOrigin/wiki/solutions/youtube/#wiki_shorts
            // '#content > ytd-rich-shelf-renderer', // results old
            'ytd-reel-shelf-renderer',
            'ytd-rich-grid-row + ytd-rich-section-renderer', // feed
            '[is-shorts]',
         ]
            .join(',\n');

         NOVA.css.push(stylesList + `{ display: none !important; }`);
         // NOVA.css.push({
         //    'display': 'none !important',
         // }, stylesList.join(',\n'));
      }

      const thumbRemove = {
         // alt - https://greasyfork.org/en/scripts/461568-hide-youtube-shorts/
         shorts() {
            if (!user_settings.thumbs_hide_shorts) return;
            // exclude "short" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'shorts') return;

            document.body.querySelectorAll('a#thumbnail[href*="shorts/"]')
               // .forEach(el => el.closest(thumbsSelectors)?.remove());
               .forEach(el => {
                  if (thumb = el.closest(thumbsSelectors)) {
                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('#short:', thumb);
                     // thumb.style.border = '2px solid orange'; // mark for test
                  }
               });
         },

         durationLimits() {
            // alt - https://greasyfork.org/en/scripts/466576-hide-longs-on-youtube
            if (!+user_settings.thumbs_hide_min_duration) return;
            // if (!NOVA.formatTimeOut.hmsToSec(user_settings.thumbs_hide_min_duration)) return; // for input[type=text] (digit time)

            // exclude "" tab in channel
            // if (NOVA.currentPage == 'channel' && NOVA.channelTab != 'video') return;

            // Strategy 1. API
            // // document.body.querySelector('ytd-grid-video-renderer').data - feed page
            // document.body.querySelectorAll(thumbsSelectors)
            //    .forEach(thumb => {
            //       if ((to = thumb.data?.thumbnailOverlays)?.length) {
            //          if (NOVA.formatTimeOut.hmsToSec(to[0].thumbnailOverlayTimeStatusRenderer.text.simpleText) < (+user_settings.thumbs_hide_min_duration || 60)
            //          ) {
            //             // thumb.remove();
            //             // // for test
            //             // // thumb.style.display = 'none';
            //             // console.debug('has watched:', thumb);
            //             thumb.style.border = '2px solid orange'; // mark for test
            //          }
            //       }
            //    });

            // Strategy 2. HTML
            // const OVERLAYS_TIME_SELECTOR = '#thumbnail #overlays ytd-thumbnail-overlay-time-status-renderer:not(:empty)';
            const OVERLAYS_TIME_SELECTOR = '#thumbnail #overlays #text:not(:empty)';
            // wait load overlays-time
            NOVA.waitSelector(OVERLAYS_TIME_SELECTOR)
               .then(() => {
                  document.body.querySelectorAll(OVERLAYS_TIME_SELECTOR)
                     .forEach(el => {
                        // console.debug('>', NOVA.formatTimeOut.hmsToSec(el.textContent.trim()));
                        if ((thumb = el.closest(thumbsSelectors))
                           && (timeSec = NOVA.formatTimeOut.hmsToSec(el.textContent.trim()))
                           && (timeSec * (user_settings.rate_default || 1)) < (+user_settings.thumbs_hide_min_duration || 60)
                        ) {
                           thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                           // thumb.remove();
                           // thumb.style.display = 'none';

                           // console.debug('short time:', timeSec, el.textContent);
                           // thumb.style.border = '2px solid blue'; // mark for test
                        }
                     });
               });
         },

         // alt - https://greasyfork.org/en/scripts/443344-youtube-toggle-videos-buttons
         premieres() {
            if (!user_settings.thumbs_hide_premieres) return;
            // announced
            document.body.querySelectorAll(
               `#thumbnail #overlays [aria-label="Premiere"],
               #thumbnail #overlays [aria-label="Upcoming"]`
            )
               // .forEach(el => el.closest(thumbsSelectors)?.remove());
               .forEach(el => {
                  if (thumb = el.closest(thumbsSelectors)) {
                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('Premieres:', thumb);
                     // thumb.style.border = '2px solid red'; // mark for test
                  }
               });

            // streaming
            // #thumbnail #overlays > :not(ytd-thumbnail-overlay-time-status-renderer)
            // #thumbnail #overlays > :not(#text)
            // #video-badges > .badge-style-type-live-now-alternate // old
            // .badge-style-type-live-now-alternate .ytd-badge-supported-renderer svg
            // document.body.querySelectorAll('#video-badges > [class*="live-now"]') // old
            document.body.querySelectorAll('[class*="badge"] [class*="live-now"]')
               // .forEach(el => el.closest(thumbsSelectors)?.remove());
               .forEach(el => {
                  if (thumb = el.closest(thumbsSelectors)) {
                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('Premieres:', thumb);
                     // thumb.style.border = '2px solid violet'; // mark for test
                  }
               });
         },

         live() {
            if (!user_settings.thumbs_hide_live) return;
            // exclude "LIVE" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;

            // textarea to array
            const keywords = NOVA.strToArray(user_settings.thumbs_hide_live_channels_exception);

            // #thumbnail #overlays [overlay-style="LIVE"],
            document.body.querySelectorAll('#thumbnail img[src*="_live.jpg"]')
               // .forEach(el => el.closest(thumbsSelectors)?.remove());
               // for test
               .forEach(el => {
                  if (thumb = el.closest(thumbsSelectors)) {
                     // find in filter channel exception
                     if (keywords?.includes(thumb.querySelector('#channel-name a')?.textContent.trim().toLowerCase())) {
                        // fix for [search-filter] plugin
                        if (user_settings['search-filter']) {
                           thumb.style.display = 'block'; // unhide after [search-filter] plugin
                        }
                        // thumb.style.border = '2px solid dodgerblue'; // mark for test
                        return;
                     }

                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('live now:', thumb);
                     // thumb.style.border = '2px solid orange'; // mark for test
                  }
               });
         },

         streamed() {
            if (!user_settings.thumbs_hide_streamed) return;
            // exclude "LIVE" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;

            // textarea to array
            const keywords = NOVA.strToArray(user_settings.thumbs_hide_live_channels_exception);

            // document.body.querySelectorAll('#metadata-line > span:last-of-type')
            document.body.querySelectorAll('#metadata')
               .forEach(el => {
                  if (el.querySelector('#metadata-line > span:last-of-type')?.textContent?.split(' ').length === 4 // "Streamed 5 days ago"
                     && (thumb = el.closest(thumbsSelectors))
                     // && thumb.classList.contains(SELECTOR_THUMBS_HIDE_CLASS_NAME)
                  ) {
                     // filter channel
                     if (keywords?.includes(thumb.querySelector('#channel-name a')?.textContent.trim().toLowerCase())) {
                        // fix for [search-filter] plugin
                        if (user_settings['search-filter']) {
                           thumb.style.display = 'block'; // unhide after [search-filter] plugin
                        }
                        // thumb.style.border = '2px solid dodgerblue'; // mark for test
                        return;
                     }

                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('streamed:', thumb);
                     // thumb.style.border = '2px solid green'; // mark for test
                  }
               });
         },

         mix() {
            if (!user_settings.thumbs_hide_mix) return;

            document.body.querySelectorAll(
               // .ytp-videowall-still[data-is-mix=true],
               // ytd-browse[page-subtype=home] a[href$="start_radio=1"],
               // ytd-browse[page-subtype=home] ytd-video-meta-block[radio-meta],
               // ytd-compact-radio-renderer,
               // ytd-radio-renderer,
               `a[href*="list="][href*="start_radio="]:not([hidden]),
               #video-title[title^="Mix -"]:not([hidden])`
            )
               // .forEach(el => el.closest('ytd-radio-renderer, ytd-compact-radio-renderer, ' + thumbsSelectors)?.remove());
               .forEach(el => {
                  if (thumb = el.closest('ytd-radio-renderer, ytd-compact-radio-renderer,' + thumbsSelectors)) {
                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('has Mix:', thumb);
                     // thumb.style.border = '2px solid red'; // mark for test
                  }
               });
         },

         // alt1 - https://greasyfork.org/en/scripts/451525-youtube-hide-watched
         // alt2 - https://greasyfork.org/en/scripts/424945-youtube-watched-subscription-hider
         watched() {
            if (!user_settings.thumbs_hide_watched) return;
            // conflict with [thumbnails-watched] plugin
            if (!user_settings['thumbnails-watched']) return;

            const PERCENT_COMPLETE = user_settings.thumbs_hide_watched_percent_complete || 90;

            // Strategy 1. API
            // document.body.querySelectorAll(thumbsSelectors)
            //    .forEach(thumb => {
            //       if ((to = thumb.data?.thumbnailOverlays)?.length) {
            //          if (to[0].thumbnailOverlayResumePlaybackRenderer?.percentDurationWatched >= PERCENT_COMPLETE) {
            //             thumb.remove();
            //             // // for test
            //             // // thumb.style.display = 'none';
            //             // console.debug('has watched:', thumb);
            //             // thumb.style.border = '2px solid orange'; // mark for test
            //          }
            //       }
            //    });
            // Strategy 1. HTML
            document.body.querySelectorAll('#thumbnail #overlays #progress')
               .forEach(el => {
                  // if (parseInt(el.style.width) > PERCENT_COMPLETE) {
                  //    el.closest(thumbsSelectors)?.remove();
                  // }
                  if ((parseInt(el.style.width) > PERCENT_COMPLETE)
                     && (thumb = el.closest(thumbsSelectors))
                  ) {
                     thumb.classList.add(SELECTOR_THUMBS_HIDE_CLASS_NAME);
                     // thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('watched', thumb);
                     // thumb.style.border = '2px solid orange'; // mark for test
                  }
               });
         },
      };

      if (user_settings.thumbs_hide_mix) {
         NOVA.css.push(
            `ytd-radio-renderer {
               display: none !important;
            }`);
      }

   },
   options: {
      thumbs_hide_shorts: {
         _tagName: 'input',
         label: 'Hide Shorts',
         'label:zh': '隐藏短裤',
         'label:ja': 'ショーツを隠す',
         'label:ko': '반바지 숨기기',
         'label:id': 'Sembunyikan Celana Pendek',
         'label:es': 'Ocultar pantalones cortos',
         'label:pt': 'Ocultar shorts',
         'label:fr': 'Masquer les shorts',
         'label:it': 'Nascondi pantaloncini',
         // 'label:tr': 'Şort Gizle',
         'label:de': 'Shorts verstecken',
         'label:pl': 'Ukryj YouTube Shorts',
         'label:ua': 'Приховати прев`ю',
         type: 'checkbox',
         // title: '',
         // 'data-dependent': { 'thumbs-shorts-duration': '!true' },
      },
      thumbs_hide_min_duration: {
         _tagName: 'input',
         label: 'Min duration in sec (for regular video)',
         'label:zh': '最短持续时间（以秒为单位）',
         'label:ja': '秒単位の最小期間',
         'label:ko': '최소 지속 시간(초)',
         'label:id': 'Durasi lebih sedikit dalam detik',
         'label:es': 'Duración mínima en segundos',
         'label:pt': 'Duração mínima em segundos',
         'label:fr': 'Durée minimale en secondes',
         'label:it': 'Meno durata in sec',
         // 'label:tr': 'Saniye cinsinden minimum süre',
         'label:de': 'Mindestdauer in Sekunden',
         'label:pl': 'Poniżej czasu trwania w sekundach',
         'label:ua': 'Мінімальна триваліcть в cекундах',
         type: 'number',
         // title: '60 - default',
         // title: 'Minimum duration in seconds',
         title: 'in sec / 0 - disable',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '60-3600',
         step: 1,
         min: 0,
         max: 3600, // 3600 = 1 hour
         value: 0,

         // for input[type=text] (digit time)
         // type: 'text',
         // title: '0 - disable',
         // placeholder: '00:00:00 - 01:00:00',
         // step: 1,
         // value: '00:00:00',
         // pattern: '(0[0-1])(:[0-5][0-9]){2}',
         // size: 15,
      },
      thumbs_hide_premieres: {
         _tagName: 'input',
         label: 'Hide Premieres/Upcoming',
         'label:zh': '隐藏首映/即将上映',
         'label:ja': 'プレミア公開/近日公開を非表示',
         'label:ko': 'Premieres/예정 숨기기',
         'label:id': 'Sembunyikan Tayang Perdana/Mendatang',
         'label:es': 'Ocultar estrenos/próximos',
         'label:pt': 'Ocultar Estreias/Próximas',
         'label:fr': 'Masquer les premières/à venir',
         'label:it': 'Nascondi anteprime/in arrivo',
         // 'label:tr': '',
         'label:de': 'Premieren/Kommende ausblenden',
         'label:pl': 'Ukrywaj premiery',
         'label:ua': 'Приховати прем`єри',
         type: 'checkbox',
         title: 'Premiere Announcements',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
      },
      thumbs_hide_live: {
         _tagName: 'input',
         label: 'Hide Live streams',
         'label:zh': '隐藏直播',
         'label:ja': 'ライブ ストリームを非表示にする',
         'label:ko': '라이브 스트림 숨기기',
         'label:id': 'Sembunyikan streaming langsung',
         'label:es': 'Ocultar transmisiones en vivo',
         'label:pt': 'Ocultar transmissões ao vivo',
         'label:fr': 'Masquer les flux en direct',
         'label:it': 'Nascondi live streaming',
         // 'label:tr': '',
         'label:de': 'Live-Streams ausblenden',
         'label:pl': 'Ukryj strumień (na żywo)',
         'label:ua': 'Приховати живі транcляції',
         type: 'checkbox',
         title: 'Now airing',
         'title:zh': '正在播出',
         'title:ja': '放映中',
         'title:ko': '지금 방영중',
         'title:id': 'Sekarang ditayangkan',
         'title:es': 'Ahora al aire',
         'title:pt': 'Agora no ar',
         'title:fr': 'Diffusion en cours',
         'title:it': 'Ora in onda',
         // 'title:tr': 'Şimdi yayınlanıyor',
         'title:de': 'Jetzt Lüften',
         'title:pl': 'Teraz wietrzenie',
         'title:ua': 'Зараз в ефірі',
      },
      thumbs_hide_live_channels_exception: {
         _tagName: 'textarea',
         label: 'Channels exception',
         // 'label:zh': '频道列表',
         // 'label:ja': 'チャンネルリスト',
         // 'label:ko': '채널 목록',
         // 'label:id': 'Daftar',
         // 'label:es': 'Lista',
         // 'label:pt': 'Lista',
         // 'label:fr': 'Liste',
         // 'label:it': 'Elenco',
         // // 'label:tr': 'Listesi',
         // 'label:de': 'Liste',
         // 'label:pl': 'Lista',
         // 'label:ua': 'Список',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         'title:id': 'pemisah: "," atau ";" atau "baris baru"',
         'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         'title:it': 'separatore: "," o ";" o "nuova linea"',
         // 'title:tr': 'ayırıcı: "," veya ";" veya "new line"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         'title:pl': 'separator: "," lub ";" lub "now linia"',
         'title:ua': 'розділювач: "," або ";" або "новий рядок"',
         placeholder: 'channel1\nchannel2',
         'data-dependent': { 'thumbs_hide_live': true },
      },
      thumbs_hide_streamed: {
         _tagName: 'input',
         label: 'Hide finished streams',
         'label:zh': '隐藏完成的流',
         'label:ja': '終了したストリームを非表示にする',
         'label:ko': '완료된 스트림 숨기기',
         'label:id': 'Sembunyikan aliran yang sudah selesai',
         'label:es': 'Ocultar flujos terminados',
         'label:pt': 'Ocultar streams concluídos',
         'label:fr': 'Masquer les flux terminés',
         'label:it': 'Nascondi i flussi finiti',
         // 'label:tr': 'Bitmiş akışları gizle',
         'label:de': 'Fertige Streams ausblenden',
         'label:pl': 'Ukryj po streamie',
         'label:ua': 'cховати завершені транcляції',
         type: 'checkbox',
         //title: '',
         'data-dependent': { 'thumbs_hide_live': true },
      },
      thumbs_hide_mix: {
         _tagName: 'input',
         label: "Hide 'Mix' thumbnails",
         'label:zh': '隐藏[混合]缩略图',
         'label:ja': '「Mix」サムネイルを非表示',
         'label:ko': '"믹스" 썸네일 숨기기',
         'label:id': 'Sembunyikan gambar mini "Mix"',
         'label:es': "Ocultar miniaturas de 'Mix'",
         'label:pt': "Ocultar miniaturas de 'Mix'",
         'label:fr': 'Masquer les vignettes "Mix"',
         'label:it': 'Nascondi le miniature "Mix".',
         // 'label:tr': "'Karıştır' küçük resimlerini gizle",
         'label:de': '„Mix“-Thumbnails ausblenden',
         'label:pl': 'Ukryj miniaturki "Mix"',
         'label:ua': 'Приховати мікc мініатюр',
         type: 'checkbox',
         title: '[Mix] offers to rewatch what has already saw',
         'title:zh': '[混合]提供重新观看已经看过的内容',
         'title:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
         'title:ko': '[Mix]는 이미 본 것을 다시 볼 것을 제안합니다',
         'title:id': '[Mix] menawarkan untuk menonton ulang apa yang telah dilihat',
         'title:es': '[Mix] ofrece volver a ver lo que ya vio',
         'title:pt': '[Mix] se oferece para rever o que já viu',
         'title:it': '[Mix] si offre di rivedere ciò che ha già visto',
         // 'title:tr': '[Mix], daha önce görmüş olanı yeniden izlemeyi teklif ediyor',
         'title:de': '[Mix] bietet an, bereits Gesehenes noch einmal anzuschauen',
         'title:pl': '[Mix] proponuje ponowne obejrzenie już obejrzanych filmów',
         'title:ua': '[Mix] пропонує передивитиcя вже побачене',
      },
      thumbs_hide_watched: {
         _tagName: 'input',
         label: 'Hide watched',
         'label:zh': '隐藏观看',
         'label:ja': '監視対象を非表示',
         'label:ko': '시청 숨기기',
         'label:id': 'Sembunyikan ditonton',
         'label:es': 'Ocultar visto',
         'label:pt': 'Ocultar assistidos',
         'label:fr': 'Masquer surveillé',
         'label:it': 'Nascondi guardato',
         // 'label:tr': '',
         'label:de': 'Ausblenden beobachtet',
         'label:pl': 'Ukryj oglądane',
         'label:ua': 'cховати переглянуті відео',
         type: 'checkbox',
         // https://myactivity.google.com/activitycontrols?settings=youtube
         title: 'Need to Turn on [YouTube History]',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
      },
      thumbs_hide_watched_percent_complete: {
         _tagName: 'input',
         label: 'Threshold percent',
         type: 'number',
         title: 'in %',
         placeholder: '%',
         step: 5,
         min: 5,
         max: 100,
         value: 90,
         'data-dependent': { 'thumbs_hide_watched': true },
      },
   }
});
