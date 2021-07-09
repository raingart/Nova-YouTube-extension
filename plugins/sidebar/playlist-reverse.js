_plugins_conteiner.push({
   id: 'playlist-reverse',
   title: 'Reverse playlist order',
   run_on_pages: 'watch, playlist',
   // restart_on_transition: true,
   section: 'sidebar',
   desc: 'Unstable! Think of it as an alpha ver.',
   _runtime: user_settings => {

      let idx;

      YDOM.waitElement('#movie_player')
         .then(player => {
            player.addEventListener('onStateChange', onPlayerStateChange.bind(player));
         });

      function onPlayerStateChange(state) {
         if (!YDOM.queryURL.get('list')) return;
         // console.debug('state', state);
         // -1: unstarted
         // 0: ended
         // 1: playing
         // 2: paused
         // 3: buffering
         // 5: cued
         switch (state) {
            case 0:
               this.previousVideo();
               break;

            case 1:
               let idxNew = YDOM.queryURL.get('index');
               if (idxNew !== idx) {
                  idx = idxNew;
                  reverseElement(document.querySelector('#playlist #items.playlist-items'));
                  scrollToElement(document.querySelector('#playlist-items[selected]'));
                  updateNextButton();
               }
               break;
         }
      }

      function updateNextButton() {
         const
            nextItem = document.querySelector('#playlist [selected] + *'),
            nextURL = nextItem?.querySelector('a').href;

         if (!nextURL) return;

         if (next_button = document.querySelector('.ytp-next-button')) {
            next_button.href = nextURL;
            next_button.dataset.preview = nextItem.querySelector('img').src;
            next_button.dataset.tooltipText = nextItem.querySelector('#video-title').textContent;
         }
         if (playlistManager = document.querySelector('yt-playlist-manager')?.autoplayData.sets[0].nextButtonVideo) {
            playlistManager.commandMetadata.webCommandMetadata.url = nextURL.replace(location.origin, '');
            playlistManager.watchEndpoint.videoId = YDOM.queryURL.get('v', nextURL);

         }
      }

      function reverseElement(container) {
         if (!(container instanceof HTMLElement)) {
            return console.error('container not HTMLElement:', container);
         }
         container.append(...Array.from(container.childNodes).reverse());
      }

      function scrollToElement(targetEl) {
         if (!(targetEl instanceof HTMLElement)) {
            return console.error('targetEl not HTMLElement:', targetEl);
         }
         const container = targetEl.parentNode;
         container.scrollTop = targetEl.offsetTop - container.offsetTop;
      }

      // scroll does not work
      // YDOM.css.push(
      //    `#playlist #items.playlist-items {
      //       display: flex;
      //       flex-direction: column-reverse;
      //     }`);
      // YDOM.waitElement('#movie_player')
      //    .then(player => {
      //       // -1: unstarted
      //       // 0: ended
      //       // 1: playing
      //       // 2: paused
      //       // 3: buffering
      //       // 5: cued
      //       const onPlayerStateChange = state => (state === 0) && player.previousVideo();
      //    });
   },
});
