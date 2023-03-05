window.nova_plugins.push({
   id: 'scrollbar-hide',
   title: 'Hide scrollbar in watch page',
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
   // 'title:ua': '',
   run_on_pages: 'all, -embed, -mobile',
   // run_on_pages: 'all, live_chat, -embed, -mobile',
   section: 'other',
   _runtime: user_settings => {

      const HIDE_SCROLL_ATTR = 'nova-scrollbar-hide';

      NOVA.css.push(
         `html[${HIDE_SCROLL_ATTR}] body {
            overflow: hidden;
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

      if (user_settings.scrollbar_hide_livechat && NOVA.currentPage == 'live_chat') {
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
         label: 'In live-chat',
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
         'data-dependent': { 'livechat_visibility_mode': ['!disable'] }, // conflict with [livechat-visibility] plugin
      },
   }
});
