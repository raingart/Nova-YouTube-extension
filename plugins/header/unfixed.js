window.nova_plugins.push({
   id: 'header-unfixed',
   title: 'Header bar unfixed',
   'title:zh': '标题栏不固定',
   'title:ja': 'ヘッダーバーは固定されていません',
   run_on_pages: 'all',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      NOVA.css.push(
         `#masthead-container, ytd-mini-guide-renderer, #guide {
            position: absolute !important;
         }
         #chips-wrapper {
            position: sticky !important;
         }`);

   },
});
