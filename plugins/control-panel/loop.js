// for test
// https://www.youtube.com/watch?v=ig2b_obsCQ8 - has chapters

window.nova_plugins.push({
   id: 'player-loop',
   title: 'Add repeat (loop) playback button',
   // Repeat the video you're watching.
   'title:zh': '添加循环播放按钮',
   'title:ja': 'ループ再生ボタンを追加する',
   // 'title:ko': '루프 재생 버튼 추가',
   // 'title:vi': '',
   // 'title:id': 'Tambahkan tombol pemutaran ulangi (loop)',
   // 'title:es': 'Agregar un botón de reproducción en bucle',
   'title:pt': 'Adicionar um botão de reprodução em loop',
   'title:fr': 'Ajouter un bouton de lecture en boucle',
   // 'title:it': 'Aggiungi il pulsante di riproduzione ripetuta (loop).',
   // 'title:tr': 'Döngü oynatma düğmesi ekle',
   'title:de': 'Füge einen Loop-Play-Button hinzu',
   'title:pl': 'Dodaj przycisk odtwarzania pętli',
   'title:ua': 'Додати кнопку повтор',
   run_on_pages: 'watch',
   section: 'control-panel',
   // desc: 'Loop video playback',
   // 'desc:zh': '循环播放视频',
   // 'desc:ja': 'ビデオ再生をループする',
   // 'desc:ko': '루프 비디오 재생',
   // 'desc:vi': '',
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

      // alt1 - https://greasyfork.org/en/scripts/444241-loopbuttonyt (https://github.com/Makhloufbel/YoutubeLooper/blob/main/loopButton.user.js)
      // alt2 - https://greasyfork.org/en/scripts/421393-youtube-extended-controls

      // createPlayerButton
      NOVA.waitSelector('#movie_player .ytp-left-controls .ytp-play-button')
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
            btn.addEventListener('click', toggleLoop);

            container.after(btn);

            // update the next video
            NOVA.waitSelector('#movie_player video')
               .then(video => {
                  // video.loop = true;
                  video.addEventListener('loadeddata', ({ target }) => {
                     if (movie_player.classList.contains('ad-showing')) return;
                     // upd loop state
                     if (btn.style.opacity == 1 && !target.loop) target.loop = true;
                     // if (btn.style.opacity == 1 && !movie_player.getLoopVideo()) movie_player.setLoopVideo();
                     // upd btn active
                     if (target.loop) btn.style.opacity = 1;
                  });
               });

            // hotkey
            if (user_settings.player_loop_hotkey) {
               const hotkey = user_settings.player_loop_hotkey;// || 'KeyL';

               document.addEventListener('keyup', evt => {
                  if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;

                  if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;

                  if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey) {
                     toggleLoop();
                     // btn.click();
                  }
               });
            }

            function toggleLoop() {
               if (!NOVA.videoElement) return console.error('btn > videoElement empty:', NOVA.videoElement);

               NOVA.videoElement.loop = !NOVA.videoElement.loop;
               btn.style.opacity = NOVA.videoElement.loop ? 1 : .5;
               NOVA.showOSD('Loop is ' + Boolean(NOVA.videoElement.loop));
               // NOVA.showOSD('Loop is ' + movie_player.getLoopVideo());
            }

            // NOVA.runOnPageLoad(async () => {
            //    if (NOVA.currentPage != 'watch') return;

            //    const isMusic = (user_settings.player_loop_in_music || user_settings.player_loop_in_music_auto_enabled) && NOVA.isMusic();

            //    if (user_settings.player_loop_save_state && btn.style.opacity == 1 && !NOVA.videoElement?.loop) return setLoop();

            //    // reset btn opacity
            //    else btn.style.opacity = NOVA.videoElement.hasAttribute('loop') ? 1 : .5;

            //    // button visible toggle
            //    if (user_settings.player_loop_in_music) btn.style.display = isMusic ? '' : 'none';

            //    //
            //    if ((user_settings.player_loop_in_music_auto_enabled && isMusic)
            //       || (user_settings['save-channel-state']
            //          && await NOVA.storage_obj_manager.getParam('loop')
            //          && !NOVA.videoElement?.loop //!NOVA.videoElement?.hasAttribute('loop')
            //       )
            //    ) {
            //       setLoop();
            //    }
            //    function setLoop() {
            //       NOVA.videoElement.loop = true;
            //       btn.style.opacity = 1; // enable btn
            //       // or btn.click();
            //    }
            // });

         });

      // loopChangeMutationObserver.observe(videoElement, { attributeFilter: ["loop"], attributes: true });

      // NOVA.waitSelector('video')
      //    .then(video => {
      //       // video.loop = true;
      //       video.addEventListener('loadeddata', ({ target }) => target.loop = true);
      //    });

      // Doesn't work
      // NOVA.waitSelector('#movie_player')
      //    .then(movie_player => movie_player.setLoop());

   },
   options: {
      player_loop_hotkey: {
         _tagName: 'select',
         label: 'Hotkey',
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
         options: [
            { label: 'none', /* value: false, */ }, // fill value if no "selected" mark another option
            // { label: 'none', value: false },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            // { label: 'ShiftL', value: 'ShiftLeft' },
            // { label: 'ShiftR', value: 'ShiftRight' },
            // { label: 'CtrlL', value: 'ControlLeft' },
            // { label: 'CtrlR', value: 'ControlRight' },
            // { label: 'AltL', value: 'AltLeft' },
            // { label: 'AltR', value: 'AltRight' },
            // { label: 'ArrowUp', value: 'ArrowUp' },
            // { label: 'ArrowDown', value: 'ArrowDown' },
            // { label: 'ArrowLeft', value: 'ArrowLeft' },
            // { label: 'ArrowRight', value: 'ArrowRight' },
            { label: 'A', value: 'KeyA' },
            { label: 'B', value: 'KeyB' },
            { label: 'C', value: 'KeyC' },
            { label: 'D', value: 'KeyD' },
            { label: 'E', value: 'KeyE' },
            { label: 'F', value: 'KeyF' },
            { label: 'G', value: 'KeyG' },
            { label: 'H', value: 'KeyH' },
            { label: 'I', value: 'KeyI' },
            { label: 'J', value: 'KeyJ' },
            { label: 'K', value: 'KeyK' },
            { label: 'L', value: 'KeyL' },
            { label: 'M', value: 'KeyM' },
            { label: 'N', value: 'KeyN' },
            { label: 'O', value: 'KeyO' },
            { label: 'P', value: 'KeyP' },
            { label: 'Q', value: 'KeyQ' },
            { label: 'R', value: 'KeyR' },
            { label: 'S', value: 'KeyS' },
            { label: 'T', value: 'KeyT' },
            { label: 'U', value: 'KeyU' },
            { label: 'V', value: 'KeyV' },
            { label: 'W', value: 'KeyW' },
            { label: 'X', value: 'KeyX' },
            { label: 'Y', value: 'KeyY' },
            { label: 'Z', value: 'KeyZ' },
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            ']', '[', '+', '-', ',', '.', '/', '<', ';', '\\',
         ],
      },
      // player_loop_save_state: {
      //    _tagName: 'input',
      //    //label: 'Remember state',
      //    label: 'Keep state to the next videos',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': '',
      //    type: 'checkbox',
      //    title: 'Affects to next videos',
      //    'title:zh': '对下一个视频的影响',
      //    'title:ja': '次の動画への影響',
      //    // 'title:ko': '다음 동영상에 영향',
      //    // 'title:vi': '',
      //    // 'title:id': 'Mempengaruhi video berikutnya',
      //    // 'title:es': 'Afecta a los siguientes videos',
      //    'title:pt': 'Afeta para os próximos vídeos',
      //    'title:fr': 'Affecte aux prochaines vidéos',
      //    // 'title:it': 'Influisce sui prossimi video',
      //    // 'title:tr': 'Sonraki videoları etkiler',
      //    'title:de': 'Beeinflusst die nächsten Videos',
      //    'title:pl': 'Zmiany w następnych filmach',
      //    'title:ua': 'Впливає на наступні відео',
      // },
      // player_loop_in_music_auto_enabled: {
      //    _tagName: 'input',
      //    label: 'Auto enabled in music',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': '',
      //    type: 'checkbox',
      //    // title: '',
      // },
      // player_loop_in_music: {
      //    _tagName: 'input',
      //    label: 'Show button only in music',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': 'Показувати тільки в музиці',
      //    type: 'checkbox',
      // },
   }
});
