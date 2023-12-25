window.nova_plugins.push({
   id: 'scrollbar-hide',
   title: 'Hide scrollbar (for watch page)',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   'title:ua': 'Приховати смугу прокрутки на сторінці перегляду',
   run_on_pages: '*, -embed, -mobile',
   // run_on_pages: '*, live_chat, -embed, -mobile',
   section: 'player',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/452948-youtube-disable-scrollbar
      // alt2 - https://greasyfork.org/en/scripts/423150-youtube-scrollbar-remove

      const HIDE_SCROLL_ATTR = 'nova-scrollbar-hide';

      NOVA.css.push(
         `html[${HIDE_SCROLL_ATTR}] body::-webkit-scrollbar {
            display: none;
         }`);

      NOVA.runOnPageInitOrTransition(() => {
         let hasAttr = document.documentElement.hasAttribute(HIDE_SCROLL_ATTR);
         if ((NOVA.currentPage == 'watch') && !hasAttr) {
            // document.documentElement.setAttribute(HIDE_SCROLL_ATTR, true); // add
            document.documentElement.toggleAttribute(HIDE_SCROLL_ATTR); // add
         }
         else if ((NOVA.currentPage != 'watch') && hasAttr) {
            document.documentElement.removeAttribute(HIDE_SCROLL_ATTR); // remove
         }
      });

      // scroll event
      // const needScroll = () => document.documentElement.scrollHeight > window.innerHeight;
      // let scrollbarState = needScroll();
      // window.addEventListener('scroll', () => {
      //    console.debug('', 1);
      //    if (NOVA.currentPage == 'watch') return;
      //    if (scrollbarState != needScroll()) {
      //       console.debug('', 111);
      //       scrollbarState = needScroll()
      //       document.documentElement.toggleAttribute(HIDE_SCROLL_ATTR);
      //    }
      // });

      // scroll page update
      // let pageHeight = document.documentElement.scrollHeight;
      // window.addEventListener('scroll', () => {
      //    if (document.documentElement.scrollHeight !== pageHeight) {
      //       pageHeight = document.documentElement.scrollHeight;

      //       // code
      //    }
      // });

      if (user_settings.scrollbar_hide_livechat && NOVA.currentPage.includes('live_chat')) {
         return NOVA.css.push(
            `*,
            #item-scroller {
               -ms-overflow-style: none; /* for Internet Explorer, Edge */
               scrollbar-width: none; /* for Firefox */
            }
            *::-webkit-scrollbar,
            #item-scroller::-webkit-scrollbar {
               display: none; /* for Chrome, Safari, and Opera */
            }`);
      }

   },
   options: {
      scrollbar_hide_livechat: {
         _tagName: 'input',
         label: 'In live-chat frame',
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
         'label:ua': 'У живому чаті',
         type: 'checkbox',
         // title: '',
         'data-dependent': { 'livechat_visibility_mode': ['!disable'] }, // conflict with plugin [livechat-visibility]
      },
   }
});
