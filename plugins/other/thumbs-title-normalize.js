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
   'title:tr': 'Küçük resim başlığının büyük harflerini kaldır',
   'title:de': 'Thumbnails-Titel entfernen',
   'title:pl': 'Zmniejsz czcionkę w tytule miniatur',
   run_on_pages: 'home, feed, channel, watch, -results',
   // run_on_pages: 'home, results, feed, channel, watch',
   // run_on_pages: 'all, -embed, -results',
   section: 'other',
   // desc: '',
   _runtime: user_settings => {

      const
         VIDEO_TITLE_SELECTOR = '#video-title:not(:empty):not([hidden]), a > h3.large-media-item-headline:not(:empty):not([hidden]), h1.title',
         MAX_CAPS_LETTERS = +user_settings.thumbnails_title_normalize_smart_max_words || 2,
         ATTR_MARK = 'nova-thumb-title-normalized',
         clearOfEmoji = str => str.replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, ' ').replace(/\s{2,}/g, ' ');

      // dirty fix bug with not updating thumbnails
      let oldSortQuery = NOVA.queryURL.get('sort');
      document.addEventListener('yt-navigate-finish', () => {
         if ((sortQuery = NOVA.queryURL.get('sort')) && sortQuery != oldSortQuery) {
            oldSortQuery = sortQuery;
            location.reload();
         }
      });
      // // document.addEventListener('yt-page-data-updated', () =>
      // document.addEventListener('yt-navigate-finish', () =>
      //    document.querySelectorAll(`[${ATTR_MARK}]`).forEach(e => e.removeAttribute(ATTR_MARK)));

      if (user_settings.thumbnails_title_normalize_show_full) {
         NOVA.css.push(
            VIDEO_TITLE_SELECTOR + `{
               display: block !important;
               max-height: unset !important;
            }`);
      }

      // Letters(Lu) + Dash punctuation(Pd) + Decimal number(Nd): Upper case letter unicode - https://apps.timwhitlock.info/js/regex
      const UpperCaseLetterRegex = new RegExp("([\-0-9A-ZÀ-ÖØ-ÞĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĽĿŁŃŅŇŊŌŎŐŒŔŖŘŚŜŞŠŢŤŦŨŪŬŮŰŲŴŶŸ-ŹŻŽƁ-ƂƄƆ-ƇƉ-ƋƎ-ƑƓ-ƔƖ-ƘƜ-ƝƟ-ƠƢƤƦ-ƧƩƬƮ-ƯƱ-ƳƵƷ-ƸƼǄǇǊǍǏǑǓǕǗǙǛǞǠǢǤǦǨǪǬǮǱǴǶ-ǸǺǼǾȀȂȄȆȈȊȌȎȐȒȔȖȘȚȜȞȠȢȤȦȨȪȬȮȰȲȺ-ȻȽ-ȾɁɃ-ɆɈɊɌɎͰͲͶΆΈ-ΊΌΎ-ΏΑ-ΡΣ-ΫϏϒ-ϔϘϚϜϞϠϢϤϦϨϪϬϮϴϷϹ-ϺϽ-ЯѠѢѤѦѨѪѬѮѰѲѴѶѸѺѼѾҀҊҌҎҐҒҔҖҘҚҜҞҠҢҤҦҨҪҬҮҰҲҴҶҸҺҼҾӀ-ӁӃӅӇӉӋӍӐӒӔӖӘӚӜӞӠӢӤӦӨӪӬӮӰӲӴӶӸӺӼӾԀԂԄԆԈԊԌԎԐԒԔԖԘԚԜԞԠԢԱ-Ֆ֊־٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉႐-႙Ⴀ-Ⴥ០-៩᠆᠐-᠙᥆-᥏᧐-᧙᭐-᭙᮰-᮹᱀-᱉᱐-᱙ḀḂḄḆḈḊḌḎḐḒḔḖḘḚḜḞḠḢḤḦḨḪḬḮḰḲḴḶḸḺḼḾṀṂṄṆṈṊṌṎṐṒṔṖṘṚṜṞṠṢṤṦṨṪṬṮṰṲṴṶṸṺṼṾẀẂẄẆẈẊẌẎẐẒẔẞẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỺỼỾἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙὛὝὟὨ-ὯᾸ-ΆῈ-ΉῘ-ΊῨ-ῬῸ-Ώ‐-―ℂℇℋ-ℍℐ-ℒℕℙ-ℝℤΩℨK-ℭℰ-ℳℾ-ℿⅅↃⰀ-ⰮⱠⱢ-ⱤⱧⱩⱫⱭ-ⱯⱲⱵⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⲲⲴⲶⲸⲺⲼⲾⳀⳂⳄⳆⳈⳊⳌⳎⳐⳒⳔⳖⳘⳚⳜⳞⳠⳢ⸗⸚〜〰゠꘠-꘩ꙀꙂꙄꙆꙈꙊꙌꙎꙐꙒꙔꙖꙘꙚꙜꙞꙢꙤꙦꙨꙪꙬꚀꚂꚄꚆꚈꚊꚌꚎꚐꚒꚔꚖꜢꜤꜦꜨꜪꜬꜮꜲꜴꜶꜸꜺꜼꜾꝀꝂꝄꝆꝈꝊꝌꝎꝐꝒꝔꝖꝘꝚꝜꝞꝠꝢꝤꝦꝨꝪꝬꝮꝹꝻꝽ-ꝾꞀꞂꞄꞆꞋ꣐-꣙꤀-꤉꩐-꩙︱-︲﹘﹣－０-９Ａ-Ｚ]|\ud801[\udc00-\udc27\udca0-\udca9]|\ud835[\udc00-\udc19\udc34-\udc4d\udc68-\udc81\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb5\udcd0-\udce9\udd04-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd38-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd6c-\udd85\udda0-\uddb9\uddd4-\udded\ude08-\ude21\ude3c-\ude55\ude70-\ude89\udea8-\udec0\udee2-\udefa\udf1c-\udf34\udf56-\udf6e\udf90-\udfa8\udfca\udfce-\udfff]){2,}", 'g');

      // Doesn't work.
      // // first letter uppercase
      // NOVA.css.push({
      //    'text-transform': 'uppercase',
      //    // color: '#8A2BE2', // indicator
      // }, `[${ATTR_MARK}]:first-letter`, 'important');

      NOVA.watchElements({
         selectors: VIDEO_TITLE_SELECTOR,
         attr_mark: ATTR_MARK,
         callback: title => {
            let countCaps = 0;
            const normalizedText = title.textContent.replace(UpperCaseLetterRegex, match => {
               // console.debug('match', match);
               countCaps++;
               // skip hasNumber
               return /\d/.test(match) ? match : match.toLowerCase();
            });

            // Upper case
            if (countCaps > MAX_CAPS_LETTERS) {
               title.textContent = normalizedText.trim();
               // console.debug('normalize:', countCaps, '\n' + title.title, '\n' + title.textContent);
            }

            if (user_settings.thumbnails_title_clear_emoji) {
               title.textContent = clearOfEmoji(title.textContent);
            }
         }
      });

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
         'label:tr': 'Tam başlığı göster',
         'label:de': 'Vollständigen Titel anzeigen',
         'label:pl': 'Pokaż pełny tytuł',
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
         'label:tr': 'Büyük harfli maksimum kelime',
         'label:de': 'Maximale Wörter in Großbuchstaben',
         'label:pl': 'Maksymalna liczba słów pisanych wielkimi literami',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         min: 1,
         max: 10,
         value: 2,
      },
      thumbnails_title_clear_emoji: {
         _tagName: 'input',
         label: 'Clear emoji',
         'label:zh': '从表情符号中清除标题',
         'label:ja': 'クリア絵文字',
         'label:ko': '이모티콘 지우기',
         'label:id': 'Hapus emoji',
         'label:es': 'Borrar emoji',
         'label:pt': 'Limpar emoji',
         'label:fr': 'Emoji clair',
         'label:it': 'Emoji trasparenti',
         'label:tr': 'Emojiyi temizle',
         'label:de': 'Emoji löschen',
         'label:pl': 'Usuń emoji',
         type: 'checkbox',
      },
   }
});
