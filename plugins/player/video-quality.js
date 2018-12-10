_plugins.push({
   name: 'Video Quality',
   id: 'video-quality',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Set prefered quality',
   _runtime: function (user_settings) {

      const _this = this;

      PolymerYoutube.waitFor('.html5-video-player', function (playerId) {

         const target_quality = user_settings['video_quality'];

         // playerId.addEventListener("onStateChange", onChangeQuality.bind(this));

         document.querySelector("video").addEventListener("canplay", onChangeQuality);

         function onChangeQuality(_vid) {

            const qualities = playerId.getAvailableQualityLevels();

            // if (playerId.getPlaybackQuality() == target_quality) {
            //    console.log('skip set quality');
            //    return;
            // }

            let max_available_quality = Math.max(qualities.indexOf(target_quality), 0);
            let qualityToSet = qualities[max_available_quality];

            //set PlaybackQuality'
            if (playerId.hasOwnProperty('setPlaybackQuality')) {
               // console.log('use setPlaybackQuality');
               playerId.setPlaybackQuality(qualityToSet);
            }

            // set QualityRange
            if (playerId.hasOwnProperty('setPlaybackQualityRange')) {
               playerId.setPlaybackQualityRange(qualityToSet, qualityToSet);

            } else { // emul clicked (in embed iframe)
               console.log('use emul clicked');
               document.querySelector(".ytp-settings-button").click(); // settings button

               const quality_option = document.querySelector(".ytp-panel-menu .ytp-menuitem:last-child");
               // test is quality option
               if (quality_option.children[1].firstElementChild.textContent.match(/\d{3,4}[ps]/)) {
                  quality_option.click(); // open option

                  const shownQualities = document
                     .querySelector(".ytp-settings-menu")
                     .querySelector(".ytp-quality-menu .ytp-panel-menu").children;

                  shownQualities[max_available_quality].click(); // choosing it quality

                  //unfocused
                  _vid.target.click();
                  _vid.target.focus();

                  // console.log('choosing it quality', shownQualities[max_available_quality].innerText);
               }
            }
            
            if (qualities.indexOf(target_quality) === -1) {
               console.warn('no have target_quality. Choosing instead the top-most quality available\n', qualities, target_quality);
            }

            // console.log('Available qualities:', JSON.stringify(qualities));
            // console.log("try set quality:", qualityToSet);
            // console.log('set realy quality:', playerId.getPlaybackQuality());
         }

      });

   },
   export_opt: (function (data) {
      return {
         'video_quality': {
            _elementType: 'select',
            label: 'Quality',
            title: 'If unavailable, set max available quality',
            options: [
               // Available 'highres','hd2880','hd2160','hd1440','hd1080','hd720','large','medium','small','tiny'
               /* beautify preserve:start */
               { label: '4320p (8k/FUHD)', value: 'highres' },
               { label: '2880p (5k/UHD)', value: 'hd2880' },
               { label: '2160p (4k/QFHD)', value: 'hd2160' },
               { label: '1440p (QHD)', value: 'hd1440' },
               { label: '1080p (FHD)', value: 'hd1080' },
               { label: '720p (HD)', value: 'hd720', selected: true },
               { label: '480p (SD)', value: 'large' },
               { label: '360p', value: 'medium' },
               { label: '240p', value: 'small' },
               { label: '144p', value: 'tiny' },
               // { label: 'Auto', value: 'auto' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
