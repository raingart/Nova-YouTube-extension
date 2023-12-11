// for test
// https://www.youtube.com/channel/UCqnWGqWpWLvnw9fowQ9Y3Uw - click error (nth-child out)
// https://www.youtube.com/pencilmation - unsupported
// https://www.youtube.com/rhino - unsupported
// https://www.youtube.com/@YouTube?app=desktop
// https://www.youtube.com/c/YouTube
// https://www.youtube.com/channel/UCK9X9JACEsonjbqaewUtICA - old
// https://www.youtube.com/channel/UCG6TrwqzkWwvWiY2eUny8TA - does not have a "video" tab
// https://www.youtube.com/channel/UCPJ_rWazdbheOzQuqNQpKwg - does not have a "video" tab

window.nova_plugins.push({
   id: 'channel-default-tab',
   title: 'Default tab on channel page',
   'title:zh': '频道页默认选项卡',
   'title:ja': 'チャンネルページのデフォルトタブ',
   'title:ko': '채널 페이지의 기본 탭',
   'title:id': 'Tab default di halaman saluran',
   'title:es': 'La pestaña predeterminada en la página del canal',
   'title:pt': 'A guia padrão na página do canal',
   'title:fr': 'Onglet par défaut sur la page de la chaîne',
   'title:it': 'Scheda predefinita nella pagina del canale',
   // 'title:tr': 'Kanal sayfasındaki varsayılan sekme',
   'title:de': 'Die Standardregisterkarte auf der Kanalseite',
   'title:pl': 'Domyślna karta na stronie kanału',
   'title:ua': 'Вкладка за умовчанням на сторінці каналу',
   // run_on_pages: 'channel, -mobile',
   // run_on_pages: 'channel, watch',
   run_on_pages: 'channel',
   restart_on_location_change: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      // TODO bug on click (https://www.youtube.com/@bluearchive_Global/community)
      // 'shorts', 'streams', 'playlists' tabs do not exist in all channels

      // alt1 - https://greasyfork.org/en/scripts/445640-yt-video-tab-by-default
      // alt2 - https://greasyfork.org/en/discussions/requests/56798-request-make-videoes-the-default-tab-on-youtube-channels
      // alt3 - https://greasyfork.org/en/scripts/466003-e-youtube-channel-page-auto-click-videos-and-then-latest-may-2023
      // alt4 - https://greasyfork.org/en/scripts/407945-youtube-2020-improvements

      // if (NOVA.currentPage == 'watch') {
      //    // mouse left click
      // document.addEventListener('click', evt => {
      //    patchLink(evt.target);
      //    evt.stopPropagation();
      // }, { capture: true });
      //    // document.addEventListener('click', ({ target }) => patchLink(target), { capture: true });
      //    // // mouse middle click
      //    // document.addEventListener('auxclick', evt => evt.button === 1 && patchLink(evt.target), { capture: true });

      //    // function patchLink(a = required()) {
      //    //    const linkSelector = '#channel-name a';

      //    //    if (!a.matches(linkSelector)) {
      //    //       if (!(a = a.closest(linkSelector))) return;
      //    //    }

      //    //    a.href += '/' + user_settings.channel_default_tab;

      //    //    if (a.data?.commandMetadata?.webCommandMetadata?.url) {
      //    //       a.data.commandMetadata.webCommandMetadata.url += '/' + user_settings.channel_default_tab;
      //    //    }
      //    //    if (a.data.browseEndpoint.canonicalBaseUrl) {
      //    //       a.data.browseEndpoint.canonicalBaseUrl += '/' + user_settings.channel_default_tab;
      //    //    }
      //    // }

      //    NOVA.waitSelector('#owner #channel-name a', { destroy_if_url_changes: true })
      //       .then(async a => {
      //          a.href += '/' + user_settings.channel_default_tab;

      //          await NOVA.waitUntil(() => a.data?.commandMetadata?.webCommandMetadata?.url, 100);
      //          a.data.commandMetadata.webCommandMetadata.url += '/' + user_settings.channel_default_tab;
      //          // a.data.commandMetadata.webCommandMetadata.url.replace('/@', '/c/')
      //          a.data.browseEndpoint.canonicalBaseUrl += '/' + user_settings.channel_default_tab;
      //       });
      //    return;
      // }
      // return

      if (NOVA.channelTab) return;

      if (user_settings.channel_default_tab_mode == 'redirect') {

         switch (user_settings.channel_default_tab_thumbs_sort) {
            case 'popular':
               location.assign(`${location.protocol}//${location.hostname}/${location.pathname}/${user_settings.channel_default_tab}?SRT=P`);
               return;
               break;

            // case 'newest':
            // default:
            //    user_settings.channel_default_tab_thumbs_sort += '?SRT=R'; break;
         }
         location.pathname += '/' + user_settings.channel_default_tab;
      }
      else {
         const tabSelectors = '#tabsContent [role="tab"]';
         // tab select
         NOVA.waitSelector(tabSelectors, { destroy_if_url_changes: true })
            .then(() => {
               let tabActive;
               const tabs = [...document.body.querySelectorAll(tabSelectors)];
               switch (user_settings.channel_default_tab) {
                  // https://www.youtube.com/@channel/search?query=11
                  // case 'search':; break;
                  case 'videos': tabActive = tabs[1]; break;
                  // case 'shorts': ; break;
                  // case 'live': ; break;
                  case 'playlists': tabActive = tabs[tabs.length - 4]; break;
                  case 'community': tabActive = tabs[tabs.length - 3]; break;
                  case 'about': tabActive = tabs.pop(); break;
                  default:
                     location.pathname += '/' + user_settings.channel_default_tab;
               }
               // select tab
               tabActive?.click();
            });

         //    // tab select
         //    NOVA.waitSelector('#tabsContent>[role="tab"]:nth-child(2)[aria-selected="true"]', { destroy_if_url_changes: true })
         //       .then(() => {
         //          let tab_nth;
         //          switch (user_settings.channel_default_tab) {
         //             // case 'playlists': tab_nth = 6; break;
         //             // case 'about': tab_nth = 12; break;
         //             // case 'videos':
         //             default: tab_nth = 4;
         //          }
         //          // select tab
         //          document.body.querySelector(`#tabsContent>[role="tab"]:nth-child(${tab_nth})[aria-selected="false"]`)
         //             ?.click();
         //       });

         //    // for mobile
         //    // NOVA.waitSelector('.scbrr-tabs > a[role="tab"]')
         //    //    .then(() => {
         //    //       if (document.body.querySelector(`.scbrr-tabs > a[aria-selected="true"]`)) return;
         //    //       let tab_nth;
         //    //       switch (user_settings.channel_default_tab) {
         //    //          // case 'playlists': tab_nth = 6; break;
         //    //          // case 'about': tab_nth = 12; break;
         //    //          case 'videos': tab_nth = 2; break;
         //    //          // default: tab_nth = 2;
         //    //       }
         //    //       // select tab
         //    //       document.body.querySelector(`.scbrr-tabs > a:nth-child(${tab_nth})`)
         //    //          ?.click();
         //    //    });
      }

   },
   options: {
      channel_default_tab: {
         _tagName: 'select',
         label: 'Default tab',
         'label:zh': '默认标签页',
         'label:ja': 'デフォルトのタブ',
         'label:ko': '기본 탭',
         'label:id': 'tab bawaan',
         'label:es': 'Ficha predeterminada',
         'label:pt': 'Aba padrão',
         'label:fr': 'Onglet par défaut',
         'label:it': 'Scheda predefinita',
         // 'label:tr': 'Varsayılan sekme',
         'label:de': 'Standard-Tab',
         'label:pl': 'Domyślna karta',
         'label:ua': 'Вкладка за умовчанням',
         options: [
            {
               label: 'videos', value: 'videos', selected: true,
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
               'label:pl': 'wideo',
               'label:ua': 'відео',
            },
            {
               label: 'shorts', value: 'shorts',
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
            },
            {
               label: 'live', value: 'streams',
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
            },
            {
               label: 'playlists', value: 'playlists',
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
               'label:pl': 'playlista',
               'label:ua': 'плейлисти',
            },
            {
               label: 'community', value: 'community',
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
            },
            // {
            //    label: 'channels', value: 'channels',
            //    // 'label:zh': '',
            //    // 'label:ja': '',
            //    // 'label:ko': '',
            //    // 'label:id': '',
            //    // 'label:es': '',
            //    // 'label:pt': '',
            //    // 'label:fr': '',
            //    // 'label:it': '',
            //    // 'label:tr': '',
            //    // 'label:de': '',
            //    // 'label:pl': '',
            //    // 'label:ua': '',
            // },
            {
               label: 'about', value: 'about',
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
               'label:pl': 'o kanale',
               'label:ua': 'про канал',
            },
         ],
      },
      channel_default_tab_mode: {
         _tagName: 'select',
         label: 'Mode',
         'label:zh': '模式',
         'label:ja': 'モード',
         'label:ko': '방법',
         // 'label:id': 'Mode',
         'label:es': 'Modo',
         'label:pt': 'Modo',
         // 'label:fr': 'Mode',
         'label:it': 'Modalità',
         // 'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         'label:ua': 'Режим',
         // title: 'Redirect is safer but slower',
         // 'title:zh': '重定向是安全的，但速度很慢',
         // 'title:ja': 'リダイレクトは安全ですが遅くなります',
         // 'title:ko': '리디렉션이 더 안전하지만 느립니다',
         // 'title:id': 'Redirect lebih aman tetapi lebih lambat',
         // 'title:es': 'La redirección es más segura pero más lenta',
         // 'title:pt': 'O redirecionamento é mais seguro, mas mais lento',
         // 'title:fr': 'La redirection est plus sûre mais plus lente',
         // 'title:it': 'Il reindirizzamento è più sicuro ma più lento',
         // // 'title:tr': 'Yönlendirme daha güvenlidir ancak daha yavaştır',
         // 'title:de': 'Redirect ist sicherer, aber langsamer',
         // 'title:pl': 'Przekierowanie jest bezpieczniejsze, ale wolniejsze',
         // 'title:ua': 'Перенаправлення безпечніше, але повільніше',
         options: [
            {
               label: 'redirect', value: 'redirect', selected: true,
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
               'label:pl': 'przekierowanie',
               'label:ua': 'перенаправити',
            },
            {
               label: 'click', /*value: '',*/
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
               'label:pl': 'klik',
               'label:ua': 'клік',
            },
         ],
         'data-dependent': { 'channel_default_tab': ['videos', 'playlists', 'community', 'about'] },
      },
      channel_default_tab_thumbs_sort: {
         _tagName: 'select',
         label: 'Sort',
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
         // title: '',
         options: [
            {
               label: 'newest', /*value: 'newest',*/ selected: true,
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
            },
            {
               label: 'popular', value: 'popular',
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
            },
         ],
         'data-dependent': { 'channel_default_tab_mode': ['redirect'] },
      },
   }
});
