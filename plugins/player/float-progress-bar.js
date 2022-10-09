// for test
// https://www.youtube.com/embed/yWUMMg3dmFY?wmode=opaque&amp;rel=0&amp;controls=0&amp;modestbranding=1&amp;showinfo=0&amp;enablejsapi=1 - embed when disable chrome-bottom
// https://radio.nv.ua/online-radio-nv - live embed

window.nova_plugins.push({
   id: 'player-float-progress-bar',
   title: 'Float player progress bar',
   'title:zh': '浮动播放器进度条',
   'title:ja': 'フロートプレーヤーのプログレスバー',
   'title:ko': '플로팅 플레이어 진행률 표시줄',
   'title:id': 'Bilah kemajuan pemain mengambang',
   'title:es': 'Barra de progreso flotante del jugador',
   'title:pt': 'Barra de progresso do jogador flutuante',
   'title:fr': 'Barre de progression du joueur flottant',
   'title:it': 'Barra di avanzamento del giocatore mobile',
   'title:tr': 'Kayan oyuncu ilerleme çubuğu',
   'title:de': 'Float-Player-Fortschrittsbalken',
   'title:pl': 'Pływający pasek postępu odtwarzacza',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // Doesn't work in embed - movie_player.getVideoData().isLive
      if (NOVA.currentPage == 'embed' && window.self.location.href.includes('live_stream')) return;

      const
         SELECTOR_ID = 'nova-player-float-progress-bar', // Do not forget patch plugin "player-control-autohide"
         SELECTOR = '#' + SELECTOR_ID,
         CHAPTERS_MARK_WIDTH_PX = '2px';

      NOVA.waitElement('video')
         .then(async video => {
            const
               // async fix embed when disable chrome-bottom
               chromeBtn = await NOVA.waitUntil(() => document.querySelector('.ytp-chrome-bottom')),
               container = renderFloatBar(chromeBtn),
               bufferEl = document.getElementById(`${SELECTOR_ID}-buffer`),
               progressEl = document.getElementById(`${SELECTOR_ID}-progress`);

            renderChapters.init(video); // init

            // resetBar on new video loaded
            video.addEventListener('loadeddata', resetBar);
            document.addEventListener('yt-navigate-finish', resetBar);

            // render progress
            // NOVA.waitElement(`${SELECTOR}-progress`)
            //    .then(progressEl => {
            video.addEventListener('timeupdate', function () {
               if (document.visibilityState == 'hidden' // tab inactive
                  || movie_player.getVideoData().isLive) return;

               // Strategy 1 HTML5
               if (!isNaN(this.duration)) {
                  progressEl.style.transform = `scaleX(${this.currentTime / this.duration})`;
               }
               // Strategy 2
               // if (!isNaN(movie_player.getDuration())) {
               //    progressEl.style.transform = `scaleX(${movie_player.getCurrentTime() / movie_player.getDuration()})`;
               // }
            });
            // });

            // render buffer
            // NOVA.waitElement(`${SELECTOR}-buffer`)
            //    .then(bufferEl => {
            video.addEventListener('progress', renderBuffer.bind(video));
            video.addEventListener('seeking', renderBuffer.bind(video));

            function renderBuffer() {
               if (document.visibilityState == 'hidden' // tab inactive
                  || movie_player.getVideoData().isLive) return;

               // Strategy 1 HTML5
               // for (let i = 0; i < this.buffered.length; i++) {
               //    //    const bufferedSeconds = this.buffered.end(0) - this.buffered.start(0);
               //    //    console.debug(`${bufferedSeconds} seconds of video are ready to play.`);
               //    if (!isNaN(this.duration) && this.currentTime > this.buffered.start(i)) {
               //       bufferEl.style.transform = `scaleX(${this.buffered.end(i) / this.duration})`;
               //    }
               // }

               // Strategy 2
               if ((totalDuration = movie_player.getDuration()) && !isNaN(totalDuration)) {
                  bufferEl.style.transform = `scaleX(${
                     (movie_player.getVideoBytesLoaded() / totalDuration) * totalDuration
                     })`;
               }
            }
            // });

            function resetBar() {
               // hide if is stream.
               container.style.display = movie_player.getVideoData().isLive ? 'none' : 'initial'; // style.visibility - overridden

               // reset animation state
               container.classList.remove('transition');
               bufferEl.style.transform = 'scaleX(0)';
               progressEl.style.transform = 'scaleX(0)';
               container.classList.add('transition');

               renderChapters.init(video);
            }

         });

      function renderFloatBar(chrome_btn) {
         return document.getElementById(SELECTOR_ID) || (function () {
            movie_player?.insertAdjacentHTML('beforeend',
               `<div id="${SELECTOR_ID}" class="transition">
                  <div class="conteiner">
                     <div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
                     <div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color"></div>
                  </div>
                  <div id="${SELECTOR_ID}-chapters"></div>
               </div>`);

            const zIndex = (chrome_btn && chrome_btn instanceof HTMLElement)
               ? getComputedStyle(chrome_btn)['z-index'] : 60;
            // const bufferColor = getComputedStyle(document.querySelector('.ytp-load-progress'))['background-color'] || 'rgba(255,255,255,.4)';

            NOVA.css.push(
               `[id|=${SELECTOR_ID}] {
                  position: absolute;
                  bottom: 0;
               }

               ${SELECTOR} {
                  --opacity: ${+user_settings.player_float_progress_bar_opacity || .7};
                  --height: ${+user_settings.player_float_progress_bar_height || 3}px;
                  --bg-color: ${getComputedStyle(document.querySelector('.ytp-progress-list'))['background-color'] || 'rgba(255,255,255,.2)'};
                  --zindex: ${zIndex};

                  opacity: var(--opacity)
                  z-index: var(--zindex);
                  background-color: var(--bg-color);
                  width: 100%;
                  visibility: hidden;
               }

               /*.ytp-chrome-bottom[hidden],*/
               .ytp-autohide ${SELECTOR} {
                  visibility: visible;
               }

               /*${SELECTOR} .conteiner {
                  position: relative;
                  margin: 0 15px;
               }*/

               ${SELECTOR}.transition [id|=${SELECTOR_ID}] {
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
                  justify-content: flex-end;
               }

               ${SELECTOR}-chapters span {
                  height: var(--height);
                  z-index: ${+zIndex + 1};
                  border-left: ${CHAPTERS_MARK_WIDTH_PX} solid rgba(255,255,255,.7);
                  /* border-left: ${CHAPTERS_MARK_WIDTH_PX} solid #000; */
                  margin-left: -${CHAPTERS_MARK_WIDTH_PX};
               }`);

            return document.getElementById(SELECTOR_ID);
         })();
      }

      const renderChapters = {
         async init(vid) {
            if (NOVA.currentPage == 'watch' && !(vid instanceof HTMLElement)) return console.error('vid not HTMLElement:', chaptersContainer);

            switch (NOVA.currentPage) {
               case 'watch':
                  await NOVA.waitUntil(() => !isNaN(vid.duration), 1000) // panel hides for a few seconds. No need to hurry
                  this.from_description(vid.duration);
                  break;

               // embed dont have description
               case 'embed':
                  await NOVA.waitUntil(() => (chaptersContainer = document.body.querySelector('.ytp-chapters-container')) && chaptersContainer?.children.length, 1000) // panel hides for a few seconds. No need to hurry
                  this.from_div(chaptersContainer);
                  break;
            }
         },

         from_description(duration = required()) {
            if (Math.sign(duration) !== 1) return console.error('duration not positive number:', duration);
            // <a href="/playlist?list=XX"> - erroneous filtering "t=XX" without the character "&"
            const selectorTimestampLink = 'a[href*="&t="]';
            // search in description
            NOVA.waitElement(`#primary-inner #description ${selectorTimestampLink}`)
               .then(() => renderChaptersMarks(duration));

            // search in first/pinned comment
            NOVA.waitElement(`#comments ytd-comment-thread-renderer:first-child #content ${selectorTimestampLink}`)
               .then(() => renderChaptersMarks(duration));

            function renderChaptersMarks(duration) {
               // console.debug('renderChaptersMarks', ...arguments);
               if (chaptersConteiner = document.getElementById(`${SELECTOR_ID}-chapters`)) {
                  chaptersConteiner.innerHTML = ''; // clear old
                  // if (!isNaN(duration)) {
                  NOVA.getChapterList(duration)
                     ?.forEach((chapter, i, chapters_list) => {
                        // console.debug('chapter', (newChapter.sec / duration) * 100 + '%');
                        const newChapter = document.createElement('span');
                        const nextChapterSec = chapters_list[i + 1]?.sec || duration;

                        newChapter.style.width = ((nextChapterSec - chapter.sec) / duration) * 100 + '%';
                        if (chapter.title) newChapter.title = chapter.title;
                        newChapter.setAttribute('time', chapter.time);

                        chaptersConteiner.append(newChapter);
                     });
                  // }
               }
            }
         },

         from_div(chaptersContainer = required()) {
            if (!(chaptersContainer instanceof HTMLElement)) return console.error('container not HTMLElement:', chaptersContainer);
            const
               progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width),
               chaptersConteiner = document.getElementById(`${SELECTOR_ID}-chapters`);

            for (const chapter of chaptersContainer.children) {
               const
                  newChapter = document.createElement('span'),
                  { width, marginLeft, marginRight } = getComputedStyle(chapter), // chapterWidth = width
                  chapterMargin = parseInt(marginLeft) + parseInt(marginRight);

               newChapter.style.width = (((width + chapterMargin) / progressContainerWidth) * 100) + '%';

               chaptersConteiner.append(newChapter);
            }
         },
      };

   },
   options: {
      player_float_progress_bar_height: {
         _tagName: 'input',
         label: 'Height',
         'label:zh': '高度',
         'label:ja': '身長',
         'label:ko': '키',
         'label:id': 'Tinggi',
         'label:es': 'Altura',
         'label:pt': 'Altura',
         'label:fr': 'Hauteur',
         'label:it': 'Altezza',
         'label:tr': 'Yükseklik',
         'label:de': 'Höhe',
         'label:pl': 'Wysokość',
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
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         'label:ko': '불투명',
         'label:id': 'Kegelapan',
         'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         'label:it': 'Opacità',
         'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         'label:pl': 'Przejrzystość',
         type: 'number',
         // title: '',
         placeholder: '0-1',
         step: .05,
         min: 0,
         max: 1,
         value: .7,
      },
   }
});
