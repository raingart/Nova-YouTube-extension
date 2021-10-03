// for test:
// https://www.youtube.com/watch?v=Xt2sbtvBuk8 - have timestamps but no chapters: Еhree-digit time
// https://www.youtube.com/watch?v=egAB2qtVWFQ - chapter title ahead of timestamp
// https://www.youtube.com/watch?v=E-6gg0xKTPY - lying timestamp
// https://www.youtube.com/watch?v=gaZDIQ3Zptk - lying timestamp. Filtering by channel author is possible?
// https://www.youtube.com/watch?v=SgQ_Jk49FRQ - timestamp in pinned comment
// https://www.youtube.com/watch?v=hLXIK9DBxAo - very long timestamp line
// https://www.youtube.com/watch?v=IR0TBQV147I = very-long Еhree-digit time
// https://www.youtube.com/embed/JxTyMVPaOXY?autoplay=1 - embed test

window.nova_plugins.push({
   id: 'time-jump',
   title: 'Time jump',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Use to skip ad inserts',
   _runtime: user_settings => {

      if (user_settings.time_jump_title_offset) addTitleOffset();

      switch (NOVA.currentPageName()) {
         case 'watch':
            let chapterList;

            // reset chapterList
            NOVA.waitElement('video')
               .then(video => video.addEventListener('loadeddata', () => chapterList = []));

            NOVA.waitElement('#movie_player')
               .then(player => {
                  doubleKeyPressListener(jumpTime.bind(player), user_settings.time_jump_hotkey);

                  function jumpTime() {
                     if (chapterList !== null && !chapterList?.length) { // null - chapterList is init: skiping
                        chapterList = NOVA.getChapterList(this.getDuration()) || null;
                        // console.debug('chapterList:', chapterList);
                     }
                     const nextChapterIndex = chapterList?.findIndex(c => c?.sec > this.getCurrentTime());
                     // console.debug('nextChapterIndex', nextChapterIndex);
                     let msg;
                     if (chapterList?.length && nextChapterIndex !== -1) { // if chapters not ended
                        // if has chapters
                        if (document.querySelectorAll('.ytp-chapter-hover-container')?.length > 1) {
                           // console.debug(`nextChapterIndex jump [${nextChapterIndex}] ${this.getCurrentTime()?.toFixed(0)} > ${chapterList[nextChapterIndex].sec}sec`);
                           this.seekToChapterWithAnimation(nextChapterIndex);

                           msg = document.querySelector('.ytp-chapter-title-content')?.textContent // querySelector after seek
                              || chapterList[nextChapterIndex].title;
                           msg += ' • ' + chapterList[nextChapterIndex].time;

                        } else {
                           const nextChapterData = chapterList?.find(c => c?.sec >= this.getCurrentTime());
                           // console.debug(`nextChapterData jump [${nextChapterData.index}] ${this.getCurrentTime()?.toFixed(0)} > ${nextChapterData.sec}sec`);
                           this.seekTo(nextChapterData.sec);

                           msg = nextChapterData.title + ' • ' + nextChapterData.time;
                        }

                     } else {
                        this.seekBy(+user_settings.time_jump_step);

                        msg = `+${user_settings.time_jump_step} sec • ` + NOVA.timeFormatTo.HMS_digit(this.getCurrentTime());
                     }

                     NOVA.bezelTrigger(msg); // trigger default indicator
                  }
               });
            break;

         case 'embed':
            NOVA.waitElement('video')
               .then(video => {
                  doubleKeyPressListener(jumpTime.bind(video), user_settings.time_jump_hotkey);

                  function jumpTime() {
                     let sec = +user_settings.time_jump_step + this.currentTime;

                     if (sec = seekToNextChapter.apply(this)) {
                        // wait chapter-title update
                        document.querySelector('.ytp-chapter-title-content')
                           ?.addEventListener("DOMNodeInserted", ({ target }) => {
                              NOVA.bezelTrigger(
                                 target.textContent + ' • ' + NOVA.timeFormatTo.HMS_digit(video.currentTime)
                              );// trigger default indicator
                           }, { capture: true, once: true });
                     } else {
                        NOVA.bezelTrigger(`+${user_settings.time_jump_step} sec`); // trigger default indicator
                     }
                     // console.debug('seekTo', sec);
                     this.currentTime = sec;

                     function seekToNextChapter() {
                        if ((chapterscontainer = document.querySelector('.ytp-chapters-container'))
                           && chapterscontainer?.children.length > 1
                           && (progressContainerWidth = parseInt(NOVA.css.getValue({ selector: chapterscontainer, property: 'width' })))
                        ) {
                           const progressRatio = this.currentTime / this.duration;
                           let passedWidth = 0;
                           for (const chapter of chapterscontainer.children) {
                              const
                                 chapterWidth = parseInt(NOVA.css.getValue({ selector: chapter, property: 'width' })),
                                 сhapterRatio = (passedWidth + chapterWidth) / progressContainerWidth,
                                 chapterMargin = parseInt(NOVA.css.getValue({ selector: chapter, property: 'margin-left' }))
                                    + parseInt(NOVA.css.getValue({ selector: chapter, property: 'margin-right' }));

                              // console.debug('сhapter', сhapterRatio, chapterWidth);
                              if (сhapterRatio >= progressRatio && сhapterRatio < 1) {
                                 return Math.floor(сhapterRatio * this.duration) + chapterMargin + 1;
                              }
                              // accumulate passed
                              passedWidth += chapterWidth + chapterMargin;
                           }
                           // console.debug('passedWidth', 'total=' + passedWidth, 'chapter count=' + chapterscontainer?.children.length, progressContainerWidth, '/', progressRatio);
                        }
                     }
                  }
               });
            break;
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
                        offsetTime = cursorTime - document.querySelector('video').currentTime,
                        sign = offsetTime >= 1 ? '+' : Math.sign(offsetTime) === -1 ? '-' : '';
                     // updateOffsetTime
                     tooltipEl.setAttribute('data-before', ` ${sign + NOVA.timeFormatTo.HMS_digit(offsetTime)}`);
                  });
                  // hide titleOffset
                  progressContainer.addEventListener('mouseleave', () => tooltipEl.removeAttribute('data-before'));
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
         label: 'Hotkey (double click)',
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
