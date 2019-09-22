_plugins.push({
   name: 'Scroll to top button',
   id: 'scroll-to-top',
   section: 'global',
   depends_page: 'all, -embed',
   desc: 'added in long pages',
   _runtime: user_settings => {

      YDOM.waitFor('body', body => {
         // create button and add styleы
         let scrollToTop_bth = (() => {
            const bthId = 'scrollToTop_bth';

            let bth = document.createElement('button');
            let arrow = document.createElement('i');
            bth.appendChild(arrow);
            bth.id = bthId;
            document.body.appendChild(bth);

            // bth
            YDOM.injectStyle({
               position: 'fixed',
               cursor: 'pointer',
               'z-index': -1,
               bottom: 0,
               left: '20%',
               // display: 'none',
               opacity: 0,
               width: '40%',
               height: '40px',
               border: 'none',
               // transition: 'opacity 200ms ease-in',

               outline: 'none',
               'border-radius': '100% 100% 0 0',
               'font-size': '16px',
               'background-color': 'rgba(0,0,0,0.3)',
            }, '#' + bthId);

            // arrow
            YDOM.injectStyle('#' + bthId + ' > * {\
            border: solid white;\
            border-width: 0 3px 3px 0;\
            display: inline-block !important;\
            padding: 4px;\
            vertical-align: middle;\
            transform: rotate(-135deg);\
         }\
         #' + bthId + ':hover {\
           opacity: 1 !important;\
           box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);\
         }');

            return document.getElementById(bthId);

         })();

         let scroll_position = {
            top: 0,
            left: window.pageXOffset,
            behavior: 'instant' //'smooth'
         };

         if (user_settings.scroll_to_top_smooth) scroll_position.behavior = 'smooth';

         scrollToTop_bth.addEventListener('click', () => window.scrollTo(scroll_position));

         window.addEventListener('scroll', () => {
            if (document.documentElement.scrollTop > (window.innerHeight / 2)) {
               // scrollToTop_bth.style.display = "block";
               scrollToTop_bth.style.zIndex = 1;
               scrollToTop_bth.style.opacity = 0.5;

            } else {
               // scrollToTop_bth.style.display = "none";
               scrollToTop_bth.style = ''
            }
         });
      });

   },
   export_opt: (function () {
      return {
         'scroll_to_top_smooth': {
            _elementType: 'input',
            label: 'Smooth',
            type: 'checkbox',
         },
      };
   }()),
});
