window.nova_plugins.push({
   id: 'header-short',
   title: 'Header compact',
   'title:zh': '标题紧凑',
   'title:ja': 'ヘッダーコンパクト',
   'title:ko': '헤더 컴팩트',
   'title:es': 'Encabezado compacto',
   'title:pt': 'Cabeçalho compacto',
   'title:fr': 'En-tête compact',
   'title:de': 'Header kompakt',
   run_on_pages: 'all, -embed, -mobile',
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
         }

         #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
            --ytd-rich-grid-chips-bar-top: ${height};
         }`);

   },
});
