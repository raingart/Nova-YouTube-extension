// for test
// https://www.youtube.com/embed/yWUMMg3dmFY?wmode=opaque&amp;rel=0&amp;controls=0&amp;modestbranding=1&amp;showinfo=0&amp;enablejsapi=1 - embed when disable chrome-bottom
// https://radio.nv.ua/online-radio-nv - live embed

// Chapters not indicated in the description block
// https://www.youtube.com/watch?v=PtSNcZLyNaU

window.nova_plugins.push({
   id: 'player-float-progress-bar',
   // title: 'Sticky progress bar',
   title: 'Float player progress bar',
   'title:zh': '浮动播放器进度条',
   'title:ja': 'フロートプレーヤーのプログレスバー',
   'title:ko': '플로팅 플레이어 진행률 표시줄',
   'title:id': 'Bilah kemajuan pemain mengambang',
   'title:es': 'Barra de progreso flotante del jugador',
   'title:pt': 'Barra de progresso do jogador flutuante',
   'title:fr': 'Barre de progression du joueur flottant',
   'title:it': 'Barra di avanzamento del giocatore mobile',
   // 'title:tr': 'Kayan oyuncu ilerleme çubuğu',
   'title:de': 'Float-Player-Fortschrittsbalken',
   'title:pl': 'Pływający pasek postępu odtwarzacza',
   'title:ua': 'Плаваючий індикатор прогресу відтворення',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: '',
   // 'data-conflict': 'description-expand',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/434990-youtube-always-show-progress-bar-forked
      // alt2 - https://greasyfork.org/en/scripts/30046-youtube-always-show-progress-bar
      // alt3 - https://chrome.google.com/webstore/detail/dammfdepmngjjoidfdbhkjboecgceamb
      // alt4 - https://greasyfork.org/en/scripts/394512-youtube-progressbar-preserver
      // alt5 - https://chrome.google.com/webstore/detail/ogkoifddpkoabehfemkolflcjhklmkge
      // alt6 - https://greasyfork.org/en/scripts/426283-youtube-permanent-progressbar
      // alt7 - https://greasyfork.org/en/scripts/466345-stick-youtube-progress-bar

      if (NOVA.currentPage == 'embed') {
         if (
            // live iframe
            window.self.location.href.includes('live_stream') //|| movie_player.getVideoData().isLive)
            // skip embed when disable chrome - bottom(example: https://www.youtube.com/embed/yWUMMg3dmFY?controls=0)
            || ['0', 'false'].includes(NOVA.queryURL.get('controls'))
         ) {
            return;
         }
      }

      const
         SELECTOR_CONTAINER = '#movie_player.ytp-autohide',
         SELECTOR_ID = 'nova-player-float-progress-bar', // Do not forget patch plugin [player-control-autohide]
         SELECTOR = '#' + SELECTOR_ID,
         CHAPTERS_MARK_WIDTH_PX = '2px';

      NOVA.waitSelector(`${SELECTOR_CONTAINER} video`)
         .then(video => {
            const
               container = insertFloatBar({
                  'init_container': movie_player,
                  'z_index': Math.max(NOVA.css.getValue('.ytp-chrome-bottom', 'z-index'), 59)
               }),
               bufferEl = document.getElementById(`${SELECTOR_ID}-buffer`),
               progressEl = document.getElementById(`${SELECTOR_ID}-progress`);

            renderChapters.init(video); // init
            // resetBar();

            // resetBar on new video loaded
            // video.addEventListener('play', resetBar); // fix: live_stream visibility
            video.addEventListener('loadeddata', resetBar);
            document.addEventListener('yt-navigate-finish', resetBar);

            // render progress
            // NOVA.waitSelector(`${SELECTOR}-progress`)
            //    .then(progressEl => {
            video.addEventListener('timeupdate', function () {
               if (notInteractiveToRender()) return;

               // Strategy 1 HTML
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
            // NOVA.waitSelector(`${SELECTOR}-buffer`)
            //    .then(bufferEl => {
            video.addEventListener('progress', renderBuffer.bind(video));
            video.addEventListener('seeking', renderBuffer.bind(video));

            function renderBuffer() {
               if (notInteractiveToRender()) return;

               // Strategy 1 HTML
               // for (let i = 0; i < this.buffered.length; i++) {
               //    //    const bufferedSeconds = this.buffered.end(0) - this.buffered.start(0);
               //    //    console.debug(`${bufferedSeconds} seconds of video are ready to play.`);
               //    if (!isNaN(this.duration) && this.currentTime > this.buffered.start(i)) {
               //       bufferEl.style.transform = `scaleX(${this.buffered.end(i) / this.duration})`;
               //    }
               // }

               // Strategy 2
               if ((totalDuration = movie_player.getDuration()) && !isNaN(totalDuration)) {
                  // bufferEl.style.transform = `scaleX(${
                  // (movie_player.getVideoBytesLoaded() / totalDuration) * totalDuration
                  // })`;
                  bufferEl.style.transform = `scaleX(${movie_player.getVideoLoadedFraction()})`;
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

            function notInteractiveToRender() {
               return (document.visibilityState == 'hidden' // tab inactive
                  || movie_player.getVideoData().isLive
                  // || !movie_player.classList.contains('ytp-autohide') // dubious optimization hack
               );
            }

         });

      function insertFloatBar({ init_container = movie_player, z_index = 60 }) {
         if (!(init_container instanceof HTMLElement)) {
            return console.error('vid not HTMLElement:', init_container);
         }

         return document.getElementById(SELECTOR_ID) || (function () {
            init_container.insertAdjacentHTML('beforeend',
               `<div id="${SELECTOR_ID}" class="">
                  <div class="container">
                     <div id="${SELECTOR_ID}-buffer" class="ytp-load-progress"></div>
                     <div id="${SELECTOR_ID}-progress" class="ytp-swatch-background-color"></div>
                  </div>
                  <div id="${SELECTOR_ID}-chapters"></div>
               </div>`);

            // const bufferColor = NOVA.css.getValue('.ytp-load-progress', 'background-color') || 'rgba(255,255,255,.4)';

            NOVA.css.push(
               `[id|=${SELECTOR_ID}] {
                  position: absolute;
                  bottom: 0;
               }

               ${SELECTOR} {
                  --opacity: ${+user_settings.player_float_progress_bar_opacity || .7};
                  --height: ${+user_settings.player_float_progress_bar_height || 3}px;
                  --bg-color: ${NOVA.css.getValue('.ytp-progress-list', 'background-color') || 'rgba(255,255,255,.2)'};
                  --zindex: ${z_index};

                  opacity: var(--opacity);
                  z-index: var(--zindex);
                  background-color: var(--bg-color);
                  width: 100%;
                  height: var(--height);
                  visibility: hidden;
               }

               /*.ytp-chrome-bottom[hidden],*/
               ${SELECTOR_CONTAINER} ${SELECTOR} {
                  visibility: visible;
               }

               /*${SELECTOR} .container {
                  position: relative;
                  margin: 0 15px;
               }*/

               ${SELECTOR_CONTAINER} ${SELECTOR}.transition [id|=${SELECTOR_ID}] {
                  transition: transform .2s linear;
               }

               ${SELECTOR}-progress, ${SELECTOR}-buffer {
                  width: 100%;
                  height: 100%;
                  transform-origin: 0 0;
                  transform: scaleX(0);
               }

               ${SELECTOR}-progress {
                  z-index: calc(var(--zindex) + 1);
               }

               /*${SELECTOR}-buffer {
                  background-color: var(--buffer-color);
               }*/

               ${SELECTOR}-chapters {
                  position: relative;
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
               }

               ${SELECTOR}-chapters span {
                  height: var(--height);
                  z-index: calc(var(--zindex) + 1);
                  box-sizing: border-box;
                  padding: 0;
                  margin: 0;
               }

               ${SELECTOR}-chapters span:not(:first-child) {
                  /* border-left: ${CHAPTERS_MARK_WIDTH_PX} solid #000; */
                  border-left: ${CHAPTERS_MARK_WIDTH_PX} solid rgba(255,255,255,.7);
               }`);

            return document.getElementById(SELECTOR_ID);
         })();
      }

      // alt - https://chrome.google.com/webstore/detail/jahmafmcpgdedfjfknmfkhaiejlfdcfc
      const renderChapters = {
         async init(vid) {
            if (NOVA.currentPage == 'watch' && !(vid instanceof HTMLElement)) {
               return console.error('vid not HTMLElement:', chaptersContainer);
            }

            await NOVA.waitUntil(() => !isNaN(vid.duration), 1000); // 1sec

            switch (NOVA.currentPage) {
               case 'watch':
                  // // fix load description
                  // NOVA.waitSelector('#meta [collapsed] #more, [description-collapsed] #description #expand')
                  //    .then(btn => {
                  //       btn.click();
                  //       this.from_description(vid.duration);
                  //    });
                  this.from_description(vid.duration);
                  break;

               // embed don't have description
               case 'embed':
                  // fix loaded - window.ytPubsubPubsubInstance and chaptersContainer to from_div
                  let chaptersContainer;
                  await NOVA.waitUntil(() => (
                     chaptersContainer = document.body.querySelector('.ytp-chapters-container'))
                     && chaptersContainer?.children.length > 1
                     , 1000); // 1sec

                  this.renderChaptersMarkers(vid.duration) || this.from_div(chaptersContainer);
                  break;
            }
         },

         from_description(duration = required()) {
            if (Math.sign(duration) !== 1) return console.error('duration not positive number:', duration);

            // <a href="/playlist?list=XX"> - erroneous filtering "t=XX" without the character "&"
            const selectorTimestampLink = 'a[href*="&t="]';

            // search in description (#structured-description)
            // NOVA.waitSelector(`ytd-watch-metadata #description #video-lockups a`)
            NOVA.waitSelector(`ytd-watch-metadata #description.ytd-watch-metadata ${selectorTimestampLink}`, { destroy_after_page_leaving: true })
               .then(() => this.renderChaptersMarkers(duration));

            // search in comments
            NOVA.waitSelector(`#comments #comment #comment-content ${selectorTimestampLink}`, { destroy_after_page_leaving: true })
               .then(() => this.renderChaptersMarkers(duration));
            // search in first/pinned comment
            // NOVA.waitSelector(`#comments ytd-comment-thread-renderer:first-child #content ${selectorTimestampLink}`)
            //    .then(() => this.renderChaptersMarkers(duration));
         },

         from_div(chaptersContainer = required()) {
            if (!(chaptersContainer instanceof HTMLElement)) return console.error('container not HTMLElement:', chaptersContainer);
            const
               progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width),
               chaptersOut = document.getElementById(`${SELECTOR_ID}-chapters`);

            for (const chapter of chaptersContainer.children) {
               const
                  newChapter = document.createElement('span'),
                  { width, marginLeft, marginRight } = getComputedStyle(chapter), // chapterWidth = width
                  chapterMargin = parseInt(marginLeft) + parseInt(marginRight);

               // console.debug('chapter', chapter.style.width, width, chapterMargin);
               newChapter.style.width = (((parseInt(width) + chapterMargin) / progressContainerWidth) * 100) + '%';

               chaptersOut.append(newChapter);
            }
         },

         renderChaptersMarkers(duration) {
            // console.debug('renderChaptersMarkers', ...arguments);
            if (isNaN(duration)) return console.error('duration isNaN:', duration);

            if (chaptersContainer = document.getElementById(`${SELECTOR_ID}-chapters`)) {
               chaptersContainer.innerHTML = ''; // clear old
            }
            const chapterList = NOVA.getChapterList(duration);

            // let segmentsList = [];
            // if (user_settings['sponsor-block']) {
            //    const CACHE_PREFIX = 'nova-videos-sponsor-block:';
            //    const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;
            //    if (storage = sessionStorage.getItem(CACHE_PREFIX + videoId)) {
            //       segmentsList = JSON.parse(storage);
            //    }
            // }

            chapterList
               ?.forEach((chapter, i, chapters_list) => {
                  // console.debug('chapter', (newChapter.sec / duration) * 100 + '%');
                  const newChapter = document.createElement('span');
                  const nextChapterSec = chapters_list[i + 1]?.sec || duration;

                  newChapter.style.width = ((nextChapterSec - chapter.sec) / duration) * 100 + '%';
                  if (chapter.title) newChapter.title = chapter.title;
                  newChapter.setAttribute('time', chapter.time);

                  // if (user_settings['sponsor-block'] && segmentsList.length) {
                  //    console.debug('>', segmentsList);
                  //    // newChapter.style.backgroundColor = '';
                  // }

                  chaptersContainer.append(newChapter);
               });

            // console.debug('renderChaptersMarkers', chapterList);
            return chapterList; // return dependency
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
         // 'label:tr': 'Yükseklik',
         'label:de': 'Höhe',
         'label:pl': 'Wysokość',
         'label:ua': 'Висота',
         type: 'number',
         title: 'in pixels',
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
         // 'label:tr': 'Opaklık',
         'label:de': 'Opazität',
         'label:pl': 'Przejrzystość',
         'label:ua': 'Прозорість',
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
