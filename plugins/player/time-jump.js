// for test:
// https://www.youtube.com/watch?v=Xt2sbtvBuk8 - have 3-digit timestamps in description, Manual chapter numbering
// https://www.youtube.com/watch?v=egAB2qtVWFQ - title of chapters before timestamp. Manual chapter numbering
// https://www.youtube.com/watch?v=E-6gg0xKTPY - lying timestamp
// https://www.youtube.com/watch?v=SgQ_Jk49FRQ - timestamp in pinned comment
// https://www.youtube.com/watch?v=Dg30oEk5Mw0 - timestamp in pinned comment #2 once
// https://www.youtube.com/watch?v=tlICDvcCkog - timestamp in pinned comment#3 (bug has 1 chapters blocks). Manual chapter numbering
// https://www.youtube.com/watch?v=IvZOmE36PLc - many extra characters. Manual chapter numbering
// https://www.youtube.com/watch?v=hLXIK9DBxAo - very long text line of timestamp
// https://www.youtube.com/watch?v=IR0TBQV147I = lots 3-digit timestamp
// https://www.youtube.com/embed/JxTyMVPaOXY?autoplay=1 - embed test
// https://www.youtube.com/watch?v=tNkZsRW7h2c - can't rewind video (live)

// test TitleOffset
// https://youtu.be/t_fbcgzmxHs

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
   'title:tr': 'Zaman atlama',
   'title:de': 'Zeitsprung',
   'title:pl': 'Skok czasowy',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: 'Use to skip ad inserts',
   'desc:zh': '用于跳过广告插入',
   'desc:ja': '広告の挿入をスキップするために使用',
   'desc:ko': '광고 삽입을 건너뛸 때 사용',
   'desc:id': 'Gunakan untuk melewati sisipan iklan',
   'desc:es': 'Úselo para omitir inserciones de anuncios',
   'desc:pt': 'Use para pular inserções de anúncios',
   'desc:fr': 'Utiliser pour ignorer les insertions publicitaires',
   'desc:it': 'Utilizzare per saltare gli inserti pubblicitari',
   'desc:tr': 'Reklam eklerini atlamak için kullanın',
   'desc:de': 'Zum Überspringen von Anzeigeninsertionen verwenden',
   'desc:pl': 'Użyj, aby pominąć wstawki reklamowe',
   _runtime: user_settings => {

      if (user_settings.time_jump_title_offset) addTitleOffset();

      // switch (NOVA.currentPage) {
      //    case 'watch':
      let chapterList;

      // reset chapterList
      NOVA.waitElement('video')
         .then(video => video.addEventListener('loadeddata', () => chapterList = []));

      NOVA.waitElement('#movie_player')
         .then(movie_player => {
            doubleKeyPressListener(timeLeap, user_settings.time_jump_hotkey);

            function timeLeap() {
               if (chapterList !== null && !chapterList?.length) { // null - chapterList is init: skiping
                  chapterList = NOVA.getChapterList(movie_player.getDuration()) || null;
                  // console.debug('chapterList:', chapterList);
               }
               const
                  nextChapterIndex = chapterList?.findIndex(c => c.sec > movie_player.getCurrentTime()),
                  separator = ' • ';
               // console.debug('nextChapterIndex', nextChapterIndex);
               let msg;
               // has chapters and chapters not ended
               if (chapterList?.length && nextChapterIndex !== -1) {
                  // has chapters blocks (Important! more than 1. See e.g. "(bug has 1 chapters blocks)"
                  if (movie_player.querySelectorAll('.ytp-chapter-hover-container')?.length > 1) {
                     // console.debug(`nextChapterIndex jump [${nextChapterIndex}] ${movie_player.getCurrentTime()?.toFixed(0)} > ${chapterList[nextChapterIndex].sec} sec`);
                     movie_player.seekToChapterWithAnimation(nextChapterIndex);

                     // querySelector update after seek
                     // const chapterTitleEl = movie_player.querySelector('.ytp-chapter-title-content');

                     // msg = (chapterTitleEl?.textContent || chapterList[nextChapterIndex].title)
                     //    + separator + chapterList[nextChapterIndex].time;

                     // if (chapterTitleEl && user_settings.time_jump_chapters_list_show) {
                     //    chapterTitleEl.click()
                     // }

                  } else { // chapters blocks none, but has timestamp
                     const nextChapterData = chapterList?.find(({ sec }) => sec >= movie_player.getCurrentTime());
                     // console.debug(`nextChapterData jump [${nextChapterData.index}] ${movie_player.getCurrentTime()?.toFixed(0)} > ${nextChapterData.sec} sec`);
                     movie_player.seekTo(nextChapterData.sec);

                     msg = nextChapterData.title + separator + nextChapterData.time;
                  }

               } else { // chapters none
                  movie_player.seekBy(+user_settings.time_jump_step);

                  msg = `+${user_settings.time_jump_step} sec` + separator + NOVA.timeFormatTo.HMS.digit(movie_player.getCurrentTime());
               }

               NOVA.bezelTrigger(msg); // trigger default indicator
            }
         });
      // break;

      // case 'embed':
      //    NOVA.waitElement('video')
      //       .then(video => {
      //          doubleKeyPressListener(timeLeap.bind(video), user_settings.time_jump_hotkey);

      //          function timeLeap() {
      //             let sec = +user_settings.time_jump_step + this.currentTime;

      //             if (secNextChapter = seekToNextChapter.apply(this)) {
      //                sec = secNextChapter;
      //                // wait chapter-title update
      //                document.body.querySelector('.ytp-chapter-title-content')
      //                   ?.addEventListener('DOMNodeInserted', ({ target }) => {
      //                      NOVA.bezelTrigger(
      //                         target.textContent + ' • ' + NOVA.timeFormatTo.HMS.digit(video.currentTime)
      //                      );// trigger default indicator
      //                   }, { capture: true, once: true });
      //             } else {
      //                NOVA.bezelTrigger(`+${user_settings.time_jump_step} sec`); // trigger default indicator
      //             }
      //             // console.debug('seekTo', sec);
      //             this.currentTime = sec;

      //             function seekToNextChapter() {
      //                if ((chaptersContainer = document.body.querySelector('.ytp-chapters-container'))
      //                   && chaptersContainer?.children.length > 1
      //                   && (progressContainerWidth = parseInt(getComputedStyle(chaptersContainer).width))
      //                ) {
      //                   const progressRatio = this.currentTime / this.duration;
      //                   let passedWidth = 0;
      //                   for (const chapter of chaptersContainer.children) {
      //                      const
      //                         { width, marginLeft, marginRight } = getComputedStyle(chapter), // chapterWidth = width
      //                         chapterMargin = parseInt(marginLeft) + parseInt(marginRight),
      //                         chapterRatio = (passedWidth + width) / progressContainerWidth;

      //                      // console.debug('Chapter', chapterRatio, chapterWidth);
      //                      if (chapterRatio >= progressRatio && chapterRatio < 1) {
      //                         return ~~(chapterRatio * this.duration) + chapterMargin + 1;
      //                      }
      //                      // accumulate passed
      //                      passedWidth += width + chapterMargin;
      //                   }
      //                   // console.debug('passedWidth', 'total=' + passedWidth, 'chapter count=' + chaptersContainer?.children.length, progressContainerWidth, '/', progressRatio);
      //                }
      //             }
      //          }
      //       });
      //    break;
      // }

      function addTitleOffset() {
         NOVA.css.push(
            `.ytp-tooltip-text:after {
               content: attr(data-before);
               color: #ffcc00;
            }`);
         // color: ${getComputedStyle(document.querySelector('.ytp-swatch-background-color'))['background-color'] || '#f00'};

         NOVA.waitElement('.ytp-progress-bar')
            .then(progressContainer => {
               if (tooltipEl = document.body.querySelector('.ytp-tooltip-text')) {
                  progressContainer.addEventListener('mousemove', () => {
                     if (movie_player.getVideoData().isLive // stream. Doesn't work in embed
                        || (NOVA.currentPage == 'embed' && window.self.location.href.includes('live_stream'))) return;

                     const
                        cursorTime = NOVA.timeFormatTo.hmsToSec(tooltipEl.textContent),
                        offsetTime = cursorTime - NOVA.videoElement?.currentTime,
                        sign = offsetTime >= 1 ? '+' : Math.sign(offsetTime) === -1 ? '-' : '';
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
            lastPressed = parseInt(keyCodeFilter) || null;

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
         'label:ko': '단계 시간',
         'label:id': 'Langkah waktu',
         'label:es': 'Tiempo de paso',
         'label:pt': 'Tempo da etapa',
         'label:fr': 'Temps de pas',
         'label:it': 'Tempo di passaggio',
         'label:tr': 'Adım süresi',
         'label:de': 'Schrittzeit',
         'label:pl': 'Krok czasowy',
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
         'label:ko': '단축키(더블 클릭)',
         'label:id': 'Tombol pintas (klik dua kali)',
         'label:es': 'Tecla de acceso rápido (doble clic)',
         'label:pt': 'Atalho (duplo clique)',
         'label:fr': 'Raccourci clavier (double clic)',
         'label:it': 'Tasto di scelta rapida (doppio clic)',
         'label:tr': 'Kısayol tuşu (çift tıklama)',
         'label:de': 'Hotkey (Doppelklick)',
         'label:pl': 'Klawisz skrótu (podwójne kliknięcie)',
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
         'label:tr': 'İlerleme çubuğunda zaman ofsetini göster',
         'label:de': 'Zeitverschiebung im Fortschrittsbalken anzeigen',
         'label:pl': 'Pokaż przesunięcie czasu na pasku postępu',
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
         'title:tr': 'Geçerli oynatma süresinden zaman farkı',
         'title:de': 'Zeitverschiebung zur aktuellen Wiedergabezeit',
         'title:pl': 'Przesunięcie czasu względem bieżącego czasu odtwarzania',
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
      //    type: 'checkbox',
      // },
   }
});
