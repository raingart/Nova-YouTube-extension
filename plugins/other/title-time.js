// for test
// https://www.youtube.com/watch?v=lZYzT3HS9L4 - has strSplit: ' | '

window.nova_plugins.push({
   id: 'page-title-time',
   title: 'Show time in tab title',
   'title:zh': '在标签标题中显示时间',
   'title:ja': 'タブタイトルに時間を表示する',
   // 'title:ko': '탭 제목에 시간 표시',
   // 'title:vi': '',
   // 'title:id': 'Tampilkan waktu di judul tab',
   // 'title:es': 'Mostrar la hora en el título de la pestaña',
   'title:pt': 'Mostrar tempo no título da guia',
   'title:fr': "Afficher l'heure dans le titre de l'onglet",
   // 'title:it': "Mostra l'ora nel titolo della scheda",
   // 'title:tr': 'Sekme başlığında zamanı göster',
   'title:de': 'Zeit im Tab-Titel anzeigen',
   'title:pl': 'Pokaż czas w tytule karty',
   'title:ua': 'Відображення часу в заголовку вкладки',
   run_on_pages: 'watch',
   section: 'other',
   // desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/450646-youtube-better-window-title
      // alt2 - https://greasyfork.org/en/scripts/450734-youtube-com-channel-name-and-upload-date-in-tab-title-no-notification-count
      // alt3 - https://greasyfork.org/en/scripts/485000-youtube-video-duration-in-title/code

      NOVA.waitSelector('video')
         .then(video => {
            // remove saved title
            document.addEventListener('yt-navigate-start', () => pageTitle.backup = null);
            // save title
            video.addEventListener('playing', pageTitle.save.bind(pageTitle));
            // update title
            video.addEventListener('timeupdate', () => pageTitle.update(video));
            // restore title
            video.addEventListener('pause', () => pageTitle.restore(video));
            video.addEventListener('ended', () => pageTitle.restore(video));
         });


      const pageTitle = {
         // backup: document.title,

         strSplit: ' | ',
         // strSplit: ' ● ',
         // strSplit: ' • ',
         // strSplit: ' ► ',
         // strSplit: ' ▷ ',

         saveCheck() { // speed hack
            return (result = (this.backup || document.title).includes(this.strSplit)) // check strSplit has in title
               // deep test. // title has time "0:00:00${this.strSplit}"
               ? new RegExp(`^((\\d?\\d:){1,2}\\d{2})(${this.strSplit.replace('|', '\\|')})`, '')
                  .test(document.title)
               : result; // includes - less accurate but more speed up
         },

         save() {
            if (this.backup
               || movie_player.getVideoData().isLive // live
               || movie_player.classList.contains('ad-showing') // ad-video
               || this.saveCheck()
            ) {
               return;
            }
            // this.backup = document.title;
            this.backup = movie_player.getVideoData().title;
            // console.debug('save', this.backup);
         },

         update(video = NOVA.videoElement) {
            if (!this.backup) return;

            let newTitleArr = [];

            switch (movie_player.getVideoData().isLive ? 'current' : user_settings.page_title_time_mode) {
               case 'current':
                  newTitleArr = [video.currentTime];
                  break;

               case 'current-duration':
                  if (!isNaN(video.duration)) {
                     newTitleArr = [video.currentTime, ' / ', video.duration]; // string
                  }
                  break;

               // case 'left':
               default:
                  if (!isNaN(video.duration)) {
                     newTitleArr = [video.duration - video.currentTime];
                  }
            }

            // add playbackRate if it is not default
            // if (this.playbackRate !== 1) newTitleArr.push(` (${this.playbackRate}x)`);

            newTitleArr = newTitleArr
               .map(t => (typeof t === 'string') ? t : NOVA.formatTimeOut.HMS.digit(t / video.playbackRate))
               .join('');

            this.set([newTitleArr, this.backup]);
         },

         restore(video = NOVA.videoElement) {
            if (!this.backup) return;

            this.set([movie_player.getVideoData().isLive && video.currentTime, this.backup]);
         },

         set(arr) {
            document.title = arr
               .filter(Boolean) // filter null/undefined
               .join(this.strSplit);
         },
      };

   },
   options: {
      page_title_time_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         // 'label:ko': '방법',
         // 'label:vi': '',
         // 'label:id': 'Mode',
         // 'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            // {
            //    label: 'current', value: 'current',
            //    'label:zh': '现在',
            //    'label:ja': '現在',
            //    'label:ko': '현재의',
            //    // 'label:vi': '',
            //    // 'label:id': '',
            //    'label:es': 'actual',
            //    'label:pt': 'atual',
            //    'label:fr': 'courant',
            //    // 'label:it': '',
            //    // ''label:tr': 'akım',
            //    'label:de': 'strom',
            //    'label:pl': 'pozostało',
            //    'label:ua': 'поточний',
            // },
            {
               label: 'left', value: 'left', selected: true,
               'label:zh': '剩下',
               'label:ja': '左',
               // 'label:ko': '왼쪽',
               // 'label:vi': '',
               // 'label:id': 'tetap',
               // 'label:es': 'izquierda',
               'label:pt': 'deixou',
               'label:fr': 'à gauche',
               // 'label:it': 'è rimasta',
               // 'label:tr': 'o ayrıldı',
               'label:de': 'links',
               'label:pl': 'pozostało',
               'label:ua': 'лишилось',
            },
            {
               label: 'current/duration', value: 'current-duration',
               'label:zh': '现在/期间',
               'label:ja': '現在/期間',
               // 'label:ko': '현재/기간',
               // 'label:vi': '',
               // 'label:id': 'saat ini/durasi',
               // 'label:es': 'actual/duración',
               'label:pt': 'atual/duração',
               'label:fr': 'courant/durée',
               // 'label:it': 'corrente/durata',
               // 'label:tr': 'akım/süre',
               'label:de': 'strom/dauer',
               'label:pl': 'bieżący czas',
               'label:ua': 'поточний/тривалість',
            },
         ],
      },
   }
});
