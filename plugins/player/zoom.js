// for test
// https://www.youtube.com/watch?v=SDjbK8JWA_Y - (1:1)
// https://www.youtube.com/watch?v=OV27taeR4LA - (4:3)
// https://www.youtube.com/watch?v=KOCZaxzZE34 - (91:90)
// https://www.youtube.com/watch?v=z-2w7eAL-98 - (121:120)
// https://www.youtube.com/watch?v=TaQwW5eQZeY - (121:120)
// https://www.youtube.com/watch?v=U9mUwZ47z3E - (ultra-wide) - now broken
// https://www.youtube.com/watch?v=EqYYmQVs36I- (16:9) horizontal black bars
// https://www.youtube.com/watch?v=EIVgSuuUTwQ - (4:3) horizontal black bars

window.nova_plugins.push({
   id: 'video-zoom',
   title: 'Zoom video',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: 'Remove horizontal black bars',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   // 'desc:ua': '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/484376-youtube-video-zoomer
      // alt2 - https://chromewebstore.google.com/detail/zoom-to-fill-ultrawide-vi/adpjimagbfpknkodpofjphpbdlfkeiho
      // alt3 - https://greasyfork.org/en/scripts/16323-youtube-player-controls

      // similar plugins:
      // - "aspect-ratio" - [player-quick-buttons]
      // - [player-resize-ratio]

      const ZOOM_CLASS_NAME = 'nova-zoom';

      NOVA.waitSelector('.html5-video-container')
         .then(container => {
            let zoomPercent = 100;

            // keyboard (+/-)
            if (user_settings.zoom_hotkey == 'keyboard') {

               document.addEventListener('keydown', evt => {
                  if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;

                  // movie_player.contains(document.activeElement) // don't use! stay overline
                  if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;

                  let delta;
                  switch (user_settings.zoom_hotkey_custom_in.length === 1 ? evt.key : evt.code) {
                     case user_settings.zoom_hotkey_custom_in: delta = 1; break;
                     case user_settings.zoom_hotkey_custom_out: delta = -1; break;
                  }
                  if (delta) {
                     evt.preventDefault();
                     evt.stopPropagation();
                     evt.stopImmediatePropagation();

                     if (step = +user_settings.zoom_step * Math.sign(delta)) {
                        setScale(zoomPercent + step);
                     }
                  }
               }, { capture: true });
            }
            // mousewheel in player area
            else if (user_settings.zoom_hotkey) {
               // mousewheel in player area
               container.addEventListener('wheel', evt => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  // evt.stopImmediatePropagation();

                  if (evt[user_settings.zoom_hotkey] || (user_settings.zoom_hotkey == 'none'
                     && !evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey)
                  ) {
                     if (step = +user_settings.zoom_step * Math.sign(evt.wheelDelta)) {
                        setScale(zoomPercent + step);
                     }
                  }
               }, { capture: true });
            }

            // hotkey max width
            if (hotkey = user_settings.zoom_auto_max_width_hotkey_toggle) {
               document.addEventListener('keyup', evt => {
                  if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;

                  if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
                  if ((hotkey.length === 1 ? evt.key : evt.code) === hotkey
                     && (maxZoomPercent = geVideoMaxWidthPercent())
                  ) {
                     // console.debug('maxZoomPercent', maxZoomPercent);
                     setScale(zoomPercent === maxZoomPercent ? 100 : maxZoomPercent);
                  }
               });
            }

            // custom zoom from [save-channel-state] plugin
            if (user_settings['save-channel-state']) {
               NOVA.runOnPageLoad(async () => {
                  if ((NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed')
                     && (userZoom = await NOVA.storage_obj_manager.getParam('zoom')) // returns a fractional value
                  ) {
                     setScale(userZoom * 100); // fractional to pt
                  }
               });
            }

            // zoom small video to fill height
            // NOVA.waitSelector('video')
            //    .then(video => {
            //       video.addEventListener('loadeddata', () => {
            //          if (this.videoHeight < window.innerWidth && this.videoHeight < window.innerHeight) {
            //             setScale(geVideoMaxHeightPercent());
            //          }

            //          function geVideoMaxHeightPercent() {
            //             return movie_player.clientHeight / NOVA.videoElement.videoHeight * 100;
            //          }

            //          // if (!squareAspectRatio()
            //          //    && (maxZoomPercent = geVideoMaxWidthPercent())
            //          //    && (~~maxZoomPercent !== 100) // was changed earlier
            //          //    && (~~maxZoomPercent < 175) // skip ultra-wide (179.63446475195823)
            //          // ) {

            //          // }
            //       });
            //    });

            // init max width
            if (user_settings.zoom_auto_max_width) {
               NOVA.waitSelector('video')
                  .then(video => {
                     video.addEventListener('loadeddata', () => {
                        const squareAspectRatio = () => {
                           const aspectRatio = NOVA.aspectRatio.getAspectRatio({
                              // 'width': movie_player.clientWidth,
                              // 'height': movie_player.clientHeight,
                              // 'width': NOVA.videoElement?.videoWidth,
                              // 'height': NOVA.videoElement?.videoHeight,
                              'width': video.videoWidth,
                              'height': video.videoHeight,
                           });
                           return ('4:3' == aspectRatio || '1:1' == aspectRatio);
                        };

                        if (!squareAspectRatio()
                           && (maxZoomPercent = geVideoMaxWidthPercent())
                           && (~~maxZoomPercent !== 100) // was changed earlier
                           && (~~maxZoomPercent < 175) // skip ultra-wide (179.63446475195823)
                        ) {
                           setScale(maxZoomPercent);
                        }
                     });
                  });
            }

            function setScale(zoom_pt = 100) {
               // console.debug('setScale', ...arguments);
               // limit zoom
               // zoom_pt = Math.max(100, Math.min(geVideoMaxWidthPercent(), +zoom_pt));
               zoom_pt = Math.max(100, Math.min(250, +zoom_pt));

               // disable
               if (zoom_pt === 100 && container.classList.contains(ZOOM_CLASS_NAME)) {
                  container.classList.remove(ZOOM_CLASS_NAME);
                  container.style.removeProperty('transform');
               }
               // enable
               else if (zoom_pt !== 100 && !container.classList.contains(ZOOM_CLASS_NAME)) {
                  container.classList.add(ZOOM_CLASS_NAME);
               }

               // show UI notification
               NOVA.triggerHUD(`Zoom: ${~~zoom_pt}%`);

               // For optimozation, don`t update again
               if (zoom_pt === zoomPercent) return;
               // save
               zoomPercent = zoom_pt;

               // Doesn't work scale image from center
               // container.style.setProperty('scale', zoom);
               // container.style.removeProperty('scale');
               // let zoomPercent = step + (+NOVA.css.get(container, 'scale') || 1);

               container.style.setProperty('transform', `scale(${zoom_pt / 100})`);
               // container.style.setProperty('transform', `scale(${zoom_h}, ${zoom_v})`);
            }

            function geVideoMaxWidthPercent() {
               return movie_player.clientWidth / NOVA.videoElement.videoHeight * 100;
            }
            // for css scale you need a percentage and not a resolution
            // NOVA.aspectRatio.sizeToFit({
            //    srcWidth = 0, srcHeight = 0,
            //    // maxWidth = window.innerWidth, maxHeight = window.innerHeight // iframe size
            //    maxWidth = screen.width, maxHeight = screen.height // screen size
            // })

            // initStyles
            NOVA.css.push(
               // transform: scale(${zoomPercent});
               `.${ZOOM_CLASS_NAME} {
                  transition: transform 100ms linear;
                  transform-origin: center;
               }
               .${ZOOM_CLASS_NAME} video {
                  position: relative !important;
               }`);
         });

   },
   options: {
      zoom_hotkey: {
         _tagName: 'select',
         label: 'Hotkey',
         'label:zh': '热键',
         'label:ja': 'ホットキー',
         // 'label:ko': '단축키',
         // 'label:id': 'Tombol pintas',
         // 'label:es': 'Tecla de acceso rápido',
         'label:pt': 'Tecla de atalho',
         'label:fr': 'Raccourci',
         // 'label:it': 'Tasto di scelta rapida',
         // 'label:tr': 'Kısayol tuşu',
         'label:de': 'Schnelltaste',
         'label:pl': 'Klawisz skrótu',
         'label:ua': 'Гаряча клавіша',
         options: [
            { label: 'none', /*value: false*/ },
            { label: 'wheel', value: 'none' },
            { label: 'shift+wheel', value: 'shiftKey' },
            { label: 'ctrl+wheel', value: 'ctrlKey' },
            { label: 'alt+wheel', value: 'altKey' },
            { label: 'keyboard', value: 'keyboard', selected: true },
         ],
      },
      zoom_hotkey_custom_in: {
         _tagName: 'select',
         label: 'Hotkey zoom in',
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
         // title: '',
         options: [
            { label: '+', value: '+', selected: true },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'shiftL', value: 'ShiftLeft' },
            { label: 'shiftR', value: 'ShiftRight' },
            { label: 'ctrlL', value: 'ControlLeft' },
            { label: 'ctrlR', value: 'ControlRight' },
            { label: 'altL', value: 'AltLeft' },
            { label: 'altR', value: 'AltRight' },
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
            ']', '[', /*'+',*/ '-', ',', '.', '/', '<', ';', '\\',
         ],
         'data-dependent': { 'zoom_hotkey': ['keyboard'] },
      },
      zoom_hotkey_custom_out: {
         _tagName: 'select',
         label: 'Hotkey zoom out',
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
         // title: '',
         options: [
            { label: '-', value: '-', selected: true },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'shiftL', value: 'ShiftLeft' },
            { label: 'shiftR', value: 'ShiftRight' },
            { label: 'ctrlL', value: 'ControlLeft' },
            { label: 'ctrlR', value: 'ControlRight' },
            { label: 'altL', value: 'AltLeft' },
            { label: 'altR', value: 'AltRight' },
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
            ']', '[', '+', /*'-',*/ ',', '.', '/', '<', ';', '\\',
         ],
         'data-dependent': { 'zoom_hotkey': ['keyboard'] },
      },
      zoom_step: {
         _tagName: 'input',
         label: 'Hotkey step',
         'label:zh': '步',
         'label:ja': 'ステップ',
         // 'label:ko': '단계',
         // 'label:id': 'Melangkah',
         // 'label:es': 'Paso',
         'label:pt': 'Degrau',
         'label:fr': 'Étape',
         // 'label:it': 'Fare un passo',
         // 'label:tr': 'Adım',
         'label:de': 'Schritt',
         'label:pl': 'Krok',
         'label:ua': 'Крок',
         type: 'number',
         title: 'in %',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '%',
         step: 5,
         min: 5,
         max: 50,
         value: 10,
      },
      zoom_auto_max_width: {
         _tagName: 'input',
         label: 'Auto fit to width',
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
         // title: '',
      },
      zoom_auto_max_width_hotkey_toggle: {
         _tagName: 'select',
         label: 'Hotkey toggle fit to width',
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
         title: 'exception square video',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         options: [
            // { label: 'none', /*value: false,*/ }, // activate if no default "selected" mark
            { label: 'none', value: false },
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'shiftL', value: 'ShiftLeft' },
            { label: 'shiftR', value: 'ShiftRight' },
            { label: 'ctrlL', value: 'ControlLeft' },
            { label: 'ctrlR', value: 'ControlRight' },
            { label: 'altL', value: 'AltLeft' },
            { label: 'altR', value: 'AltRight' },
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
            { label: 'Q', value: 'KeyQ', selected: true },
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
         // 'data-dependent': { 'player_buttons_custom_items': ['toggle-'] },
      },
   }
});
