window.nova_plugins.push({
   id: 'save-to-playlist',
   title: 'Add sort/filter to "Save to playlist" menu',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch, -mobile',
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/436123-youtube-save-to-playlist-filter

      NOVA.waitElement('tp-yt-paper-dialog #playlists')
         .then(playlists => {
            const container = playlists.closest('tp-yt-paper-dialog');

            new IntersectionObserver(([entry]) => {
               const searchInput = container.querySelector('input[type=search]')
               // in viewport
               if (entry.isIntersecting) {
                  if (user_settings.save_to_playlist_sort) sortPlaylistsMenu(playlists);

                  if (!searchInput) renderFilterInput(playlists);
               }
               // (fix menu) reset state
               else if (searchInput) {
                  searchInput.value = '';
                  searchInput.dispatchEvent(new Event('change')); // run searchFilterHTML
               }
            })
               .observe(container);
         });

      function sortPlaylistsMenu(playlists = required()) {
         // alt - https://greasyfork.org/en/scripts/450181-youtube-save-to-playlist-menu-sorted-alphabetically

         // console.debug('sortPlaylistsMenu', ...arguments);
         if (!(playlists instanceof HTMLElement)) return console.error('playlists not HTMLElement:', playlists);

         playlists.append(...Array.from(playlists.childNodes).sort(sortByLabel));

         function sortByLabel(a, b) {
            const getLabel = (el = required()) => stringLocaleCompare(
               el.querySelector('#checkbox-label').textContent
            );
            return getLabel(a) > getLabel(b) ? 1 : -1;

            function stringLocaleCompare(a, b) {
               // for sorting string with emojis icons/emojis and keeping them on top
               return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            }
         }
      }

      function renderFilterInput(container = required()) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         const searchInput = document.createElement('input');
         searchInput.setAttribute('type', 'search');
         searchInput.setAttribute('placeholder', 'Playlist Filter');
         Object.assign(searchInput.style, {
            padding: '.4em .6em',
            border: 0,
            // 'border-radius': '4px',
            'margin-bottom': '1.5em',
         });

         ['change', 'keyup'].forEach(evt => {
            searchInput
               .addEventListener(evt, function () {
                  NOVA.searchFilterHTML({
                     'keyword': this.value,
                     'filter_selectors': 'ytd-playlist-add-to-option-renderer',
                     'highlight_selector': '#label'
                  });
               });
            searchInput
               .addEventListener('click', () => {
                  searchInput.value = '';
                  searchInput.dispatchEvent(new Event('change')); // run searchFilterHTML
               });
         });

         container.prepend(searchInput);
      };

   },
   options: {
      save_to_playlist_sort: {
         _tagName: 'input',
         label: 'Default sorting alphabetically',
         'label:zh': '默认按字母顺序排序',
         'label:ja': 'デフォルトのアルファベット順のソート',
         'label:ko': '알파벳순 기본 정렬',
         'label:id': 'Penyortiran default menurut abjad',
         'label:es': 'Clasificación predeterminada alfabéticamente',
         'label:pt': 'Classificação padrão em ordem alfabética',
         'label:fr': 'Tri par défaut par ordre alphabétique',
         'label:it': 'Ordinamento predefinito in ordine alfabetico',
         // 'label:tr': 'Alfabetik olarak varsayılan sıralama',
         'label:de': 'Standardsortierung alphabetisch',
         'label:pl': 'Domyślne sortowanie alfabetyczne',
         'label:ua': 'Сортування за замовчуванням за алфавітом',
         type: 'checkbox',
         // title: '',
      },
   }
});
