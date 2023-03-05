// for test:
// CHAPTER without description
// https://www.youtube.com/watch?v=lQPp7xNOoe4

// MANUAL CHAPTER

// timestamp in (description + comment):
// https://www.youtube.com/watch?v=IvZOmE36PLc&lc=UgznihSt34vx093bT9p4AaABAg
// https://www.youtube.com/watch?v=Xt2sbtvBuk8&lc=UgzAWQZfFFq2nzZ4gtp4AaABAg - have 3-digit timestamps

// timestamp in pinned comment:
// https://www.youtube.com/watch?v=SgQ_Jk49FRQ
// https://www.youtube.com/watch?v=tlICDvcCkog
// https://www.youtube.com/watch?v=_-5cYbk-QYI&lc=UgxgHkAhtabuiFsFHAp4AaABAg

// timestamp in description
// https://www.youtube.com/watch?v=hLXIK9DBxAo - title of chapters before timestamp. very long text line of timestamp

// CORRECT CHAPTERS + description:
// https://www.youtube.com/watch?v=egAB2qtVWFQ - title of chapters before timestamp.
// https://www.youtube.com/watch?v=t_fbcgzmxHs - title of chapters before timestamp.
// https://www.youtube.com/watch?v=IR0TBQV147I - lots 3-digit timestamp
// https://www.youtube.com/watch?v=fgMdiwECQSE - brackets
// https://www.youtube.com/embed/JxTyMVPaOXY?autoplay=1 - embed

// false detect:
// https://www.youtube.com/watch?v=Z9ZaEXqjZvw - broken
// https://www.youtube.com/watch?v=E-6gg0xKTPY - lying timestamp

