window.nova_plugins.push({
   id: 'header-short',
   title: 'Compact header',
   run_on_pages: 'all',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      const height = '36px';

      NOVA.css.push(
         `#masthead #container.ytd-masthead {
            height: ${height} !important;
         }

         body {
            --ytd-masthead-height: ${height};
         }`);

   },
});
