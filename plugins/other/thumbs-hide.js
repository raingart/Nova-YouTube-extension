// for test
// https://www.youtube.com/channel/UC9qr4fem8L5HEx0IDoktEpw/videos - many live

window.nova_plugins.push({
   id: 'thumbs-hide',
   title: 'Thumbnails filtering',
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
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel, feed
            'ytd-video-renderer', // results
            // 'ytd-grid-video-renderer', // feed (old)
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            'ytm-item-section-renderer' // mobile /subscriptions page
         ]
            .join(',');

      // page update event
      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         if ([
            'yt-append-continuation-items-action', // home, results, feed, channel, watch
            'ytd-update-grid-state-action', // feed, channel
            'yt-service-request', // results, watch
            'ytd-rich-item-index-update-action', // home, channel
         ]
            .includes(evt.detail?.actionName)
         ) {
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

               case 'channel':
                  thumbRemove.live();
                  thumbRemove.streamed();
                  // thumbRemove.shorts();
                  thumbRemove.premieres();
                  thumbRemove.watched();
                  break;

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

      const thumbRemove = {
         // alt - https://greasyfork.org/en/scripts/461568-hide-youtube-shorts/
         shorts() {
            if (!user_settings.shorts_disable) return;
            // exclude "short" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'shorts') return;

            document.body.querySelectorAll('a#thumbnail[href*="shorts/"]')
               .forEach(el => el.closest(thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest(thumbsSelectors)) {
            //       // thumb.remove();
            //       // thumb.style.display = 'none';

            //       // console.debug('#short:', thumb);
            //       thumb.style.border = '2px solid orange'; // mark for test
            //    }
            // });
         },

         durationLimits() {
            // alt - https://greasyfork.org/en/scripts/466576-hide-longs-on-youtube
            if (!+user_settings.shorts_disable_min_duration) return;
            // if (!NOVA.timeFormatTo.hmsToSec(user_settings.shorts_disable_min_duration)) return; // for input[type=text] (digit time)

            // exclude "" tab in channel
            // if (NOVA.currentPage == 'channel' && NOVA.channelTab != 'video') return;

            // Strategy 1. API
            // // document.querySelector('ytd-grid-video-renderer').data - feed page
            // document.body.querySelectorAll(thumbsSelectors)
            //    .forEach(thumb => {
            //       if ((to = thumb.data?.thumbnailOverlays).length) {
            //          if (NOVA.timeFormatTo.hmsToSec(to[0].thumbnailOverlayTimeStatusRenderer.text.simpleText) < (+user_settings.shorts_disable_min_duration || 60)
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
            const OVERLAYS_TIME_SELECTOR = '#thumbnail #overlays #text:not(:empty)';
            // wait load overlays-time
            NOVA.waitSelector(OVERLAYS_TIME_SELECTOR)
               .then(() => {
                  document.body.querySelectorAll(OVERLAYS_TIME_SELECTOR)
                     .forEach(el => {
                        // console.debug('>', NOVA.timeFormatTo.hmsToSec(el.textContent.trim()));
                        if ((thumb = el.closest(thumbsSelectors))
                           && (time = NOVA.timeFormatTo.hmsToSec(el.textContent.trim()))
                           && time < (+user_settings.shorts_disable_min_duration || 60)
                        ) {
                           thumb.remove();
                           // thumb.style.display = 'none';

                           // console.debug('short time:', time, el.textContent);
                           // thumb.style.border = '2px solid blue'; // mark for test
                        }
                     });
               });
         },

         // alt - https://greasyfork.org/en/scripts/443344-youtube-toggle-videos-buttons
         premieres() {
            if (!user_settings.premieres_disable) return;
            // announced
            document.body.querySelectorAll(
               `#thumbnail #overlays [aria-label="Premiere"],
               #thumbnail #overlays [aria-label="Upcoming"]`
            )
               .forEach(el => el.closest(thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest(thumbsSelectors)) {
            //       // thumb.remove();
            //       // thumb.style.display = 'none';

            //       console.debug('Premieres:', thumb);
            //       thumb.style.border = '2px solid red'; // mark for test
            //    }
            // });

            // streaming
            // #overlays > :not(ytd-thumbnail-overlay-time-status-renderer)
            // #video-badges > .badge-style-type-live-now-alternate
            document.body.querySelectorAll('#video-badges > [class*="live-now"]')
               .forEach(el => el.closest(thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest(thumbsSelectors)) {
            //       // thumb.remove();
            //       // thumb.style.display = 'none';

            //       console.debug('Premieres:', thumb);
            //       thumb.style.border = '2px solid violet'; // mark for test
            //    }
            // });
         },

         live() {
            if (!user_settings.live_disable) return;
            // exclude "LIVE" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;

            // #thumbnail #overlays [overlay-style="LIVE"],
            document.body.querySelectorAll('#thumbnail img[src*="_live.jpg"]')
               .forEach(el => el.closest(thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest(thumbsSelectors)) {
            //       // thumb.remove();
            //       // thumb.style.display = 'none';

            //       console.debug('live now:', thumb);
            //       thumb.style.border = '2px solid orange'; // mark for test
            //    }
            // });
         },

         streamed() {
            if (!user_settings.streamed_disable) return;
            // exclude "LIVE" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;

            document.body.querySelectorAll('#metadata-line > span:last-of-type')
               .forEach(el => {
                  if (el.textContent?.split(' ').length === 4 // "Streamed 5 days ago"
                     && (thumb = el.closest(thumbsSelectors))) {
                     thumb.remove();
                     // thumb.style.display = 'none';

                     // console.debug('streamed:', thumb);
                     // thumb.style.border = '2px solid green'; // mark for test
                  }
               });
         },

         mix() {
            if (!user_settings.mix_disable) return;

            document.body.querySelectorAll(
               // .ytp-videowall-still[data-is-mix=true],
               // ytd-browse[page-subtype=home] a[href$="start_radio=1"],
               // ytd-browse[page-subtype=home] ytd-video-meta-block[radio-meta],
               // ytd-compact-radio-renderer,
               // ytd-radio-renderer,
               `a[href*="list="][href*="start_radio="]:not([hidden]),
               #video-title[title^="Mix -"]:not([hidden])`
            )
               .forEach(el => el.closest('ytd-radio-renderer, ytd-compact-radio-renderer, ' + thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest('ytd-radio-renderer, ytd-compact-radio-renderer,' + thumbsSelectors)) {
            //       // thumb.style.display = 'none';
            //       console.debug('has Mix:', thumb);
            //       thumb.style.border = '2px solid red'; // mark for test
            //    }
            // });
         },

         // alt1 - https://greasyfork.org/en/scripts/451525-youtube-hide-watched
         // alt2 - https://greasyfork.org/en/scripts/424945-youtube-watched-subscription-hider
         watched() {
            if (!user_settings.watched_disable) return;
            // conflict with plugin [thumbnails-watched]
            if (!user_settings['thumbnails-watched']) return;

            const PERCENT_COMPLETE = user_settings.watched_disable_percent_complete || 90;

            // Strategy 1. API
            // document.body.querySelectorAll(thumbsSelectors)
            //    .forEach(thumb => {
            //       if ((to = thumb.data?.thumbnailOverlays).length) {
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
                  if (parseInt(el.style.width) > PERCENT_COMPLETE) {
                     el.closest(thumbsSelectors)?.remove();
                  }
               });
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest(thumbsSelectors)) {
            //       // thumb.style.display = 'none';
            //       console.debug('has Mix:', thumb);
            //       thumb.style.border = '2px solid orange'; // mark for test
            //    }
            // });
         },
      };

      if (user_settings.mix_disable) {
         NOVA.css.push(
            `ytd-radio-renderer {
               display: none !important;
            }`);
      }

   },
   options: {
      shorts_disable: {
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
      shorts_disable_min_duration: {
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
         title: '0 - disable',
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
      premieres_disable: {
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
      },
      live_disable: {
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
      streamed_disable: {
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
         'data-dependent': { 'live_disable': true },
      },
      mix_disable: {
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
      watched_disable: {
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
      watched_disable_percent_complete: {
         _tagName: 'input',
         label: 'Threshold percent',
         type: 'number',
         title: 'in %',
         placeholder: '%',
         step: 5,
         min: 5,
         max: 100,
         value: 90,
         'data-dependent': { 'watched_disable': true },
      },
   }
});
