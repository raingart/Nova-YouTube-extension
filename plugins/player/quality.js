_plugins.push({
   name: 'Video quality',
   id: 'video-quality',
   section: 'player',
   depends_page: 'watch, embed',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitHTMLElement({
         selector: '#movie_player',
         callback: videoPlayer => {
            let selectedQuality = user_settings.video_quality;

            videoPlayer.addEventListener("onStateChange", setQuality.bind(this));

            function setQuality(state) {
               if (!selectedQuality) {
                  console.error('selectedQuality unavailable', selectedQuality);
                  return;
               }
               // console.debug('onStateChange', state);

               // -1: unstarted
               // 0: ended
               // 1: playing
               // 2: paused
               // 3: buffering
               // 5: video cued
               if ((1 === state || 3 === state) && !setQuality.allow_change) {
                  setQuality.allow_change = true;

                  let interval_quality = setInterval(() => {
                     const availableQualityLevels = videoPlayer.getAvailableQualityLevels();

                     if (availableQualityLevels.length) {
                        clearInterval(interval_quality);

                        const maxAvailableQuality = Math.max(availableQualityLevels.indexOf(selectedQuality), 0);
                        const qualityToSet = availableQualityLevels[maxAvailableQuality];

                        // if (!qualityToSet || videoPlayer.getPlaybackQuality() == selectedQuality) {
                        //    console.debug('skip set quality');
                        //    return;
                        // }

                        if (!availableQualityLevels.includes(selectedQuality)) {
                           console.info(`no has selectedQuality: "${selectedQuality}". Choosing instead the top-most quality available "${qualityToSet}" of ${JSON.stringify(availableQualityLevels)}`);
                        }

                        if (videoPlayer.hasOwnProperty('setPlaybackQuality')) {
                           // console.debug('use setPlaybackQuality');
                           videoPlayer.setPlaybackQuality(qualityToSet);
                        }

                        // set QualityRange
                        if (videoPlayer.hasOwnProperty('setPlaybackQualityRange')) {
                           videoPlayer.setPlaybackQualityRange(qualityToSet, qualityToSet);

                           // emulate clicked (in embed iframe)
                        } else if (document.querySelector('.ytp-settings-button:not([aria-expanded]')) { // the menu is not open
                           // console.debug('emulate clicked');
                           document.querySelector('.ytp-settings-button').click(); // settings button
                           document.querySelector('.ytp-settings-menu [role=menuitem]:last-child').click(); // quality menu

                           // [...document.querySelector(".ytp-quality-menu .ytp-panel-menu").children]
                           //    .filter(menuitem => menuitem.textContent.includes(qualityToSet))[0].click();

                           const showQualities = document.querySelectorAll('.ytp-quality-menu [role=menuitemradio]');
                           console.debug('choosing it quality', showQualities[maxAvailableQuality].innerText);
                           showQualities[maxAvailableQuality].click(); // choosing it quality

                           // unfocused
                           document.querySelector("body").click();
                           document.querySelector("video").focus();
                        }

                        // console.debug('availableQualityLevels:', JSON.stringify(availableQualityLevels));
                        // console.debug("try set quality:", qualityToSet);
                        // console.debug('set realy quality:', videoPlayer.getPlaybackQuality());
                     }
                  }, 50); // 50ms

               } else if (-1 === state || 0 === state) {
                  setQuality.allow_change = false;
               }

               // keep quality in session
               if (user_settings.save_manual_quality_in_tab && location.pathname == '/watch') {// no sense if in the embed
                  videoPlayer.addEventListener("onPlaybackQualityChange", quality => {
                     // console.debug('document.activeElement,',document.activeElement);
                     if (document.activeElement.getAttribute('role') == "menuitemradio" && // now focuse setting menu
                        quality !== selectedQuality && // the new quality
                        videoPlayer.hasOwnProperty('setPlaybackQuality') // not automatically changed
                     ) {
                        console.info('save session new quality:', quality);
                        selectedQuality = quality;
                     }
                  });
               }
            }
         },
      });

   },
   opt_export: {
      'video_quality': {
         _elementType: 'select',
         label: 'Set prefered quality',
         title: 'If unavailable, set max available quality',
         // multiple: null,
         options: [
            // Available 'highres','hd2880','hd2160','hd1440','hd1080','hd720','large','medium','small','tiny'
            { label: '4320p (8k/FUHD)', value: 'highres' },
            { label: '2880p (5k/UHD)', value: 'hd2880' },
            { label: '2160p (4k/QFHD)', value: 'hd2160' },
            { label: '1440p (QHD)', value: 'hd1440' },
            { label: '1080p (FHD)', value: 'hd1080', selected: true },
            { label: '720p (HD)', value: 'hd720' },
            { label: '480p (SD)', value: 'large' },
            { label: '360p', value: 'medium' },
            { label: '240p', value: 'small' },
            { label: '144p', value: 'tiny' },
            // { label: 'Auto', value: 'auto' }, // no sense, deactivation does too
         ]
      },
      'save_manual_quality_in_tab': {
         _elementType: 'input',
         label: 'Save manually selected quality for the same tab',
         type: 'checkbox',
      },
   },
});
