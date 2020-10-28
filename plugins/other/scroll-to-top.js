_plugins.push({
   name: 'Scroll to top button',
   id: 'scroll-to-top',
   section: 'global',
   depends_page: 'all, -embed',
   desc: 'Displayed on long pages',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: 'body',
         callback: () => {
            const SELECTOR_ID = 'scrollToTop_bth';

            // create bth
            let bth = document.createElement('button');
            bth.id = SELECTOR_ID;
            Object.assign(bth.style, {
               position: 'fixed',
               cursor: 'pointer',
               bottom: 0,
               left: '20%',
               // display: 'none',
               visibility: 'hidden',
               opacity: 0.5,
               width: '40%',
               height: '40px',
               border: 'none',
               // transition: 'opacity 200ms ease-in',
               outline: 'none',
               'border-radius': '100% 100% 0 0',
               'font-size': '16px',
               'background-color': 'rgba(0,0,0,0.3)',
               'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4)',
            });
            bth.addEventListener('click', () => window.scrollTo({
               top: 0,
               left: window.pageXOffset,
               behavior: user_settings.scroll_to_top_smooth ? 'smooth' : 'instant',
            }));

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
            bth.appendChild(arrow);
            document.body.appendChild(bth);

            // bth hover style
            YDOM.injectStyle(`#${SELECTOR_ID}:hover {
               opacity: 1 !important;
            }`);

            // scroll event
            const scrollToTop_bth = document.getElementById(SELECTOR_ID);
            let sOld;
            window.addEventListener('scroll', () => {
               const sNow = document.documentElement.scrollTop > (window.innerHeight / 2);
               if (sNow === sOld) return;
               sOld = sNow;
               scrollToTop_bth.style.visibility = sNow ? 'visible' : 'hidden';
               // console.debug('visibility:', scrollToTop_bth.style.visibility);
            });
         },
      });

   },
   opt_export: {
      'scroll_to_top_smooth': {
         _elementType: 'input',
         label: 'Smooth',
         type: 'checkbox',
      },
   },
});
