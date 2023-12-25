window.nova_plugins.push({
   id: 'thumbnails-title-normalize',
   title: 'Decapitalize thumbnails title',
   'title:zh': '从大写中删除缩略图标题',
   'title:ja': 'サムネイルのタイトルを大文字から外す',
   'title:ko': '썸네일 제목을 대문자로',
   'title:id': 'Judul gambar mini decapitalize',
   'title:es': 'Descapitalizar el título de las miniaturas',
   'title:pt': 'Decapitalize o título das miniaturas',
   'title:fr': 'Démajuscule le titre des vignettes',
   'title:it': 'Decapitalizza il titolo delle miniature',
   // 'title:tr': 'Küçük resim başlığının büyük harflerini kaldır',
   'title:de': 'Thumbnails-Titel entfernen',
   'title:pl': 'Zmniejsz czcionkę w tytule miniatur',
   'title:ua': 'Завжди маленькі літери для назв мініатюр',
   run_on_pages: 'home, feed, channel, watch',
   // run_on_pages: '*, -embed, -results, -live_chat',
   section: 'other',
   desc: 'Upper Case thumbnails title back to normal',
   'desc:ua': 'Зняти слова з великої літери для назв мініатюр',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/445780-youtube-remove-caps-from-videos-titles
      // alt2 - https://chrome.google.com/webstore/detail/pgpdaocammeipkkgaeelifgakbhjoiel
      // alt3 - https://github.com/MarcGuiselin/youtube-refined/blob/main/code/scripts/common/title-caps.js

      const
         VIDEO_TITLE_SELECTOR = [
            '#video-title', // results
            // 'ytm-media-item a > [class$="media-item-headline"]', // mobile /subscriptions
            // 'ytm-rich-item-renderer a > [class$="media-item-headline"]', // mobile /channel
            'a > [class*="media-item-headline"]', // mobile
            // for title in watch page
            // 'h2.slim-video-information-title', // mobile
            // 'ytd-watch-metadata #title h1' // watch
         ]
            .map(i => i + ':not(:empty)'),
         MAX_CAPS_LETTERS = +user_settings.thumbnails_title_normalize_smart_max_words || 2,
         ATTR_MARK = 'nova-thumb-title-normalized',
         // /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g // full
         clearOfSymbols = str => str.replace(/[\u2011-\u26FF]/g, ' ').replace(/\s{2,}/g, ' '), // simple
         clearOfEmoji = str => str.replace(/[^<>=\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, ' ').replace(/\s{2,}/g, ' ');

      if (user_settings.thumbnails_title_normalize_show_full) {
         NOVA.css.push(
            VIDEO_TITLE_SELECTOR.join(',') + `{
               display: block !important;
               max-height: unset !important;
            }`);
      }

      // Letters(Lu) + Dash punctuation(Pd) + Decimal number(Nd): Upper case letter unicode - https://apps.timwhitlock.info/js/regex
      const UpperCaseLetterRegex = new RegExp("([\-0-9A-ZÀ-ÖØ-ÞĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĽĿŁŃŅŇŊŌŎŐŒŔŖŘŚŜŞŠŢŤŦŨŪŬŮŰŲŴŶŸ-ŹŻŽƁ-ƂƄƆ-ƇƉ-ƋƎ-ƑƓ-ƔƖ-ƘƜ-ƝƟ-ƠƢƤƦ-ƧƩƬƮ-ƯƱ-ƳƵƷ-ƸƼǄǇǊǍǏǑǓǕǗǙǛǞǠǢǤǦǨǪǬǮǱǴǶ-ǸǺǼǾȀȂȄȆȈȊȌȎȐȒȔȖȘȚȜȞȠȢȤȦȨȪȬȮȰȲȺ-ȻȽ-ȾɁɃ-ɆɈɊɌɎͰͲͶΆΈ-ΊΌΎ-ΏΑ-ΡΣ-ΫϏϒ-ϔϘϚϜϞϠϢϤϦϨϪϬϮϴϷϹ-ϺϽ-ЯѠѢѤѦѨѪѬѮѰѲѴѶѸѺѼѾҀҊҌҎҐҒҔҖҘҚҜҞҠҢҤҦҨҪҬҮҰҲҴҶҸҺҼҾӀ-ӁӃӅӇӉӋӍӐӒӔӖӘӚӜӞӠӢӤӦӨӪӬӮӰӲӴӶӸӺӼӾԀԂԄԆԈԊԌԎԐԒԔԖԘԚԜԞԠԢԱ-Ֆ֊־٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉႐-႙Ⴀ-Ⴥ០-៩᠆᠐-᠙᥆-᥏᧐-᧙᭐-᭙᮰-᮹᱀-᱉᱐-᱙ḀḂḄḆḈḊḌḎḐḒḔḖḘḚḜḞḠḢḤḦḨḪḬḮḰḲḴḶḸḺḼḾṀṂṄṆṈṊṌṎṐṒṔṖṘṚṜṞṠṢṤṦṨṪṬṮṰṲṴṶṸṺṼṾẀẂẄẆẈẊẌẎẐẒẔẞẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỺỼỾἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙὛὝὟὨ-ὯᾸ-ΆῈ-ΉῘ-ΊῨ-ῬῸ-Ώ‐-―ℂℇℋ-ℍℐ-ℒℕℙ-ℝℤΩℨK-ℭℰ-ℳℾ-ℿⅅↃⰀ-ⰮⱠⱢ-ⱤⱧⱩⱫⱭ-ⱯⱲⱵⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⲲⲴⲶⲸⲺⲼⲾⳀⳂⳄⳆⳈⳊⳌⳎⳐⳒⳔⳖⳘⳚⳜⳞⳠⳢ⸗⸚〜〰゠꘠-꘩ꙀꙂꙄꙆꙈꙊꙌꙎꙐꙒꙔꙖꙘꙚꙜꙞꙢꙤꙦꙨꙪꙬꚀꚂꚄꚆꚈꚊꚌꚎꚐꚒꚔꚖꜢꜤꜦꜨꜪꜬꜮꜲꜴꜶꜸꜺꜼꜾꝀꝂꝄꝆꝈꝊꝌꝎꝐꝒꝔꝖꝘꝚꝜꝞꝠꝢꝤꝦꝨꝪꝬꝮꝹꝻꝽ-ꝾꞀꞂꞄꞆꞋ꣐-꣙꤀-꤉꩐-꩙︱-︲﹘﹣－０-９Ａ-Ｚ]|\ud801[\udc00-\udc27\udca0-\udca9]|\ud835[\udc00-\udc19\udc34-\udc4d\udc68-\udc81\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb5\udcd0-\udce9\udd04-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd38-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd6c-\udd85\udda0-\uddb9\uddd4-\udded\ude08-\ude21\ude3c-\ude55\ude70-\ude89\udea8-\udec0\udee2-\udefa\udf1c-\udf34\udf56-\udf6e\udf90-\udfa8\udfca\udfce-\udfff]){2,}", 'g');

      // first letter uppercase
      NOVA.css.push({
         'text-transform': 'uppercase',
         // color: '#8A2BE2', // indicator
      }, VIDEO_TITLE_SELECTOR.map(e => `${e}[${ATTR_MARK}]::first-letter`), 'important');

      NOVA.watchElements({
         selectors: VIDEO_TITLE_SELECTOR,
         attr_mark: ATTR_MARK,
         callback: async videoTitleEl => {
            // if (['home, feed, channel, watch'].includes(NOVA.currentPage)) return;
            if (NOVA.currentPage == 'results') return;
            let countCaps = 0;

            // need before count
            if (user_settings.thumbnails_title_clear_emoji) {
               videoTitleEl.textContent = clearOfEmoji(videoTitleEl.innerText).trim();
            }

            if (user_settings.thumbnails_title_clear_symbols) {
               videoTitleEl.textContent = clearOfSymbols(videoTitleEl.innerText).trim();
            }

            const normalizedText = videoTitleEl.innerText.replace(UpperCaseLetterRegex, match => {
               // console.debug('match', match);
               ++countCaps;

               return (
                  /\d/.test(match)  // skip hasNumber
                  || (match.length === 1 && /[A-Z]/.test(match)) // one upper word (latin)
                  //|| (match.length < 5 && match.includes('.') && /([A-Z]\.){2,}/.test(match)) // Abbreviations. Does not make sense Since word length == 1
                  || (match.length < 5 && match.length > 1 && ['HD', 'UHD', 'USB', 'TV', 'CPU', 'GPU', 'APU', 'AMD', 'XT', 'RX', 'GTX', 'RTX', 'GT', 'FX', 'SE', 'HP', 'SSD', 'RAM', 'PC', 'FPS', 'RDNA', 'FSR', 'DLSS', 'MSI', 'VR', 'GOTY', 'AAA', 'UI', 'BBC', 'WWE', 'OS', 'OP', 'ED', 'MV', 'PV', 'OST', 'NCS', 'BGM', 'EDM', 'GMV', 'AMV', 'MMD', 'MAD', 'SQL', 'CAPS'].includes(match)) // specific words (like: AMD RADEON VII)
                  || (match.length < 5 && /(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))/i.test(match)) // skip roman numerals
               ) ? match : match.toLowerCase();
            });
            // Upper case
            if (countCaps > MAX_CAPS_LETTERS
               || (countCaps > 1 && normalizedText.split(/\s+/).length === countCaps) // All letters in caps
            ) {
               videoTitleEl.innerText = normalizedText;
               // console.debug('normalize:', countCaps, '\n' + videoTitleEl.title, '\n' + videoTitleEl.innerText);
            }
         }
      });

      // fix bug with not updating thumbnails
      document.addEventListener('yt-action', evt => {
         // console.log(evt.detail?.actionName);
         if (evt.detail?.actionName == 'yt-chip-cloud-chip-select-action') { // click on sort thumbs
            window.addEventListener('transitionend', restoreTitle, { capture: true, once: true });
         }
      });
      function restoreTitle() {
         const selectorOldTitle = '#video-title-link[title]';
         if (NOVA.channelTab == 'videos') {
            document.body.querySelectorAll(`${selectorOldTitle} ${VIDEO_TITLE_SELECTOR}[${ATTR_MARK}]`)
               // document.body.querySelectorAll(`${selectorOldTitle} [${ATTR_MARK}]`)
               .forEach(el => {
                  if (oldTitle = el.closest(selectorOldTitle)?.title) {
                     el.innerText = oldTitle;
                     el.removeAttribute(ATTR_MARK);
                  }
               });
         }
      }

   },
   options: {
      thumbnails_title_normalize_show_full: {
         _tagName: 'input',
         label: 'Show full title',
         'label:zh': '显示完整标题',
         'label:ja': '完全なタイトルを表示',
         'label:ko': '전체 제목 표시',
         'label:id': 'Tampilkan judul lengkap',
         'label:es': 'Mostrar título completo',
         'label:pt': 'Mostrar título completo',
         'label:fr': 'Afficher le titre complet',
         'label:it': 'Mostra il titolo completo',
         // 'label:tr': 'Tam başlığı göster',
         'label:de': 'Vollständigen Titel anzeigen',
         'label:pl': 'Pokaż pełny tytuł',
         'label:ua': 'Показати повну назву',
         type: 'checkbox'
      },
      thumbnails_title_normalize_smart_max_words: {
         _tagName: 'input',
         label: 'Max words in uppercase',
         'label:zh': '大写字数上限',
         'label:ja': '大文字の最大単語数',
         'label:ko': '대문자의 최대 단어 수',
         'label:id': 'Maks kata dalam huruf besar',
         'label:es': 'Máximo de palabras en mayúsculas',
         'label:pt': 'Máximo de palavras em maiúsculas',
         'label:fr': 'Mots maximum en majuscules',
         'label:it': 'Max parole in maiuscolo',
         // 'label:tr': 'Büyük harfli maksimum kelime',
         'label:de': 'Maximale Wörter in Großbuchstaben',
         'label:pl': 'Maksymalna liczba słów pisanych wielkimi literami',
         'label:ua': 'Максимальна кількість слів ВЕЛИКИМИ літерами',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         min: 1,
         max: 10,
         value: 2,
      },
      thumbnails_title_clear_emoji: {
         _tagName: 'input',
         label: 'Remove emoji',
         // label: 'Remove symbols and emoji',
         'label:zh': '从表情符号中清除标题',
         'label:ja': 'クリア絵文字',
         'label:ko': '이모티콘 지우기',
         'label:id': 'Hapus emoji',
         'label:es': 'Borrar emoji',
         'label:pt': 'Limpar emoji',
         'label:fr': 'Emoji clair',
         'label:it': 'Emoji trasparenti',
         // 'label:tr': 'Emojiyi temizle',
         'label:de': 'Emoji löschen',
         'label:pl': 'Usuń emoji',
         'label:ua': 'Очистити емодзі',
         type: 'checkbox',
         // title: '',
      },
      thumbnails_title_clear_symbols: {
         _tagName: 'input',
         label: 'Remove symbols',
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
         // title: '',
      },
   }
});
