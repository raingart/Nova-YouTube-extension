// for test:
// https://www.youtube.com/channel/UCl7OsED7y9eavZJbTGnK0xg/playlists - select Albums & Singles
// https://www.youtube.com/c/cafemusicbgmchannel/videos - live

window.nova_plugins.push({
   id: 'thumbnails-clear',
   title: 'Clear thumbnails',
   'title:zh': '清除缩略图',
   'title:ja': 'サムネイルをクリアする',
   'title:ko': '썸네일 지우기',
   'title:es': 'Miniaturas claras',
   'title:pt': 'Limpar miniaturas',
   'title:fr': 'Effacer les vignettes',
   'title:tr': 'Küçük resimleri temizle',
   'title:de': 'Miniaturansichten löschen',
   'title:pl': 'Wyczyść miniatury',
   run_on_pages: 'home, results, feed, channel, watch',
   // run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined thumbnail',
   'desc:zh': '替换预定义的缩略图',
   'desc:ja': '事前定義されたサムネイルを置き換えます',
   'desc:ko': '미리 정의된 축소판을 대체합니다',
   'desc:es': 'Reemplaza la miniatura predefinida',
   'desc:pt': 'Substitui a miniatura predefinida',
   // 'desc:fr': 'Remplace la vignette prédéfinie',
   'desc:tr': 'Önceden tanımlanmış küçük resmi değiştirir',
   'desc:de': 'Ersetzt das vordefinierte Thumbnail',
   'desc:pl': 'Zastępuje predefiniowaną miniaturkę',
   _runtime: user_settings => {

      const ATTR_MARK = 'nova-thumb-preview-cleared';

      // dirty fix bug with not updating thumbnails
      document.addEventListener('yt-navigate-finish', () =>
         document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK)));

      NOVA.watchElements({
         // selectors: 'a#thumbnail:not([hidden]):not(.ytd-playlist-thumbnail) #img[src]',
         selectors: 'a[class*="thumbnail"]:not([hidden]):not(.ytd-playlist-thumbnail) img[src]', // fix broken playlist
         attr_mark: ATTR_MARK,
         callback: img => {
            // skip "premiere", "live now"
            if (parent = img.closest('ytd-video-renderer, ytd-grid-video-renderer')) {
               if (!parent.querySelector('#overlays [overlay-style="DEFAULT"], #overlays [overlay-style="SHORTS"]')
                  || img.src.includes('hqdefault_live.jpg') || parent.querySelector('#video-badges [class*="live-now"], ytd-thumbnail-overlay-time-status-renderer [overlay-style="UPCOMING"], [aria-label="PREMIERE"]')
               ) {
                  // console.debug('skiped thumbnails-preview-cleared', parent);
                  return;
               }
            }
            // hq1,hq2,hq3,hq720,default,sddefault,mqdefault,hqdefault,maxresdefault(excluding for thumbs)
            // /(hq(1|2|3|720)|(sd|mq|hq|maxres)?default)/i - unnecessarily exact
            if ((re = /(\w{1}qdefault|hq\d+).jpg/i) && re.test(img.src)) {
               img.src = img.src.replace(re, (user_settings.thumbnails_clear_preview_timestamp || 'hq2') + '.jpg');
            }
         },
      });

      if (user_settings.thumbnails_clear_overlay) {
         NOVA.css.push(
            `#hover-overlays {
               visibility: hidden !important;
            }`);
      }

   },
   options: {
      thumbnails_clear_preview_timestamp: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         'label:zh': '缩略图时间戳',
         'label:ja': 'サムネイルのタイムスタンプ',
         'label:ko': '썸네일 타임스탬프',
         'label:es': 'Marcas de tiempo en miniatura',
         'label:pt': 'Carimbos de data e hora em miniatura',
         'label:fr': 'Horodatages des vignettes',
         'label:tr': 'Küçük resim zaman damgaları',
         'label:de': 'Thumbnail-Zeitstempel',
         'label:pl': 'Znaczniki czasowe miniatur',
         title: 'Show thumbnail from video time position',
         'title:zh': '从视频时间位置显示缩略图',
         'title:ja': 'ビデオの時間位置からサムネイルを表示',
         // 'title:es': 'Mostrar miniatura de la posición de tiempo del video',
         'title:pt': 'Mostrar miniatura da posição no tempo do vídeo',
         'title:tr': 'Video zaman konumundan küçük resmi göster',
         'title:de': 'Miniaturansicht von der Videozeitposition anzeigen',
         'title:pl': 'Pokaż miniaturkę z pozycji czasu wideo',
         options: [
            { label: 'start', value: 'hq1', 'label:zh': '开始', 'label:ja': '始まり', 'label:ko': '시작', 'label:es': 'comienzo', 'label:pt': 'começar', 'label:fr': 'le début', 'label:tr': 'başlat', 'label:de': 'anfang', 'label:pl': 'początek' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true, 'label:zh': '中间', 'label:ja': '真ん中', 'label:ko': '~ 아니다', 'label:es': 'medio', 'label:pt': 'meio', 'label:fr': 'ne pas', 'label:tr': 'orta', 'label:de': 'mitte', 'label:pl': 'środek' },
            { label: 'end', value: 'hq3', 'label:zh': '结尾', 'label:ja': '終わり', 'label:ko': '끝', 'label:es': 'fin', 'label:pt': 'fim', 'label:fr': 'finir', 'label:tr': 'son', 'label:de': 'ende', 'label:pl': 'koniec' }
         ],
      },
      thumbnails_clear_overlay: {
         _tagName: 'input',
         label: 'Hide overlay buttons on a thumbnail',
         'label:zh': '隐藏覆盖在缩略图上的按钮',
         'label:ja': 'サムネイルにオーバーレイされたボタンを非表示にする',
         'label:ko': '축소판에서 오버레이 버튼 숨기기',
         'label:es': 'Ocultar botones superpuestos en una miniatura',
         'label:pt': 'Ocultar botões de sobreposição em uma miniatura',
         'label:fr': 'Masquer les boutons de superposition sur une vignette',
         'label:tr': 'Küçük resimdeki bindirme düğmelerini gizle',
         'label:de': 'Überlagerungsschaltflächen auf einer Miniaturansicht ausblenden',
         'label:pl': 'Ukryj przyciski nakładki na miniaturce',
         type: 'checkbox',
         title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
      },
   }
});
