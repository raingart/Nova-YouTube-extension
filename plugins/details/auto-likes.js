window.nova_plugins.push({
   id: 'auto-likes',
   title: 'Auto-like',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
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
   section: 'details-buttons',
   // desc: '',
   // 'plugins-conflict': 'details-buttons',
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
                  // NOVA.triggerOSD('Auto-like is disable');
               }
               else Timer.reset.bind(Timer)
            });
            video.addEventListener('playing', Timer.start.bind(Timer, video.playbackRate));
            video.addEventListener('pause', Timer.pause.bind(Timer));

            // watching the timeline
            video.addEventListener('timeupdate', function () {
               if (Timer.disable || isNaN(this.duration)) return;
               // exceeds the progress threshold
               // if (this.currentTime / this.duration > ((Math.trunc(user_settings.auto_likes_percent) / 100) || .8)) {
               if ((+Timer.progressTime / this.duration) > ((Math.trunc(user_settings.auto_likes_percent) / 100) || .8)) {
                  // Timer.disable();
                  Timer.disable = true;
                  setLike();
                  NOVA.triggerOSD('Auto-like is activation');
               }
               // console.debug('Auto-like timeupdate');
            });
            // disable for live
            video.addEventListener('canplay', () => {
               if (movie_player.getVideoData().isLive) {
                  // Timer.disable();
                  Timer.disable = true;
               }
            });
         });

      // if is liked button pressed. for optimization
      NOVA.runOnPageLoad(async () => {
         if (NOVA.currentPage != 'watch') return;

         NOVA.waitSelector(`${SELECTOR_LIKE_BTN}[aria-pressed="true"]`, { destroy_after_page_leaving: true })
            .then(() => {
               if (Timer.disable) return;
               // Timer.disable();
               Timer.disable = true;
               NOVA.triggerOSD('Auto-like is deactivated');
            });

         if (user_settings.auto_likes_for_subscribed) {
            // isSubscribed
            // NOVA.waitSelector('#subscribe-button [subscribe-button-invisible]', { destroy_after_page_leaving: true })
            NOVA.waitSelector('#subscribe-button [subscribed]', { destroy_after_page_leaving: true })
               .then(() => {
                  // Timer.reset();
                  Timer.disable = false;
                  NOVA.triggerOSD('Auto-like is enable');
               });
         }

         // document.addEventListener('yt-action', likeIsUpdated);
      });

      // function likeIsUpdated(evt) {
      //    if (NOVA.currentPage != 'watch') return;
      //    // console.debug(evt.detail?.actionName);

      //    switch (evt.detail?.actionName) {
      //       // case 'yt-reload-continuation-items-command':
      //       case 'yt-reload-continuation-items-command':
      //          document.removeEventListener('yt-action', likeIsUpdated); // stop listener

      //          NOVA.waitSelector(`${SELECTOR_LIKE_BTN}[aria-pressed="true"]`, { destroy_after_page_leaving: true })
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
         label: 'Watch threshold in %',
         'label:zh': '观察阈值（%）',
         'label:ja': '監視しきい値 (%)',
         // 'label:ko': '감시 임계값(%)',
         // 'label:vi': '',
         // 'label:id': 'Ambang batas tontonan dalam %',
         // 'label:es': 'Umbral de vigilancia en %',
         'label:pt': 'Limite de observação em %',
         'label:fr': 'Seuil de surveillance en %',
         // 'label:it': '',
         // 'label:tr': '',
         'label:de': 'Beobachtungsschwelle in %',
         'label:pl': 'Próg oglądania w%',
         'label:ua': 'Поріг перегляду в %',
         type: 'number',
         title: '10-90%',
         title: 'Percentage of views at which a video is liked',
         'title:zh': '视频在时间进度后被点赞',
         'title:ja': '時間の経過後にビデオが「いいね！」される',
         // 'title:ko': '',
         // 'title:vi': '',
         // 'title:id': '',
         // 'title:es': 'El porcentaje visto para darle me gusta al video en',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
         // 'title:ua': '',
         placeholder: '%',
         step: 5,
         min: 10,
         max: 90,
         value: 80,
      },
      auto_likes_for_subscribed: {
         _tagName: 'input',
         label: 'Only for subscribed',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:vi': '',
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
