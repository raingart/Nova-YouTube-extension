// for test
// https://www.youtube.com/watch?v=dQw4w9WgXcQ - too many comments
// https://www.youtube.com/watch?v=kXYiU_JCYtU - too many comments
// https://www.youtube.com/watch?v=hWozHt9wbO4 - many comments


window.nova_plugins.push({
   id: 'comments-sort',
   title: 'Comments sort',
   'title:zh': '评论排序',
   'title:ja': 'コメントの並べ替え',
   // 'title:ko': '댓글 정렬',
   // 'title:id': 'Mengurutkan komentar',
   // 'title:es': 'Clasificación de comentarios',
   'title:pt': 'classificação de comentários',
   'title:fr': 'Tri des commentaires',
   // 'title:it': 'Ordinamento dei commenti',
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
      // alt3 - https://github.com/FreeTubeApp/yt-comment-scraper
      // alt4 - https://github.com/yakisova41/return-youtube-comment-username

      // #comments #contents #submessage[is-empty] - "Comments are turned off."

      const
         MAX_COMMENTS = 500,
         // CACHE_PREFIX = 'nova-channel-videos-count:',
         MODAL_NAME_SELECTOR_ID = 'nova-modal-comments',
         MODAL_CONTENT_SELECTOR_ID = 'modal-content',
         NOVA_REPLYS_SELECTOR_ID = 'nova-replys',
         // textarea to array
         BLOCK_KEYWORDS = NOVA.strToArray(user_settings.comments_sort_words_blocklist?.toLowerCase());
      // getCacheName = () => CACHE_PREFIX + ':' + (NOVA.queryURL.get('v') || movie_player.getVideoData().video_id);

      // try fix disappear button
      NOVA.waitSelector('#movie_player')
         .then(insertButton);

      // insertButton();

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
                     getComments();
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
                              // NOVA.css.get('yt-live-chat-app', 'z-index'),
                              NOVA.css.get('.ytp-chrome-top', 'z-index'),
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
               // clear table after page transition
               NOVA.runOnPageLoad(() => {
                  if (NOVA.currentPage == 'watch') {
                     document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = '<pre>Loading data...</pre>';
                  }
               });

            });
      }

      let commentList = [];

      function getComments(next_page_token) {
         // console.debug('genTable:', ...arguments);
         // const channelId = NOVA.getChannelId();
         // if (!channelId) return console.error('genTable channelId: empty', channelId);

         // has in cache
         // if (storage = sessionStorage.getItem(CACHE_PREFIX + channelId)) {
         //    insertToHTML({ 'text': storage, 'container': container });

         // } else {

         // https://developers.google.com/youtube/v3/docs/commentThreads/list?apix_params=%7B%22part%22%3A%5B%22snippet%22%5D%2C%22textFormat%22%3A%22plainText%22%2C%22videoId%22%3A%228Pnlm1Ky_sA%22%7D

         // https://www.googleapis.com/youtube/v3/commentThreads?key={your_api_key}&textFormat=plainText&part=snippet&videoId={video_id}&part=snippet&order=relevance&maxResults=5&pageToken={nextPageToken}

         // chunkArray(ids, YOUTUBE_API_MAX_IDS_PER_CALL)
         //    .forEach(id_part => {
         // console.debug('id_part', id_part);

         const params = {
            'videoId': NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
            'part': 'snippet,replies',
            'maxResults': 100, // max 100
            'order': 'relevance', // 'time',
         };

         if (next_page_token) {
            params['pageToken'] = next_page_token;
         }

         NOVA.request.API({
            request: 'commentThreads',
            params: params,
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

               res?.items?.forEach(item => {
                  if (comment = item.snippet?.topLevelComment?.snippet) {

                     // "id": "Ug...",
                     // {
                     //    "snippet": {
                     //       "videoId": "xxx..",
                     //       "textDisplay": "text", // html inicode
                     //       "textOriginal": "text",
                     //       "authorDisplayName": "@usernick",
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
                           item.replies,
                        )
                     );
                  }
                  else {
                     console.warn('API is change', item);
                  }
               });

               // max 500 comments
               if (!user_settings['user-api-key'] && commentList.length > MAX_COMMENTS) {
                  // NOVA.uiAlert('Use your personal API key to overcome the 500 comments limit');
                  alert('Use your personal API key to overcome the 500 comments limit');
                  genTable();
               }
               // get next page
               // else if ((res?.nextPageToken && (commentList.length % 1000) !== 0)
               //    || ((commentList.length % 1000) === 0 && confirm(`Continue downloading?`)) // message every multiple of 1000 comments
               // ) {
               else if (res?.nextPageToken) {
                  // display current download status
                  document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = `<pre>Loading: ${commentList.length}</pre>`;

                  getComments(res?.nextPageToken);
               }
               // pages are over
               else {
                  // console.debug('>', res);
                  genTable();
               }
            });
      }

      function genTable() {
         if (!commentList.length) {
            return document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML = `<pre>Comments empty</pre>`;
         }

         const ul = document.createElement('tbody');

         commentList
            .sort((a, b) => b.likeCount - a.likeCount) // default sorting by number of likes
            .forEach(comment => {
               try {
                  if (!(comment.textDisplay = filterStr(comment.textDisplay))) return; // continue

                  const
                     replyInputName = `${NOVA_REPLYS_SELECTOR_ID}-${comment.id}`,
                     li = document.createElement('tr');

                  li.className = 'item';
                  li.innerHTML =
                     `<td>${comment.likeCount}</td>
                     <td sorttable_customkey="${comment.totalReplyCount}" class="nova-switch">
                     ${comment.comments?.length
                        ? `<a href="https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}" target="_blank" title="Open comment link">${comment.comments.length}</a> <label for="${replyInputName}"></label>`
                        : ''}</td>
                     <td sorttable_customkey="${new Date(comment.updatedAt).getTime()}">${NOVA.formatTimeOut.ago(new Date(comment.updatedAt))}</td>
                     <td>
                        <a href="${comment.authorChannelUrl}" target="_blank" title="${comment.authorDisplayName}">
                           <img src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}" />
                        </a>
                     </td>
                     <td sorttable_customkey="${comment.textOriginal.length}">
                        <span class="text-overflow-dynamic-ellipsis">${comment.textDisplay}</span>
                        ${appendReplies()}
                     </td>`;

                  ul.append(li); // append

                  // checkbox reply show
                  if (+comment.totalReplyCount) {
                     const checkbox = document.createElement('input');
                     checkbox.type = 'checkbox';
                     checkbox.id = checkbox.name = replyInputName;
                     checkbox.addEventListener('change', ({ target }) => {
                        // console.debug('change', target, 'name:', target.name);
                        document.body.querySelector(`table[${NOVA_REPLYS_SELECTOR_ID}="${target.name}"]`)
                           .classList.toggle('nova-hide');
                     });
                     li.querySelector('td label[for]')?.before(checkbox);
                     // li.querySelector('td label[for]').append(checkbox);
                  }

                  function appendReplies() {
                     if (!+comment.totalReplyCount) return '';

                     const table = document.createElement('table');
                     table.className = 'nova-hide';
                     table.setAttribute(NOVA_REPLYS_SELECTOR_ID, replyInputName); // mark
                     // replies
                     comment.comments
                        // ?.reverse() // order by
                        ?.forEach(reply => {
                           if (!(reply.snippet.textDisplay = filterStr(reply.snippet.textDisplay))) return; // continue

                           const li = document.createElement('tr');
                           // li.className = 'item';
                           li.innerHTML =
                              `<td>
                                 <a href="${reply.snippet.authorChannelUrl}" target="_blank" title="${reply.snippet.authorDisplayName}">
                                    <img src="${reply.snippet.authorProfileImageUrl}" alt="${reply.snippet.authorDisplayName}" />
                                 </a>
                              </td>
                              <td>
                                 <span class="text-overflow-dynamic-ellipsis">
                                    <div class="nova-reply-time-text">${reply.snippet.likeCount
                                 ? `${reply.snippet.likeCount} likes` : ''}</div>
                                    <div>${reply.snippet.textDisplay}</div>
                                 </span>
                              </td>`;
                           table.append(li); // append
                        });
                     return table.outerHTML;
                  }

               } catch (error) {
                  console.error('Error comment generate:\n', error.stack + '\n', comment);
                  // alert('Error comment generate\n' + comment);
               }
            });

         function filterStr(str) {
            // alt - https://greasyfork.org/en/scripts/481131-youtube-comment-sponsor-blocker
            if (keyword = BLOCK_KEYWORDS?.find(keyword => str.toLowerCase().includes(keyword))) {
               console.log('comment filter:', `"${keyword}\n"`, str.replace(keyword, `[${keyword}]`));
               return;
            }

            const countWords = (str = '') => str.trim().split(/\s+/).length,
               clearOfEmoji = str => str
                  // for test test 'a1^€$❤️🧠🦄🦊🥦►•●-–—🔺'
                  // .replace(/[\u2011-\u26FF]/g, ' ') // Symbols. remove "€" sign
                  .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, ' ') // Symbols
                  .replace(/(?![*#0-9]+)[\p{Emoji}]/gu, ' ') // Emoji
                  // .replace(/[^<>=\p{L}\p{N}\p{P}\p{Z}{\^\$€}]/gu, ' ') // Emoji
                  .replace(/([=:;/.()]{2,}|\))$/g, ' ') // ANSII smile at the end of the line
                  .replace(/\s{2,}/g, ' ') // multi-spacebar
                  .replace(/(<br>){3,}/g, '<br><br>')
                  .replace(/<a[^>]+><\/a>/g, '') // empty links
                  .trim();

            // filter comments
            if (user_settings.comments_sort_clear_emoji) {
               str = clearOfEmoji(str); // comment.textOriginal

               // skip empty after clear
               if (!str.length) return;

               if (+user_settings.comments_sort_min_words
                  && countWords(str) <= +user_settings.comments_sort_min_words
               ) {
                  // console.debug('filter comment (by min words):', str);
                  return;
               }
            }

            return str;
         }


         // render table
         const MODAL_CONTENT_FILTER_SELECTOR_ID = 'nova-search-comment';
         document.getElementById(MODAL_CONTENT_SELECTOR_ID).innerHTML =
            `<table class="sortable" border="0" cellspacing="0" cellpadding="0">
               <thead id="${MODAL_CONTENT_FILTER_SELECTOR_ID}">
                  <tr>
                     <th class="sorttable_numeric">likes</th>
                     <th class="sorttable_numeric">replys</th>
                     <th class="sorttable_numeric">date</th>
                     <th class="sorttable_nosort">avatar</th>
                     <th class="sorttable_numeric">comments (${commentList.length/*res.pageInfo.totalResults*/})</th>
                  </tr>
               </thead>
               <!-- $ {ul.innerHTML} -->
            </table>`;

         document.getElementById(MODAL_CONTENT_FILTER_SELECTOR_ID).after(ul); /*$ {ul.innerHTML}*/

         // add sort event
         connectSortable().makeSortable(document.body.querySelector('table.sortable'));

         insertFilterInput(MODAL_CONTENT_FILTER_SELECTOR_ID);

         // replies
         NOVA.css.push(
            `.nova-hide {
               display: none;
            }
            table[${NOVA_REPLYS_SELECTOR_ID}] {
               border: 1px solid #444;
               width: auto !important;
            }
            table[${NOVA_REPLYS_SELECTOR_ID}] td {
               padding: auto 10px;
            }
            .nova-reply-time-text {
               font-size: .5em;
               font-style: italic;
            }

            /* replies checkbox */
            .nova-switch input[type=checkbox] {
               --height: 1.5em;
               --disabled-opacity: .7;

               background-color: var(--dark-theme-divider-color);
               color: var(--dark-theme-text-color);
               --off-hover-bg: var(--light-theme-secondary-color);
               /* --checked-bg: #188cc3;
               --checked-bg: #ff691c; */
               --checked-bg: #e85717;
               --checked-bg-active: var(--dark-theme-divider-color);
               --checked-color: var(--dark-theme-text-color);

               --text-on: 'HIDE';
               --text-on-press: 'SHOW';
               /* --text-on: attr(text-on); */
               --text-off: 'ANS';
               --text-off-press: 'HIDE?';
               /* --text-on: attr(text-off); */

               appearance: none;
               -webkit-appearance: none;
               position: relative;
               cursor: pointer;
               outline: 0;
               border: none;
               overflow: hidden;

               -webkit-user-select: none;
               -moz-user-select: none;
               -ms-user-select: none;
               user-select: none;
               -webkit-backface-visibility: hidden;
               backface-visibility: hidden;
               /* box-shadow: none !important; */

               /* transform: skew(-10deg); */
               font-size: 1em;
               width: 4em;
               height: 1.7em;
               font-weight: bold;
            }

            .nova-switch input[type=checkbox]:hover:before {
               background-color: var(--off-hover-bg);
               /* background-color: greenyellow; */
            }

            .nova-switch input[type=checkbox]:after,
            .nova-switch input[type=checkbox]:before {
               position: absolute;
               transition: left 200ms ease-in-out;
               width: 100%;
               line-height: 1.8em;
               text-align: center;
               /* box-shadow: 0 0 .25em rgba(0, 0, 0, .3); */
            }

            .nova-switch input[type=checkbox]:after {
               left: 100%;
               content: var(--text-on);
               font-weight: bold;
            }

            .nova-switch input[type=checkbox]:before {
               left: 0;
               content: var(--text-off);
            }

            .nova-switch input[type=checkbox]:active {
               /* line on press */
               background-color: var(--checked-bg);
            }

            .nova-switch input[type=checkbox]:active:before {
               left: -10%;
               content: var(--text-on-press);
            }

            .nova-switch input[type=checkbox]:checked {
               color: var(--checked-color);
               background-color: var(--checked-bg);
            }

            .nova-switch input[type=checkbox]:checked:before {
               left: -100%;
            }

            .nova-switch input[type=checkbox]:checked:after {
               left: 0;
            }

            .nova-switch input[type=checkbox]:checked:active:after {
               left: 10%;
               content: var(--text-off-press);
               background-color: var(--checked-bg-active);
            }

            .nova-switch input[type=checkbox] [disabled] {
               cursor: not-allowed;
            }

            .nova-switch input[type=checkbox] [disabled] {
               opacity: var(--disabled-opacity);
            }
            `);
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
      //          t = NOVA.formatTimeOut.hmsToSec(t.replace(/m/, ':').replace(/s$/, ''));

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
            `#${parent_selector_id} input {
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
            }
            .nova-mark-text {
               background-color: #ff0;
               background-color: mark;

               /* outline: 2px dashed rgba(255, 127, 127, 0.8);
               background: transparent;
               color: inherit;*/
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
                     'filter_selectors': 'tr.item',
                     'highlight_selector': '.text-overflow-dynamic-ellipsis',
                     'highlight_class': 'nova-mark-text',
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
               transition: scale var(--animation-time) ease-out;
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
               background-color: var(--yt-spec-brand-background-primary);
               background-color: var(--yt-spec-menu-background);
               background-color: var(--yt-spec-raised-background);
               color: var(--yt-spec-text-primary);
            }

            .modal-content {
               font-size: 12px;
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

            /* fixed headers */
            table.sortable thead {
               position: sticky;
               top: 0px
            }

            table.sortable th {
               text-transform: uppercase;
               white-space: nowrap;
            }

            table.sortable th:not(.sorttable_nosort) {
               cursor: pointer;
            }

            table.sortable th:not(.sorttable_sorted):not(.sorttable_sorted_reverse):not(.sorttable_nosort):hover:after {
               position: absolute;
               content: " \\25B4\\25BE";
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
            table tbody tr:nth-child(even) {} */`);

         // custom style
         NOVA.css.push(
            `#${MODAL_CONTENT_SELECTOR_ID} table {}

            #${MODAL_CONTENT_SELECTOR_ID} thead {
               background-color: #555;
               /* background-color: var(--yt-spec-text-secondary); */
               background-color: var(--yt-spec-outline);
            }

            #${MODAL_CONTENT_SELECTOR_ID} th {
               padding: 5px 3px;
               font-weight: 500;
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
               scrollbar-width: thin;
               text-align: left;
               font-size: 1.2em;
               line-height: 1.4;
               padding: 10px 5px;
               max-width: 1200px;
               /*min-width: 450px;*/
            }
            #${MODAL_CONTENT_SELECTOR_ID} td a {
               text-decoration: none;
               color: var(--yt-spec-call-to-action);
            }`);

         // TODO add wait when sorting
         // document.body.querySelector('table.sortable').style.cursor = 'wait';
         // document.body.querySelector('table.sortable').style.removeProperty('cursor')

         // fork from https://github.com/dascritch/sorttable
         return sorttable = { selector_tables: "table.sortable", class_sort_bottom: "sortbottom", class_no_sort: "sorttable_nosort", class_sorted: "sorttable_sorted", class_sorted_reverse: "sorttable_sorted_reverse", id_sorttable_sortfwdind: "sorttable_sortfwdind", id_sorttable_sortfrevind: "sorttable_sortrevind", icon_up: "&nbsp;&#x25B4;", icon_down: "&nbsp;&#x25BE;", regex_non_decimal: /[^0-9\.\-]/g, regex_trim: /^\s+|\s+$/g, regex_any_sorttable_class: /\bsorttable_([a-z0-9]+)\b/, init: function () { arguments.callee.done || (arguments.callee.done = !0, sorttable.forEach(document.querySelectorAll(sorttable.selector_tables), sorttable.makeSortable)) }, insert_thead_in_table: function (t) { 0 === t.getElementsByTagName("thead").length && (thead_element = document.createElement("thead"), thead_element.appendChild(t.rows[0]), t.insertBefore(thead_element, t.firstChild)) }, forEach: function (t, e, r) { if (t) { var s = Object; if (t instanceof Function) s = Function; else { if (t.forEach instanceof Function) return void t.forEach(e, r); "string" == typeof t ? s = String : "number" == typeof t.length && (s = Array) } s.forEach(t, e, r) } }, innerSortFunction: function (t) { if (this.classList.contains(sorttable.class_sorted)) return sorttable.reverse(this.sorttable_tbody), this.classList.remove(sorttable.class_sorted), this.classList.add(sorttable.class_sorted_reverse), this.removeChild(document.getElementById(sorttable.id_sorttable_sortfwdind)), sortrevind = document.createElement("span"), sortrevind.id = sorttable.id_sorttable_sortfrevind, sortrevind.innerHTML = sorttable.icon_up, this.appendChild(sortrevind), void t.preventDefault(); if (this.classList.contains(sorttable.class_sorted_reverse)) return sorttable.reverse(this.sorttable_tbody), this.classList.remove(sorttable.class_sorted_reverse), this.classList.add(sorttable.class_sorted), this.removeChild(document.getElementById(sorttable.id_sorttable_sortfrevind)), sortfwdind = document.createElement("span"), sortfwdind.id = sorttable.id_sorttable_sortfwdind, sortfwdind.innerHTML = sorttable.icon_down, this.appendChild(sortfwdind), void t.preventDefault(); theadrow = this.parentNode, sorttable.forEach(theadrow.childNodes, (function (t) { 1 == t.nodeType && (t.classList.remove(sorttable.class_sorted_reverse), t.classList.remove(sorttable.class_sorted)) })), sortfwdind = document.getElementById(sorttable.id_sorttable_sortfwdind), sortfwdind && sortfwdind.parentNode.removeChild(sortfwdind), sortrevind = document.getElementById(sorttable.id_sorttable_sortfrevind), sortrevind && sortrevind.parentNode.removeChild(sortrevind), this.classList.add(sorttable.class_sorted), sortfwdind = document.createElement("span"), sortfwdind.id = sorttable.id_sorttable_sortfwdind, sortfwdind.innerHTML = sorttable.icon_down, this.appendChild(sortfwdind), row_array = [], col = this.sorttable_columnindex, rows = this.sorttable_tbody.rows; for (var e = 0; e < rows.length; e++)row_array[row_array.length] = [sorttable.getInnerText(rows[e].cells[col]), rows[e]]; row_array.sort(this.sorttable_sortfunction), tb = this.sorttable_tbody; for (e = 0; e < row_array.length; e++)tb.appendChild(row_array[e][1]); t.preventDefault(), delete row_array }, makeSortable: function (t) { if (sorttable.insert_thead_in_table(t), null == t.tHead && (t.tHead = t.getElementsByTagName("thead")[0]), 1 == t.tHead.rows.length) { for (var e = [], r = 0; r < t.rows.length; r++)t.rows[r].classList.contains(sorttable.class_sort_bottom) && (e[e.length] = t.rows[r]); if (e) { if (null == t.tFoot) { var s = document.createElement("tfoot"); t.appendChild(s) } for (r = 0; r < e.length; r++)s.appendChild(e[r]) } var o = t.tHead.rows[0].cells; for (r = 0; r < o.length; r++)o[r].classList.contains(sorttable.class_no_sort) || (mtch = o[r].className.match(sorttable.regex_any_sorttable_class), mtch && (override = mtch[1]), mtch && "function" == typeof sorttable["sort_" + override] ? o[r].sorttable_sortfunction = sorttable["sort_" + override] : o[r].sorttable_sortfunction = sorttable.guessType(t, r), o[r].sorttable_columnindex = r, o[r].sorttable_tbody = t.tBodies[0], o[r].addEventListener("click", sorttable.innerSortFunction)) } }, guessType: function (t, e) { return sorttable.sort_alpha }, getInnerText: function (t) { if (!t) return ""; if (void 0 !== t.dataset && void 0 !== t.dataset.value) return t.dataset.value; if (hasInputs = "function" == typeof t.getElementsByTagName && t.getElementsByTagName("input").length, null != t.getAttribute("sorttable_customkey")) return t.getAttribute("sorttable_customkey"); if (void 0 !== t.textContent && !hasInputs) return t.textContent.replace(sorttable.regex_trim, ""); if (void 0 !== t.innerText && !hasInputs) return t.innerText.replace(sorttable.regex_trim, ""); if (void 0 !== t.text && !hasInputs) return t.text.replace(sorttable.regex_trim, ""); switch (t.nodeType) { case 3: if ("input" == t.nodeName.toLowerCase()) return t.value.replace(sorttable.regex_trim, ""); case 4: return t.nodeValue.replace(sorttable.regex_trim, ""); case 1: case 11: for (var e = "", r = 0; r < t.childNodes.length; r++)e += sorttable.getInnerText(t.childNodes[r]); return e.replace(sorttable.regex_trim, ""); default: return "" } }, reverse: function (t) { for (var e = [], r = 0; r < t.rows.length; r++)e[e.length] = t.rows[r]; for (r = e.length - 1; r >= 0; r--)t.appendChild(e[r]) }, sort_numeric: function (t, e) { var r = parseFloat(t[0].replace(sorttable.regex_non_decimal, "")); isNaN(r) && (r = 0); var s = parseFloat(e[0].replace(sorttable.regex_non_decimal, "")); return isNaN(s) && (s = 0), r - s }, sort_alpha: function (t, e) { return t[0] == e[0] ? 0 : t[0] < e[0] ? -1 : 1 }, shaker_sort: function (t, e) { for (var r = 0, s = t.length - 1, o = !0; o;) { o = !1; for (var a = r; a < s; ++a)if (e(t[a], t[a + 1]) > 0) { var n = t[a]; t[a] = t[a + 1], t[a + 1] = n, o = !0 } if (s-- , !o) break; for (a = s; a > r; --a)if (e(t[a], t[a - 1]) < 0) { n = t[a]; t[a] = t[a - 1], t[a - 1] = n, o = !0 } r++ } } };

         // a little simplified ver. for https://www.kryogenix.org/code/browser/sorttable/
         // function dean_addEvent(t, e, r) { if (t.addEventListener) t.addEventListener(e, r, !1); else { r.$$guid || (r.$$guid = dean_addEvent.guid++), t.events || (t.events = {}); var o = t.events[e]; o || (o = t.events[e] = {}, t["on" + e] && (o[0] = t["on" + e])), o[r.$$guid] = r, t["on" + e] = handleEvent } } function handleEvent(t) { var e = !0; t = t || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event); var r = this.events[t.type]; for (var o in r) this.$$handleEvent = r[o], !1 === this.$$handleEvent(t) && (e = !1); return e } function fixEvent(t) { return t.preventDefault = fixEvent.preventDefault, t.stopPropagation = fixEvent.stopPropagation, t } sorttable = { makeSortable: function (t) { if (0 == t.getElementsByTagName("thead").length && (the = document.createElement("thead"), the.appendChild(t.rows[0]), t.insertBefore(the, t.firstChild)), null == t.tHead && (t.tHead = t.getElementsByTagName("thead")[0]), 1 == t.tHead.rows.length) { sortbottomrows = []; for (var e = 0; e < t.rows.length; e++)-1 != t.rows[e].className.search(/\bsortbottom\b/) && (sortbottomrows[sortbottomrows.length] = t.rows[e]); if (sortbottomrows) { null == t.tFoot && (tfo = document.createElement("tfoot"), t.appendChild(tfo)); for (e = 0; e < sortbottomrows.length; e++)tfo.appendChild(sortbottomrows[e]); delete sortbottomrows } headrow = t.tHead.rows[0].cells; for (e = 0; e < headrow.length; e++)headrow[e].className.match(/\bsorttable_nosort\b/) || (mtch = headrow[e].className.match(/\bsorttable_([a-z0-9]+)\b/), mtch && (override = mtch[1]), mtch && "function" == typeof sorttable["sort_" + override] ? headrow[e].sorttable_sortfunction = sorttable["sort_" + override] : headrow[e].sorttable_sortfunction = sorttable.guessType(t, e), headrow[e].sorttable_columnindex = e, headrow[e].sorttable_tbody = t.tBodies[0], dean_addEvent(headrow[e], "click", sorttable.innerSortFunction = function (t) { if (-1 != this.className.search(/\bsorttable_sorted\b/)) return sorttable.reverse(this.sorttable_tbody), this.className = this.className.replace("sorttable_sorted", "sorttable_sorted_reverse"), this.removeChild(document.getElementById("sorttable_sortfwdind")), sortrevind = document.createElement("span"), sortrevind.id = "sorttable_sortrevind", sortrevind.innerHTML = "&nbsp;&#x25B4;", void this.appendChild(sortrevind); if (-1 != this.className.search(/\bsorttable_sorted_reverse\b/)) return sorttable.reverse(this.sorttable_tbody), this.className = this.className.replace("sorttable_sorted_reverse", "sorttable_sorted"), this.removeChild(document.getElementById("sorttable_sortrevind")), sortfwdind = document.createElement("span"), sortfwdind.id = "sorttable_sortfwdind", sortfwdind.innerHTML = "&nbsp;&#x25BE;", void this.appendChild(sortfwdind); theadrow = this.parentNode, forEach(theadrow.childNodes, (function (t) { 1 == t.nodeType && (t.className = t.className.replace("sorttable_sorted_reverse", ""), t.className = t.className.replace("sorttable_sorted", "")) })), sortfwdind = document.getElementById("sorttable_sortfwdind"), sortfwdind && sortfwdind.parentNode.removeChild(sortfwdind), sortrevind = document.getElementById("sorttable_sortrevind"), sortrevind && sortrevind.parentNode.removeChild(sortrevind), this.className += " sorttable_sorted", sortfwdind = document.createElement("span"), sortfwdind.id = "sorttable_sortfwdind", sortfwdind.innerHTML = "&nbsp;&#x25BE;", this.appendChild(sortfwdind), row_array = [], col = this.sorttable_columnindex, rows = this.sorttable_tbody.rows; for (var e = 0; e < rows.length; e++)row_array[row_array.length] = [sorttable.getInnerText(rows[e].cells[col]), rows[e]]; row_array.sort(this.sorttable_sortfunction).reverse(), tb = this.sorttable_tbody; for (e = 0; e < row_array.length; e++)tb.appendChild(row_array[e][1]); delete row_array })) } }, guessType: function (t, e) { sortfn = sorttable.sort_alpha; for (var r = 0; r < t.tBodies[0].rows.length; r++)if (text = sorttable.getInnerText(t.tBodies[0].rows[r].cells[e]), "" != text && text.match(/^-?[£$¤]?[\d,.]+%?$/)) return sorttable.sort_numeric; return sortfn }, getInnerText: function (t) { if (!t) return ""; if (hasInputs = "function" == typeof t.getElementsByTagName && t.getElementsByTagName("input").length, null != t.getAttribute("sorttable_customkey")) return t.getAttribute("sorttable_customkey"); if (void 0 !== t.textContent && !hasInputs) return t.textContent.replace(/^\s+|\s+$/g, ""); if (void 0 !== t.innerText && !hasInputs) return t.innerText.replace(/^\s+|\s+$/g, ""); if (void 0 !== t.text && !hasInputs) return t.text.replace(/^\s+|\s+$/g, ""); switch (t.nodeType) { case 3: if ("input" == t.nodeName.toLowerCase()) return t.value.replace(/^\s+|\s+$/g, ""); case 4: return t.nodeValue.replace(/^\s+|\s+$/g, ""); case 1: case 11: for (var e = "", r = 0; r < t.childNodes.length; r++)e += sorttable.getInnerText(t.childNodes[r]); return e.replace(/^\s+|\s+$/g, ""); default: return "" } }, reverse: function (t) { newrows = []; for (var e = 0; e < t.rows.length; e++)newrows[newrows.length] = t.rows[e]; for (e = newrows.length - 1; e >= 0; e--)t.appendChild(newrows[e]); delete newrows }, sort_numeric: function (t, e) { return aa = parseFloat(t[0].replace(/[^0-9.-]/g, "")), isNaN(aa) && (aa = 0), bb = parseFloat(e[0].replace(/[^0-9.-]/g, "")), isNaN(bb) && (bb = 0), aa - bb }, sort_alpha: function (t, e) { return t[0].localeCompare(e[0]) } }, dean_addEvent.guid = 1, fixEvent.preventDefault = function () { this.returnValue = !1 }, fixEvent.stopPropagation = function () { this.cancelBubble = !0 }, Function.prototype.forEach = function (t, e, r) { for (var o in t) void 0 === this.prototype[o] && e.call(r, t[o], o, t) }, String.forEach = function (t, e, r) { Array.forEach(t.split(""), (function (o, n) { e.call(r, o, n, t) })) }; var forEach = function (t, e, r) { if (t) { var o = Object; if (t instanceof Function) o = Function; else { if (t.forEach instanceof Function) return void t.forEach(e, r); "string" == typeof t ? o = String : "number" == typeof t.length && (o = Array) } o.forEach(t, e, r) } };
      }

   },
   options: {
      comments_sort_clear_emoji: {
         _tagName: 'input',
         label: 'Clear of emoji',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         type: 'checkbox',
      },
      comments_sort_min_words: {
         _tagName: 'input',
         label: 'Min words count',
         'label:zh': '最少字数',
         'label:ja': '最小単語数',
         // 'label:ko': '최소 단어 수',
         // 'label:id': '',
         'label:es': 'Recuento mínimo de palabras',
         'label:pt': 'Contagem mínima de palavras',
         'label:fr': 'Nombre minimum de mots',
         // 'label:it': '',
         // 'label:tr': '',
         'label:de': 'Mindestanzahl an Wörtern',
         'label:pl': 'Minimalna liczba słów',
         'label:ua': 'Мінімальна кількість слів',
         type: 'number',
         title: '0 - disable',
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
         placeholder: '0-10',
         min: 0,
         max: 10,
         value: 2,
         'data-dependent': { 'comments_sort_clear_emoji': true },
      },
      comments_sort_words_blocklist: {
         _tagName: 'textarea',
         label: 'Words block list',
         'label:zh': '被阻止的单词列表',
         'label:ja': 'ブロックされた単語のリスト',
         // 'label:ko': '단어 목록',
         // 'label:id': 'Daftar kata',
         // 'label:es': 'lista de palabras',
         'label:pt': 'Lista de bloqueio de palavras',
         'label:fr': 'Liste de blocage de mots',
         // 'label:it': 'Elenco di parole',
         // // 'label:tr': 'Kelime listesi',
         'label:de': 'Liste blockierter Wörter',
         'label:pl': 'Lista blokowanych słów',
         'label:ua': 'Список заблокованих слів',
         title: 'separator: "," or ";" or "new line"',
         'title:zh': '分隔器： "," 或 ";" 或 "新队"',
         'title:ja': 'セパレータ： "," または ";" または "改行"',
         // 'title:ko': '구분 기호: "," 또는 ";" 또는 "새 줄"',
         // 'title:id': 'pemisah: "," atau ";" atau "baris baru"',
         // 'title:es': 'separador: "," o ";" o "new line"',
         'title:pt': 'separador: "," ou ";" ou "new line"',
         'title:fr': 'séparateur : "," ou ";" ou "nouvelle ligne"',
         // 'title:it': 'separatore: "," o ";" o "nuova linea"',
         // 'title:tr': 'ayırıcı: "," veya ";" veya "new line"',
         'title:de': 'separator: "," oder ";" oder "new line"',
         'title:pl': 'separator: "," lub ";" lub "now linia"',
         'title:ua': 'розділювач: "," або ";" або "новий рядок"',
         placeholder: 'text1\ntext2',
         // required: true,
      },
   },
});
