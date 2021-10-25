window.nova_plugins.push({
   id: 'page-title-time',
   title: 'Show time in tab title',
   'title:zh': '在标签标题中显示时间',
   'title:ja': 'タブタイトルに時間を表示する',
   run_on_pages: 'watch',
   section: 'other',
   // desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      let originalTitleTemplate = document.title;

      document.addEventListener('yt-navigate-start', () => originalTitleTemplate = document.title);

      NOVA.waitElement('video')
         .then(video => {
            video.addEventListener('timeupdate', updateTitle.bind(video));
            // restore the original title
            ['pause', 'ended'].forEach(evt => {
               video.addEventListener(evt, () => document.title = originalTitleTemplate?.replace('%s', getVideoTitle()));
            });
         });

      function updateTitle() {
         // console.debug('timeupdate', this.currentTime, '/', this.duration);
         // backup the original title template
         if (!originalTitleTemplate) originalTitleTemplate = document.title.replace(getVideoTitle(), '%s');

         let new_title = [];

         switch (user_settings.page_title_time_mode) {
            case 'current':
               new_title = [this.currentTime];
               break;

            case 'current-duration':
               new_title = [this.currentTime, ' / ', this.duration];
               break;

            // case 'left':
            default:
               if (!isNaN(this.duration)) {
                  new_title = [this.duration - this.currentTime];
               }
         }
         // add playbackRate if it is not default
         // if (this.playbackRate !== 1) new_title.push(` (${this.playbackRate}x)`);

         new_title = new_title
            .map(t => typeof t === 'string' ? t : NOVA.timeFormatTo.HMS_digit(t / this.playbackRate))
            .join('');

         document.title = new_title + ' | ' + getVideoTitle();
         // document.title = new_title + ' • ' + getVideoTitle();
      }

      function getVideoTitle() {
         return document.querySelector('meta[name="title"][content]')?.content
            || document.getElementById('movie_player')?.getVideoData().title;
      }

   },
   options: {
      page_title_time_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         options: [
            { label: 'current', value: 'current', 'label:zh': '现在', 'label:ja': '現在' },
            { label: 'left', value: 'left', selected: true, 'label:zh': '剩下', 'label:ja': '左' },
            { label: 'current/duration', value: 'current-duration', 'label:zh': '现在/期间', 'label:ja': '現在/期間' },
         ],
      },
   },
});
