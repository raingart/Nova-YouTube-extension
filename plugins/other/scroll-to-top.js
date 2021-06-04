_plugins_conteiner.push({
   name: 'Scroll to top button',
   id: 'scroll-to-top',
   depends_on_pages: 'all, -embed',
   opt_section: 'global',
   desc: 'Displayed on long pages',
   _runtime: (user_settings, current_page) => {

      const SELECTOR_ID = 'scrollToTop_btn';

      YDOM.HTMLElement.wait('body')
         .then(() => {
            // create btn
            let btn = document.createElement('button');
            btn.id = SELECTOR_ID;
            Object.assign(btn.style, {
               position: 'fixed',
               cursor: 'pointer',
               bottom: 0,
               left: '20%',
               // display: 'none',
               visibility: 'hidden',
               opacity: .5,
               width: '40%',
               height: '40px',
               border: 'none',
               // transition: 'opacity 200ms ease-in',
               outline: 'none',
               'z-index': 1,
               'border-radius': '100% 100% 0 0',
               'font-size': '16px',
               'background-color': 'rgba(0,0,0,.3)',
               'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .4)',
            });
            btn.addEventListener('click', event => {
               window.scrollTo({
                  top: 0,
                  left: window.pageXOffset,
                  behavior: user_settings.scroll_to_top_smooth ? 'smooth' : 'instant',
               });

               if (user_settings.scroll_to_top_autoplay && current_page === 'watch') {
                  document.querySelector('.html5-video-player')?.playVideo();
               }
            });

            // create arrow
            let arrow = document.createElement('span');
            Object.assign(arrow.style, {
               border: 'solid white',
               'border-width': '0 3px 3px 0',
               display: 'inline-block',
               padding: '4px',
               'vertical-align': 'middle',
               transform: 'rotate(-135deg)',
            });

            // append
            btn.appendChild(arrow);
            document.body.appendChild(btn);

            // btn hover style
            YDOM.css.push(
               `#${SELECTOR_ID}:hover {
                  opacity: 1 !important;
                  background-color: rgba(0,0,0,.6) !important;
               }`);

            // scroll event
            const scrollToTop_btn = document.getElementById(SELECTOR_ID);
            let sOld;
            window.addEventListener('scroll', () => {
               const sNow = document.documentElement.scrollTop > (window.innerHeight / 2);
               if (sNow == sOld) return;
               sOld = sNow;
               scrollToTop_btn.style.visibility = sNow ? 'visible' : 'hidden';
               // console.debug('visibility:', scrollToTop_btn.style.visibility);
            });
         });

   },
   opt_export: {
      'scroll_to_top_smooth': {
         _tagName: 'input',
         label: 'Smooth',
         type: 'checkbox',
      },
      'scroll_to_top_autoplay': {
         _tagName: 'input',
         label: 'Video unpause',
         type: 'checkbox',
      },
   },
});
