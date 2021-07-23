window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header unfixed',
   run_on_pages: 'all',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      YDOM.css.push(
         `#masthead-container, ytd-mini-guide-renderer, #guide {
            position: absolute !important;
         }`);

   },
});
