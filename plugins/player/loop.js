// for test
// https://www.youtube.com/watch?v=ig2b_obsCQ8 - has chapters

window.nova_plugins.push({
   id: 'player-loop',
   title: 'Add repeat (loop) playback button',
   // Repeat the video you're watching.
   'title:zh': '添加循环播放按钮',
   'title:ja': 'ループ再生ボタンを追加する',
   'title:ko': '루프 재생 버튼 추가',
   'title:id': 'Tambahkan tombol pemutaran ulangi (loop)',
   'title:es': 'Agregar un botón de reproducción en bucle',
   'title:pt': 'Adicionar um botão de reprodução em loop',
   'title:fr': 'Ajouter un bouton de lecture en boucle',
   'title:it': 'Aggiungi il pulsante di riproduzione ripetuta (loop).',
   'title:tr': 'Döngü oynatma düğmesi ekle',
   'title:de': 'Füge einen Loop-Play-Button hinzu',
   'title:pl': 'Dodaj przycisk odtwarzania pętli',
   'title:ua': 'Додати кнопку повтор',
   run_on_pages: 'watch',
   section: 'player',
   // desc: 'Loop video playback',
   // 'desc:zh': '循环播放视频',
   // 'desc:ja': 'ビデオ再生をループする',
   // 'desc:ko': '루프 비디오 재생',
   // 'desc:id': '',
   // 'desc:es': 'Reproducción de video en bucle',
   // 'desc:pt': 'Reprodução de vídeo em loop',
   // 'desc:fr': 'Lecture vidéo en boucle',
   // 'desc:it': '',
   // 'desc:tr': 'Döngü video oynatma',
   // 'desc:de': 'Loop-Videowiedergabe',
   // 'desc:pl': 'Odtwarzanie filmów w pętli',
   // 'desc:ua': 'Зациклювання відео',
   _runtime: user_settings => {

      // createPlayerButton
      NOVA.waitElement('.ytp-left-controls .ytp-play-button')
         .then(container => {
            const
               SELECTOR_CLASS = 'nova-right-custom-button', // same class in "player-buttons-custom" plugin
               btn = document.createElement('button');

            // "ye-repeat-button"
            btn.className = `ytp-button ${SELECTOR_CLASS}`;
            btn.style.opacity = .5;
            btn.style.minWidth = getComputedStyle(container).width || '48px'; // fix if has chapters
            btn.title = 'Repeat';
            // btnPopup.setAttribute('aria-label','');
            btn.innerHTML =
               `<svg viewBox="-6 -6 36 36" height="100%" width="100%">
                  <g fill="currentColor">
                     <path d="M 7 7 L 17 7 L 17 10 L 21 6 L 17 2 L 17 5 L 5 5 L 5 11 L 7 11 L 7 7 Z M 7.06 17 L 7 14 L 3 18 L 7 22 L 7 19 L 19 19 L 19 13 L 17 13 L 17 17 L 7.06 17 Z"/>
                  </g>
               </svg>`;
               // `<svg viewBox="-6 -6 36 36" height="100%" width="100%">
               //    <g fill="currentColor">
               //       <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
               //    </g>
               // </svg>`;
            btn.addEventListener('click', () => {
               if (!NOVA.videoElement) return console.error('btn > videoElement empty:', NOVA.videoElement);

               NOVA.videoElement.loop = !NOVA.videoElement.loop;
               // fix ad
               if (movie_player.classList.contains('ad-showing')) NOVA.videoElement.removeAttribute('loop');

               btn.style.opacity = NOVA.videoElement.hasAttribute('loop') ? 1 : .5;
            });

            container.after(btn);

            // button visible toggle
            if (user_settings.player_loop_in_music) {
               NOVA.runOnEveryPageTransition(() => btn.style.display = NOVA.isMusic() ? '' : 'none');
            }
         });

      // NOVA.waitElement('video')
      //    .then(video => {
      //       video.loop = true;
      //       video.addEventListener('loadeddata', ({ target }) => target.loop = true);
      //    });

      // Doesn't work
      // NOVA.waitElement('#movie_player')
      //    .then(movie_player => movie_player.setLoop());

   },
   options: {
      player_loop_in_music: {
         _tagName: 'input',
         label: 'Show only in music',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
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
      },
   }
});
