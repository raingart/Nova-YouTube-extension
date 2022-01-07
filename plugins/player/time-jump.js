// for test:
// https://www.youtube.com/watch?v=Xt2sbtvBuk8 - have 3-digit timestamps in description, but dont have chapters
// https://www.youtube.com/watch?v=egAB2qtVWFQ - title of chapters before timestamp. Manual chapter numbering
// https://www.youtube.com/watch?v=E-6gg0xKTPY - lying timestamp
// https://www.youtube.com/watch?v=SgQ_Jk49FRQ - timestamp in pinned comment
// https://www.youtube.com/watch?v=tlICDvcCkog - timestamp in pinned comment#2 (bug has 1 chapters blocks). Manual chapter numbering
// https://www.youtube.com/watch?v=hLXIK9DBxAo - very long line of timestamp
// https://www.youtube.com/watch?v=IR0TBQV147I = lots 3-digit timestamp
// https://www.youtube.com/embed/JxTyMVPaOXY?autoplay=1 - embed test

window.nova_plugins.push({
   id: 'time-jump',
   title: 'Time jump',
   'title:zh': '时间跳跃',
   // 'title:ja': 'タイムジャンプ',
   'title:es': 'Salto de tiempo',
   'title:pt': 'Salto no tempo',
   'title:de': 'Zeitsprung',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Use to skip ad inserts',
   'desc:zh': '用于跳过广告插入',
   'desc:ja': '広告の挿入をスキップするために使用',
   'desc:es': 'Úselo para omitir inserciones de anuncios',
   'desc:pt': 'Use para pular inserções de anúncios',
   // 'desc:de': 'Zum Überspringen von Anzeigeninsertionen verwenden',
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
                  doubleKeyPressListener(timeLeap.bind(player), user_settings.time_jump_hotkey);

                  function timeLeap() {
                     if (chapterList !== null && !chapterList?.length) { // null - chapterList is init: skiping
                        chapterList = NOVA.getChapterList(this.getDuration()) || null;
                        // console.debug('chapterList:', chapterList);
                     }
                     const nextChapterIndex = chapterList?.findIndex(c => c?.sec > this.getCurrentTime());
                     // console.debug('nextChapterIndex', nextChapterIndex);
                     let msg;
                     // has chapters and chapters not ended
                     if (chapterList?.length && nextChapterIndex !== -1) {
                        // has chapters blocks (Important! more than 1. See e.g. "(bug has 1 chapters blocks)"
                        if (player.querySelectorAll('.ytp-chapter-hover-container')?.length > 1) {
                           // console.debug(`nextChapterIndex jump [${nextChapterIndex}] ${this.getCurrentTime()?.toFixed(0)} > ${chapterList[nextChapterIndex].sec} sec`);
                           this.seekToChapterWithAnimation(nextChapterIndex);

                           // querySelector update after seek
                           const chapterTitleEl = player.querySelector('.ytp-chapter-title-content');

                           msg = (chapterTitleEl?.textContent || chapterList[nextChapterIndex].title)
                              + ' • ' + chapterList[nextChapterIndex].time;

                           if (chapterTitleEl && user_settings.time_jump_chapters_list_show) {
                              chapterTitleEl.click()
                           }

                        } else { // chapters blocks none, but has timestamp
                           const nextChapterData = chapterList?.find(c => c?.sec >= this.getCurrentTime());
                           // console.debug(`nextChapterData jump [${nextChapterData.index}] ${this.getCurrentTime()?.toFixed(0)} > ${nextChapterData.sec} sec`);
                           this.seekTo(nextChapterData.sec);

                           msg = nextChapterData.title + ' • ' + nextChapterData.time;
                        }

                     } else { // chapters none
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
                  doubleKeyPressListener(timeLeap.bind(video), user_settings.time_jump_hotkey);

                  function timeLeap() {
                     let sec = +user_settings.time_jump_step + this.currentTime;

                     if (sec = seekToNextChapter.apply(this)) {
                        // wait chapter-title update
                        document.body.querySelector('.ytp-chapter-title-content')
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
                        if ((chapterscontainer = document.body.querySelector('.ytp-chapters-container'))
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
               if (tooltipEl = document.body.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', () => {
                     if (document.getElementById('movie_player')?.getVideoData().isLive) return;
                     const
                        cursorTime = tooltipEl.textContent.split(':').reduce((a, t) => (60 * a) + parseInt(t)),
                        offsetTime = cursorTime - document.body.querySelector('video').currentTime,
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
            timeOut = () => setTimeout(() => isDoublePress = false, 500), // 500ms
            handleDoublePresss = key => {
               // console.debug(key.key, 'pressed two times');
               if (callback && typeof callback === 'function') return callback(key);
            };

         function keyPress(key) {
            if (document.activeElement.tagName.toLowerCase() == 'input' // search-input
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
         // 'label:ja': 'ステップ時間',
         'label:zh': '步骤时间',
         'label:es': 'Tiempo de paso',
         'label:pt': 'Tempo da etapa',
         'label:de': 'Schrittzeit',
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
         'label:zh': '热键（双击）',
         'label:ja': 'Hotkey (ダブルプレス)',
         'label:es': 'Tecla de acceso rápido (doble clic)',
         'label:pt': 'Atalho (duplo clique)',
         'label:de': 'Hotkey (Doppelklick)',
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
         'label:zh': '在进度条中显示时间偏移',
         'label:ja': 'プログレスバーに時間オフセットを表示する',
         'label:es': 'Mostrar compensación de tiempo en la barra de progreso',
         'label:pt': 'Mostrar a diferença de tempo na barra de progresso',
         'label:de': 'Zeitverschiebung im Fortschrittsbalken anzeigen',
         type: 'checkbox',
         // title: 'When you hover offset current playback time',
         title: 'Time offset from current playback time',
         'title:zh': '与当前播放时间的时间偏移',
         'title:ja': '現在の再生時間からの時間オフセット',
         'title:es': 'Desfase de tiempo del tiempo de reproducción actual',
         'title:pt': 'Deslocamento de tempo do tempo de reprodução atual',
         'title:de': 'Zeitverschiebung zur aktuellen Wiedergabezeit',
      },
      time_jump_chapters_list_show: {
         _tagName: 'input',
         label: 'Show chapters list block',
         'label:zh': '显示章节列表块',
         'label:ja': 'チャプターリストブロックを表示',
         'label:es': 'Mostrar bloque de lista de capítulos',
         'label:pt': 'Mostrar bloco de lista de capítulos',
         'label:de': 'Kapitellistenblock anzeigen',
         type: 'checkbox',
      },
   },
});
