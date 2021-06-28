_plugins_conteiner.push({
   id: 'page-title-time',
   title: 'Show time in page title',
   run_on_pages: 'watch',
   section: 'other',
   desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      YDOM.waitElement('video')
         .then(video => {
            video.addEventListener('timeupdate', function () {
               // console.debug('timeupdate', this.currentTime, '/', this.duration);
               if (isNaN(this.duration)) return;
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
                     new_title = [this.duration - this.currentTime];
               }
               // add playbackRate if it is not default
               if (this.playbackRate !== 1) {
                  new_title.push(` (${this.playbackRate}x)`);
               }

               document.title = new_title
                  .map(t => typeof t === 'string' ? t : YDOM.secToStr(Math.round(t)))
                  .join('');
            });
         });

   },
   options: {
      page_title_time_mode: {
         _tagName: 'select',
         label: 'Mode',
         options: [
            { label: 'current', value: 'current' },
            { label: 'left', value: 'left', selected: true },
            { label: 'current/duration', value: 'current-duration' },
         ],
      },
   },
});
