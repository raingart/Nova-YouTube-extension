window.nova_plugins.push({
   id: 'scrollbar-hide',
   title: 'Hide scrollbar (for watch page)',
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
   'title:ua': 'Приховати смугу прокрутки на сторінці перегляду',
   run_on_pages: 'watch, -mobile',
   // run_on_pages: '*, live_chat, -embed, -mobile',
   section: 'other',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/452948-youtube-disable-scrollbar
      // alt2 - https://greasyfork.org/en/scripts/423150-youtube-scrollbar-remove

      const HIDE_SCROLL_ATTR = 'nova-scrollbar-hide';

      NOVA.css.push(
         `html[${HIDE_SCROLL_ATTR}] {
            scrollbar-width: none;
         }
         html[${HIDE_SCROLL_ATTR}] body::-webkit-scrollbar {
            width: 0px;
            height: 0px;
         }`);

      // update state on page changed
      // document.addEventListener('yt-navigate-finish', () => {
      NOVA.runOnPageLoad(() => {
         const hasAttr = document.documentElement.hasAttribute(HIDE_SCROLL_ATTR);

         if ((NOVA.currentPage == 'watch') && !hasAttr) {
            document.documentElement.setAttribute(HIDE_SCROLL_ATTR, true); // add
         }
         else if ((NOVA.currentPage != 'watch') && hasAttr) {
            document.documentElement.removeAttribute(HIDE_SCROLL_ATTR); // remove
         }
      });

      if (user_settings.scrollbar_hide_toggle_on_scroll) {
         // toggle on scroll
         window.addEventListener('scroll', function blink() {
            if (NOVA.currentPage != 'watch') return;

            if (document.documentElement.scrollHeight > window.innerHeight) {

               if (document.documentElement.hasAttribute(HIDE_SCROLL_ATTR)) {
                  document.documentElement.removeAttribute(HIDE_SCROLL_ATTR); // remove
               }
               if (typeof blink.fade === 'number') clearTimeout(blink.fade); // reset timeout
               blink.fade = setTimeout(() => {
                  document.documentElement.setAttribute(HIDE_SCROLL_ATTR, true); // add
               }, 700); // 700ms
            }
         });
      }

      // if (user_settings.scrollbar_hide_livechat && NOVA.currentPage.includes('live_chat')) {
      //    return NOVA.css.push(
      //       `*,
      //       #item-scroller {
      //          -ms-overflow-style: none; /* for Internet Explorer, Edge */
      //          scrollbar-width: none; /* for Firefox */
      //       }
      //       *::-webkit-scrollbar,
      //       #item-scroller::-webkit-scrollbar {
      //          display: none; /* for Chrome, Safari, and Opera */
      //       }`);
      // }

   },
   options: {
      scrollbar_hide_toggle_on_scroll: {
         _tagName: 'input',
         label: 'Showing on scroll',
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
         type: 'checkbox',
         // title: '',
      },
      // scrollbar_hide_livechat: {
      //    _tagName: 'input',
      //    label: 'In live-chat frame',
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
      //    'label:ua': 'У живому чаті',
      //    type: 'checkbox',
      //    // title: '',
      //    'data-dependent': { 'livechat_visibility_mode': ['!disable'] }, // conflict with plugin [livechat-visibility]
      // },
   }
});
