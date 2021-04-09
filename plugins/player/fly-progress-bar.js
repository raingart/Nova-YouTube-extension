_plugins_conteiner.push({
   name: 'Fly player progress bar',
   id: 'fly-video-progress-bar',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const SELECTOR_ID = 'pin-progress-bar';

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
               `<div id="${SELECTOR_ID}-bar">
                  <div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
                  <div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color transition"></div>
               </div>`);

            const
               // zIndex = YDOM.HTMLElement.getCSSValue({ selector: '.ytp-chrome-bottom ', property: 'z-index' }) || 60,
               // height = YDOM.HTMLElement.getCSSValue({ selector: '.ytp-progress-bar-container', property: 'height' }) || '3px',
               bgColor = YDOM.HTMLElement.getCSSValue({ selector: '.ytp-progress-list', property: 'background-color' }) || 'rgba(255,255,255,.2)',
               bufferColor = YDOM.HTMLElement.getCSSValue({ selector: '.ytp-load-progress', property: 'background-color' }) || 'rgba(255,255,255,.4)';

            YDOM.HTMLElement.addStyle(`
               #${SELECTOR_ID}-bar {
                  --opacity: .8;
                  --height: 3px;
                  --buffer-color: ${bufferColor};
                  --bg-color: ${bgColor};
               }
               #${SELECTOR_ID}-bar {
                  position: absolute;
                  bottom: 0;
                  opacity: 0;
                  z-index: 60;
                  width: 100%;
                  height: var(--height);
                  background: var(--bg-color);
               }
               .ytp-autohide #${SELECTOR_ID}-bar {
                  opacity: var(--opacity);
               }
               #${SELECTOR_ID}-progress,
               #${SELECTOR_ID}-buffer {
                  width: 100%;
                  height: var(--height);
                  transform-origin: 0 0;
                  position: absolute;
               }
               #${SELECTOR_ID}-progress.transition,
               #${SELECTOR_ID}-buffer {
                  transition: transform .2s linear;
               }
               #${SELECTOR_ID}-buffer {
                  background: var(--buffer-color);
               }`);

            return document.getElementById(SELECTOR_ID);
         })();
      }

   },
   // opt_export: {
   //    'progress_bar_opacity': {
   //       _elementsTagName: 'input',
   //       label: 'Opacity',
   //       type: 'number',
   //       // title: '',
   //       placeholder: '1-10',
   //       step: 1,
   //       min: 1,
   //       max: 10,
   //       value: 7,
   //    },
   // },
});
