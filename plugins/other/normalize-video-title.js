_plugins_conteiner.push({
   name: 'Normalize videos title',
   id: 'normalize-videos-title',
   depends_on_pages: 'all, -embed, -results',
   opt_section: 'other',
   desc: 'Decapitalize videos title',
   _runtime: user_settings => {

      const
         VIDEO_TITLE_SELECTOR = '#video-title', // '.title, #video-title';
         MAX_TITLE_WORDS = +user_settings.smart_normalize_title_max_words || 2,
         ATTR_MARK = 'title-normalized';

      if (user_settings.show_full_video_title) {
         YDOM.css.add(
            VIDEO_TITLE_SELECTOR + `{
               display: block !important;
               max-height: unset !important;
            }`);
      }

      if (user_settings.smart_normalize_title) {
         // Letters (Lu): Upper case letter unicode
         // https://apps.timwhitlock.info/js/regex
         const UpperCaseLetterRegex = new RegExp("([A-ZÀ-ÖØ-ÞĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĽĿŁŃŅŇŊŌŎŐŒŔŖŘŚŜŞŠŢŤŦŨŪŬŮŰŲŴŶŸ-ŹŻŽƁ-ƂƄƆ-ƇƉ-ƋƎ-ƑƓ-ƔƖ-ƘƜ-ƝƟ-ƠƢƤƦ-ƧƩƬƮ-ƯƱ-ƳƵƷ-ƸƼǄǇǊǍǏǑǓǕǗǙǛǞǠǢǤǦǨǪǬǮǱǴǶ-ǸǺǼǾȀȂȄȆȈȊȌȎȐȒȔȖȘȚȜȞȠȢȤȦȨȪȬȮȰȲȺ-ȻȽ-ȾɁɃ-ɆɈɊɌɎͰͲͶΆΈ-ΊΌΎ-ΏΑ-ΡΣ-ΫϏϒ-ϔϘϚϜϞϠϢϤϦϨϪϬϮϴϷϹ-ϺϽ-ЯѠѢѤѦѨѪѬѮѰѲѴѶѸѺѼѾҀҊҌҎҐҒҔҖҘҚҜҞҠҢҤҦҨҪҬҮҰҲҴҶҸҺҼҾӀ-ӁӃӅӇӉӋӍӐӒӔӖӘӚӜӞӠӢӤӦӨӪӬӮӰӲӴӶӸӺӼӾԀԂԄԆԈԊԌԎԐԒԔԖԘԚԜԞԠԢԱ-ՖႠ-ჅḀḂḄḆḈḊḌḎḐḒḔḖḘḚḜḞḠḢḤḦḨḪḬḮḰḲḴḶḸḺḼḾṀṂṄṆṈṊṌṎṐṒṔṖṘṚṜṞṠṢṤṦṨṪṬṮṰṲṴṶṸṺṼṾẀẂẄẆẈẊẌẎẐẒẔẞẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỺỼỾἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙὛὝὟὨ-ὯᾸ-ΆῈ-ΉῘ-ΊῨ-ῬῸ-Ώℂℇℋ-ℍℐ-ℒℕℙ-ℝℤΩℨK-ℭℰ-ℳℾ-ℿⅅↃⰀ-ⰮⱠⱢ-ⱤⱧⱩⱫⱭ-ⱯⱲⱵⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⲲⲴⲶⲸⲺⲼⲾⳀⳂⳄⳆⳈⳊⳌⳎⳐⳒⳔⳖⳘⳚⳜⳞⳠⳢꙀꙂꙄꙆꙈꙊꙌꙎꙐꙒꙔꙖꙘꙚꙜꙞꙢꙤꙦꙨꙪꙬꚀꚂꚄꚆꚈꚊꚌꚎꚐꚒꚔꚖꜢꜤꜦꜨꜪꜬꜮꜲꜴꜶꜸꜺꜼꜾꝀꝂꝄꝆꝈꝊꝌꝎꝐꝒꝔꝖꝘꝚꝜꝞꝠꝢꝤꝦꝨꝪꝬꝮꝹꝻꝽ-ꝾꞀꞂꞄꞆꞋＡ-Ｚ]|\ud801[\udc00-\udc27]|\ud835[\udc00-\udc19\udc34-\udc4d\udc68-\udc81\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb5\udcd0-\udce9\udd04-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd38-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd6c-\udd85\udda0-\uddb9\uddd4-\udded\ude08-\ude21\ude3c-\ude55\ude70-\ude89\udea8-\udec0\udee2-\udefa\udf1c-\udf34\udf56-\udf6e\udf90-\udfa8\udfca]){2,}", 'g');

         // first letter uppercase
         YDOM.css.add({
            'text-transform': 'uppercase',
            // color: '#8A2BE2', // indicator
         }, `[${ATTR_MARK}]:first-letter`, 'important');

         YDOM.HTMLElement.watch({
            selector: VIDEO_TITLE_SELECTOR + ':not(:empty)',
            attr_mark: ATTR_MARK,
            callback: title => {
               let counterUpperCase = 0;
               const normalizedText = title.textContent.replace(UpperCaseLetterRegex, match => {
                  // console.debug('match', match);
                  counterUpperCase++;
                  return match.toLowerCase();
               });

               // Upper case
               if (counterUpperCase > MAX_TITLE_WORDS) {
                  title.textContent = normalizedText.trim();
                  // console.debug('normalize:', counterUpperCase, '\n' + title.title, '\n' + title.textContent);
               }
            }
         });

      } else {
         YDOM.css.add(
            VIDEO_TITLE_SELECTOR + `{
               text-transform: lowercase !important;
            }
            ${VIDEO_TITLE_SELECTOR}:first-letter {
               text-transform: uppercase !important;
            }`);
      }

   },
   opt_export: {
      'show_full_video_title': {
         _tagName: 'input',
         label: 'Show full title',
         type: 'checkbox'
      },
      'smart_normalize_title': {
         _tagName: 'input',
         label: 'Smart mode',
         type: 'checkbox',
         title: 'Filter words by regex pattern',
      },
      'smart_normalize_title_max_words': {
         _tagName: 'input',
         label: 'Max words in uppercase',
         type: 'number',
         // title: '',
         placeholder: '1-10',
         min: 1,
         max: 10,
         value: 2,
         'data-dependent': '{"smart_normalize_title":"true"}',
      },
   },
});
