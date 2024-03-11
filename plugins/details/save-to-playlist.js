window.nova_plugins.push({
   id: 'save-to-playlist',
   title: 'Add sort/filter to "Save to playlist" menu',
   'title:zh': '将排序/过滤器添加到“保存到播放列表”菜单',
   'title:ja': '「プレイリストに保存」メニューにソート/フィルターを追加',
   // 'title:ko': '"재생 목록에 저장" 메뉴에 정렬/필터 추가',
   // 'title:vi': '',
   // 'title:id': 'Tambahkan sortir/filter ke menu "Simpan ke daftar putar".',
   // 'title:es': 'Agregar ordenar/filtrar al menú "Guardar en lista de reproducción"',
   'title:pt': 'Adicionar classificação/filtro ao menu "Salvar na lista de reprodução"',
   'title:fr': 'Ajouter un tri/filtre au menu "Enregistrer dans la liste de lecture"',
   // 'title:it': 'Aggiungi ordinamento/filtro al menu "Salva nella playlist".',
   // 'title:tr': '',
   'title:de': 'Sortieren/Filtern zum Menü „In Wiedergabeliste speichern“ hinzufügen',
   'title:pl': 'Dodaj sortowanie/filtr do menu „Zapisz na liście odtwarzania”.',
   'title:ua': 'Додати сортування/фільтр до меню "Зберегти до плейлиста"',
   run_on_pages: 'home, feed, results, channel, watch, -mobile',
   section: 'details-buttons',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/436123-youtube-save-to-playlist-filter
      // alt2 - https://greasyfork.org/en/scripts/392141-youtube-save-to-playlist-incremental-search
      // alt3 - https://greasyfork.org/en/scripts/451914-youtube-sort-filter-playlists-when-saving-video
      // alt4 - https://greasyfork.org/en/scripts/400524-youtube-sort-playlist

      // alt - https://chromewebstore.google.com/detail/youtube-playlist-helper/ibdakohjhchaagmccfedeejmeillongg

      // NOVA.waitSelector('#title.ytd-add-to-playlist-renderer')
      NOVA.waitSelector('tp-yt-paper-dialog #playlists')
         .then(playlists => {
            const container = playlists.closest('tp-yt-paper-dialog');
            // toggle show state
            new IntersectionObserver(([entry]) => {
               const searchInput = container.querySelector('input[type=search]');
               // in viewport
               if (entry.isIntersecting) {
                  if (user_settings.save_to_playlist_sort) sortPlaylistsMenu(playlists);

                  if (!searchInput) {
                     insertFilterInput(
                        document.body.querySelector('ytd-add-to-playlist-renderer #header ytd-menu-title-renderer')
                     );
                  }
               }
               // (fix menu) reset state
               else if (searchInput) {
                  searchInput.value = '';
                  searchInput.dispatchEvent(new Event('change')); // run searchFilterHTML
               }
            })
               .observe(container);
         });

      // alt1 - https://greasyfork.org/en/scripts/450181-youtube-save-to-playlist-menu-sorted-alphabetically
      // alt2 - https://greasyfork.org/en/scripts/6775-youtube-playlists-sorted-alphabetically
      function sortPlaylistsMenu(playlists = required()) {
         // console.debug('sortPlaylistsMenu', ...arguments);
         if (!(playlists instanceof HTMLElement)) return console.error('playlists not HTMLElement:', playlists);

         playlists.append(
            ...Array.from(playlists.childNodes)
               .sort(sortByLabel)
         );

         function sortByLabel(a, b) {
            // console.debug('a', a.innerText.trim());
            // console.debug('b', b.textContent.trim());

            // const getLabel = el => el.querySelector('#checkbox-label').textContent.trim();
            // const getLabel = el => el.textContent.trim();
            const getLabel = el => el.innerText.trim();
            // return (getLabel(a) > getLabel(b)) ? 1 : -1;
            return stringLocaleCompare(getLabel(a), getLabel(b));

            function stringLocaleCompare(a = required(), b = required()) {
               // for sorting string with emojis icons/emojis and keeping them on top
               return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            }
         }
      }

      function insertFilterInput(container = required()) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         const searchInput = document.createElement('input');
         searchInput.setAttribute('type', 'search');
         searchInput.setAttribute('placeholder', 'Playlists Filter');
         // searchInput.style.cssText = '';
         Object.assign(searchInput.style, {
            padding: '.4em .6em',
            border: 0,
            outline: 0,
            // 'border-radius': '4px',
            'min-width': '250px',
            width: '100%',
            height: '2.5em',
            color: 'var(--ytd-searchbox-text-color)',
            'background-color': 'var(--ytd-searchbox-background)',
         });

         ['change', 'keyup'].forEach(evt => {
            searchInput
               .addEventListener(evt, function () {
                  NOVA.searchFilterHTML({
                     'keyword': this.value,
                     // 'filter_selectors': 'ytd-playlist-add-to-option-renderer',
                     'filter_selectors': '#playlists #checkbox',
                     // 'highlight_selector': 'yt-formatted-string',
                     'highlight_selector': '#label',
                  });
               });
            searchInput
               .addEventListener('click', () => {
                  searchInput.value = '';
                  searchInput.dispatchEvent(new Event('change')); // run searchFilterHTML
               });
         });
         const containerDiv = document.createElement('div');
         // containerDiv.style.cssText = 'margin-top:.5em; display:inherit;';
         Object.assign(containerDiv.style, {
            'margin-top': '.5em',
            display: 'flex',
            gap: '10px',
         });

         // sort Button
         if (!user_settings.save_to_playlist_sort) {

            const sortButton = document.createElement('button');
            sortButton.textContent = 'A-Z ↓';
            // sortButton.style.cssText = '';
            Object.assign(sortButton.style, {
               padding: '.4em .6em',
               border: 0,
               outline: 0,
               'border-radius': '4px',
               color: 'var(--ytd-searchbox-text-color)',
               'background-color': 'var(--ytd-searchbox-background)',
               'white-space': 'nowrap',
               'cursor': 'pointer',
            });

            sortButton.addEventListener('click', () => {
               sortButton.remove(); // self
               sortPlaylistsMenu(document.body.querySelector('tp-yt-paper-dialog #playlists'));

               // sortButton.toggleAttribute('actived');
               // sortButton.textContent = sortButton.hasAttribute('actived')
               //    ? sortButton.textContent.replace('↓', '↑')
               //    : sortButton.textContent.replace('↑', '↓');

               // elPlaylistItem.style.order
               // var originalSortOrder = index;
               // originalSortOrder = elPlaylistItem.getAttribute('data-origOrder');
            }, { capture: true, once: true });

            containerDiv.append(sortButton);
         }

         containerDiv.append(searchInput);
         container.append(containerDiv);
      };

   },
   options: {
      save_to_playlist_sort: {
         _tagName: 'input',
         label: 'Default sorting alphabetically',
         'label:zh': '默认按字母顺序排序',
         'label:ja': 'デフォルトのアルファベット順のソート',
         // 'label:ko': '알파벳순 기본 정렬',
         // 'label:vi': '',
         // 'label:id': 'Penyortiran default menurut abjad',
         // 'label:es': 'Clasificación predeterminada alfabéticamente',
         'label:pt': 'Classificação padrão em ordem alfabética',
         'label:fr': 'Tri par défaut par ordre alphabétique',
         // 'label:it': 'Ordinamento predefinito in ordine alfabetico',
         // 'label:tr': 'Alfabetik olarak varsayılan sıralama',
         'label:de': 'Standardsortierung alphabetisch',
         'label:pl': 'Domyślne sortowanie alfabetyczne',
         'label:ua': 'Сортування за замовчуванням за алфавітом',
         type: 'checkbox',
         // title: '',
      },
   }
});
