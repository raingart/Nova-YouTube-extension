// for test
// https://radio.nv.ua/online-radio-nv - live embed

window.nova_plugins.push({
   id: 'time-remaining',
   title: 'Remaining time',
   'title:zh': '剩余时间',
   'title:ja': '余日',
   // 'title:ko': '남은 시간',
   // 'title:vi': '',
   // 'title:id': 'Waktu yang tersisa',
   // 'title:es': 'Tiempo restante',
   'title:pt': 'Tempo restante',
   'title:fr': 'Temps restant',
   // 'title:it': 'Tempo rimanente',
   // 'title:tr': 'Kalan süre',
   'title:de': 'Verbleibende Zeit',
   'title:pl': 'Pozostały czas',
   'title:ua': 'Час, що залишився',
   run_on_pages: 'watch, embed, -mobile',
   section: 'control-panel',
   desc: 'Remaining time until the end of the video',
   'desc:zh': '距离视频结束的剩余时间',
   'desc:ja': 'ビデオの終わりまでの残り時間',
   // 'desc:ko': '영상 끝까지 남은 시간',
   // 'desc:vi': '',
   // 'desc:id': 'Sisa waktu sampai akhir video',
   // 'desc:es': 'Tiempo restante hasta el final del video',
   'desc:pt': 'Tempo restante até o final do vídeo',
   'desc:fr': "Temps restant jusqu'à la fin de la vidéo",
   // 'desc:it': 'Tempo rimanente fino alla fine del video',
   // 'desc:tr': 'Videonun sonuna kalan süre',
   'desc:de': 'Verbleibende Zeit bis zum Ende des Videos',
   'desc:pl': 'Czas pozostały do końca filmu',
   'desc:ua': 'Час, що залишився до кінця відео',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/432706-youtube-speeder
      // alt2 - https://greasyfork.org/en/scripts/368389-youtube-time-remaining
      // alt3 - https://greasyfork.org/en/scripts/19120-youtube-remaining-time
      // alt4 - https://greasyfork.org/en/scripts/38090-add-youtube-video-progress
      // alt5 - https://greasyfork.org/en/scripts/477119-youtube-remaining-time
      // alt6 - https://greasyfork.org/en/scripts/485321-youtube-end-time-display
      // alt7 - https://greasyfork.org/en/scripts/489800-youtube-video-length-based-on-its-speed

      const SELECTOR_ID = 'nova-player-time-remaining';

      // NOVA.waitSelector('.ytp-time-duration, ytm-time-display .time-display-content, .player-controls-bottom .ytm-time-display .time-display-content')
      NOVA.waitSelector('.ytp-time-duration, ytm-time-display .time-display-content')
         .then(container => {

            NOVA.waitSelector('video')
               .then(video => {
                  video.addEventListener('timeupdate', setRemaining.bind(video));
                  video.addEventListener('ratechange', setRemaining.bind(video));
                  // clear text
                  // BUG - "suspend" blinking text in google drive player
                  // ['suspend', 'ended'].forEach(evt => {
                  //    video.addEventListener(evt, () => insertToHTML({ 'container': container }));
                  // });
                  video.addEventListener('ended', () => insertToHTML({ 'container': container }));
                  document.addEventListener('yt-navigate-finish', () => insertToHTML({ 'container': container }));
               });

            function setRemaining() {
               if (isNaN(this.duration)
                  || movie_player.getVideoData().isLive // stream. Doesn't work in embed
                  || (NOVA.currentPage == 'embed' && document.URL.includes('live_stream'))
                  || document.visibilityState == 'hidden' // tab inactive
                  || movie_player.classList.contains('ytp-autohide')
               ) return;

               const
                  // for optimization
                  currentTime = Math.trunc(this.currentTime),
                  duration = Math.trunc(this.duration),
                  delta = duration - currentTime,
                  getPercent = () => {
                     const
                        floatRound = pt => (this.duration > 3600)
                           ? pt.toFixed(2) // >1 hour
                           : (this.duration > 1500)
                              ? pt.toFixed(1) // >25 Minute
                              : Math.round(pt),
                        percentLeft = user_settings.time_remaining_pt_left
                           ? delta * 100 / duration
                           : currentTime * 100 / duration

                     return floatRound(percentLeft) + '%';
                  },
                  getTimeLeft = () => NOVA.formatTimeOut.HMS.digit(delta),
                  getTimeLeftByRate = () => '-' + NOVA.formatTimeOut.HMS.digit(delta / this.playbackRate);

               let text;

               switch (user_settings.time_remaining_mode) {
                  case 'pt': text = ' • ' + getPercent(); break;
                  case 'time': text = getTimeLeftByRate(); break;
                  case 'time_full':
                     text = getTimeLeftByRate();
                     if (this.playbackRate != 1) text += `(${getTimeLeft()})`;
                     break;
                  case 'time_full_pt':
                     text = getTimeLeftByRate();
                     if (this.playbackRate != 1) text += `(${getTimeLeft()})`;
                     text += text && ` (${getPercent()})`; // prevent show NaN
                     break;
                  // case 'full_pt':
                  // case 'full':
                  default:
                     text = getTimeLeftByRate();
                     text += text && ` (${getPercent()})`; // prevent show NaN
               }

               if (text) {
                  insertToHTML({ 'text': text, 'container': container });
               }
            }

            function insertToHTML({ text = '', container = required() }) {
               // console.debug('insertToHTML', ...arguments);
               if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

               (document.getElementById(SELECTOR_ID) || (function () {
                  const el = document.createElement('span');
                  el.id = SELECTOR_ID;
                  container.after(el);
                  // container.insertAdjacentElement('afterend', el);
                  return el;
                  // 62.88 % slower
                  // container.insertAdjacentHTML('afterend', `&nbsp;<span id="${SELECTOR_ID}">${text}</span>`);
                  // return document.getElementById(SELECTOR_ID);
               })())
                  .textContent = ' ' + text;
            }

         });

   },
   options: {
      time_remaining_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         // 'label:ko': '방법',
         // 'label:fd': 'Mode',
         // 'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         options: [
            {
               label: 'time+(%)', value: 'full',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               'label:ua': 'час+(%)',
            },
            {
               label: 'time(full)', value: 'time_full',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // '',
            },
            {
               label: 'time(full)+%', value: 'time_full_pt',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // '',
            },
            {
               label: 'time', value: 'time', selected: true,
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               'label:ua': 'час',
            },
            {
               label: 'done %', value: 'pt',
               // 'label:zh': '',
               // 'label:ja': '',
               // 'label:ko': '',
               // 'label:vi': '',
               // 'label:id': '',
               // 'label:es': '',
               // 'label:pt': '',
               // 'label:fr': '',
               // 'label:it': '',
               // 'label:tr': '',
               // 'label:de': '',
               // 'label:pl': '',
               // 'label:ua': '',
            },
         ],
      },
      time_remaining_pt_left: {
         _tagName: 'input',
         label: 'left %',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:vi': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'checkbox',
         title: 'by default "done"',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:vi': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         'data-dependent': { 'time_remaining_mode': ['time_full_pt', 'pt'] },
      },
   }
});
