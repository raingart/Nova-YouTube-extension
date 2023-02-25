// for test
// https://www.youtube.com/watch?v=OV27taeR4LA - (4:3)
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide

window.nova_plugins.push({
   id: 'player-resize-ratio',
   title: 'Player force resize 16:9',
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
   run_on_pages: 'watch',
   section: 'player',
   desc: 'only for 4:3 video',
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
   // 'desc:ua': '',
   _runtime: user_settings => {

      // fit thumbnail cover
      // NOVA.css.push(
      //    `.ytp-cued-thumbnail-overlay-image {
      //       background-size: contain;
      //    }`);

      NOVA.waitElement('ytd-watch-flexy:not([theater])')
         .then(ytd_watch => {

            NOVA.waitElement('#movie_player video')
               .then(video => {
                  console.assert(ytd_watch.calculateCurrentPlayerSize_, '"ytd_watch" does not have fn "calculateCurrentPlayerSize_"');

                  const
                     heightRatio = .5625, // 0.5625 as a fraction is 9/16 (https://hellothinkster.com/math-questions/fractions/what-is-0.5625-as-a-fraction)
                     check4to3 = () => '4:3' == NOVA.calculateAspectRatio.fitToSize({
                        // 'width': movie_player.clientWidth,
                        // 'height': movie_player.clientHeight,
                        // 'width': NOVA.videoElement?.videoWidth,
                        // 'height': NOVA.videoElement?.videoHeight,
                        'width': video.videoWidth,
                        'height': video.videoHeight,
                     });

                  // Strategy 1 API
                  if (ytd_watch.calculateCurrentPlayerSize_ && ytd_watch.updateStyles) {
                     const backupFn = ytd_watch.calculateCurrentPlayerSize_;
                     // init
                     patchYtCalculateFn();
                     // update video
                     video.addEventListener('loadeddata', patchYtCalculateFn);

                     function sizeBypass() {
                        let width = height = NaN;

                        if (!ytd_watch.theater) {
                           width = movie_player.offsetWidth;
                           height = Math.round(movie_player.offsetWidth / (16 / 9));

                           if (ytd_watch.updateStyles) {
                              ytd_watch.updateStyles({
                                 '--ytd-watch-flexy-width-ratio': 1,
                                 '--ytd-watch-flexy-height-ratio': heightRatio,
                                 // '--ytd-watch-width-ratio': 1,
                                 // '--ytd-watch-height-ratio': heightRatio.
                              });
                              window.dispatchEvent(new Event('resize')); // fix: restore player size
                           }
                        }
                        return {
                           'width': width,
                           'height': height,
                        };
                     }

                     function patchYtCalculateFn() {
                        ytd_watch.calculateCurrentPlayerSize_ = check4to3() ? sizeBypass : backupFn;
                     }
                  }
                  // Strategy 2. Now broken ".ytp-chrome-bottom" (https://www.youtube.com/watch?v=U9mUwZ47z3E)
                  else {
                     // watch on the ytd_watch is change
                     new MutationObserver(mutationRecordsArray => {
                        // for (const record of mutationRecordsArray) {
                        //    console.debug('Old value:', record.oldValue);
                        // }
                        if (!ytd_watch.theater && heightRatio != ytd_watch.style.getPropertyValue('--ytd-watch-flexy-height-ratio')) {
                           updateRatio();
                        }
                     })
                        // childList: false, subtree: false,
                        .observe(ytd_watch, { attributes: true, attributeFilter: ['style'] });
                  }

                  window.addEventListener('resize', updateRatio); // fix: restore player size

                  function updateRatio() {
                     if (check4to3()) {
                        ytd_watch.style.setProperty('--ytd-watch-flexy-width-ratio', 1);
                        ytd_watch.style.setProperty('--ytd-watch-flexy-height-ratio', heightRatio);
                     }
                  }
               });

         });

      // alt set real ratio (video before playing returns wrong size - 4:3)
      // NOVA.waitElement('video')
      //    .then(video => {
      //       if (ytd_watch.theater) return;
      //       // const
      //       //    width = movie_player.offsetWidth,
      //       // height = Math.round(movie_player.offsetWidth / (16 / 9));

      //       const aspectRatio = Nova.calculateAspectRatio.fitToSize(video.videoWidth, video.videoHeight);
      //       console.debug('>', aspectRatio, video.videoWidth, height);
      //       // update only height ratio
      //       // Strategy 1
      //       // ytd_watch.style.setProperty('--ytd-watch-flexy-height-ratio', aspectRatioHeightList[aspectRatio]);

      //       // Strategy 2 API
      //       ytd_watch.updateStyles({
      //          '--ytd-watch-flexy-width-ratio': 1,
      //          '--ytd-watch-flexy-height-ratio': .5625,
      //          // '--ytd-watch-width-ratio': 1,
      //          // '--ytd-watch-height-ratio': .5625
      //       });
      //    });

      // // https://hellothinkster.com/math-questions/fractions/what-is-0.5625-as-a-fraction
      // const aspectRatioHeightList = [
      //    // ex. - 0.5625 as a fraction is 9/16
      //    { '16:9': .5625 }, // HD, FHD, QHD, 4K, 8K
      //    { '4:3': .75 }, // HD, FHD, QHD, 4K, 8K
      //    { '9:16': 1.777777778 }, // mobile
      // ];
   },
});
