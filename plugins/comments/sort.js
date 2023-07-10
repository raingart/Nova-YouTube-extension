window.nova_plugins.push({
   id: 'comments-sort',
   title: 'Comments sort',
   'title:zh': '评论排序',
   'title:ja': 'コメントの並べ替え',
   'title:ko': '댓글 정렬',
   'title:id': 'Mengurutkan komentar',
   'title:es': 'Clasificación de comentarios',
   'title:pt': 'classificação de comentários',
   'title:fr': 'Tri des commentaires',
   'title:it': 'Ordinamento dei commenti',
   // 'title:tr': '',
   'title:de': 'Kommentare sortieren',
   'title:pl': 'Sortowanie komentarzy',
   'title:ua': 'Сортування коментарів',
   run_on_pages: 'watch, -mobile',
   // restart_on_location_change: true,
   opt_api_key_warn: true,
   section: 'comments',
   desc: 'add modal',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   'desc:ua': 'Додати спосіб подання',
   _runtime: user_settings => {

      // alt1 - https://github.com/sonigy/YCS
      // alt2 - https://github.com/pancevac/ytsc-extension

      // #comments #contents #submessage[is-empty] - "Comments are turned off."

      const
         // CACHE_PREFIX = 'nova-channel-videos-count:',
         MODAL_NAME_SELECTOR_ID = 'nova-modal-comments',
         MODAL_CONTENT_SELECTOR_ID = 'modal-content';
      // getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);

      insertButton();

      function insertButton() {
         // NOVA.waitSelector('#comments ytd-comments-header-renderer #title')
         NOVA.waitSelector(
            user_settings['comments-popup']
               ? '#masthead-container'
               // ? '#movie_player'
               // ? 'ytd-watch-flexy'
               // ? '#comments'
               // ? 'html:not(:fullscreen) ytd-watch-metadata #description.ytd-watch-metadata:not([hidden])'
               : '#comments ytd-comments-header-renderer #title'
            // : '#page-manager #owner'
         )
            .then(menu => {
               // [data-open-modal="nova-modal-comments"]
               const btn = document.createElement('span');
               btn.setAttribute('data-open-modal', MODAL_NAME_SELECTOR_ID);
               btn.title = 'Nova Comments';
               // btn.innerHTML =
               btn.textContent = '►';
               btn.addEventListener('click', () => {
                  // once if not inited
                  if (!document.body.querySelector(`#${MODAL_CONTENT_SELECTOR_ID} table`)) {
                     genTable();
                     // eventListenerPatchTimeLink();
                  }
                  btn.dispatchEvent(new CustomEvent(MODAL_NAME_SELECTOR_ID, { bubbles: true, detail: 'test' }));
               });

               // append css
               Object.assign(btn.style,
                  user_settings['comments-popup']
                     ? {
                        /*transform: rotate(-90deg) translateX(-100%);*/
                        position: 'fixed',
                        right: '0',
                        top: 'var(--ytd-masthead-height)',
                        // right: '1em',
                        visibility: 'visible',
                        'z-index':
                           1 + Math.max(
                              // getComputedStyle(menu)['z-index'],
                              // NOVA.css.getValue('yt-live-chat-app', 'z-index'),
                              NOVA.css.getValue('.ytp-chrome-top', 'z-index'),
                              60),
                        'font-size': '18px',
                     }
                     : {
                        'font-size': '24px',
                        'text-decoration': 'none',
                        padding: '0 10px',
                        background: 'transparent',
                        border: 'none',
                     },
                  // common
                  {
                     color: 'orange',
                     cursor: 'pointer',
                  });

               user_settings['comments-popup']
                  ? menu.append(btn)
                  : menu.prepend(btn);

               // if #page-manager #owner
               // menu.append(btn);

               insertModal();
               connectSortable();
               // clear table after page transition
               NOVA.runOnPageInitOrTransition(() => {
                  if (NOVA.currentPage == 'watch') {
                     document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = '<pre>Loading data...</pre>';
                  }
               });

            });
      }

      function genTable() {
         // console.debug('genTable:', ...arguments);
         // const channelId = NOVA.getChannelId();
         // if (!channelId) return console.error('genTable channelId: empty', channelId);

         // has in cache
         // if (storage = sessionStorage.getItem(CACHE_PREFIX + channelId)) {
         //    insertToHTML({ 'text': storage, 'container': container });

         // } else {

         // https://developers.google.com/youtube/v3/docs/commentThreads/list?apix_params=%7B%22part%22%3A%5B%22snippet%22%5D%2C%22textFormat%22%3A%22plainText%22%2C%22videoId%22%3A%228Pnlm1Ky_sA%22%7D

         // https://www.googleapis.com/youtube/v3/commentThreads?key={your_api_key}&textFormat=plainText&part=snippet&videoId={video_id}&part=snippet&order=relevance&maxResults=5&pageToken={nextPageToken}
         NOVA.request.API({
            request: 'commentThreads',
            params: {
               'videoId': NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
               'part': 'snippet',
               'maxResults': 100, // max 100
               'order': 'relevance', // 'time',
            },
            api_key: user_settings['user-api-key'],
         })
            .then(res => {
               if (res?.error) {
                  // alert message
                  if (res.reason) {
                     document.getElementById(MODAL_NAME_SELECTOR_ID)
                        .dispatchEvent(new CustomEvent(MODAL_NAME_SELECTOR_ID, { bubbles: true, detail: 'test' }));
                     return alert(`Error [${res.code}]: ${res.reason}`);
                  }
                  // modal message
                  else {
                     return document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML =
                        `<pre>Error [${res.code}]: ${res.reason}</pre>
                        <pre>${res.error}</pre>`;
                  }
               }

               let commentList = []
               res?.items?.forEach(item => {
                  if (comment = item.snippet?.topLevelComment?.snippet) {

                     // "id": "Ug...",
                     // {
                     //    "snippet": {
                     //       "videoId": "xxx..",
                     //       "textDisplay": "text",
                     //       "textOriginal": "text",
                     //       "authorDisplayName": "user A",
                     //       "authorProfileImageUrl": "https://yt3.ggpht.com/ytc/..",
                     //       "authorChannelUrl": "http://www.youtube.com/channel/UC1..",
                     //       "authorChannelId": { "value": "UC.." },
                     //       "canRate": true,
                     //       "viewerRating": "none",
                     //       "likeCount": 5,
                     //       "publishedAt": "2022-01-01T01:23:00Z",
                     //       "updatedAt": "2022-01-01T01:23:00Z"
                     //    },
                     // "canReply": true,
                     // "totalReplyCount": 7,
                     // "isPublic": true
                     // }
                     // save cache in tabs
                     // sessionStorage.setItem(CACHE_PREFIX + channelId, videoCount);
                     commentList.push(
                        Object.assign(
                           { 'totalReplyCount': item.snippet.totalReplyCount },
                           { 'id': item.id },
                           comment,
                        )
                     );
                  }
                  else {
                     console.warn('API is change', item);
                  }
               });

               if (!commentList.length) {
                  return document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML =
                     `<pre>Total number of comments: ${res.pageInfo.totalResults}</pre>`;
               }

               const ul = document.createElement('tbody');

               commentList
                  .sort((a, b) => b.likeCount - a.likeCount) // b - a for reverse sort
                  .forEach(comment => {
                     try {
                        const li = document.createElement('tr');
                        li.className = 'item';

                        li.innerHTML =
                           `<td>${comment.likeCount}</td>
                           <td>${+comment.totalReplyCount ?
                              `<a href="https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}" target="_blank" title="Open">${comment.totalReplyCount}</a>` : comment.totalReplyCount}
                           </td>
                           <td sorttable_customkey="${new Date(comment.updatedAt).getTime()}">${NOVA.timeFormatTo.ago(new Date(comment.updatedAt))}</td>
                           <td>
                              <a href="${comment.authorChannelUrl}" target="_blank" title="${comment.authorDisplayName}">
                                 <img src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}" />
                              </a>
                           </td>
                           <td sorttable_customkey="${comment.textDisplay.length}">
                              <span class="text-overflow-dynamic-ellipsis">${comment.textDisplay}</span>
                           </td>`;

                        ul.append(li); // append

                     } catch (error) {
                        console.error('Error comment generate:\n', error.stack + '\n', comment);
                        // alert('Error comment generate\n' + comment);
                     }
                  });

               // render table
               const MODAL_CONTENT_FILTER_SELECTOR_ID = 'nova-search-comment';
               document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML =
                  `<table class="sortable" border="0" cellspacing="0" cellpadding="0">
                     <thead id="${MODAL_CONTENT_FILTER_SELECTOR_ID}">
                        <tr>
                           <th class="sorttable_numeric">likes</th>
                           <th class="sorttable_numeric">replys</th>
                           <th class="sorttable_numeric">date</th>
                           <th class="sorttable_nosort">avatars</th>
                           <th class="sorttable_numeric">comments (${res.pageInfo.totalResults})</th>
                        </tr>
                     </thead>
                     ${ul.innerHTML}
                  </table>`;
               // add sort event
               sorttable.makeSortable(document.body.querySelector('.sortable'));

               insertFilterInput(MODAL_CONTENT_FILTER_SELECTOR_ID);
            });
      }

      // copy fn from [redirect-disable] plugin
      // function eventListenerPatchTimeLink() {
      //    document.addEventListener('click', ({ target }) => patchLink(target), { capture: true });
      //    // mouse middle click
      //    document.addEventListener('auxclick', evt => evt.button === 1 && patchLink(evt.target), { capture: true });

      //    function patchLink(target = required()) {
      //       // https://www.youtube.com/watch?v=VIDEO_ID&t=0m42s
      //       const linkSelector = 'a[href*="&t="]';

      //       if (!target.matches(linkSelector)) {
      //          if (!(target = target.closest(linkSelector))) return;
      //       }

      //       if (t = NOVA.queryURL.get('t', target.href)) {
      //          // '10m42s' > '10:42' > '642'
      //          t = NOVA.timeFormatTo.hmsToSec(t.replace(/m/, ':').replace(/s$/, ''));

      //          target.href = NOVA.queryURL.set({ 't': ~~t + 's' }, target.href);
      //          NOVA.updateUrl(NOVA.queryURL.set({ 't': ~~t + 's' }, target.href));
      //          // alert(target.href);
      //       }
      //    }
      // }

      function insertFilterInput(parent_selector_id = required()) {
         if (typeof parent_selector_id !== 'string') {
            return console.error('typeof "parent_selector_id":', (typeof parent_selector_id));
         }

         NOVA.css.push(
            `#${parent_selector_id} {
               position: relative;
            }

            #${parent_selector_id} input {
              position: absolute;
              top: 0;
              right: 0;

              /* border: 1px solid var(--ytd-searchbox-border-color);
              background-color: var(--ytd-searchbox-background);
              color: var(--ytd-searchbox-text-color); */

              /* height: 100%; */
            }

            #${parent_selector_id} input[type=search]:focus,
            #${parent_selector_id} input[type=text]:focus {
               outline: 1px solid #00b7fc;
            }`);

         const searchInput = document.createElement('input');
         searchInput.setAttribute('type', 'search');
         searchInput.setAttribute('placeholder', 'Filter');
         // Object.assign(searchInput.style, {
         //    padding: '.4em .6em',
         //    // border: 0,
         //    // 'border-radius': '4px',
         //    'margin-bottom': '1.5em',
         // });

         ['change', 'keyup'].forEach(evt => {
            searchInput
               .addEventListener(evt, function () {
                  NOVA.searchFilterHTML({
                     'keyword': this.value,
                     'filter_selectors': 'tr',
                     'highlight_selector': '.text-overflow-dynamic-ellipsis',
                  });
               });
            searchInput
               .addEventListener('click', () => {
                  searchInput.value = '';
                  searchInput.dispatchEvent(new Event('change')); // run searchFilterHTML
               });
         });

         document.getElementById(parent_selector_id).append(searchInput);
         // return searchInput;
      };

      function insertModal() {
         NOVA.css.push(
            `.modal {
               --animation-time: .2s;

               z-index: 9999;
               position: fixed;
               top: 0;
               left: 0;
               background: rgba(0, 0, 0, .8);
               display: flex;
               align-items: center;
               justify-content: center;

               width: 100%;
               height: 100%;

               box-sizing: border-box;

               visibility: hidden;
               opacity: 0;

               /*transition:
                  visibility 0.1s linear,
                  opacity 0.1s ease-out;*/
            }

            .modal.modal-visible {
               animation: microModalFadeIn var(--animation-time) cubic-bezier(0, 0, .2, 1);
               visibility: visible;
               opacity: 1;
            }

            @keyframes microModalFadeIn {
               from { opacity: 0; }
               to { opacity: 1; }
            }

            .modal-container {
               border-radius: 4px;
               background-color: silver;

               position: relative;
               display: flex;
               box-sizing: border-box;
               overflow-y: auto;
               max-width: 70%;
               max-height: 100vh;

               transform: scale(0.9);
               transition: all var(--animation-time) ease-out;
            }

            .modal.modal-visible .modal-container {
               transform: scale(1);
            }

            .modal-close {
               position: absolute;
               top: 0;
               right: 0;
               cursor: pointer;
               font-size: 2em;
               padding: 0 5px;
               transition: background-color var(--animation-time) ease-out;
            }

            .modal-close:before { content: "\\2715"; }

            .modal-close:hover {
               background-color: #ea3c3c;
            }

            .modal-content {
               padding: 2rem;
            }`);

         // custom style
         NOVA.css.push(
            `.modal {}

            .modal-container {
               /*--yt-spec-general-background-a: #181818;
               --yt-spec-general-background-b: #0f0f0f;
               --yt-spec-general-background-c: #030303;*/
               background-color: var(--yt-spec-base-background);
               background-color: var(--yt-spec-raised-background);
            }

            .modal-content {
               font-size: 12px;
               color: var(--yt-spec-text-primary);
            }`);

         // html
         document.body
            // document.getElementById('comments')
            // document.body.querySelector('ytd-app')
            .insertAdjacentHTML('beforeend',
               `<div id="${MODAL_NAME_SELECTOR_ID}" class="modal" data-modal>
                  <div class="modal-container">
                     <div class="modal-close" data-close-modal></div>

                     <div class="modal-content" id="${MODAL_CONTENT_SELECTOR_ID}"></div>
                  </div>
               </div>`);

         // js
         // demo - https://www.cssscript.com/demo/lite-modal-javascript-library-modalite/
         // src - https://github.com/hdodov/modalite/blob/0f965bea481e1a6aefb4f272c50fece5a9836448/dist/modalite.js
         const modalShowClass = 'modal-visible';

         // addEventListener close modal
         document.getElementById(MODAL_NAME_SELECTOR_ID)
            .addEventListener('click', ({ target }) => {
               target.dispatchEvent(new CustomEvent(MODAL_NAME_SELECTOR_ID, { bubbles: true, detail: 'test' }));
            });

         document.addEventListener(MODAL_NAME_SELECTOR_ID, ({ target }) => {
            // console.debug('', evt.detail);
            const
               attrModal = target.hasAttribute('data-modal'),
               attrOpen = target.getAttribute('data-open-modal'),
               attrClose = target.hasAttribute('data-close-modal');

            // modal overlay
            if (attrModal) {
               target.classList.remove(modalShowClass);
            }
            // activate
            else if (attrOpen && (modal = document.getElementById(attrOpen))) {
               modal.classList.add(modalShowClass);
            }
            // close btn
            else if (attrClose && (modal = target.closest('[data-modal]'))) {
               modal.classList.remove(modalShowClass);
            }
         });
      }

      function connectSortable() {
         // https://www.kryogenix.org/code/browser/sorttable/

         // table
         NOVA.css.push(
            `table.sortable table {
               width: 100%;
            }

            table.sortable thead {}

            table.sortable thead th {
               text-transform: uppercase;
               cursor: pointer;
            }

            thead, th, td {
               text-align: center;
            }

            table tbody {
               counter-reset: sortabletablescope;
            }

            /* row count */
            /*table thead tr::before {
               content: '';
               display: table-cell;
            }

            table tbody tr::before {
               content: counter(sortabletablescope);
               counter-increment: sortabletablescope;
               display: table-cell;
            }

            table tbody tr:nth-child(odd) {}
            table tbody tr:nth-child(even) {}/*`);

         // custom style
         NOVA.css.push(
            `#${MODAL_CONTENT_SELECTOR_ID} table {}

            #${MODAL_CONTENT_SELECTOR_ID} th {
               padding: 5px 3px;
               font-weight: 500;
            }

            #${MODAL_CONTENT_SELECTOR_ID} thead {
               background-color: var(--yt-spec-text-secondary);
               background-color: var(--yt-spec-outline);
            }

            #${MODAL_CONTENT_SELECTOR_ID} tbody {
               margin-top: 0px;
            }

            #${MODAL_CONTENT_SELECTOR_ID} tr:nth-child(even) {
               background-color: var(--yt-spec-menu-background);
            }

            /*#${MODAL_CONTENT_SELECTOR_ID} td {
               border-bottom: 1px solid rgba(255,255,255,.1);
            }*/

            #${MODAL_CONTENT_SELECTOR_ID} td .text-overflow-dynamic-ellipsis {
               display: block;
               max-height: 25vh;
               overflow-y: auto;
               text-align: left;
               font-size: 1.2em;
               line-height: 1.4;
               padding: 10px 5px;
               max-width: 1200px;
            }
            #${MODAL_CONTENT_SELECTOR_ID} td a {
               text-decoration: none;
               color: var(--yt-spec-call-to-action);
            }`);

         function dean_addEvent(t, e, r) { if (t.addEventListener) t.addEventListener(e, r, !1); else { r.$$guid || (r.$$guid = dean_addEvent.guid++), t.events || (t.events = {}); var o = t.events[e]; o || (o = t.events[e] = {}, t["on" + e] && (o[0] = t["on" + e])), o[r.$$guid] = r, t["on" + e] = handleEvent } } function handleEvent(t) { var e = !0; t = t || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event); var r = this.events[t.type]; for (var o in r) this.$$handleEvent = r[o], !1 === this.$$handleEvent(t) && (e = !1); return e } function fixEvent(t) { return t.preventDefault = fixEvent.preventDefault, t.stopPropagation = fixEvent.stopPropagation, t } sorttable = { makeSortable: function (t) { if (0 == t.getElementsByTagName("thead").length && (the = document.createElement("thead"), the.appendChild(t.rows[0]), t.insertBefore(the, t.firstChild)), null == t.tHead && (t.tHead = t.getElementsByTagName("thead")[0]), 1 == t.tHead.rows.length) { sortbottomrows = []; for (var e = 0; e < t.rows.length; e++)-1 != t.rows[e].className.search(/\bsortbottom\b/) && (sortbottomrows[sortbottomrows.length] = t.rows[e]); if (sortbottomrows) { null == t.tFoot && (tfo = document.createElement("tfoot"), t.appendChild(tfo)); for (e = 0; e < sortbottomrows.length; e++)tfo.appendChild(sortbottomrows[e]); delete sortbottomrows } headrow = t.tHead.rows[0].cells; for (e = 0; e < headrow.length; e++)headrow[e].className.match(/\bsorttable_nosort\b/) || (mtch = headrow[e].className.match(/\bsorttable_([a-z0-9]+)\b/), mtch && (override = mtch[1]), mtch && "function" == typeof sorttable["sort_" + override] ? headrow[e].sorttable_sortfunction = sorttable["sort_" + override] : headrow[e].sorttable_sortfunction = sorttable.guessType(t, e), headrow[e].sorttable_columnindex = e, headrow[e].sorttable_tbody = t.tBodies[0], dean_addEvent(headrow[e], "click", sorttable.innerSortFunction = function (t) { if (-1 != this.className.search(/\bsorttable_sorted\b/)) return sorttable.reverse(this.sorttable_tbody), this.className = this.className.replace("sorttable_sorted", "sorttable_sorted_reverse"), this.removeChild(document.getElementById("sorttable_sortfwdind")), sortrevind = document.createElement("span"), sortrevind.id = "sorttable_sortrevind", sortrevind.innerHTML = "&nbsp;&#x25B4;", void this.appendChild(sortrevind); if (-1 != this.className.search(/\bsorttable_sorted_reverse\b/)) return sorttable.reverse(this.sorttable_tbody), this.className = this.className.replace("sorttable_sorted_reverse", "sorttable_sorted"), this.removeChild(document.getElementById("sorttable_sortrevind")), sortfwdind = document.createElement("span"), sortfwdind.id = "sorttable_sortfwdind", sortfwdind.innerHTML = "&nbsp;&#x25BE;", void this.appendChild(sortfwdind); theadrow = this.parentNode, forEach(theadrow.childNodes, (function (t) { 1 == t.nodeType && (t.className = t.className.replace("sorttable_sorted_reverse", ""), t.className = t.className.replace("sorttable_sorted", "")) })), sortfwdind = document.getElementById("sorttable_sortfwdind"), sortfwdind && sortfwdind.parentNode.removeChild(sortfwdind), sortrevind = document.getElementById("sorttable_sortrevind"), sortrevind && sortrevind.parentNode.removeChild(sortrevind), this.className += " sorttable_sorted", sortfwdind = document.createElement("span"), sortfwdind.id = "sorttable_sortfwdind", sortfwdind.innerHTML = "&nbsp;&#x25BE;", this.appendChild(sortfwdind), row_array = [], col = this.sorttable_columnindex, rows = this.sorttable_tbody.rows; for (var e = 0; e < rows.length; e++)row_array[row_array.length] = [sorttable.getInnerText(rows[e].cells[col]), rows[e]]; row_array.sort(this.sorttable_sortfunction).reverse(), tb = this.sorttable_tbody; for (e = 0; e < row_array.length; e++)tb.appendChild(row_array[e][1]); delete row_array })) } }, guessType: function (t, e) { sortfn = sorttable.sort_alpha; for (var r = 0; r < t.tBodies[0].rows.length; r++)if (text = sorttable.getInnerText(t.tBodies[0].rows[r].cells[e]), "" != text && text.match(/^-?[£$¤]?[\d,.]+%?$/)) return sorttable.sort_numeric; return sortfn }, getInnerText: function (t) { if (!t) return ""; if (hasInputs = "function" == typeof t.getElementsByTagName && t.getElementsByTagName("input").length, null != t.getAttribute("sorttable_customkey")) return t.getAttribute("sorttable_customkey"); if (void 0 !== t.textContent && !hasInputs) return t.textContent.replace(/^\s+|\s+$/g, ""); if (void 0 !== t.innerText && !hasInputs) return t.innerText.replace(/^\s+|\s+$/g, ""); if (void 0 !== t.text && !hasInputs) return t.text.replace(/^\s+|\s+$/g, ""); switch (t.nodeType) { case 3: if ("input" == t.nodeName.toLowerCase()) return t.value.replace(/^\s+|\s+$/g, ""); case 4: return t.nodeValue.replace(/^\s+|\s+$/g, ""); case 1: case 11: for (var e = "", r = 0; r < t.childNodes.length; r++)e += sorttable.getInnerText(t.childNodes[r]); return e.replace(/^\s+|\s+$/g, ""); default: return "" } }, reverse: function (t) { newrows = []; for (var e = 0; e < t.rows.length; e++)newrows[newrows.length] = t.rows[e]; for (e = newrows.length - 1; e >= 0; e--)t.appendChild(newrows[e]); delete newrows }, sort_numeric: function (t, e) { return aa = parseFloat(t[0].replace(/[^0-9.-]/g, "")), isNaN(aa) && (aa = 0), bb = parseFloat(e[0].replace(/[^0-9.-]/g, "")), isNaN(bb) && (bb = 0), aa - bb }, sort_alpha: function (t, e) { return t[0].localeCompare(e[0]) } }, dean_addEvent.guid = 1, fixEvent.preventDefault = function () { this.returnValue = !1 }, fixEvent.stopPropagation = function () { this.cancelBubble = !0 }, Function.prototype.forEach = function (t, e, r) { for (var o in t) void 0 === this.prototype[o] && e.call(r, t[o], o, t) }, String.forEach = function (t, e, r) { Array.forEach(t.split(""), (function (o, n) { e.call(r, o, n, t) })) }; var forEach = function (t, e, r) { if (t) { var o = Object; if (t instanceof Function) o = Function; else { if (t.forEach instanceof Function) return void t.forEach(e, r); "string" == typeof t ? o = String : "number" == typeof t.length && (o = Array) } o.forEach(t, e, r) } };
      }

   },
});
