window.nova_plugins.push({
   id: 'auto-buffer',
   title: 'Video preloading/buffering',
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
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'When paused, progress well show incorrect',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:vi': '',
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

      const maxBufferSec = (user_settings.auto_buffer_sec || 60); // 60sec

      const SELECTOR_CLASS_NAME = 'buffered';

      NOVA.css.push(
         `.${SELECTOR_CLASS_NAME} .ytp-swatch-background-color {
            background-color: ${user_settings.auto_buffer_color || '#ffa000'} !important;
         }`);

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            let saveCurrentTime = false;
            let isLive;

            // reset saveCurrentTime
            video.addEventListener('loadeddata', () => {
               saveCurrentTime = false;
               isLive = movie_player.getVideoData().isLive;
            });

            video.addEventListener('play', function () {
               if (!this.paused && saveCurrentTime !== false) {
                  // console.debug('play', saveCurrentTime);
                  // console.debug('restore currentTime', saveCurrentTime);
                  this.currentTime = saveCurrentTime;
                  saveCurrentTime = false;
                  movie_player.classList.remove(SELECTOR_CLASS_NAME);
               }
            });

            // document.addEventListener('keyup', evt => {
            document.addEventListener('keydown', evt => {
               if (!video.paused || !saveCurrentTime) return;

               if (NOVA.currentPage != 'watch' && NOVA.currentPage != 'embed') return;

               // movie_player.contains(document.activeElement) // don't use! stay overline
               if (['input', 'textarea', 'select'].includes(evt.target.localName) || evt.target.isContentEditable) return;
               // if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;

               if (evt.code == 'ArrowLeft' || evt.code == 'ArrowRight') reSaveTime();
            });

            document.addEventListener('click', evt => {
               if (evt.isTrusted
                  && video.paused && saveCurrentTime
                  && evt.target.closest('.ytp-progress-bar')
               ) {
                  reSaveTime();
               }
            });

            function reSaveTime() {
               movie_player.classList.add(SELECTOR_CLASS_NAME);
               // if (video.paused && saveCurrentTime) {
               saveCurrentTime = video.currentTime;
               // }
            }

            // video.addEventListener('seeked', function () {
            //    if (this.paused
            //       && saveCurrentTime
            //       // && (this.currentTime > (saveCurrentTime + maxBufferSec))
            //       // && (this.currentTime < saveCurrentTime)
            //    ) {
            //       movie_player.classList.add(SELECTOR_CLASS_NAME);
            //       // console.debug('seeking');
            //       // saveCurrentTime = false;
            //    }
            // });

            // prevent update progressbar
            // video.addEventListener('timeupdate', function (evt) {
            //    console.debug('timeupdate', this.paused, saveCurrentTime);
            //    // save
            //    if (saveCurrentTime !== false) {
            //       if (el = document.body.querySelector('.ytp-chrome-bottom .ytp-swatch-background-color')) {
            //          // el.classList.add('a332');
            //          // restore
            //          // Object.assign(el.style, {
            //          //    position: 'absolute',
            //          //    left: 0,
            //          //    bottom: 0,
            //          //    width: '100%',
            //          //    height: '100%',
            //          //    'transform-origin': '0 0',
            //          //    'z-index': 34,
            //          // });
            //          el.classList.remove('ytp-play-progress');
            //          console.debug('saveCurrentTime / this.duration', saveCurrentTime / this.duration);
            //          // el.style.transform = `scaleX(${saveCurrentTime / this.duration})`;
            //       }
            //    }
            //    // restore
            //    else if (this.paused
            //       && saveCurrentTime === false
            //       // && document.body.querySelector('.ytp-play-progress').classList.contains('a332')
            //    ) {
            //       document.body.querySelector('.ytp-chrome-bottom .ytp-swatch-background-color[style]').classList.add('ytp-play-progress');
            //    }
            // });

            video.addEventListener('pause', recordBuffer.bind(video));
            video.addEventListener('progress', recordBuffer.bind(video));

            // autoBuffer
            function recordBuffer() {
               if (!this.paused || !this.buffered?.length) return; // not start buffered yet

               // Strategy 1
               // for (let i = 0; i < this.buffered.length; i++) {
               //    if (this.currentTime > this.buffered.start(i)) {
               //       bufferedEnd = this.buffered.start(i);
               //       bufferedSeconds = this.currentTime - bufferedEnd;
               //       break;
               //    }
               // }
               // Strategy 2
               const bufferedSeconds = this.currentTime - this.buffered.start(this.buffered.length - 1);
               // const duration = player.getDuration();
               // movie_player.getVideoLoadedFraction() === (movie_player.getVideoBytesLoaded() / movie_player.getVideoBytesTotal());

               if (bufferedSeconds > maxBufferSec) {
                  this.currentTime = saveCurrentTime;
                  movie_player.classList.remove(SELECTOR_CLASS_NAME);
                  return;
               }

               if (!isLive || !isNaN(this.duration)) {
                  // const bufferedPercent = movie_player.getDuration() * movie_player.getVideoLoadedFraction();
                  const bufferedPercent = bufferedSeconds / this.duration;
                  // percent = Math.min(1, Math.max(0, bufferedPercent) * 100;

                  // stop hit 90%
                  if (bufferedPercent > .9) {
                     movie_player.classList.remove(SELECTOR_CLASS_NAME);
                     return;
                  }
               }

               // save saveCurrentTime
               if (saveCurrentTime === false) {
                  movie_player.classList.add(SELECTOR_CLASS_NAME);
                  // movie_player.seekTo(bufferedSeconds);
                  // movie_player.pauseVideo();
                  // saveCurrentTime = movie_player.getCurrentTime();
                  saveCurrentTime = this.currentTime;
                  // console.debug('recordBuffer:', saveCurrentTime);
               }

               this.currentTime = this.buffered.end(this.buffered.length - 1);
               // movie_player.seekTo(movie_player.getVideoLoadedFraction());

               // currentTime = this.currentTime;
               // bufferEl.style.transform = `scaleX(${this.buffered.end(i) / this.duration})`;
               // bufferEl.style.transform = `scaleX(${movie_player.getVideoLoadedFraction()})`;
               // }
            }
         });

   },
   options: {
      auto_buffer_sec: {
         _tagName: 'input',
         label: 'Sec',
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
         type: 'number',
         title: 'buffer time',
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
         placeholder: '10-300',
         step: 5,
         min: 30,
         max: 300, // 5min
         value: 60,
      },
      auto_buffer_color: {
         _tagName: 'input',
         type: 'color',
         value: '#ffa000',
         label: 'Color',
         'label:zh': '颜色',
         'label:ja': '色',
         // 'label:ko': '색깔',
         // 'label:vi': '',
         // 'label:id': 'Warna',
         // 'label:es': 'Color',
         'label:pt': 'Cor',
         'label:fr': 'Couleur',
         // 'label:it': 'Colore',
         // 'label:tr': 'Renk',
         'label:de': 'Farbe',
         'label:pl': 'Kolor',
         'label:ua': 'Колір',
         // title: 'default - #ff0000',
      },
   }
});
