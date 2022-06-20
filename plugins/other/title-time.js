window.nova_plugins.push({
   id: 'page-title-time',
   title: 'Show time in tab title',
   'title:zh': '在标签标题中显示时间',
   'title:ja': 'タブタイトルに時間を表示する',
   'title:ko': '탭 제목에 시간 표시',
   'title:es': 'Mostrar la hora en el título de la pestaña',
   'title:pt': 'Mostrar tempo no título da guia',
   'title:fr': "Afficher l'heure dans le titre de l'onglet",
   'title:tr': 'Sekme başlığında zamanı göster',
   'title:de': 'Zeit im Tab-Titel anzeigen',
   'title:pl': 'Pokaż czas w tytule karty',
   run_on_pages: 'watch',
   section: 'other',
   // desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      // if isLive dont update - video.duration!

      // let backupTitle = document.title; // create bug. on ini, the value must be null
      let backupTitle;

      document.addEventListener('yt-navigate-start', () => backupTitle = null); // remove saved title

      NOVA.waitElement('video')
         .then(video => {
            // update title
            video.addEventListener('timeupdate', updateTitle.bind(video));
            // save title
            video.addEventListener('loadeddata', () => {
               if (backupTitle
                  || movie_player.classList.contains('ad-showing')
                  || /^((\d?\d:){1,2}\d{2})(\s\|\s)/g.exec(document.title)) return;
               backupTitle = document.title;
            });
            // restore the original title
            ['pause', 'ended'].forEach(evt => { // need add event "suspend" ?
               video.addEventListener(evt, () => {
                  if (!backupTitle) return;
                  let newTitleArr;
                  if (movie_player.getVideoData().isLive) newTitleArr = video.currentTime;
                  setTitle([newTitleArr, backupTitle]);
               });
            });
         });

      function updateTitle() {
         if (!backupTitle) return;

         let newTitleArr = [];

         switch (movie_player.getVideoData().isLive ? 'current' : user_settings.page_title_time_mode) {
            case 'current':
               newTitleArr = [this.currentTime];
               break;

            case 'current-duration':
               if (!isNaN(this.duration)) {
                  newTitleArr = [this.currentTime, ' / ', this.duration]; // string
               }
               break;

            // case 'left':
            default:
               if (!isNaN(this.duration)) {
                  newTitleArr = [this.duration - this.currentTime];
               }
         }

         // add playbackRate if it is not default
         // if (this.playbackRate !== 1) newTitleArr.push(` (${this.playbackRate}x)`);

         newTitleArr = newTitleArr
            .map(t => typeof t === 'string' ? t : NOVA.timeFormatTo.HMS.digit(t / this.playbackRate))
            .join('');

         setTitle([newTitleArr, backupTitle]);
      }

      function setTitle(arr) {
         document.title = arr.filter(Boolean)
            .join(' | '); // add to regex
         // .join(' • '); // add to regex
      }

      // function getVideoTitle() {
      //    return movie_player.getVideoData().title || document.body.querySelector('#info h1.title')?.content;
      // }

   },
   options: {
      page_title_time_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         options: [
            // { label: 'current', value: 'current', 'label:zh': '现在', 'label:ja': '現在', 'label:ko': '현재의', 'label:es': 'actual', 'label:pt': 'atual', 'label:fr': 'courant', 'label:tr': 'akım', 'label:de': 'strom' },
            { label: 'left', value: 'left', selected: true, 'label:zh': '剩下', 'label:ja': '左', 'label:ko': '왼쪽', 'label:es': 'izquierda', 'label:pt': 'deixou', 'label:fr': 'à gauche', 'label:tr': 'o ayrıldı', 'label:de': 'links'/*, 'label:pl': ''*/  },
            { label: 'current/duration', value: 'current-duration', 'label:zh': '现在/期间', 'label:ja': '現在/期間', 'label:ko': '현재/기간', 'label:es': 'actual/duración', 'label:pt': 'atual/duração', 'label:fr': 'courant/durée', 'label:tr': 'akım/süre', 'label:de': 'strom/dauer'/*, 'label:pl': ''*/  },
         ],
      },
   }
});
