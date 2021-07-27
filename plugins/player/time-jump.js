// for test:
// https://www.youtube.com/watch?v=Xt2sbtvBuk8 - There are timestamp but no chapters: Еhree-digit time
// https://www.youtube.com/watch?v=egAB2qtVWFQ - chapter title ahead of timestamp

window.nova_plugins.push({
   id: 'time-jump',
   title: 'Time jump',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      YDOM.waitElement('#movie_player')
         .then(player => {
            doubleKeyPressListener(jumpTime.bind(player), user_settings.time_jump_hotkey);

            if (user_settings.time_jump_title_offset) {
               addTitleOffset.apply(player);
            }
         });

      function jumpTime() {
         if (document.activeElement.tagName.toLowerCase() !== 'input' // search-input
            && !document.activeElement.isContentEditable // comment-area
         ) {
            const chapterList = getChapterList();
            console.debug('chapterList', chapterList);
            let msg;
            // if has chapters
            if (document.querySelectorAll('.ytp-chapter-hover-container')?.length > 1 && chapterList?.length) {
               const nextChapterIndex = chapterList?.findIndex(c => c?.seconds >= this.getCurrentTime());
               this.seekToChapterWithAnimation(nextChapterIndex);
               msg = `Chapter • ` + (document.querySelector('.ytp-chapter-title-content')?.textContent // querySelector after seek
                  || chapterList[nextChapterIndex].name) + ` (${chapterList[nextChapterIndex].time})`;
               // console.debug(`nextChapter(1): ${this.getCurrentTime()} jump to ${chapterList[nextChapterIndex]}`);

            } else if (chapterList?.length) {
               const nextChapterData = chapterList?.find(c => c?.seconds >= this.getCurrentTime());
               // console.debug(`nextChapter(2): jump from ${this.getCurrentTime()} to ${nextChapterData.seconds} sec`);
               this.seekTo(nextChapterData.seconds);
               msg = `Chapter • ${nextChapterData.name} (${nextChapterData.time})`;

            } else {
               this.seekBy(+user_settings.time_jump_step);
               msg = `+${user_settings.time_jump_step} sec (${YDOM.formatDuration(this.getCurrentTime())})`;
            }

            YDOM.bezelTrigger(msg); // trigger default indicator
         }

         // function getNextChapterIndex() {
         function getChapterList() {
            let prevTime = -1;
            return [...document.getElementById('description')?.textContent.matchAll(/(\d{2,}:\d{2,}(:\d{2,})?)(.+$)?/gm)]
               .map((curr, i, array) => {
                  // const prev = array[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
                  const currTime = hmsToSecondsOnly(curr[1]);
                  if (currTime > prevTime) {
                     prevTime = currTime;
                     return {
                        index: ++i,
                        seconds: currTime,
                        time: curr[1],
                        name: curr[3]?.toString().trim(),
                     }
                  }
               });

            function hmsToSecondsOnly(str) {
               const p = str.split(':');
               let = s = 0, m = 1;

               while (p.length) {
                  s += m * parseInt(p.pop(), 10);
                  m *= 60;
               }
               return s;
            }
         }
      }

      function addTitleOffset() {
         YDOM.css.push(
            `.ytp-tooltip-text:after {
            content: attr(data-before);
            color: #ffcc00;
         }`);
         // color: ${YDOM.css.getValue({ selector: '.ytp-swatch-background-color', property: 'background-color' }) || '#f00'};

         YDOM.waitElement('.ytp-progress-bar')
            .then(progressContainer => {
               if (tooltipEl = document.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', () => {
                     const
                        cursorTime = tooltipEl.textContent.split(':').reduce((acc, time) => (60 * acc) + parseInt(time)),
                        offsetTime = cursorTime - this.getCurrentTime(),
                        sign = offsetTime >= 1 ? '+' : Math.sign(offsetTime) === -1 ? '-' : '';
                     // updateOffsetTime
                     tooltipEl.setAttribute('data-before', ` ${sign + YDOM.formatDuration(offsetTime)}`);
                  });

                  progressContainer.addEventListener('mouseleave', function hideOffsetTime() {
                     tooltipEl.removeAttribute('data-before');
                  });
               }
            })
      }

      function doubleKeyPressListener(callback, keyCodeFilter) {
         let
            pressed,
            isDoublePress,
            lastPressed = parseInt(keyCodeFilter) || null;

         const
            timeOut = () => setTimeout(() => isDoublePress = false, 500),
            handleDoublePresss = key => {
               // console.debug(key.key, 'pressed two times');
               if (callback && typeof callback === 'function') return callback(key);
            };

         function keyPress(key) {
            pressed = key.keyCode;
            // console.debug('doubleKeyPressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);
            if (isDoublePress && pressed === lastPressed) {
               isDoublePress = false;
               handleDoublePresss(key);
            } else {
               isDoublePress = true;
               timeOut();
            }

            if (!keyCodeFilter) lastPressed = pressed;
         }
         document.addEventListener('keyup', keyPress);
      }

   },
   options: {
      time_jump_step: {
         _tagName: 'input',
         label: 'Step time',
         type: 'number',
         title: 'in seconds',
         placeholder: 'sec',
         min: 3,
         max: 300,
         value: 30,
      },
      time_jump_hotkey: {
         _tagName: 'select',
         label: 'Hotkey (double tap)',
         options: [
            // https://css-tricks.com/snippets/javascript/javascript-keycodes/
            { label: 'alt', value: 18 },
            { label: 'shift', value: 16 },
            { label: 'ctrl', value: 17, selected: true },
         ],
      },
      time_jump_title_offset: {
         _tagName: 'input',
         label: 'Show time offset on progress bar',
         type: 'checkbox',
         title: 'Time offset from current playback time',
         // title: 'When you hover offset current playback time',
      },
   },
});
