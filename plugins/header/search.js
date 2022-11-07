window.nova_plugins.push({
   id: 'search-query',
   title: 'Search filters',
   'title:zh': '搜索过滤器',
   'title:ja': '検索フィルター',
   'title:ko': '검색 필터',
   'title:id': 'Filter pencarian',
   'title:es': 'Filtros de búsqueda',
   'title:pt': 'Filtros de pesquisa',
   'title:fr': 'Filtres de recherche',
   'title:it': 'Filtri di ricerca',
   'title:tr': 'Arama filtreleri',
   'title:de': 'Suchfilter',
   'title:pl': 'Filtry wyszukiwania',
   'title:ua': 'Фільтр пошуку',
   run_on_pages: 'results',
   restart_on_transition: true,
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      // Strategy 1. Patch url
      if (!NOVA.queryURL.has('sp')
         && (sp = user_settings.search_query_date || user_settings.search_query_sort)
      ) {
         location.href = NOVA.queryURL.set({ 'sp': sp });
      }

      // Strategy 2. Patch input
      // if (!NOVA.queryURL.has('sp')
      //    && (sp = user_settings.search_query_date || user_settings.search_query_sort)
      // ) {
      //    NOVA.waitElement('input#search')
      //       .then(input => {
      //          const patchLocation = () => location.href = `/results?search_query=${input.value}&sp=` + sp;
      //          // press "Enter"
      //          input.addEventListener('keydown', ({ keyCode }) => (keyCode === 13) && patchLocation());
      //          input.addEventListener('keydown', ({ key }) => (key === 'Enter') && patchLocation());
      //          // click on button
      //          NOVA.waitElement('button#search-icon-legacy')
      //             .then(button => button.addEventListener('click', patchLocation));
      //       });
      // }

   },
   options: {
      search_query_sort: {
         _tagName: 'select',
         label: 'Sort by',
         'label:zh': '排序方式',
         'label:ja': '並び替え',
         'label:ko': '정렬 기준',
         'label:id': 'Sortir dengan',
         'label:es': 'Ordenar por',
         'label:pt': 'Ordenar por',
         'label:fr': 'Trier par',
         'label:it': 'Ordina per',
         'label:tr': 'Göre sırala',
         'label:de': 'Sortieren nach',
         'label:pl': 'Sortuj według',
         'label:ua': 'Сортувати за',
         options: [
            { label: 'Relevance', value: false, selected: true, 'label:ua': 'Актуальність' },
            { label: 'Upload date', value: 'CAI%253D', 'label:ua': 'Дата завантаження' },
            { label: 'View count', value: 'CAM%253D', 'label:ua': 'Кількість переглядів' },
            { label: 'Rating', value: 'CAE%253D', 'label:ua': 'Вподобайки' },
         ],
         'data-dependent': { 'search_query_date': [false] },
      },
      search_query_date: {
         _tagName: 'select',
         label: 'Upload date',
         'label:zh': '上传日期',
         'label:ja': 'アップロード日',
         'label:ko': '업로드 날짜',
         'label:id': 'Tanggal unggah',
         'label:es': 'Fecha de carga',
         'label:pt': 'data de upload',
         'label:fr': 'Date de dépôt',
         'label:it': 'data di caricamento',
         'label:tr': 'yükleme tarihi',
         'label:de': 'Datum des Hochladens',
         'label:pl': 'Data przesłania',
         'label:ua': 'Дата завантаження',
         options: [
            { label: 'All time', value: false, selected: true, 'label:ua': 'За увесь час' },
            { label: 'Last hour', value: 'EgIIAQ%253D%253D', 'label:ua': 'За останню годину' },
            { label: 'Today', value: 'EgIIAg%253D%253D', 'label:ua': 'Сьогодні' },
            { label: 'This week', value: 'EgIIAw%253D%253D', 'label:ua': 'Цього тижня' },
            { label: 'This month', value: 'EgIIBA%253D%253D', 'label:ua': 'Цього місяця' },
            { label: 'This year', value: 'EgIIBQ%253D%253D', 'label:ua': 'Цього року' },
         ],
         'data-dependent': { 'search_query_sort': [false] },
      },
   }
});
