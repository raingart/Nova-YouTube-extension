window.nova_plugins.push({
   id: 'header-short',
   title: 'Header compact',
   'title:zh': '标题紧凑',
   'title:ja': 'ヘッダーコンパクト',
   'title:es': 'Encabezado compacto',
   'title:pt': 'Cabeçalho compacto',
   'title:de': 'Header kompakt',
   run_on_pages: 'all',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      const height = '36px';

      NOVA.css.push(
         `#masthead #container.ytd-masthead {
            height: ${height} !important;
         }

         #search-form, #search-icon-legacy {
            height: ${height} !important;
         }

         body {
            --ytd-masthead-height: ${height};
         }`);

   },
});
