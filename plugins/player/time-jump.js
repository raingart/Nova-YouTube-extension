// onomal behavior. There are time markers but no chapters:
// https://www.youtube.com/watch?v=z1gaUI9gBdk

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
               addTitleOffset(player.getCurrentTime());
            }
         });

      function jumpTime() {
         if (document.activeElement.tagName.toLowerCase() !== 'input' // search-input
            && !document.activeElement.isContentEditable // comment-area
         ) {
            let msg;
            if (document.querySelectorAll('.ytp-chapter-hover-container')?.length > 1 // check for chapters
               && (chapterIndex = getNextChapterIndex(this.getCurrentTime()))
            ) {
               this.seekToChapterWithAnimation(chapterIndex);
               const chapterName = document.querySelector('.ytp-chapter-title-content')?.textContent // after seek
                  || (chapterIndex + 1);  // numbering does not start from 0
               msg = `Chapter • ` + chapterName;

            } else {
               this.seekBy(+user_settings.time_jump_step);
               msg = `+${user_settings.time_jump_step} sec (${YDOM.formatDuration(this.getCurrentTime())})`;
            }

            YDOM.bezelTrigger(msg); // trigger default indicator
         }

         function getNextChapterIndex(current_time) {
            let prevTime = -1;
            const chapterList = (window.ytplayer?.config?.args.raw_player_response.videoDetails.shortDescription
               || document.getElementById('description')?.textContent)
               .match(/(\d+:\d+)/g) // get time
               ?.map((curr, i, array) => { // controversial point. Drops time stamps without chronology
                  // const prev = array[i-1] || -1; // needs to be called "hmsToSecondsOnly" again. What's not optimized
                  const currTime = hmsToSecondsOnly(curr);
                  // console.debug('>', currTime, prevTime);
                  if (currTime > prevTime) {
                     prevTime = currTime;
                     return currTime;
                  }
               }); // sec
            console.debug('chapterList', chapterList);

            nextChapterIndex = chapterList?.findIndex(c => c >= current_time);
            // console.debug('nextChapter', current_time, ' jump to ', chapterList[nextChapterIndex], `(${nextChapterIndex})`);
            return nextChapterIndex;

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

      function addTitleOffset(current_time) {
         YDOM.css.push(
            `.ytp-tooltip-text:after {
            content: attr(data-before);
            color: #ffcc00;
         }`);
         // color: ${YDOM.css.getValue({ selector: '.ytp-swatch-background-color', property: 'background-color' }) || '#f00'};

         YDOM.waitElement('.ytp-progress-bar')
            .then(progressContainer => {
               if (tooltipEl = document.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', function updateOffsetTime() {
                     const
                        cursorTime = tooltipEl.textContent.split(':').reduce((acc, time) => (60 * acc) + parseInt(time)),
                        offsetTime = cursorTime - +current_time,
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
