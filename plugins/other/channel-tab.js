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
   'title:tr': 'Kanal sayfasındaki varsayılan sekme',
   'title:de': 'Die Standardregisterkarte auf der Kanalseite',
   'title:pl': 'Domyślna karta na stronie kanału',
   run_on_pages: 'channel, -mobile',
   restart_on_transition: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      // if not - home page channel/user
      if (location.pathname.split('/').filter(i => i).length !== 2) return;

      if (user_settings.channel_default_tab_mode == 'redirect') {
         location.href += '/' + user_settings.channel_default_tab;

      } else {
         // tab select
         NOVA.waitElement('#tabsContent>[role="tab"]:nth-child(2)[aria-selected=true]')
            .then(() => {
               let tab_nth;
               switch (user_settings.channel_default_tab) {
                  case 'playlists': tab_nth = 6; break;
                  case 'about': tab_nth = 12; break;
                  // case 'videos':
                  default: tab_nth = 4;
               }
               // select tab
               document.body.querySelector(`#tabsContent>[role="tab"]:nth-child(${tab_nth})[aria-selected="false"`)
                  ?.click();
            });
      }

   },
   options: {
      channel_default_tab: {
         _tagName: 'select',
         label: 'Default tab',
         'label:zh': '默认标签页',
         'label:ja': 'デフォルトのタブ',
         'label:ko': '기본 탭',
         'label:id': '',
         'label:es': 'Ficha predeterminada',
         'label:pt': 'Aba padrão',
         'label:fr': 'Onglet par défaut',
         'label:it': '',
         'label:tr': 'Varsayılan sekme',
         'label:de': 'Standard-Tab',
         'label:pl': 'Domyślna karta',
         options: [
            { label: 'videos', value: 'videos', selected: true, 'label:pl': 'wideo' },
            { label: 'playlists', value: 'playlists', 'label:pl': 'playlista' },
            { label: 'about', value: 'about', 'label:pl': 'o kanale' },
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
         'label:tr': 'Mod',
         'label:de': 'Modus',
         'label:pl': 'Tryb',
         title: 'Redirect is safer but slower',
         'title:zh': '重定向是安全的，但速度很慢',
         'title:ja': 'リダイレクトは安全ですが遅くなります',
         'title:ko': '리디렉션이 더 안전하지만 느립니다',
         'title:id': 'Redirect lebih aman tetapi lebih lambat',
         'title:es': 'La redirección es más segura pero más lenta',
         'title:pt': 'O redirecionamento é mais seguro, mas mais lento',
         'title:fr': 'La redirection est plus sûre mais plus lente',
         'title:it': 'Il reindirizzamento è più sicuro ma più lento',
         'title:tr': 'Yönlendirme daha güvenlidir ancak daha yavaştır',
         'title:de': 'Redirect ist sicherer, aber langsamer',
         'title:pl': 'Przekierowanie jest bezpieczniejsze, ale wolniejsze',
         options: [
            { label: 'redirect', value: 'redirect', 'label:pl': 'przekierowanie' },
            { label: 'click', /*value: '',*/ selected: true, 'label:pl': 'klik' },
         ],
      },
   }
});
