window.nova_plugins.push({
   id: 'header-short',
   title: 'Compact header bar',
   'title:zh': '紧凑的标题栏',
   'title:ja': 'コンパクトなヘッダーバー',
   'title:es': 'Barra de cabecera compacta',
   'title:pt': 'Barra de cabeçalho compacta',
   'title:de': 'Kompakte Kopfleiste',
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
