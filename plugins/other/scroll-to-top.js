_plugins.push({
   name: 'Scroll to top button',
   id: 'scroll-to-top',
   section: 'other',
   depends_page: 'watch, channel, results, playlist, null',
   // desc: '',
   _runtime: user_settings => {

      let scrollToTop_bth = (() => {
         let bth_Id = 'scrollToTop_bth';

         document.documentElement.insertAdjacentHTML("beforeend", '<button id="' + bth_Id + '"><i></i></button>');

         let initcss = {
            position: 'fixed',
            cursor: 'pointer',
            'z-index': -1,
            bottom: '10px',
            left: '10px',
            // display: 'none',
            opacity: 0,
            'background-color': 'darkgray',
            width: '40px',
            height: '40px',
            'border-radius': '5px',
            border: 'none',
            transition: 'opacity 200ms ease-in',
         }
         YDOM.injectStyle(initcss, '#' + bth_Id);

         initcss = '#' + bth_Id + ' > * {\
            border: solid white;\
            border-width: 0 3px 3px 0;\
            display: inline-block !important;\
            padding: 4px;\
            vertical-align: middle;\
            transform: rotate(-135deg);\
         }\
         #' + bth_Id + ':hover {\
           opacity: 1 !important;\
         }'
         YDOM.injectStyle(initcss);

         return document.getElementById(bth_Id);

      })();

      scrollToTop_bth.addEventListener('click', () => window.scrollTo({
         top: 0,
         left: window.pageXOffset,
         behavior: 'smooth'
      }));

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

   },
});
