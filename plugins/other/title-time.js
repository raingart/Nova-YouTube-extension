_plugins_conteiner.push({
   id: 'page-title-time',
   title: 'Show time in tab title',
   run_on_pages: 'watch',
   section: 'other',
   // desc: 'Show the current time of the video on the title',
   _runtime: user_settings => {

      let originalTitleTemplate;

      YDOM.waitElement('video')
         .then(video => {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
            video.addEventListener('timeupdate', updateTitle.bind(video));
            // restore the original title
            ["pause", "ended"].forEach(evt => {
               video.addEventListener(evt, () => document.title = originalTitleTemplate.replace('%s', getVideoTitle()));
            });
         });

      function updateTitle() {
         if (isNaN(this.duration)) return;
         // console.debug('timeupdate', this.currentTime, '/', this.duration);

         // save the original title template
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
               new_title = [this.duration - this.currentTime];
         }
         // add playbackRate if it is not default
         if (this.playbackRate !== 1) {
            new_title.push(` (${this.playbackRate}x)`);
         }
         // number => round => string
         new_title = new_title
            .map(t => typeof t === 'string' ? t : YDOM.secFormatTime(Math.round(t)))
            .join('');

         document.title = new_title + ' | ' + getVideoTitle();
      }

      function getVideoTitle() {
         return document.querySelector('meta[name="title"][content]')?.content || document.querySelector('h1')?.textContent;
      }

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
