// https://www.youtube.com/watch?v=9EvbqxBUG_c - great for testing
// https://www.youtube.com/watch?v=Il0S8BoucSA&t=99 - subtitle alignment bug
// https://youtu.be/XvJRE6Sm-lM - has sub (multi)
// https://www.youtube.com/watch?v=gsuJgNjDMSE - has sub (multi)
// https://www.youtube.com/watch?v=jz-hkKgcuF0 - has sub (eng)

window.nova_plugins.push({
   id: 'subtitle-lang',
   title: 'Subtitles language',
   'title:zh': '字幕语言',
   'title:ja': '字幕言語',
   'title:ko': '자막 언어',
   'title:id': 'Bahasa subtitle',
   'title:es': 'Idioma de los subtítulos',
   'title:pt': 'Idioma das legendas',
   'title:fr': 'Langue des sous-titres',
   'title:it': 'Lingua dei sottotitoli',
   'title:tr': 'Altyazı dili',
   'title:de': 'Untertitelsprache',
   'title:pl': 'Język napisów',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: 'captions',
   _runtime: user_settings => {

      if (!user_settings.subtitle_lang) throw 'Nova subtitle lang is empty';

      // Strategy 1
      // Вoes not work with auto translation
      // NOVA.waitElement('#movie_player video')
      //    .then(video => video.addEventListener('play', selectSubtitles));

      // function selectSubtitles() {
      //    movie_player.toggleSubtitles();

      //    const langData = movie_player
      //       .getOption('captions', 'tracklist', { includeAsr: true })
      //       // {
      //       //    displayName: "English"
      //       //    id: null
      //       //    is_default: false
      //       //    is_servable: false
      //       //    is_translateable: true
      //       //    kind: ""
      //       //    languageCode: "en"
      //       //    languageName: "English"
      //       //    name: null
      //       //    vss_id: ".en"
      //       // }
      //       ?.find(({ languageCode }) => languageCode == user_settings.subtitle_lang);

      //    if (langData && Object.keys(langData).length) {
      //       console.debug('>', langData);
      //       movie_player.setOption('captions', 'track', langData);
      //    }
      // }


      // Strategy 2
      const localYT = {
         en: {
            // subtitles: 'Subtitles/CC',
            subtitles: 'Subtitles',
            translate: 'Auto-translate',
            lang: 'English',
         },
         cn: {
            subtitles: '字幕',
            translate: '自动翻译',
            // lang: '中文（简体）',
            lang: '简体',
         },
         ja: {
            subtitles: '字幕',
            translate: '自動翻訳',
            lang: '日本語',
         },
         ko: {
            subtitles: '자막',
            translate: '자동 번역',
            lang: '한국어',
         },
         id: {
            // subtitles: 'Subtitel/CC',
            subtitles: 'Subtitel',
            translate: 'Terjemahkan otomatis',
            lang: 'Indonesia',
         },
         de: {
            subtitles: 'Untertitel',
            translate: 'Automatisch übersetzen',
            lang: 'Deutsch',
         },
         fr: {
            subtitles: 'Sous-titres',
            translate: 'Traduire automatiquement',
            lang: 'Français',
         },
         it: {
            subtitles: 'Sottotitoli',
            translate: 'Traduzione automatica',
            lang: 'Italiano',
         },
         es: {
            subtitles: 'Subtítulos',
            translate: 'Traducir automáticamente',
            lang: 'Español',
         },
         pt: {
            // subtitles: 'Legendas/CC',
            subtitles: 'Legendas',
            translate: 'Traduzir automaticamente',
            lang: 'Português',
         },
         tr: {
            subtitles: 'Altyazılar',
            translate: 'Otomatik çevir',
            lang: 'Türkçe',
         },
         pl: {
            subtitles: 'Napisy',
            translate: 'Przetłumacz automatycznie',
            lang: 'Polski',
         },
         // ru: {
         //    subtitles: 'Субтитры',
         //    translate: 'Перевести',
         //    lang: 'Русский',
         // },
      };

      // selectSubtitles
      NOVA.waitElement('#movie_player video')
         .then(video => video.addEventListener('loadeddata', selectSubtitles.apply(this, [localYT[user_settings.subtitle_lang]])));

      function selectSubtitles({ subtitles, translate, lang }) {
         // console.debug('selectSubtitles lang_name', ...arguments);

         // NOVA.waitElement('.ytp-settings-menu')
         NOVA.waitElement('.caption-window')
            .then(async () => {
               // console.debug('>', settings_btn);

               movie_player.toggleSubtitlesOn();

               const settingsButton = await NOVA.waitUntil(() => document.querySelector('button.ytp-settings-button'));
               settingsButton.click();

               const subtitlesItem = await NOVA.waitUntil(() => getMenuByLabel(subtitles));
               // console.debug('subtitles', subtitlesItem);
               subtitlesItem.click();

               // there is no automatic translation
               if (langItem = getMenuByLabel(lang)) {
                  // console.debug('langItem#1', langItem);
                  langItem.click();

               } else {
                  // const autoTranslate = [...document.querySelectorAll('.ytp-menuitem:last-child')].pop();
                  const autoTranslate = await NOVA.waitUntil(() => getMenuByLabel(translate));
                  // console.debug('autoTranslate', autoTranslate);
                  autoTranslate.click();

                  langItem = await NOVA.waitUntil(() => getMenuByLabel(lang));
                  // console.debug('langItem', langItem);
                  langItem.click();
               }

               function getMenuByLabel(name = required()) {
                  name = name.toLocaleLowerCase();
                  return [...document.querySelectorAll('.ytp-menuitem')]
                     .find(e => e.textContent.toLocaleLowerCase().includes(name));
                  // .closest('.ytp-menuitem');
               }

               document.body.click(); // hide menuitem
            });
      }

   },
   options: {
      subtitle_lang: {
         _tagName: 'select',
         label: 'Subtitle language',
         'label:zh': '字幕语言',
         'label:ja': 'サブタイトル言語',
         'label:ko': '자막 언어',
         'label:id': 'Bahasa subtitle',
         'label:es': 'Idioma de los subtítulos',
         'label:pt': 'Idioma das legendas',
         'label:fr': 'Langue des sous-titres',
         'label:it': 'Lingua dei sottotitoli',
         'label:tr': 'Altyazı dili',
         'label:de': 'Untertitelsprache',
         'label:pl': 'Język napisów',
         // multiple: null,
         options: [
            { label: 'English', value: 'en', selected: true },
            { label: '字幕', value: 'cn' },
            { label: '字幕', value: 'ja' },
            { label: '한국어', value: 'ko' },
            { label: 'Indonesia', value: 'id' },
            { label: 'Français', value: 'fr' },
            { label: 'Deutsch', value: 'de' },
            { label: 'Italiano', value: 'it' },
            { label: 'Español', value: 'es' },
            { label: 'Português', value: 'pt' },
            { label: 'Türkçe', value: 'tr' },
            { label: 'Polski', value: 'pl' },
         ],
      },
   }
});
