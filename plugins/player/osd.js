window.nova_plugins.push({
   id: 'player-indicator',
   title: 'Custom On-Screen Display (OSD)',
   'title:zh': '替换默认指示器',
   'title:ja': 'デフォルトのインジケーターを置き換える',
   // 'title:ko': '기본 표시기 교체',
   // 'title:vi': '',
   // 'title:id': 'Ganti OSD (bezel)',
   // 'title:es': 'Reemplazar indicador predeterminado',
   // 'title:pt': 'Substituir o indicador padrão',
   // 'title:fr': "Remplacer l'indicateur par défaut",
   // 'title:it': 'Sostituisci OSD (cornice)',
   // 'title:tr': 'Varsayılan göstergeyi değiştir',
   // 'title:de': 'Standardkennzeichen ersetzen',
   // 'title:pl': 'Zamień wskaźnik standardowy',
   // 'title:ua': 'Замінити стандартний інтерфейс',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   // desc: "'bezel' that's what YouTube called",
   _runtime: user_settings => {

      // alt:
      // https://greasyfork.org/en/scripts/376002-youtube-volume-mouse-controller
      // https://greasyfork.org/en/scripts/376155-youtube-scroll-volume

      const
         SELECTOR_ID = 'nova-player-indicator-info',
         COLOR_OSD = user_settings.player_indicator_color || '#ff0000';

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            // volume
            video.addEventListener('volumechange', function () {
               // console.debug('volumechange', movie_player.getVolume(), this.volume); // there is a difference
               OSD.show({
                  'pt': Math.round(movie_player.getVolume()),
                  'suffix': '%',
                  // 'timeout_ms': 0,
                  'clear_previous_text': true,
               });
            });
            // rate
            video.addEventListener('ratechange', () => OSD.show({
               'pt': video.playbackRate,
               'suffix': 'x',
               // 'timeout_ms': 0,
               'clear_previous_text': true,
            }));

            if (user_settings.player_indicator_chapter) {
               // loaded description == loaded chapterList
               NOVA.waitSelector('ytd-watch-metadata #description.ytd-watch-metadata')
                  .then(() => {
                     const getNextChapterIndex = () => chapterList?.findIndex(c => c.sec > Math.trunc(video.currentTime));
                     let chapterList, lastChapTime = 0;

                     // reset chapterList
                     video.addEventListener('loadeddata', () => chapterList = []);

                     video.addEventListener('timeupdate', function () {
                        // const nextChapterIndex = chapterList?.findIndex(c => c.sec > this.currentTime);
                        if (chapterList !== null && !chapterList?.length) {
                           chapterList = NOVA.getChapterList(movie_player.getDuration()) || null;
                           // console.debug('chapterList:', chapterList);
                        }

                        if (chapterList?.length // has chapters
                           // && nextChapterIndex !== -1 // chapters not ended
                           && this.currentTime > lastChapTime
                        ) {
                           const nextChapterIndex = getNextChapterIndex();
                           lastChapTime = chapterList[nextChapterIndex]?.sec;

                           if (chapterData = chapterList[nextChapterIndex - 1]) {
                              const separator = ' • ';
                              const msg = chapterData.title + separator + chapterData.time;
                              NOVA.showOSD(msg);
                           }
                        }
                     });
                     video.addEventListener('seeking', () => {
                        if (chapterList?.length && (nexChapterData = chapterList[getNextChapterIndex()])) {
                           lastChapTime = nexChapterData.sec;
                        }
                        // console.debug('seeking write', lastChapTime);
                     });
                  });

               // if (user_settings.player_indicator_chapter_default_container_hide
               //    // skip if duplicate fn enable in [player-hide-elements] plugin
               //    && !(user_settings.player_hide_elements.length && user_settings.player_hide_elements.includes('chapter_container'))
               // ) {
               //    NOVA.css.push(
               //       `#movie_player .ytp-chrome-bottom .ytp-chapter-container { display: none !important; }`
               //    );
               // }

            }
         });

      // Listener default indicator
      NOVA.waitSelector('.ytp-bezel-text')
         .then(target => {
            new MutationObserver(mutationRecordsArray => {
               // for (const record of mutationRecordsArray) {
               //    console.debug('Old value:', record.oldValue);
               // }
               // console.debug('bezel mutation detected', record.type, target.textContent);
               if (target.textContent) {
                  // fix round volume level on range player change
                  if ((target.textContent?.endsWith('%')
                     // && (parseInt(target.textContent) <= 100
                     //    || (user_settings.volume_unlimit && parseInt(target.textContent) <= 600)
                     // )
                  )
                     || target.textContent?.endsWith('x')
                     || target.textContent?.startsWith('+')
                  ) {
                     return;
                  }
                  OSD.show({
                     'pt': target.textContent,
                     // 'suffix': '',
                     'timeout_ms': (user_settings.player_indicator_chapter_time || 1.8) * 1000, // ms
                     // 'clear_previous_text': false,
                  });
               }
            })
               // childList: false, subtree: false,
               .observe(target, { attributes: true, childList: true }); // watch for textContent
         });

      const OSD = {
         // TODO The idea of ​​copying the progress bar. To display segments of time markers
         // a = el.cloneNode(true)
         // document.getElementById(SELECTOR_ID).innerHTML = a.innerHTML

         create() {
            // hide default indicator
            // alt1 - https://greasyfork.org/en/scripts/430036-youtube-remove-huge-10-seconds-skip-indicators
            // alt2 - https://greasyfork.org/en/scripts/411754-youtube%E5%81%9C%E6%AD%A2%E9%A1%AF%E7%A4%BA%E8%BD%89%E5%9C%88%E5%9C%88-%E6%9A%AB%E5%81%9C-%E6%92%A5%E6%94%BE%E7%9A%84%E5%8B%95%E7%95%AB
            NOVA.css.push(
               `.ytp-bezel-text-wrapper,
               .ytp-doubletap-ui-legacy.ytp-time-seeking,
               /*.ytp-doubletap-seek-info-container,*/
               .ytp-chapter-seek {
                  display:none !important;
               }`);
            // init common css
            NOVA.css.push(
               `#${SELECTOR_ID} {
                  --color: #fff;
                  --bg-color: rgba(0,0,0,${user_settings.player_indicator_opacity || .3});
                  --zindex: ${1 + Math.max(NOVA.css.get('.ytp-chrome-top', 'z-index'), 60)};

                  position: absolute;
                  right: 0;
                  z-index: calc(var(--zindex) + 1);
                  margin: 0 auto;
                  text-align: center;
                  opacity: 0;
                  background-color: var(--bg-color);
                  color: var(--color);
               }`);
            // template

            const template = document.createElement('div');
            template.id = SELECTOR_ID;
            template.innerHTML = '<span></span>';
            movie_player.append(template);
            // 25.72 % slower
            // movie_player.insertAdjacentHTML('beforeend', `<div id="${SELECTOR_ID}"><span></span></div>`);

            this.container = document.getElementById(SELECTOR_ID);
            this.spanOSD = this.container.querySelector('span'); // export el

            // add to div user_settings.player_indicator_type style
            // const [indicator_type, span_align] = user_settings.player_indicator_type.split('=', 2); // 2 = max param;
            // switch (indicator_type) {
            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  // this.container.style.cssText = '';
                  Object.assign(this.container.style, {
                     left: 0,
                     bottom: '20%',
                     width: '30%',
                     'font-size': '1.2em',
                  });
                  // this.spanOSD.style.cssText = '';
                  Object.assign(this.spanOSD.style, {
                     'background-color': COLOR_OSD,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                  });
                  // if (span_align == 'left') {
                  //    Object.assign(this.spanOSD.style, {
                  //       float: 'left',
                  //    });
                  // }
                  break;

               case 'bar-vertical':
                  // this.container.style.cssText = '';
                  Object.assign(this.container.style, {
                     top: 0,
                     height: '100%',
                     width: '25px',
                     'font-size': '1.2em',
                  });
                  // this.spanOSD.style.cssText = '';
                  Object.assign(this.spanOSD.style, {
                     position: 'absolute',
                     bottom: 0,
                     right: 0,
                     'background-color': COLOR_OSD,
                     transition: 'height 100ms ease-out 0s',
                     display: 'inline-block',
                     width: '100%',
                     'font-weight': 'bold',
                  });
                  break;

               // case 'text-top':
               default:
                  // this.container.style.cssText = '';
                  Object.assign(this.container.style, {
                     top: 0,
                     width: '100%',
                     padding: '.2em',
                     'font-size': '1.55em',
                  });
            }
            return this.container;
         },

         show({ pt = 100, suffix = '', timeout_ms = 800, clear_previous_text }) {
            // console.debug('OSD show', ...arguments);

            if (typeof this.fade === 'number') clearTimeout(this.fade); // reset fade

            const notify = this.container || this.create();

            if (this.oldMsg) {
               // this.spanOSD.innerText = this.oldMsg + '\n' + pt + suffix;
               this.spanOSD.innerText += '\n' + pt + suffix;
            }
            else {
               this.spanOSD.innerHTML = pt + suffix; // fix bold text. Like "Screenshot moment" (https://www.youtube.com/watch?v=4_m3HsaNwOE&list=PLhW3qG5bs-L9sJKoT1LC5grGT77sfW0Z8&index=1&t=405s)
               // this.spanOSD.textContent = pt + suffix;
            }

            if (!clear_previous_text) {
               this.oldMsg = this.spanOSD.innerText;
               clearTimeout(this.timeoutMultiLine);
               this.timeoutMultiLine = setTimeout(() => this.oldMsg = null, 600); // forget old msg after 600ms
            }

            // rate to pt
            if (suffix == 'x') {
               const maxPercent = (+user_settings.rate_step % .25) === 0 ? 2 : 3;
               pt = +pt * 100 / maxPercent;
            }
            pt = Math.round(pt);

            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  this.spanOSD.style.width = pt + '%';
                  break;

               case 'bar-vertical':
                  this.spanOSD.style.height = pt + '%';
                  break;

               case 'bar-top':
                  notify.style.background = `linear-gradient(to right, ${COLOR_OSD}50 ${pt}%, rgba(0,0,0,.8) ${pt}%)`;
                  this.spanOSD.style.width = pt + '%';
                  break;

               // case 'text-top':
               // default:
            }

            notify.style.transition = 'none';
            notify.style.opacity = 1;
            notify.style.visibility = 'visible';

            this.fade = setTimeout(() => {
               notify.style.transition = 'opacity 200ms ease-in';
               notify.style.opacity = 0;
               // setTimeout(() => this.spanOSD.textContent = '', 200); // clear text
               setTimeout(() => notify.style.visibility = 'hidden', 1000); // completely hide after 1s
            }, timeout_ms); // total 1s = 800ms + 200ms(notify.style.transition)
         }
      };

   },
   options: {
      player_indicator_type: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         // 'label:ko': '방법',
         // 'label:vi': '',
         // 'label:id': 'Mode',
         // 'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         // 'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         // label: 'OSD type',
         // 'label:zh': '指标类型',
         // 'label:ja': 'インジケータータイプ',
         // // 'label:ko': '표시기 유형',
         // // 'label:vi': '',
         // // 'label:id': 'Gösterge tipi',
         // // 'label:es': 'Tipo de indicador',
         // 'label:pt': 'Tipo de indicador',
         // 'label:fr': "Type d'indicateur",
         // // 'label:it': 'Tipo di indicatore',
         // // 'label:tr': 'Varsayılan göstergeyi değiştir',
         // 'label:de': 'Indikatortyp',
         // 'label:pl': 'Typ wskaźnika',
         // 'label:ua': 'Тип індикатора',
         options: [
            {
               label: 'text-top', value: 'text-top', selected: true,
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
               'label:ua': 'текст зверху',
            },
            {
               label: 'bar-top', value: 'bar-top',
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
               'label:ua': 'панель зверху',
            },
            {
               label: 'bar-center', value: 'bar-center',
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
               'label:ua': 'панель в центрі',
            },
            {
               label: 'bar-vertical', value: 'bar-vertical',
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
               'label:ua': 'вертикальна панель',
            },
         ],
      },
      player_indicator_opacity: {
         _tagName: 'input',
         label: 'Opacity',
         'label:zh': '不透明度',
         'label:ja': '不透明度',
         // 'label:ko': '불투명',
         // 'label:vi': '',
         // 'label:id': 'Kegelapan',
         // 'label:es': 'Opacidad',
         'label:pt': 'Opacidade',
         'label:fr': 'Opacité',
         // 'label:it': 'Opacità',
         'label:tr': 'opaklık',
         'label:de': 'Opazität',
         'label:pl': 'Przezroczystość',
         'label:ua': 'Прозорість',
         type: 'number',
         title: 'less value - more transparency',
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
         placeholder: '0-1',
         step: .1,
         min: .1,
         max: .9,
         value: .3,
         // 'data-dependent': { 'player_indicator_type': ['text-top', bar-top'] },
      },
      player_indicator_color: {
         _tagName: 'input',
         type: 'color',
         value: '#ff0000', // red
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
         // title: '',
         'data-dependent': { 'player_indicator_type': '!text-top' },
      },
      player_indicator_chapter: {
         _tagName: 'input',
         label: 'Show info at start chapter',
         'label:zh': '在开始章节显示信息',
         'label:ja': '章の開始時に情報を表示',
         // 'label:ko': '시작 장에 정보 표시',
         // 'label:vi': '',
         // 'label:id': 'Tampilkan info di awal bab',
         // 'label:es': 'Mostrar información al inicio del capítulo',
         'label:pt': 'Mostrar informações no capítulo inicial',
         'label:fr': 'Afficher les informations au début du chapitre',
         // 'label:it': "Mostra informazioni all'inizio del capitolo",
         // 'label:tr': '',
         'label:de': 'Info beim Startkapitel anzeigen',
         'label:pl': 'Pokaż informacje na początku rozdziału',
         'label:ua': 'Показати інформацію на початку розділу',
         type: 'checkbox',
         // title: '',
      },
      // player_indicator_chapter_default_container_hide: {
      //    _tagName: 'input',
      //    label: 'Hide default block in player control panel',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': '',
      //    type: 'checkbox',
      //    'data-dependent': { 'player_indicator_chapter': true },
      // },
      player_indicator_chapter_time: {
         _tagName: 'input',
         label: 'Chapter timeout',
         type: 'number',
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
         title: 'in sec',
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
         placeholder: '0-10',
         step: .1,
         min: .1,
         max: 10,
         value: 1.8,
         'data-dependent': { 'player_indicator_chapter': true },
      },
   }
});
