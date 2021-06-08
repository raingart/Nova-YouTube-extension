_plugins_conteiner.push({
   id: 'video-quality',
   title: 'Video quality',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: (user_settings, current_page) => {

      YDOM.waitElement('.html5-video-player') // replace "#movie_player" for embed page
         .then(player => {
            let selectedQuality = user_settings.video_quality;

            player.addEventListener("onStateChange", setQuality.bind(this));

            function setQuality(state) {
               if (!selectedQuality) return console.error('selectedQuality unavailable', selectedQuality);
               // console.debug('onStateChange', ...arguments);

               // -1: unstarted
               // 0: ended
               // 1: playing
               // 2: paused
               // 3: buffering
               // 5: video cued
               if ((1 === state || 3 === state) && !setQuality.allow_change) {
                  setQuality.allow_change = true;

                  let interval_quality = setInterval(() => {
                     const availableQualityLevels = player.getAvailableQualityLevels();

                     if (availableQualityLevels?.length) {
                        clearInterval(interval_quality);

                        const maxAvailableQuality = Math.max(availableQualityLevels.indexOf(selectedQuality), 0);
                        const qualityToSet = availableQualityLevels[maxAvailableQuality];

                        // if (!qualityToSet || player.getPlaybackQuality() == selectedQuality) {
                        //    return console.debug('skip set quality');
                        // }

                        if (!availableQualityLevels.includes(selectedQuality)) {
                           console.info(`no has selectedQuality: "${selectedQuality}". Choosing instead the top-most quality available "${qualityToSet}" of ${JSON.stringify(availableQualityLevels)}`);
                        }

                        if (player.hasOwnProperty('setPlaybackQuality')) {
                           // console.debug('use setPlaybackQuality');
                           player.setPlaybackQuality(qualityToSet);
                        }

                        // set QualityRange
                        if (player.hasOwnProperty('setPlaybackQualityRange')) {
                           // console.debug('use setPlaybackQualityRange');
                           player.setPlaybackQualityRange(qualityToSet, qualityToSet);
                        }

                        // console.debug('availableQualityLevels:', availableQualityLevels);
                        // console.debug("try set quality:", qualityToSet);
                        // console.debug('set realy quality:', player.getPlaybackQuality());
                     }
                  }, 50); // 50ms

               } else if (-1 === state || 0 === state) {
                  setQuality.allow_change = false;
               }

               // keep quality in session
               if (user_settings.video_quality_manual_save_tab && current_page === 'watch') {// no sense if in the embed
                  player.addEventListener("onPlaybackQualityChange", quality => {
                     // console.debug('document.activeElement,',document.activeElement);
                     if (document.activeElement.getAttribute('role') === 'menuitemradio' // now focuse setting menu
                        && quality !== selectedQuality // the new quality
                        && player.hasOwnProperty('setPlaybackQuality') // not automatically changed
                     ) {
                        console.info('save session new quality:', quality);
                        selectedQuality = quality;
                     }
                  });
               }
            }
         });

   },
   options: {
      video_quality: {
         _tagName: 'select',
         label: 'Default video quality',
         title: 'If unavailable, set max available quality',
         // multiple: null,
         options: [
            // Available 'highres','hd2880','hd2160','hd1440','hd1080','hd720','large','medium','small','tiny'
            { label: '4320p/8k', value: 'highres' },
            { label: '2880p/5k', value: 'hd2880' },
            { label: '2160p/4k', value: 'hd2160' },
            { label: '1440p/QHD', value: 'hd1440' },
            { label: '1080p/HD', value: 'hd1080', selected: true },
            { label: '720p', value: 'hd720' },
            { label: '480p', value: 'large' },
            { label: '360p', value: 'medium' },
            { label: '240p', value: 'small' },
            { label: '144p', value: 'tiny' },
            // { label: 'Auto', value: 'auto' }, // no sense, deactivation does too
         ],
      },
      video_quality_manual_save_tab: {
         _tagName: 'input',
         label: 'Save manually selected for the same tab',
         type: 'checkbox',
         title: 'Affects to next videos',
      },
   },
});
