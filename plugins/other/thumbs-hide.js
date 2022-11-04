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
   'title:tr': 'Küçük resim filtreleme',
   'title:de': 'Filtrowanie miniatur',
   'title:pl': 'Ukryj kilka miniatur',
   run_on_pages: 'home, results, feed, channel, watch',
   section: 'other',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/446507-youtube-sub-feed-filter-2

      const
         thumbsSelectors = [
            'ytd-rich-item-renderer', // home
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed, channel
            'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile
         ]
            .join(',');

      // page update event
      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         if ([
            'yt-append-continuation-items-action', // home, results, feed, channel, watch
            'ytd-update-grid-state-action', // feed, channel
            'yt-service-request', // results, watch
            'ytd-rich-item-index-update-action', // home
         ]
            .includes(evt.detail?.actionName)
         ) {
            switch (NOVA.currentPage) {
               case 'home':
                  thumbRemove.live();
                  thumbRemove.mix()
                  break;

               case 'results':
                  thumbRemove.live();
                  thumbRemove.shorts();
                  break;

               case 'feed':
                  thumbRemove.live();
                  thumbRemove.streamed();
                  thumbRemove.shorts();
                  thumbRemove.premieres();
                  thumbRemove.mix()
                  break;

               case 'channel':
                  thumbRemove.live();
                  thumbRemove.streamed();
                  thumbRemove.shorts();
                  thumbRemove.premieres();
                  break;

               case 'watch':
                  thumbRemove.live();
                  thumbRemove.mix()
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
                        && NOVA.timeFormatTo.hmsToSec(el.textContent.trim()) < (+user_settings.shorts_disable_min_duration || 60)
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

            document.body.querySelectorAll('#metadata-line > span:nth-child(2)')
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
            if (!user_settings.thumb_mix_disable) return;

            document.body.querySelectorAll(
               `a[href*="list="][href*="start_radio="]:not([hidden]),
               a[title^="Mix -"]:not([hidden])`
            )
               .forEach(el => el.closest(thumbsSelectors)?.remove());
            // for test
            // .forEach(el => {
            //    if (thumb = el.closest(thumbsSelectors)) {
            //       // thumb.style.display = 'none';
            //       console.debug('has Mix:', thumb);
            //       thumb.style.border = '2px solid red'; // mark for test
            //    }
            // });
         },
      };

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
         'label:tr': 'Şort Gizle',
         'label:de': 'Shorts verstecken',
         'label:pl': 'Ukryj YouTube Shorts',
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
         'label:tr': 'Saniye cinsinden minimum süre',
         'label:de': 'Mindestdauer in Sekunden',
         'label:pl': 'Poniżej czasu trwania w sekundach',
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
         type: 'checkbox',
         title: 'Premiere Announcements',
      },
      live_disable: {
         _tagName: 'input',
         label: 'Hide Live Streams',
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
         type: 'checkbox',
         title: 'airing',
      },
      streamed_disable: {
         _tagName: 'input',
         label: 'Also streamed',
         'label:zh': '即使在播出之后',
         'label:ja': '放送後も',
         'label:ko': '방송 후에도',
         'label:id': 'Bahkan setelah siaran',
         'label:es': 'Incluso después de la transmisión',
         'label:pt': 'Mesmo depois da transmissão',
         'label:fr': 'Même après la diffusion',
         'label:it': 'Anche dopo la trasmissione',
         'label:tr': 'Yayından sonra bile',
         'label:de': 'Auch nach der Sendung',
         'label:pl': 'Po streamie',
         type: 'checkbox',
         title: 'Finished stream',
         'title:zh': '已经完成的',
         'title:ja': '完了しました',
         'title:ko': '완료한 것',
         'title:id': 'Itu sudah selesai',
         'title:es': 'Que han sido completados',
         'title:pt': 'Que foram concluídos',
         'title:fr': 'Qui ont été complétés',
         'title:it': 'Che sono stati completati',
         'title:tr': 'Tamamlanmış olanlar',
         'title:de': 'Die sind abgeschlossen',
         'title:pl': 'Które zostały zakończone',
         'data-dependent': { 'live_disable': true },
      },
      thumbnails_mix_hide: {
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
         'label:tr': "'Karıştır' küçük resimlerini gizle",
         'label:de': '„Mix“-Thumbnails ausblenden',
         'label:pl': 'Ukryj miniaturki "Mix"',
         type: 'checkbox',
         title: '[Mix] offers to rewatch what has already saw',
         'title:zh': '[混合]提供重新观看已经看过的内容',
         'title:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
         'title:ko': '[Mix]는 이미 본 것을 다시 볼 것을 제안합니다',
         'title:id': '[Mix] menawarkan untuk menonton ulang apa yang telah dilihat',
         'title:es': '[Mix] ofrece volver a ver lo que ya vio',
         'title:pt': '[Mix] se oferece para rever o que já viu',
         'title:it': '[Mix] si offre di rivedere ciò che ha già visto',
         'title:tr': '[Mix], daha önce görmüş olanı yeniden izlemeyi teklif ediyor',
         'title:de': '[Mix] bietet an, bereits Gesehenes noch einmal anzuschauen',
         'title:pl': '[Mix] proponuje ponowne obejrzenie już obejrzanych filmów',
      },
   }
});