window.nova_plugins.push({
   id: 'time-jump',
   title: 'Time jump',
   'title:zh': '时间跳跃',
   'title:ja': 'タイムジャンプ',
   'title:ko': '시간 점프',
   'title:id': 'Lompatan waktu',
   'title:es': 'Salto de tiempo',
   'title:pt': 'Salto no tempo',
   'title:fr': 'Saut dans le temps',
   'title:it': 'Salto nel tempo',
   // 'title:tr': 'Zaman atlama',
   'title:de': 'Zeitsprung',
   'title:pl': 'Skok czasowy',
   'title:ua': 'Стрибок часу',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: 'Use to skip the intro or ad inserts',
   'desc:zh': '用于跳过介绍或广告插入',
   'desc:ja': 'イントロや広告挿入をスキップするために使用します',
   'desc:ko': '인트로 또는 광고 삽입을 건너뛸 때 사용',
   'desc:id': 'Gunakan untuk melewati intro atau sisipan iklan',
   // 'desc:es': 'Úselo para omitir la introducción o las inserciones de anuncios.',
   'desc:pt': 'Use para pular a introdução ou inserções de anúncios',
   'desc:fr': "Utiliser pour ignorer l'intro ou les encarts publicitaires",
   // 'desc:it': "Utilizzare per saltare l'introduzione o gli inserti pubblicitari",
   // 'desc:tr': 'Girişi veya reklam eklerini atlamak için kullanın',
   // 'desc:de': 'Verwenden Sie diese Option, um das Intro oder Werbeeinblendungen zu überspringen',
   'desc:pl': 'Służy do pomijania wstępu lub wstawek reklamowych',
   'desc:ua': 'Використовуйте щоб пропустити інтро',
   _runtime: user_settings => {

      if (user_settings.time_jump_title_offset) addTitleOffset();

      // reset chapterList
      NOVA.waitElement('video')
         .then(video => video.addEventListener('loadeddata', () => chapterList = []));

      NOVA.waitElement('#movie_player')
         .then(movie_player => {
            let chapterList;

            doubleKeyPressListener(timeLeap, user_settings.time_jump_hotkey);

            function timeLeap() {
               // null - chapterList is init: skiping
               if (chapterList !== null && !chapterList?.length) {
                  chapterList = NOVA.getChapterList(movie_player.getDuration()) || null;
                  // console.debug('chapterList:', chapterList);
               }
               const
                  nextChapterIndex = chapterList?.findIndex(c => c.sec > movie_player.getCurrentTime()),
                  separator = ' • ';
               // console.debug('nextChapterIndex', nextChapterIndex);
               let msg;

               if (chapterList?.length // has chapters
                  && nextChapterIndex !== -1 // chapters not ended
               ) {
                  const nextChapterData = chapterList?.find(({ sec }) => sec >= movie_player.getCurrentTime());
                  // console.debug(`nextChapter jump [${nextChapterIndex}] ${movie_player.getCurrentTime()?.toFixed(0)} > ${nextChapterData.sec} sec`);

                  movie_player.seekTo(nextChapterData.sec + .5); // +0.5 fix paused jump (like https://www.youtube.com/watch?v=Xt2sbtvBuk8)

                  // movie_player.seekToChapterWithAnimation(nextChapterIndex); // wrong way!
                  // Chapters blocks none, but has timestamp. The reason is that the markers in the description do not correspond to the markers marked by the author in the player. Missed - "05:04: Advertisement" - https://www.youtube.com/watch?v=reNLNZtfosI
                  // console.assert(chapterList[nextChapterIndex].sec === +movie_player.getCurrentTime()?.toFixed(0), 'nextChapterIndex.time != getCurrentTime:', nextChapterIndex, +movie_player.getCurrentTime()?.toFixed(0), chapterList[nextChapterIndex]);
                  // TODO: Compare embedded and marked chapter lists. And if there is a discrepancy, preortize a larger one

                  msg = nextChapterData.title + separator + nextChapterData.time;

                  // if (chapterTitleEl && user_settings.time_jump_chapters_list_show) chapterTitleEl.click();
               }
               // chapters empty
               else {
                  movie_player.seekBy(+user_settings.time_jump_step);
                  // Attention! after seek
                  msg = `+${user_settings.time_jump_step} sec` + separator + NOVA.timeFormatTo.HMS.digit(movie_player.getCurrentTime());
               }

               NOVA.bezelTrigger(msg); // trigger default indicator
            }
         });


      // Strategy 2. Alt
      // NOVA.waitElement('video')
      //    .then(video => {
      //       doubleKeyPressListener(timeLeap.bind(video), user_settings.time_jump_hotkey);

      //       function timeLeap() {
      //          let sec = +user_settings.time_jump_step + this.currentTime;

      //          if (secNextChapter = seekToNextChapter.apply(this)) {
      //             sec = secNextChapter;
      //             // wait chapter-title update
      //             document.body.querySelector('.ytp-chapter-title-content')
      //                ?.addEventListener('DOMNodeInserted', ({ target }) => {
      //                   NOVA.bezelTrigger(
      //                      target.textContent + ' • ' + NOVA.timeFormatTo.HMS.digit(video.currentTime)
      //                   );// trigger default indicator
      //                }, { capture: true, once: true });
      //          }
      //          else {
      //             NOVA.bezelTrigger(`+${user_settings.time_jump_step} sec`); // trigger default indicator
      //          }
      //          // console.debug('seekTo', sec);
      //          this.currentTime = sec;

      //          // alt - https://greasyfork.org/en/scripts/434990-youtube-always-show-progress-bar-forked/code
      //          // Strategy 1. API
      //          function seekToNextChapter() {
      //             return Object.values((
      //                ytPubsubPubsubInstance.i // embed
      //                || ytPubsubPubsubInstance.j // normal
      //                || ytPubsubPubsubInstance.subscriptions_ // navigation
      //             )
      //                .find(a => a?.player)
      //                .player.app
      //             )
      //                .find(a => a?.videoData)
      //                ?.videoData.multiMarkersPlayerBarRenderer?.markersMap[0].value.chapters
      //                // .forEach(c => {
      //                //    c.chapterRenderer.title.simpleText;
      //                //    c.chapterRenderer.timeRangeStartMillis / 1000;
      //                // });
      //                .findIndex(c =>
      //                   (c.chapterRenderer.timeRangeStartMillis / 1000) > movie_player.getCurrentTime()
      //                );
      //          }
      //          // Strategy 2. HTML
      //          // function seekToNextChapter() {
      //          //    if ((chaptersContainer = document.body.querySelector('.ytp-chapters-container'))
      //          //       && chaptersContainer?.children.length > 1
      //          //       && (progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width), 10)
      //          //    ) {
      //          //       const progressRatio = this.currentTime / this.duration;
      //          //       let passedWidth = 0;
      //          //       for (const chapter of chaptersContainer.children) {
      //          //          const
      //          //             { width, marginLeft, marginRight } = getComputedStyle(chapter),
      //          //             chapterWidth = parseInt(width, 10),
      //          //             chapterMargin = parseInt(marginLeft, 10) + parseInt(marginRight, 10),
      //          //             chapterRatio = (passedWidth + chapterWidth) / progressContainerWidth;

      //          //          // console.debug('Chapter', chapterRatio, chapterWidth);
      //          //          if (chapterRatio >= progressRatio && chapterRatio < 1) {
      //          //             return ~~(chapterRatio * this.duration) + chapterMargin + 1;
      //          //          }
      //          //          // accumulate passed
      //          //          passedWidth += chapterWidth + chapterMargin;
      //          //       }
      //          //       // console.debug('passedWidth', 'total=' + passedWidth, 'chapter count=' + chaptersContainer?.children.length, progressContainerWidth, '/', progressRatio);
      //          //    }
      //          // }
      //       }
      //    });

      // alt - https://chrome.google.com/webstore/detail/ofbfdabicijcdjoeemcgabeeapciibbf
      function addTitleOffset() {
         NOVA.css.push(
            `.ytp-tooltip-text:after {
               content: attr(data-before);
               color: #ffcc00;
            }`);
         // color: ${getComputedStyle(document.body.querySelector('.ytp-swatch-background-color'))['background-color'] || '#f00'};

         NOVA.waitElement('.ytp-progress-bar')
            .then(progressContainer => {
               if (tooltipEl = document.body.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', () => {
                     if (movie_player.getVideoData().isLive
                        || (NOVA.currentPage == 'embed' && window.self.location.href.includes('live_stream'))
                     ) return;

                     const
                        cursorTime = NOVA.timeFormatTo.hmsToSec(tooltipEl.textContent),
                        offsetTime = cursorTime - NOVA.videoElement?.currentTime,
                        sign = (offsetTime >= 1) ? '+' : (Math.sign(offsetTime) === -1) ? '-' : '';
                     // updateOffsetTime
                     // console.debug('offsetTime', offsetTime, cursorTime, sign);
                     tooltipEl.setAttribute('data-before', ` ${sign + NOVA.timeFormatTo.HMS.digit(offsetTime)}`);
                  });
                  // hide titleOffset
                  progressContainer.addEventListener('mouseleave', () => tooltipEl.removeAttribute('data-before'));
               }
            });
      }

      function doubleKeyPressListener(callback, keyCodeFilter) {
         let
            pressed,
            isDoublePress,
            lastPressed = parseInt(keyCodeFilter, 10) || null;

         const
            timeOut = () => setTimeout(() => isDoublePress = false, 500), // 500ms
            handleDoublePresss = key => {
               // console.debug(key.key, 'pressed two times');
               if (callback && typeof callback === 'function') return callback(key);
            };

         function keyPress(evt) {
            if (['input', 'textarea'].includes(evt.target.localName) || evt.target.isContentEditable) return;

            pressed = evt.keyCode;
            // console.debug('doubleKeyPressListener %s=>%s=%s', lastPressed, pressed, isDoublePress);
            if (isDoublePress && pressed === lastPressed) {
               isDoublePress = false;
               handleDoublePresss(evt);
            }
            else {
               isDoublePress = true;
               timeOut();
            }

            if (!keyCodeFilter) lastPressed = pressed;
         }
         document.addEventListener('keyup', keyPress);
      }

      if (+user_settings.skip_into_step) {

         NOVA.waitElement('video')
            .then(video => {
               NOVA.runOnPageInitOrTransition(() => {
                  if (NOVA.currentPage == 'watch') {
                     video.addEventListener('canplay', timeLeapInto.bind(video), { capture: true, once: true });
                  }
               });

               function timeLeapInto() {
                  if (!user_settings.skip_into_step_in_music && NOVA.isMusic()) return;
                  // start - fix conflict with plugin. "player-resume-playback"
                  const
                     CACHE_PREFIX = 'resume-playback-time',
                     getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);

                  if (user_settings['player-resume-playback']
                     && (saveTime = +sessionStorage.getItem(getCacheName()))
                     && (saveTime > (this.duration - 3)) // fix if (saveTime == this.duration))
                  ) return;
                  /* end - fix */

                  if (this.duration > 30 && this.currentTime < +user_settings.skip_into_step) {
                     // console.debug('ad intro seek', +user_settings.skip_into_step);
                     this.currentTime = +user_settings.skip_into_step || 10;
                  }
               }
            });
      }

   },
   options: {
      time_jump_step: {
         _tagName: 'input',
         label: 'Step time',
         // 'label:ja': 'ステップ時間',
         'label:zh': '步骤时间',
         'label:ko': '단계 시간',
         'label:id': 'Langkah waktu',
         'label:es': 'Tiempo de paso',
         'label:pt': 'Tempo da etapa',
         'label:fr': 'Temps de pas',
         'label:it': 'Tempo di passaggio',
         // 'label:tr': 'Adım süresi',
         'label:de': 'Schrittzeit',
         'label:pl': 'Krok czasowy',
         'label:ua': 'Крок часу',
         type: 'number',
         title: 'In seconds',
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
         'label:ko': '단축키(더블 클릭)',
         'label:id': 'Tombol pintas (klik dua kali)',
         'label:es': 'Tecla de acceso rápido (doble clic)',
         'label:pt': 'Atalho (duplo clique)',
         'label:fr': 'Raccourci clavier (double clic)',
         'label:it': 'Tasto di scelta rapida (doppio clic)',
         // 'label:tr': 'Kısayol tuşu (çift tıklama)',
         'label:de': 'Hotkey (Doppelklick)',
         'label:pl': 'Klawisz skrótu (podwójne kliknięcie)',
         'label:ua': 'Гаряча клавіша (двічі натиснути)',
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
         'label:ko': '진행률 표시줄에 시간 오프셋 표시',
         'label:id': 'Tampilkan offset waktu di bilah kemajuan',
         'label:es': 'Mostrar compensación de tiempo en la barra de progreso',
         'label:pt': 'Mostrar a diferença de tempo na barra de progresso',
         'label:fr': 'Afficher le décalage horaire sur la barre de progression',
         'label:it': "Mostra l'offset di tempo sulla barra di avanzamento",
         // 'label:tr': 'İlerleme çubuğunda zaman ofsetini göster',
         'label:de': 'Zeitverschiebung im Fortschrittsbalken anzeigen',
         'label:pl': 'Pokaż przesunięcie czasu na pasku postępu',
         'label:ua': 'Показувати часовий зсув на панелі прогресу',
         type: 'checkbox',
         // title: 'When you hover offset current playback time',
         title: 'Time offset from current playback time',
         'title:zh': '与当前播放时间的时间偏移',
         'title:ja': '現在の再生時間からの時間オフセット',
         'title:ko': '현재 재생 시간으로부터의 시간 오프셋',
         'label:id': 'Waktu offset dari waktu pemutaran saat ini',
         'title:es': 'Desfase de tiempo del tiempo de reproducción actual',
         'title:pt': 'Deslocamento de tempo do tempo de reprodução atual',
         'title:fr': "Décalage temporel par rapport à l'heure de lecture actuelle",
         'title:it': 'Spostamento temporale dal tempo di riproduzione corrente',
         // 'title:tr': 'Geçerli oynatma süresinden zaman farkı',
         'title:de': 'Zeitverschiebung zur aktuellen Wiedergabezeit',
         'title:pl': 'Przesunięcie czasu względem bieżącego czasu odtwarzania',
         'title:ua': 'Часовий зсув відносно поточного часу відтворення',
      },
      // time_jump_chapters_list_show: {
      //    _tagName: 'input',
      //    label: 'Show chapters list section',
      //    'label:zh': '显示章节列表块',
      //    'label:ja': 'チャプターリストブロックを表示',
      //    'label:ko': '챕터 목록 섹션 표시',
      //    'label:id': 'Tampilkan bagian daftar bab',
      //    'label:es': 'Mostrar bloque de lista de capítulos',
      //    'label:pt': 'Mostrar bloco de lista de capítulos',
      //    'label:fr': 'Afficher la section de la liste des chapitres',
      //    'label:it': "Mostra la sezione dell'elenco dei capitoli",
      //    'label:tr': 'Bölüm listesi bölümünü göster',
      //    'label:de': 'Kapitellistenblock anzeigen',
      //    'label:pl': 'Pokaż sekcję listy rozdziałów',
      //    'label:ua': 'Показати розділ списку розділів',
      //    type: 'checkbox',
      // },
      skip_into_step: {
         _tagName: 'input',
         label: 'Start playback at',
         // label: 'Set play start time',
         // label: 'Skip intro time at',
         'label:zh': '设置开始时间',
         'label:ja': '開始時刻を設定',
         'label:ko': '시작 시간 설정',
         'label:id': 'Tetapkan waktu mulai',
         'label:es': 'Establecer hora de inicio',
         'label:pt': 'Definir horário de início',
         'label:fr': "Définir l'heure de début",
         'label:it': "Imposta l'ora di inizio",
         // 'label:tr': '',
         'label:de': 'Startzeit festlegen',
         'label:pl': 'Ustaw czas rozpoczęcia',
         'label:ua': 'Встановіть час початку',
         type: 'number',
         title: 'sec',
         placeholder: '1-30',
         step: 1,
         min: 0,
         max: 30,
         value: 0,
      },
      skip_into_step_in_music: {
         _tagName: 'input',
         label: 'Apply for music genre',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'checkbox',
         'data-dependent': { 'skip_into_step': "!0" },
      },
   }
});
