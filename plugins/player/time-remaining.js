_plugins_conteiner.push({
   id: 'time-remaining',
   title: 'Remaining Time',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Remaining time until the end of the video',
   _runtime: user_settings => {

      const SELECTOR_ID = 'ytp-time-remaining';

      YDOM.waitElement('video')
         .then(video => {
            video.addEventListener('timeupdate', setRemaining.bind(video));
         });

      function setRemaining() {
         if (isNaN(this.duration)) return;
         // console.debug('timeupdate', this.currentTime, '/', this.duration);
         if (document.querySelector('.ytp-autohide video')) return; // optimization try
         const currentPt = () => Math.round((this.currentTime / this.duration) * 100);
         const leftTime = () => '-' + YDOM.secFormatTime(Math.round(this.duration - this.currentTime));
         let text;

         switch (user_settings.time_remaining_mode) {
            case 'pt': text = ` • ${currentPt()}%`; break;
            case 'time': text = leftTime(); break;
            // case 'full':
            default:
               text = leftTime();
               text += text && ` (${currentPt()}%)`; // prevent show NaN
         }

         if (text) {
            insertToHTML({
               'text': text,
               'container': document.querySelector('.ytp-time-duration')
            });
         }

         function insertToHTML({ text = '', container = required() }) {
            // console.debug('insertToHTML', ...arguments);
            if (!(container instanceof HTMLElement)) {
               return console.error('container not HTMLElement:', container);
            }
            (document.getElementById(SELECTOR_ID) || (function () {
               // const el = document.createElement('span');
               // el.id = SELECTOR_ID;
               // container.after(el);
               container.insertAdjacentHTML('afterend', ` <span id="${SELECTOR_ID}">${text}</span>`);
               return document.getElementById(SELECTOR_ID);
            })())
               .textContent = text;
         }

      }

   },
   options: {
      time_remaining_mode: {
         _tagName: 'select',
         label: 'Mode',
         options: [
            { label: 'time+(%)', value: 'full', selected: true },
            { label: 'time', value: 'time' },
            { label: '%', value: 'pt' },
         ],
      },
   },
});
