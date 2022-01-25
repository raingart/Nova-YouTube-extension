window.nova_plugins.push({
   id: 'page-title-time',
   title: 'Show time in tab title',
   'title:zh': '在标签标题中显示时间',
   'title:ja': 'タブタイトルに時間を表示する',
   'title:es': 'Mostrar la hora en el título de la pestaña',
   'title:pt': 'Mostrar tempo no título da guia',
   'title:de': 'Zeit im Tab-Titel anzeigen',
   run_on_pages: 'watch',
   section: 'other',
   // desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      let backupTitle = document.title;

      document.addEventListener('yt-navigate-start', () => backupTitle = null); // remove saved title

      NOVA.waitElement('video')
         .then(video => {
            // update title
            video.addEventListener('timeupdate', updateTitle.bind(video));
            // save title
            video.addEventListener('loadeddata', () => {
               if (movie_player.getVideoData().isLive || backupTitle) return;
               backupTitle = document.title;
            });
            // restore the original title
            ['pause', 'ended'].forEach(evt => { // need add event "suspend" ?
               video.addEventListener(evt, () => {
                  if (movie_player.getVideoData().isLive || !backupTitle) return;
                  document.title = backupTitle;
               });
            });
         });

      function updateTitle() {
         if (movie_player.getVideoData().isLive || !backupTitle) return;

         let newTitleArr = [];

         switch (user_settings.page_title_time_mode) {
            // case 'current':
            //    newTitleArr = [this.currentTime];
            //    break;

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

         document.title = [newTitleArr, backupTitle]
            .filter(n => n)
            .join(' | ');
         // .join(' • ');
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
         'label:es': 'Modo',
         'label:pt': 'Modo',
         'label:de': 'Modus',
         options: [
            // { label: 'current', value: 'current', 'label:zh': '现在', 'label:ja': '現在', 'label:es': 'actual', 'label:pt': 'atual', 'label:de': 'strom' },
            { label: 'left', value: 'left', selected: true, 'label:zh': '剩下', 'label:ja': '左', 'label:es': 'izquierda', 'label:pt': 'deixou', 'label:de': 'links' },
            { label: 'current/duration', value: 'current-duration', 'label:zh': '现在/期间', 'label:ja': '現在/期間', 'label:es': 'actual/duración', 'label:pt': 'atual/duração', 'label:de': 'strom/dauer' },
         ],
      },
   }
});
