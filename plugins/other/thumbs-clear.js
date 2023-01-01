// for test:
// https://www.youtube.com/channel/UCl7OsED7y9eavZJbTGnK0xg/playlists - select Albums & Singles
// https://www.youtube.com/c/cafemusicbgmchannel/videos - live

window.nova_plugins.push({
   id: 'thumbnails-clear',
   title: 'Clear thumbnails',
   'title:zh': '清除缩略图',
   'title:ja': 'サムネイルをクリアする',
   'title:ko': '썸네일 지우기',
   'title:id': 'Hapus gambar mini',
   'title:es': 'Miniaturas claras',
   'title:pt': 'Limpar miniaturas',
   'title:fr': 'Effacer les vignettes',
   'title:it': 'Cancella miniature',
   // 'title:tr': 'Küçük resimleri temizle',
   'title:de': 'Miniaturansichten löschen',
   'title:pl': 'Wyczyść miniatury',
   'title:ua': 'Очистити мініатюри',
   run_on_pages: 'home, feed, channel, watch',
   // run_on_pages: 'home, results, feed, channel, watch',
   // run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined clickbait thumbnails',
   'desc:zh': '替换预定义的缩略图',
   'desc:ja': '事前定義されたサムネイルを置き換えます',
   'desc:ko': '미리 정의된 축소판을 대체합니다',
   'desc:id': 'Menggantikan gambar mini yang telah ditentukan sebelumnya',
   'desc:es': 'Reemplaza la miniatura predefinida',
   'desc:pt': 'Substitui a miniatura predefinida',
   // 'desc:fr': 'Remplace la vignette prédéfinie',
   'desc:it': 'Sostituisce la miniatura predefinita',
   // 'desc:tr': 'Önceden tanımlanmış küçük resmi değiştirir',
   'desc:de': 'Ersetzt das vordefinierte Thumbnail',
   'desc:pl': 'Zastępuje predefiniowaną miniaturkę',
   'desc:ua': 'Замінює попередньо визначені мініатюри клікбейти',
   _runtime: user_settings => {

      const
         ATTR_MARK = 'nova-thumb-preview-cleared',
         thumbsSelectors = [
            // 'ytd-rich-item-renderer', // home, channel
            'ytd-video-renderer', // results
            'ytd-grid-video-renderer', // feed
            // 'ytd-compact-video-renderer', // sidepanel in watch
            'ytm-compact-video-renderer', // mobile /results page (ytm-rich-item-renderer)
            'ytm-item-section-renderer' // mobile /subscriptions page
         ];

      // Doesn't work
      // page update
      // document.addEventListener('yt-action', evt => {
      //    console.log(evt.detail?.actionName);
      //    if ([
      //       'yt-append-continuation-items-action', // home, results, feed, channel, watch
      //       'ytd-update-grid-state-action', // feed, channel
      //       'yt-service-request', // results, watch
      //       // 'ytd-rich-item-index-update-action', // home
      //    ]
      //       .includes(evt.detail?.actionName)
      //    ) {
      //       patchThumb();
      //    }
      // });

      // function patchThumb() {
      //    document.body.querySelectorAll(`#thumbnail:not(.ytd-playlist-thumbnail) img[src]:not([src*="_live.jpg"]):not([${ATTR_MARK}])`)
      //       .forEach(img => {
      //          img.setAttribute(ATTR_MARK, true);
      //          img.src = patchImg(img.src);
      //       });
      // }

      let DISABLE_YT_IMG_DELAY_LOADING_default = false; // fix conflict with yt-flags

      // Strategy 2
      // dirty fix bug with not updating thumbnails
      // document.addEventListener('yt-navigate-finish', () =>
      //    document.body.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK)));

      NOVA.watchElements({
         selectors: [
            '#thumbnail:not(.ytd-playlist-thumbnail):not([class*=markers]):not([href*="/shorts/"]) img[src]:not([src*="_live.jpg"])',
            'a:not([href*="/shorts/"]) img.video-thumbnail-img[src]:not([src*="_live.jpg"])'
         ],
         attr_mark: ATTR_MARK,
         callback: async img => {
            if (NOVA.currentPage == 'results') return;

            // fix conflict with yt-flags
            if (window.yt?.config_?.DISABLE_YT_IMG_DELAY_LOADING
               && DISABLE_YT_IMG_DELAY_LOADING_default !== window.yt?.config_?.DISABLE_YT_IMG_DELAY_LOADING
            ) {
               // alert('Plugin "Clear thumbnails" not available with current page config');
               DISABLE_YT_IMG_DELAY_LOADING_default = window.yt?.config_?.DISABLE_YT_IMG_DELAY_LOADING;

               await NOVA.sleep(100); // dirty fix.
               // Hard reset fn
               document.body.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK));
            }

            // skip "premiere", "live now"
            if ((thumb = img.closest(thumbsSelectors))
               && thumb.querySelector(
                  `#badges [class*="live-now"],
                  #overlays [aria-label="PREMIERE"],
                  ytd-thumbnail-overlay-time-status-renderer [overlay-style="UPCOMING"]`)
            ) {
               // console.debug('skiped thumbnails-preview-cleared', parent);
               return;
            }

            if (src = patchImg(img.src)) img.src = patchImg(src);
         },
      });

      if (user_settings.thumbnails_clear_overlay) {
         NOVA.css.push(
            `#hover-overlays {
               visibility: hidden !important;
            }`);
      }

      if (user_settings.thumbnails_overlay_playing) {
         // alt - https://greasyfork.org/en/scripts/454694-disable-youtube-inline-playback-on-all-pages/code

         // Strategy 1
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
               document.body.querySelectorAll('#mouseover-overlay')
                  .forEach(el => el.remove());
            }
         });
         // Strategy 2
         // NOVA.watchElements({
         //    selectors: ['#mouseover-overlay'],
         //    // attr_mark: 'disable-thumb-inline-playback',
         //    callback: el => {
         //       el.remove();
         //       // console.debug('thumb-inline-playback:', el);
         //       // el.style.border = '2px solid green'; // mark for test
         //    }
         // });
      }

      // patch end card
      // if (user_settings.thumbnails_clear_videowall && !user_settings['disable-video-cards']) {
      //    // force show title
      //    NOVA.css.push(
      //       `.ytp-videowall-still .ytp-videowall-still-info-content {
      //          opacity: 1 !important;
      //          text-shadow: rgb(0, 0, 0) 0 0 .1em;
      //       }
      //       .ytp-videowall-still:not(:hover) .ytp-videowall-still-info-author,
      //       .ytp-videowall-still:not(:hover) .ytp-videowall-still-info-live {
      //          opacity: 0 !important;
      //       }`);

      //    NOVA.waitElement('#movie_player')
      //       .then(movie_player => {
      //          movie_player.addEventListener('onStateChange', state => {
      //             // console.debug('playerState', NOVA.getPlayerState(state));
      //             if (NOVA.getPlayerState(state) == 'ENDED') {
      //                document.body.querySelectorAll('.ytp-videowall-still-image[style*="qdefault.jpg"]')
      //                   .forEach(img => {
      //                      img.style.backgroundImage = patchImg(img.style.backgroundImage);
      //                   });
      //             }
      //          });
      //       });
      //    // Does manual change work at the end of video time
      //    // NOVA.waitElement('video')
      //    //    .then(video => {
      //    //       video.addEventListener('ended', () => {
      //    //          document.body.querySelectorAll('.ytp-videowall-still-image[style*="qdefault.jpg"]')
      //    //             .forEach(img => {
      //    //                img.style.backgroundImage = patchImg(img.style.backgroundImage);
      //    //             });
      //    //       });
      //    //    });
      // }

      function patchImg(str) {
         // hq1,hq2,hq3,hq720,default,sddefault,mqdefault,hqdefault,maxresdefault(excluding for thumbs)
         // /(hq(1|2|3|720)|(sd|mq|hq|maxres)?default)/i - unnecessarily exact
         // if ((re = /(\w{1}qdefault|hq\d+).jpg/i) && re.test(str)) { // for pc
         //    return str.replace(re, (user_settings.thumbnails_clear_preview_timestamp || 'hq2') + '.jpg');
         // }
         // https://i.ytimg.com/vi/ir6nk2zrMG0/sddefault.jpg
         if ((re = /(\w{2}default|hq\d+)./i) && re.test(str)) { // for mobile and pc
            return str.replace(re, (user_settings.thumbnails_clear_preview_timestamp || 'hq2') + '.');
         }
      }

   },
   options: {
      thumbnails_clear_preview_timestamp: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         'label:zh': '缩略图时间戳',
         'label:ja': 'サムネイルのタイムスタンプ',
         'label:ko': '썸네일 타임스탬프',
         'label:id': 'Stempel waktu gambar mini',
         'label:es': 'Marcas de tiempo en miniatura',
         'label:pt': 'Carimbos de data e hora em miniatura',
         'label:fr': 'Horodatages des vignettes',
         'label:it': 'Timestamp in miniatura',
         // 'label:tr': 'Küçük resim zaman damgaları',
         'label:de': 'Thumbnail-Zeitstempel',
         'label:pl': 'Znaczniki czasowe miniatur',
         'label:ua': 'Мітки часу мініатюр',
         title: 'Show thumbnail from video time position',
         'title:zh': '从视频时间位置显示缩略图',
         'title:ja': 'ビデオの時間位置からサムネイルを表示',
         'title:ko': '비디오 시간 위치에서 썸네일 표시',
         'title:id': 'Tampilkan thumbnail dari posisi waktu video',
         'title:es': 'Mostrar miniatura de la posición de tiempo del video',
         'title:pt': 'Mostrar miniatura da posição no tempo do vídeo',
         'title:fr': 'Afficher la vignette à partir de la position temporelle de la vidéo',
         'title:it': "Mostra la miniatura dalla posizione dell'ora del video",
         // 'title:tr': 'Video zaman konumundan küçük resmi göster',
         'title:de': 'Miniaturansicht von der Videozeitposition anzeigen',
         'title:pl': 'Pokaż miniaturkę z pozycji czasu wideo',
         'title:ua': 'Показати мініатюру з часової позиції відео',
         options: [
            {
               label: 'start', value: 'hq1',
               'label:zh': '开始',
               'label:ja': '始まり',
               'label:ko': '시작',
               'label:id': 'awal',
               'label:es': 'comienzo',
               'label:pt': 'começar',
               'label:fr': 'le début',
               'label:it': 'inizio',
               // 'label:tr': 'başlat',
               'label:de': 'anfang',
               'label:pl': 'początek',
               'label:ua': 'початок',
            }, // often shows intro
            {
               label: 'middle', value: 'hq2', selected: true,
               'label:zh': '中间',
               'label:ja': '真ん中',
               'label:ko': '~ 아니다',
               'label:id': 'tengah',
               'label:es': 'medio',
               'label:pt': 'meio',
               'label:fr': 'ne pas',
               'label:it': 'mezzo',
               // 'label:tr': 'orta',
               'label:de': 'mitte',
               'label:pl': 'środek',
               'label:ua': 'середина',
            },
            {
               label: 'end', value: 'hq3',
               'label:zh': '结尾',
               'label:ja': '終わり',
               'label:ko': '끝',
               'label:id': 'akhir',
               'label:es': 'fin',
               'label:pt': 'fim',
               'label:fr': 'finir',
               'label:it': 'fine',
               // 'label:tr': 'son',
               'label:de': 'ende',
               'label:pl': 'koniec',
               'label:ua': 'кінець',
            }
         ],
      },
      thumbnails_clear_overlay: {
         _tagName: 'input',
         label: 'Hide overlay buttons on a thumbnail',
         'label:zh': '隐藏覆盖在缩略图上的按钮',
         'label:ja': 'サムネイルにオーバーレイされたボタンを非表示にする',
         'label:ko': '축소판에서 오버레이 버튼 숨기기',
         'label:id': 'Sembunyikan tombol overlay pada thumbnail',
         'label:es': 'Ocultar botones superpuestos en una miniatura',
         'label:pt': 'Ocultar botões de sobreposição em uma miniatura',
         'label:fr': 'Masquer les boutons de superposition sur une vignette',
         'label:it': 'Nascondi pulsanti sovrapposti su una miniatura',
         // 'label:tr': 'Küçük resimdeki bindirme düğmelerini gizle',
         'label:de': 'Überlagerungsschaltflächen auf einer Miniaturansicht ausblenden',
         'label:pl': 'Ukryj przyciski nakładki na miniaturce',
         'label:ua': 'Приховати кнопки на мініатюрі',
         type: 'checkbox',
         title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
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
      thumbnails_overlay_playing: {
         _tagName: 'input',
         label: 'Disable thumbnail preview on hover',
         'label:zh': '悬停时禁用缩略图预览',
         'label:ja': 'ホバー時のサムネイル プレビューを無効にする',
         'label:ko': '호버에서 썸네일 미리보기 비활성화',
         'label:id': 'Nonaktifkan pratinjau thumbnail saat melayang',
         'label:es': 'Deshabilitar la vista previa en miniatura al pasar el mouse',
         'label:pt': 'Desativar a visualização de miniaturas ao passar o mouse',
         'label:fr': "Désactiver l'aperçu des vignettes au survol",
         'label:it': "Disabilita l'anteprima in miniatura al passaggio del mouse",
         // 'label:tr': 'Fareyle üzerine gelindiğinde küçük resim önizlemesini devre dışı bırak',
         'label:de': 'Deaktivieren Sie die Thumbnail-Vorschau beim Hover',
         'label:pl': 'Wyłącz podgląd miniatur po najechaniu myszką',
         'label:ua': 'Вимкнути попередній перегляд ескізів при наведенні',
         type: 'checkbox',
      },
      // thumbnails_clear_videowall: {
      //    _tagName: 'input',
      //    label: 'Apply for thumbnails after video ends',
      //    'label:zh': '视频结束后申请缩略图',
      //    'label:ja': '動画終了後にサムネイルを申請する',
      //    'label:ko': '영상 종료 후 썸네일 신청',
      //    'label:id': 'Terapkan untuk thumbnail setelah video berakhir',
      //    'label:es': 'Solicitar miniaturas después de que termine el video',
      //    'label:pt': 'Candidate-se a miniaturas após o término do vídeo',
      //    'label:fr': 'Demander des vignettes après la fin de la vidéo',
      //    'label:it': 'Richiedi le miniature al termine del video',
      //    'label:tr': 'Video bittikten sonra küçük resimler için başvurun',
      //    'label:de': 'Bewerben Sie sich nach dem Ende des Videos für Thumbnails',
      //    'label:pl': 'Złóż wniosek o miniatury po zakończeniu filmu',
      //    'label:ua': 'Активувати для мініатюр після перегляду відео',
      //    type: 'checkbox',
      // },
   }
});
