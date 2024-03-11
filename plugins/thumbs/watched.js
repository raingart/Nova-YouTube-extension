// for test
// https://www.youtube.com/watch?v=oWoWkxzeiok&list=OLAK5uy_kDx6ubTnuS4mYHCPyyX1NpXyCtoQN08M4&index=3

window.nova_plugins.push({
   id: 'thumbs-watched',
   // title: 'Mark watched videos',
   title: 'Mark watched thumbnails',
   'title:zh': '标记您观看的缩略图',
   'title:ja': '視聴したサムネイルにマークを付ける',
   // 'title:ko': '본 썸네일 표시',
   // 'title:vi': '',
   // 'title:id': 'Tandai gambar mini yang ditonton',
   // 'title:es': 'Mark vio miniaturas',
   'title:pt': 'Mark assistiu às miniaturas',
   'title:fr': 'Marquer les vignettes visionnées',
   // 'title:it': 'Contrassegna le miniature visualizzate',
   // 'title:tr': 'İzlenen küçük resimleri işaretle',
   'title:de': 'Angesehene Miniaturansichten markieren',
   'title:pl': 'Oznacz obejrzane miniaturki',
   'title:ua': 'Позначити переглянуті мініатюри',
   run_on_pages: 'home, results, feed, channel, playlist, watch, -mobile',
   // run_on_pages: '*, -embed, -live_chat',
   section: 'thumbs',
   // desc: 'Need to Turn on [YouTube History]',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/30261-mark-watched-youtube-videos

      // Only the outline/border works. Other selection methods do not work in chrome!

      NOVA.css.push(
         `a#thumbnail,
         a[class*="thumbnail"] {
            outline: 1px solid var(--yt-spec-general-background-a);
         }

         /*a.ytp-videowall-still.ytp-suggestion-set:visited, <-- Doesn't work*/
         a#thumbnail:visited,
         a[class*="thumbnail"]:visited {
            outline: 1px solid ${user_settings.thumbs_watched_frame_color || 'red'} !important;
         }

         /*for playlist*/
         ytd-playlist-panel-video-renderer a:visited #meta * {
            color: ${user_settings.thumbs_watched_title_color || '#ff4500'} !important;
         }`);

      if (user_settings.thumbs_watched_title) {
         NOVA.css.push(
            `a#video-title:visited:not(:hover),
            #description a:visited {
               color: ${user_settings.thumbs_watched_title_color} !important;
            }`);
      }

      // add blur
      // NOVA.css.push(
      //    `a.ytp-videowall-still.ytp-suggestion-set:visited, #thumbnail:visited {
      //       transition: all 200ms ease-in-out;
      //       opacity: .4 !important;
      //       mix-blend-mode: luminosity;
      //       filter: blur(2.2px);
      //    }

      //    .watched #thumbnail:hover, #thumbnail:visited:hover {
      //       transition: ease-out;
      //       opacity: 1 !important;
      //       mix-blend-mode: normal;
      //       filter: blur(0px);
      //    }`);

   },
   options: {
      thumbs_watched_frame_color: {
         _tagName: 'input',
         label: 'Frame color',
         'label:zh': '框架颜色',
         'label:ja': 'フレームカラー',
         // 'label:ko': '프레임 색상',
         // 'label:vi': '',
         // 'label:id': 'Warna bingkai',
         // 'label:es': 'Color del marco',
         'label:pt': 'Cor da moldura',
         'label:fr': 'Couleur du cadre',
         // 'label:it': 'Colore del telaio',
         // 'label:tr': 'Çerçeve rengi',
         'label:de': 'Rahmenfarbe',
         'label:pl': 'Kolor ramki',
         'label:ua': 'Колір рамки',
         type: 'color',
         value: '#FF0000',
      },
      thumbs_watched_title: {
         _tagName: 'input',
         label: 'Set title color',
         'label:zh': '您要更改标题颜色吗？',
         'label:ja': 'タイトルの色を変更しますか？',
         // 'label:ko': '제목 색상 설정',
         // 'label:vi': '',
         // 'label:id': 'Setel warna judul',
         // 'label:es': 'Establecer el color del título',
         'label:pt': 'Definir a cor do título',
         'label:fr': 'Définir la couleur du titre',
         // 'label:it': 'Imposta il colore del titolo',
         // 'label:tr': 'Başlık rengini ayarla',
         'label:de': 'Titelfarbe festlegen',
         'label:pl': 'Ustaw kolor tytułu',
         'label:ua': 'Встановити колір заголовку',
         type: 'checkbox',
         // title: '',
      },
      thumbs_watched_title_color: {
         _tagName: 'input',
         label: 'Choose title color',
         'label:zh': '选择标题颜色',
         'label:ja': 'タイトルの色を選択',
         // 'label:ko': '제목 색상 선택',
         // 'label:vi': '',
         // 'label:id': 'Pilih warna judul',
         // 'label:es': 'Elija el color del título',
         'label:pt': 'Escolha a cor do título',
         'label:fr': 'Choisissez la couleur du titre',
         // 'label:it': 'Scegli il colore del titolo',
         // 'label:tr': 'Başlık rengini seçin',
         'label:de': 'Titelfarbe auswählen',
         'label:pl': 'Wybierz kolor tytułu',
         'label:ua': 'Обрати колір заголовку',
         type: 'color',
         // title: '',
         value: '#ff4500',
         'data-dependent': { 'thumbs_watched_title': true },
      },
   }
});
