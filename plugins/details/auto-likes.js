window.nova_plugins.push({
   id: 'auto-likes',
   title: 'Auto-likes',
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
   // restart_on_location_change: true,
   section: 'details',
   // desc: '',
   // 'data-conflict': 'details-buttons',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/455474-youtube-auto-like
      // alt2 - https://greasyfork.org/en/scripts/455632-youtube-auto-liker
      // alt3 - https://greasyfork.org/en/scripts/33865-youtube-auto-liker
      // alt4 - https://greasyfork.org/en/scripts/481980-youtube-like-dislike-shortcut
      // alt5 - https://greasyfork.org/en/scripts/482555-youtube-auto-like
      // alt6 - https://greasyfork.org/en/scripts/455632-youtube-auto-liker

      // conflict with [details-buttons] plugin
      if (user_settings['details-buttons']
         && (user_settings.details_buttons_hide?.includes('all') || user_settings.details_buttons_hide.includes('like_dislike'))
      ) {
         return;
      }
      const SELECTOR_LIKE_BTN = 'ytd-watch-metadata #actions like-button-view-model button';

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            // set Timer
            // video.addEventListener('loadeddata', Timer.reset.bind(Timer));
            video.addEventListener('loadeddata', () => {
               // init
               if (user_settings.auto_likes_for_subscribed) {
                  Timer.disable = true;
                  // NOVA.triggerHUD('Auto-like is disable');
               }
               else Timer.reset.bind(Timer)
            });
            video.addEventListener('playing', Timer.start.bind(Timer, video.playbackRate));
            video.addEventListener('pause', Timer.pause.bind(Timer));

            // watching the timeline
            video.addEventListener('timeupdate', function () {
               if (Timer.disable || isNaN(this.duration)) return;
               // exceeds the progress threshold
               // if (this.currentTime / this.duration > (user_settings.auto_likes_percent || .8)) {
               if ((+Timer.progressTime / this.duration) > (+user_settings.auto_likes_percent || .8)) {
                  // Timer.disable();
                  Timer.disable = true;
                  setLike();
                  NOVA.triggerHUD('Auto-like is activation');
               }
               // console.debug('Auto-like timeupdate');
            });
            // disable for live
            video.addEventListener('canplay', function () {
               if (movie_player.getVideoData().isLive) {
                  // Timer.disable();
                  Timer.disable = true;
               }
            });
         });

      // if is liked button pressed. for optimization
      NOVA.runOnPageInitOrTransition(async () => {
         if (NOVA.currentPage != 'watch') return;

         NOVA.waitSelector(`${SELECTOR_LIKE_BTN}[aria-pressed="true"]`, { destroy_if_url_changes: true })
            .then(() => {
               if (Timer.disable) return;
               // Timer.disable();
               Timer.disable = true;
               NOVA.triggerHUD('Auto-like is deactivated');
            });

         if (user_settings.auto_likes_for_subscribed) {
            // isSubscribed
            // NOVA.waitSelector('#subscribe-button [subscribe-button-invisible]', { destroy_if_url_changes: true })
            NOVA.waitSelector('#subscribe-button [subscribed]', { destroy_if_url_changes: true })
               .then(() => {
                  // Timer.reset();
                  Timer.disable = false;
                  NOVA.triggerHUD('Auto-like is enable');
               });
         }

         // document.addEventListener('yt-action', likeIsUpdated);
      });

      // function likeIsUpdated(evt) {
      //    if (NOVA.currentPage != 'watch') return;
      //    // console.log(evt.detail?.actionName);

      //    switch (evt.detail?.actionName) {
      //       // case 'yt-reload-continuation-items-command':
      //       case 'yt-reload-continuation-items-command':
      //          document.removeEventListener('yt-action', likeIsUpdated); // stop listener

      //          NOVA.waitSelector(`${SELECTOR_LIKE_BTN}[aria-pressed="true"]`, { destroy_if_url_changes: true })
      //             .then(() => {
      //                alert(1)
      //                // Timer.disable();
      //                Timer.disable = true;
      //             });
      //          break;
      //    }
      // }

      function setLike() {
         const likeBtn = document.body.querySelector(SELECTOR_LIKE_BTN);

         if (!isLiked()) likeBtn.click();

         function isLiked() {
            return likeBtn.getAttribute('aria-pressed') == 'true';
         }
      }


      const Timer = {
         // disable,
         // timer, // setInterval
         progressTime: 0,

         start(delta = 1) {
            if (this.disable) return;
            this.timer = setInterval(function () {
               Timer.progressTime += 1 * delta;
               // console.debug('progressTime', Timer.progressTime);
            }, 1000); // 1sec
         },

         pause() {
            if (typeof this.timer === 'number') clearInterval(this.timer);
         },

         reset() {
            this.disable = false;
            this.progressTime = 0;
         },

         // disable() {
         //    this.disable = true;
         // },
      };

   },
   options: {
      auto_likes_percent: {
         _tagName: 'input',
         label: 'Watch threshold %',
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
         type: 'number',
         title: '0.1 - 0.9',
         title: 'The percentage watched to like the video at',
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
         placeholder: '%',
         step: .05,
         min: .1,
         max: .9,
         value: .8,
      },
      auto_likes_for_subscribed: {
         _tagName: 'input',
         label: 'Only for subscribed',
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
         // title: '',
      },
   }
});
