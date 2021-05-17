_plugins_conteiner.push({
   name: 'Fly player progress bar',
   id: 'fly-video-progress-bar',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const SELECTOR_ID = 'pin-progress-bar',
         SELECTOR_BAR = '#' + SELECTOR_ID;

      YDOM.HTMLElement.wait('video')
         .then(player => {
            // reset render transition
            player.addEventListener('durationchange', function () {
               // console.debug('durationchange', this.duration);
               const progressBarEl = document.getElementById(`${SELECTOR_ID}-progress`);
               progressBarEl.classList.remove('transition');
               setTimeout(() => progressBarEl.classList.add('transition'), 1000); // 1sec
            });
            // render progress
            player.addEventListener('timeupdate', function () {
               // console.debug('timeupdate', this.currentTime, '/', this.duration);
               document.getElementById(`${SELECTOR_ID}-progress`)
                  .style.transform = `scaleX(${this.currentTime / this.duration})`;
            });

            player.addEventListener('progress', renderBuffer);
            player.addEventListener('seeking', renderBuffer);

            function renderBuffer() {
               for (let i = 0; i < this.buffered.length; i++) {
                  //    const bufferedSeconds = this.buffered.end(0) - this.buffered.start(0);
                  //    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
                  if (this.currentTime > this.buffered.start(i)) {
                     document.getElementById(`${SELECTOR_ID}-buffer`)
                        .style.transform = `scaleX(${this.buffered.end(i) / this.duration})`;
                  }
               }
            };

         });

      YDOM.HTMLElement.wait('.html5-video-player')
         .then(playerConteiner => createBar(playerConteiner));

      function createBar(html_container) {
         // console.debug('createBar', ...arguments);

         return document.getElementById(SELECTOR_ID) || (function () {
            html_container.insertAdjacentHTML("beforeend",
               `<div id="${SELECTOR_ID}">
                  <div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
                  <div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color transition"></div>
               </div>`);

            const
               zIndex = YDOM.css.getValue({ selector: '.ytp-chrome-bottom', property: 'z-index' }) || 60,
               height = +user_settings.fly_progress_bar_height || 3,
               bgColor = YDOM.css.getValue({ selector: '.ytp-progress-list', property: 'background-color' }) || 'rgba(255,255,255,.2)',
               bufferColor = YDOM.css.getValue({ selector: '.ytp-load-progress', property: 'background-color' }) || 'rgba(255,255,255,.4)';

            YDOM.css.add(
               SELECTOR_BAR + `{
                  --opacity: ${+user_settings.fly_progress_bar_opacity || .7};
                  --height: ${height}px;
                  --buffer-color: ${bufferColor};
                  --bg-color: ${bgColor};
                  --zindex: ${zIndex};

                  opacity: 0;
                  z-index: var(--zindex);
                  width: 100%;
                  background: var(--bg-color);

                  /*margin: 0 1em;
                  width: -webkit-fill-available;*/
               }
               ${SELECTOR_BAR},
               ${SELECTOR_BAR} * {
                  position: absolute;
                  bottom: 0;
               }
               .ytp-autohide ${SELECTOR_BAR} {
                  opacity: var(--opacity);
               }
               ${SELECTOR_BAR} * {
                  width: 100%;
                  height: var(--height);
                  transform-origin: 0 0;
               }
               ${SELECTOR_BAR}-progress.transition,
               ${SELECTOR_BAR}-buffer {
                  transition: transform .2s linear;
               }
               ${SELECTOR_BAR}-progress {
                  z-index: calc(var(--zindex) + 1);
               }
               ${SELECTOR_BAR}-buffer {
                  background: var(--buffer-color);
               }`);

            return document.getElementById(SELECTOR_ID);
         })();
      }

   },
   opt_export: {
      'fly_progress_bar_height': {
         _tagName: 'input',
         label: 'Height',
         type: 'number',
         title: 'In pixels',
         placeholder: 'px',
         min: 0,
         max: 9,
         value: 3,
      },
      'fly_progress_bar_opacity': {
         _tagName: 'input',
         label: 'Opacity',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         step: .1,
         min: .1,
         max: 1,
         value: .7,
      },
   },
});
