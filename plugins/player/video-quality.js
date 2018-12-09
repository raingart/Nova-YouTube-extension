_plugins.push({
   name: 'Video Quality',
   id: 'video-quality',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Set prefered quality',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#movie_player', function (playerId) {

         const target_quality = user_settings['video_quality'];

         let wait_quality = setInterval(() => {
            // console.log('wait_quality', playerId.getAvailableQualityLevels().length);

            if (playerId.getAvailableQualityLevels().length) {
               clearInterval(wait_quality);

               const qualities = playerId.getAvailableQualityLevels();

               // if (playerId.getPlaybackQuality() == target_quality) {
               //    console.log('skip_quality');
               //    console.log('quality', document.getElementById('movie_player').getPlaybackQuality());
               //    return;
               // }

               let max_available_quality = Math.max(qualities.indexOf(target_quality), 0);
               qualityToSet = qualities[max_available_quality];

               playerId.setPlaybackQuality(qualityToSet);
               playerId.setPlaybackQualityRange(qualityToSet, qualityToSet);

               // console.log('Available qualities:', JSON.stringify(qualities));
               // console.log("try set quality:", qualityToSet);
               // console.log('set realy quality:', playerId.getPlaybackQuality());
            }
         }, 50);

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
               { label: '480p (HQ/SD)', value: 'large' },
               { label: '360p (MQ)', value: 'medium' },
               { label: '240p (LQ)', value: 'small' },
               { label: '144p', value: 'tiny' },
               // { label: 'Auto', value: 'auto' },
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
