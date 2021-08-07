window.nova_plugins.push({
   id: 'player-float-progress-bar',
   title: 'Float player progress bar',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'player-float-progress-bar',
         SELECTOR = '#' + SELECTOR_ID, // for css
         CHAPTERS_MARK_WIDTH = 2; // px

      NOVA.waitElement('#movie_player')
         .then(player => {
            renderFloatBar(player);

            NOVA.waitElement('video')
               .then(video => {
                  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
                  let container, progressEl, bufferEl;
                  // reset float-bar if new video
                  video.addEventListener('loadstart', function () {
                     // console.debug('loadstart');
                     if (!container) container = document.getElementById(SELECTOR_ID);
                     container.classList.remove('transition');

                     if (bufferEl) bufferEl.style.transform = 'scaleX(0)';
                     if (progressEl) progressEl.style.transform = 'scaleX(0)';

                     container.classList.add('transition');
                  });
                  // render progress
                  video.addEventListener('timeupdate', function () {
                     // console.debug('timeupdate', this.currentTime, '/', this.duration);
                     if (!progressEl) progressEl = document.getElementById(`${SELECTOR_ID}-progress`)
                     if (!isNaN(this.duration)) {
                        progressEl.style.transform = `scaleX(${this.currentTime / this.duration})`;
                     }
                  });

                  video.addEventListener('progress', renderBuffer);
                  video.addEventListener('seeking', renderBuffer);

                  function renderBuffer() {
                     if (!bufferEl) bufferEl = document.getElementById(`${SELECTOR_ID}-buffer`);
                     for (let i = 0; i < this.buffered.length; i++) {
                        //    const bufferedSeconds = this.buffered.end(0) - this.buffered.start(0);
                        //    console.debug(`${bufferedSeconds} seconds of video are ready to play.`);
                        if (!isNaN(this.duration) && this.currentTime > this.buffered.start(i)) {
                           bufferEl.style.transform = `scaleX(${this.buffered.end(i) / this.duration})`;
                        }
                     }
                  };
                  // add chapters marks
                  video.addEventListener('loadeddata', function () {
                     renderChaptersMarks(this.duration);
                     // first/pinned comment
                     NOVA.waitElement('#contents ytd-comment-thread-renderer:first-child #content')
                        .then(comment => renderChaptersMarks(video.duration));
                  });

               });
         });

      function renderChaptersMarks(duration) {
         // console.debug('renderChaptersMarks', ...arguments);
         const chaptersConteiner = document.getElementById(`${SELECTOR_ID}-chapters`);
         chaptersConteiner.innerHTML = ''; // clear old
         if (!isNaN(duration)) {
            NOVA.getChapterList(duration)
               ?.forEach((chapter, i, chapters_list) => {
                  // console.debug('', (chapterEl.sec / duration) * 100 + '%');
                  const chapterEl = document.createElement('span');
                  const nextChapterSec = chapters_list[i + 1]?.sec || 0;
                  chapterEl.style.width = ((nextChapterSec - chapter.sec) / duration) * 100 + '%';
                  if (chapter.title) chapterEl.title = chapter.title;
                  chaptersConteiner.appendChild(chapterEl);
               });
         }
      };

      function renderFloatBar(container = required()) {
         // console.debug('renderFloatBar', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('parent not HTMLElement:', container);

         return document.getElementById(SELECTOR_ID) || (function () {
            container.insertAdjacentHTML('beforeend',
               `<div id="${SELECTOR_ID}" class="transition">
                  <div class="conteiner">
                     <div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
                     <div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color"></div>
                  </div>
                  <div id="${SELECTOR_ID}-chapters"></div>
               </div>`);

            const
               zIndex = NOVA.css.getValue({ selector: '.ytp-chrome-bottom', property: 'z-index' }) || 60,
               height = +user_settings.player_float_progress_bar_height || 3,
               bgColor = NOVA.css.getValue({ selector: '.ytp-progress-list', property: 'background-color' }) || 'rgba(255,255,255,.2)';
            // bufferColor = NOVA.css.getValue({ selector: '.ytp-load-progress', property: 'background-color' }) || 'rgba(255,255,255,.4)';

            NOVA.css.push(
               `[id|=${SELECTOR_ID}] {
                  position: absolute;
                  bottom: 0;
               }

               ${SELECTOR} {
                  --opacity: ${+user_settings.player_float_progress_bar_opacity || .7};
                  --height: ${height}px;
                  --bg-color: ${bgColor};
                  --zindex: ${zIndex};

                  opacity: var(--opacity)
                  z-index: var(--zindex);
                  background: var(--bg-color);
                  width: 100%;
                  visibility: hidden;
               }

               .ytp-autohide ${SELECTOR} {
                  visibility: visible;
               }

               /*${SELECTOR} .conteiner {
                  position: relative;
                  margin: 0 15px;
               }*/

               ${SELECTOR}.transition * {
                  transition: transform .2s linear;
               }

               ${SELECTOR}-progress, ${SELECTOR}-buffer {
                  width: 100%;
                  height: var(--height);
                  transform-origin: 0 0;
                  transform: scaleX(0);
               }

               ${SELECTOR}-progress {
                  z-index: calc(var(--zindex) + 1);
               }

               /*${SELECTOR}-buffer {
                  background: var(--buffer-color);
               }*/

               ${SELECTOR}-chapters {
                  position: relative;
                  width: 100%;
                  display: flex;
               }

               ${SELECTOR}-chapters span {
                  height: var(--height);
                  z-index: ${+zIndex + 1};
                  border-right: ${CHAPTERS_MARK_WIDTH}px solid rgba(255,255,255,.7);
                  margin-left: -${CHAPTERS_MARK_WIDTH}px;
               }`);

            return document.getElementById(SELECTOR_ID);
         })();
      }

   },
   options: {
      player_float_progress_bar_height: {
         _tagName: 'input',
         label: 'Height',
         type: 'number',
         title: 'in pixels',
         placeholder: 'px',
         min: 1,
         max: 9,
         value: 3,
      },
      player_float_progress_bar_opacity: {
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
