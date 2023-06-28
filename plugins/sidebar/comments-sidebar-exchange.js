// for test
// https://www.youtube.com/@TheGoodLiferadio/streams

window.nova_plugins.push({
   id: 'comments-sidebar-position-exchange',
   title: 'Exchange comments/sidebar position',
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
   run_on_pages: 'watch, -mobile',
   // run_on_pages: 'watch, live_chat, -mobile',
   restart_on_location_change: true,
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://github.com/yakisova41/move-youtube-comments-to-sidebar

      if (user_settings.comments_visibility_mode == 'disable'
         || user_settings['comments-popup']
         // || user_settings['playlist-collapse']
      ) {
         return;
      }

      // conmments
      NOVA.waitSelector('ytd-watch-flexy:not([theater]) #below #comments', { stop_on_page_change: true })
         .then(comments => {
            document.querySelector('#secondary')?.appendChild(comments);

            Object.assign(comments.style, {
               height: '100vh',
               overflow: 'auto',
            });
            // NOVA.css.push(
            //    `#comments {
            //       height: 100vh !important;
            //       overflow: auto;
            //    }`);
         });

      // related
      NOVA.waitSelector('ytd-watch-flexy:not([theater]) #secondary #related', { stop_on_page_change: true })
         .then(related => {
            document.querySelector('#below')?.appendChild(related);
         });

   },
});
