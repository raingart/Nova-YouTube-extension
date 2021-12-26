window.nova_plugins.push({
   id: 'time-remaining',
   title: 'Remaining time',
   'title:zh': '剩余时间',
   'title:ja': '余日',
   'title:es': 'Tiempo restante',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Remaining time until the end of the video',
   'desc:zh': '距离视频结束的剩余时间',
   'desc:ja': 'ビデオの終わりまでの残り時間',
   'desc:es': 'Tiempo restante hasta el final del video',
   _runtime: user_settings => {

      const SELECTOR_ID = 'ytp-time-remaining';

      NOVA.waitElement('.ytp-time-duration')
         .then(container => {

            NOVA.waitElement('video')
               .then(video => {
                  video.addEventListener('timeupdate', setRemaining.bind(video));
                  video.addEventListener('ratechange', setRemaining.bind(video));
                  ['suspend', 'ended'].forEach(evt => {
                     video.addEventListener(evt, () => insertToHTML({ 'container': container }));
                  });
               });

            function setRemaining() {
               if (isNaN(this.duration) || document.querySelector('.ytp-autohide video') || player.getVideoData().isLive) return;

               const getProgressPt = () => {
                  const floatRound = pt => this.duration > 3600 ? pt.toFixed(2) // >1 hour
                     : this.duration > 1500 ? pt.toFixed(1) // >25 Minute
                        : Math.round(pt); // whats left
                  return floatRound((this.currentTime / this.duration) * 100) + '%';
               }
               const getLeftTime = () => '-' + NOVA.timeFormatTo.HMS_digit((this.duration - this.currentTime) / this.playbackRate);
               let text;

               switch (user_settings.time_remaining_mode) {
                  case 'pt': text = ' • ' + getProgressPt(); break;
                  case 'time': text = getLeftTime(); break;
                  // case 'full':
                  default:
                     text = getLeftTime();
                     text += text && ` (${getProgressPt()})`; // prevent show NaN
               }

               if (text) {
                  insertToHTML({
                     'text': text,
                     'container': container,
                  });
               }
            }

            function insertToHTML({ text = '', container = required() }) {
               // console.debug('insertToHTML', ...arguments);
               if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);
               (document.getElementById(SELECTOR_ID) || (function () {
                  // const el = document.createElement('span');
                  // el.id = SELECTOR_ID;
                  // container.after(el);
                  container.insertAdjacentHTML('afterend', ` <span id="${SELECTOR_ID}">${text}</span>`);
                  return document.getElementById(SELECTOR_ID);
               })())
                  .textContent = text;
            }

         });

   },
   options: {
      time_remaining_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '如何',
         'label:ja': '仕方',
         'label:es': 'Modo',
         options: [
            { label: 'time+(%)', value: 'full', selected: true },
            { label: 'time', value: 'time' },
            { label: '%', value: 'pt' },
         ],
      },
   },
});
