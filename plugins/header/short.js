_plugins_conteiner.push({
   name: 'Short Header',
   id: 'header-short',
   depends_on_pages: 'all',
   opt_section: 'header',
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
