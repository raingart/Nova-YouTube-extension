// https://www.youtube.com/watch?v=9EvbqxBUG_c - great for testing
// https://www.youtube.com/watch?v=Il0S8BoucSA&t=99 - subtitle alignment bug
// https://youtu.be/XvJRE6Sm-lM - has sub

window.nova_plugins.push({
   id: 'subtitle-lang',
   title: 'Subtitles language',
   'title:zh': '字幕语言',
   'title:ja': '字幕言語',
   'title:ko': '자막 언어',
   'title:es': 'Idioma de los subtítulos',
   'title:pt': 'Idioma das legendas',
   'title:fr': 'Langue des sous-titres',
   'title:tr': 'Altyazı dili',
   'title:de': 'Untertitelsprache',
   run_on_pages: 'watch, embed, -mobile',
   section: 'player',
   desc: 'captions',
   _runtime: user_settings => {

      if (!user_settings.subtitle_lang) throw 'Nova subtitle lang is empty';

      const localYT = {
         en: {
            subtitles: 'Subtitles/CC',
            translate: 'Auto-translate',
            lang: 'English',
         },
         cn: {
            subtitles: '字幕',
            translate: '自动翻译',
            lang: '中文（简体）',
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
         es: {
            subtitles: 'Subtítulos',
            translate: 'Traducir automáticamente',
            lang: 'Español',
         },
         pt: {
            subtitles: 'Legendas/CC',
            translate: 'Traduzir automaticamente',
            lang: 'Português',
         },
         tr: {
            subtitles: 'Altyazılar',
            translate: 'Otomatik çevir',
            lang: 'Türkçe',
         },
         ru: {
            subtitles: 'Субтитры',
            translate: 'Перевести',
            lang: 'Русский',
         },
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
                  return (a = [...document.querySelectorAll('.ytp-menuitem')]
                     .find(e => e.textContent.includes(name)));
                  // .closest('.ytp-menuitem');
               }

               document.body.click(); // hide menuitem
            });
      }

   },
   options: {
      subtitle_lang: {
         _tagName: 'select',
         label: 'Lang list',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:tr': '',
         // 'label:de': '',
         // multiple: null,
         options: [
            { label: 'English', value: 'en', selected: true },
            { label: '字幕', value: 'cn' },
            { label: '字幕', value: 'ja' },
            { label: '한국어', value: 'ko' },
            { label: 'Français', value: 'fr' },
            { label: 'Deutsch', value: 'de' },
            { label: 'Español', value: 'es' },
            { label: 'Português', value: 'pt' },
            { label: 'Türkçe', value: 'tr' },
            { label: 'Russian', value: 'ru' },
         ],
      },
   },
});
