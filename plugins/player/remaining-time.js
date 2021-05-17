_plugins_conteiner.push({
   name: 'Remaining Time',
   id: 'remaining-time',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Show the remaining time inside the player',
   _runtime: user_settings => {

      const SELECTOR_ID = 'ytp-time-remaining';

      YDOM.HTMLElement.wait('video')
         .then(player => {
            player.addEventListener('timeupdate', function () {
               // console.debug('timeupdate', this.currentTime, '/', this.duration);
               const currentPt = () => ((this.currentTime / this.duration) * 100).toFixed(2);
               const leftTime = () => YDOM.secToStr(Math.round(this.duration - this.currentTime));
               let text;

               switch (user_settings.remaining_time_mode) {
                  case 'pt': text = currentPt(); break;
                  case 'time': text = leftTime(); break;
                  // case 'full':
                  default:
                     text = leftTime();
                     text += text && ` (${currentPt()}%)`; // prevent show NaN
               }

               insertToHTML({ 'set_text': text, 'html_container': document.querySelector('.ytp-time-duration') });
            });

         });

      function insertToHTML({ set_text, html_container }) {
         // console.debug('insertToHTML', ...arguments);
         (document.getElementById(SELECTOR_ID) || (function () {
            html_container.insertAdjacentHTML("afterend", ` • <span id="${SELECTOR_ID}">${set_text}</span>`);
            return document.getElementById(SELECTOR_ID);
         })())
            .textContent = set_text;
      }

   },
   opt_export: {
      'remaining_time_mode': {
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
