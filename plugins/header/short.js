_plugins_conteiner.push({
   id: 'header-short',
   title: 'Short header',
   run_on_pages: 'all',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      const height = '36px';

      YDOM.css.push(
         `#masthead #container.ytd-masthead {
            height: ${height} !important;
         }
         body {
            --ytd-masthead-height: ${height};
         }`);

   },
});
