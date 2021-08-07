// for test:
// https://www.youtube.com/watch?v=Xt2sbtvBuk8 - There are timestamp but no chapters: Еhree-digit time
// https://www.youtube.com/watch?v=egAB2qtVWFQ - chapter title ahead of timestamp
// https://www.youtube.com/watch?v=E-6gg0xKTPY - lying timestamp
// https://www.youtube.com/watch?v=SgQ_Jk49FRQ - timestamp in pinned comment

window.nova_plugins.push({
   id: 'time-jump',
   title: 'Time jump',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      let chapterList;

      NOVA.waitElement('#movie_player')
         .then(player => {
            doubleKeyPressListener(jumpTime.bind(player), user_settings.time_jump_hotkey);

            if (user_settings.time_jump_title_offset) addTitleOffset.apply(player);

            NOVA.waitElement('video') // reset chapterList
               .then(video => video.addEventListener('loadeddata', () => chapterList = []));
         });

      function jumpTime() {
         if (chapterList !== null && !chapterList?.length) { // null - chapterList is init: skiping
            chapterList = NOVA.getChapterList(this.getDuration()) || null;
            console.debug('chapterList:', chapterList);
         }
         const nextChapterIndex = chapterList?.findIndex(c => c?.sec >= this.getCurrentTime());
         let msg;
         if (chapterList?.length && nextChapterIndex !== -1) { // if chapters not ended
            // if has chapters
            if (document.querySelectorAll('.ytp-chapter-hover-container')?.length > 1) {
               // console.debug(`nextChapterIndex jump [${nextChapterIndex}] ${this.getCurrentTime()?.toFixed(0)} > ${chapterList[nextChapterIndex].sec}sec`);
               this.seekToChapterWithAnimation(nextChapterIndex);
               msg = `Chapter • ` + (document.querySelector('.ytp-chapter-title-content')?.textContent // querySelector after seek
                  || chapterList[nextChapterIndex].title) + ` (${chapterList[nextChapterIndex].time})`;

            } else {
               const nextChapterData = chapterList?.find(c => c?.sec >= this.getCurrentTime());
               // console.debug(`nextChapterData jump [${nextChapterData.index}] ${this.getCurrentTime()?.toFixed(0)} > ${nextChapterData.sec}sec`);
               this.seekTo(nextChapterData.sec);
               msg = `Chapter • ${nextChapterData.title} (${nextChapterData.time})`;
            }

         } else {
            this.seekBy(+user_settings.time_jump_step);
            msg = `+${user_settings.time_jump_step} sec (${NOVA.timeFormatTo.HMS(this.getCurrentTime())})`;
         }

         NOVA.bezelTrigger(msg); // trigger default indicator
      }

      function addTitleOffset() {
         NOVA.css.push(
            `.ytp-tooltip-text:after {
            content: attr(data-before);
            color: #ffcc00;
         }`);
         // color: ${NOVA.css.getValue({ selector: '.ytp-swatch-background-color', property: 'background-color' }) || '#f00'};

         NOVA.waitElement('.ytp-progress-bar')
            .then(progressContainer => {
               if (tooltipEl = document.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', () => {
                     const
                        cursorTime = tooltipEl.textContent.split(':').reduce((a, t) => (60 * a) + parseInt(t)),
                        offsetTime = cursorTime - this.getCurrentTime(),
                        sign = offsetTime >= 1 ? '+' : Math.sign(offsetTime) === -1 ? '-' : '';
                     // updateOffsetTime
                     tooltipEl.setAttribute('data-before', ` ${sign + NOVA.timeFormatTo.HMS(offsetTime)}`);
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
            if (document.activeElement.tagName.toLowerCase() === 'input' // search-input
               || document.activeElement.isContentEditable // comment-area
            ) return;

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
