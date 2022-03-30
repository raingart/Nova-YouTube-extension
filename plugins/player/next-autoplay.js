window.nova_plugins.push({
   id: 'video-next-autoplay-disable',
   title: 'Disable autoplay next video',
   'title:zh': '禁用自动播放下一个视频',
   'title:ja': '次の動画の自動再生を無効にする',
   'title:ko': '다음 동영상 자동재생 비활성화',
   'title:es': 'Desactivar la reproducción automática del siguiente video',
   'title:pt': 'Desativar a reprodução automática do próximo vídeo',
   'title:fr': 'Désactiver la lecture automatique de la prochaine vidéo',
   'title:tr': 'Sonraki videoyu otomatik oynatmayı devre dışı bırak',
   'title:de': 'Deaktivieren Sie die automatische Wiedergabe des nächsten Videos',
   run_on_pages: 'watch',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // autoplay on: f5=20000
      // autoplay off: f5=30000
      // NOVA.cookie.set('PREF', 'f5=30000'); // Other parameters will be overwritten
      NOVA.cookie.updateParam({ key: 'PREF', param: 'f5', value: 30000 });

      if (user_settings.video_next_autoplay_timeout) {
         let timeoutNext;

         // NOVA.waitElement('video')
         //    .then(video => {
         //       // add next-button eventListener - Strategy 1
         //       // video.addEventListener('ended', nextVideoButton); // does not work when rewinding manually
         //       // video.addEventListener('suspend', nextVideoButton); // need test
         //       // auto-close modal - Strategy 1
         //       video.addEventListener('loadstart', Modal_NOVA.close);
         //    });

         // add next-button eventListener - Strategy 2
         NOVA.waitElement('#movie_player')
            .then(() => {
               movie_player.addEventListener('onStateChange', state =>
                  'ENDED' == NOVA.getPlayerState(state) && nextVideoButton());
            });

         function nextVideoButton() {
            if (movie_player.classList.contains('ad-showing')) return; // ad skip

            if (btn = document.querySelector('.ytp-next-button')) {
               timeoutNext = setTimeout(() => btn.click(), 1000 * parseInt(user_settings.video_next_autoplay_timeout)); // click btn after N sec.

               Modal_NOVA.create();
               // auto-close modal - Strategy 2
               document.addEventListener('yt-navigate-start', Modal_NOVA.close, { capture: true, once: true });
            }
         }

         const Modal_NOVA = {
            // notice: document.createElement('div'),

            create() {
               this.notice = document.createElement('div');
               Object.assign(this.notice.style, {
                  position: 'fixed',
                  top: 0,
                  right: '50%',
                  transform: 'translateX(50%)',
                  margin: '50px',
                  'z-index': 9999,
                  'border-radius': '2px',
                  'background-color': 'tomato',
                  'box-shadow': 'rgb(0 0 0 / 50%) 0px 0px 3px',
                  'font-size': '13px',
                  color: '#fff',
                  padding: '10px',
                  cursor: 'pointer',
               });
               this.notice.addEventListener('click', this.close);
               this.notice.innerHTML =
                  `<h4 style="margin:0;">Next video will play after ${NOVA.timeFormatTo.HMS.abbr(user_settings.video_next_autoplay_timeout)}</h4>`
                  + `<div>click to cancel</div>`;
               document.body.append(this.notice);
            },

            close() {
               Modal_NOVA.notice?.remove();
               clearTimeout(timeoutNext);
            },
         };
      }

   },
   options: {
      video_next_autoplay_timeout: {
         _tagName: 'input',
         label: 'Go to next video when time is reached',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         type: 'number',
         title: 'in seconds',
         placeholder: '1-30',
         step: 1,
         min: 1,
         max: 30,
         value: 5,
      },
   }
});
