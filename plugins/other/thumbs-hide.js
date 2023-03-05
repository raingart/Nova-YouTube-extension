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

      // alt - https://greasyfork.org/en/scripts/446507-youtube-sub-feed-filter-2

      const
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home, channel
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed
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
                  break;

               case 'results':
                  thumbRemove.live();
                  thumbRemove.shorts();
                  thumbRemove.mix();
                  break;

               case 'feed':
                  thumbRemove.live();
                  thumbRemove.streamed();
                  thumbRemove.shorts();
                  thumbRemove.premieres();
                  thumbRemove.mix();
                  break;

               case 'channel':
                  thumbRemove.live();
                  thumbRemove.streamed();
                  // thumbRemove.shorts();
                  thumbRemove.premieres();
                  break;

               case 'watch':
                  thumbRemove.live();
                  thumbRemove.mix();
                  break;

               // default:
               //    thumbRemove.live();
               //    break;
            }
         }
      });

      const thumbRemove = {
         shorts() {
            if (!user_settings.shorts_disable) return;
            // exсlude "short" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'shorts') return;

            document.body.querySelectorAll('a#thumbnail[href*="shorts/"]')
               .forEach(el => el.closest(thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //       if (thumb = el.closest(thumbsSelectors)) {
            //          // thumb.remove();
            //          // thumb.style.display = 'none';

            //          // console.debug('#shorts:', thumb);
            //          thumb.style.border = '2px solid orange'; // mark for test
            //       }
            //    });

            if (+user_settings.shorts_disable_min_duration) {
               document.body.querySelectorAll('#thumbnail #overlays #text:not(:empty)')
                  .forEach(el => {
                     if ((thumb = el.closest(thumbsSelectors))
                        && NOVA.timeFormatTo.hmsToSec(el.innerText.trim()) < (+user_settings.shorts_disable_min_duration || 60)
                     ) {
                        thumb.remove();
                        // thumb.style.display = 'none';

                        // console.debug('#shorts:', thumb);
                        // thumb.style.border = '2px solid blue'; // mark for test
                     }
                  });
            }
         },

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
            // exсlude "LIVE" tab in channel
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
            // exсlude "LIVE" tab in channel
            if (NOVA.currentPage == 'channel' && NOVA.channelTab == 'streams') return;

            document.body.querySelectorAll('#metadata-line > span:last-of-type')
               .forEach(el => {
                  if (el.innerText?.split(' ').length === 4 // "Streamed 5 days ago"
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
      },
      shorts_disable_min_duration: {
         _tagName: 'input',
         label: 'Min duration in sec',
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
         'label:ua': 'Мінімальна тривалість в секундах',
         type: 'number',
         // title: '60 - default',
         // title: 'Minimum duration in seconds',
         title: '0 - disable',
         placeholder: '60-300',
         step: 1,
         min: 0,
         max: 3600,
         value: 0,
         'data-dependent': { 'shorts_disable': true },
      },
      premieres_disable: {
         _tagName: 'input',
         label: 'Hide Premieres',
         // 'label:zh': '',
         'label:ja': 'プレミア公開を非表示',
         'label:ko': '프리미어 숨기기',
         'label:id': 'Sembunyikan pemutaran perdana',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         'label:pl': 'Ukrywaj premiery',
         'label:ua': 'Приховати прем`єри',
         type: 'checkbox',
         title: 'Premiere Announcements',
      },
      live_disable: {
         _tagName: 'input',
         label: 'Hide Live streams',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         'label:pl': 'Ukryj strumień (na żywo)',
         'label:ua': 'Приховати живі трансляції',
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
         'label:ua': 'Сховати завершені трансляції',
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
         'label:ua': 'Приховати мікс мініатюр',
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
         'title:ua': '[Mix] пропонує передивитися вже побачене',
      },
   }
});
