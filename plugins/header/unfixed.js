window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header bar unfixed',
   'title:zh': '标题栏不固定',
   'title:ja': 'ヘッダーバーは固定されていません',
   // run_on_pages: 'watch, channel',
   run_on_pages: 'all, -results',
   // restart_on_transition: true,
   section: 'header',
   desc: 'Prevents header from sticking',
   'desc:zh': '防止头部粘连',
   'desc:ja': 'ヘッダーがくっつくのを防ぎます',
   _runtime: user_settings => {

      NOVA.css.push(
         `#masthead-container, ytd-mini-guide-renderer, #guide {
            position: absolute !important;
         }
         #chips-wrapper {
            position: sticky !important;
         }`);

      if (user_settings.header_scroll_after) {
         scrollAfter(); // init state

         document.addEventListener('yt-navigate-finish', () => {
            scrollAfter(); // no sense. Youtube auto-scroll up when page is transition
            NOVA.waitElement('video')
               .then(video => {
                  video.addEventListener('loadeddata', scrollAfter, { capture: true, once: true });
               });
         });

         createArrowButton();

         function scrollAfter() {
            if (topOffset = document.getElementById('masthead')?.offsetHeight) {
               window.scrollTo({ top: topOffset });
            }
         }

         // create arrow button
         function createArrowButton() {
            const scrollDownButton = document.createElement('button');
            scrollDownButton.textContent = '▼';
            scrollDownButton.title = 'Scroll down';
            Object.assign(scrollDownButton.style, {
               cursor: 'pointer',
               background: 'transparent',
               color: 'deepskyblue',
               border: 'none',
            });
            scrollDownButton.onclick = scrollAfter;

            if (endnode = document.getElementById('end')) {
               endnode.parentElement.insertBefore(scrollDownButton, endnode);
            }
         }
      }

   },
   options: {
      header_scroll_after: {
         _tagName: 'input',
         label: 'Scroll after header',
         'label:zh': '在标题后滚动',
         'label:ja': 'ヘッダーの後にスクロール',
         title: 'Makes sense on a small screen',
         'title:zh': '在小屏幕上有意义',
         'title:ja': '小さな画面で意味があります',
         type: 'checkbox',
      },
   },
});
