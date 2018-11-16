_plugins.push({
   name: 'Video Quality',
   id: 'video-quality',
   group: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {
      
      PolymerYoutube.waitFor('#movie_player', function (vid) {
         // Available 'highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'
         const target_quality = settings.player_quality;
         // const target_quality = 'small'; //test
         const qualities = vid.getAvailableQualityLevels();
         let qualityToSet;

         if (vid.getPlaybackQuality() == target_quality) return;

         console.log('Available qualities: %s', JSON.stringify(qualities));

         // is available target_quality
         if (qualities.indexOf(target_quality) > -1) {
            qualityToSet = target_quality;
            // set max available quality
         } else {
            // let max_available_quality = Math.max(qualities.indexOf(target_quality), 0);
            // quality = qualities[max_available_quality];
            qualityToSet = qualities[0];
         }

         console.log("set quality to: " + qualityToSet);
         // changeResolution
         vid.setPlaybackQualityRange(qualityToSet, qualityToSet);
         // vid.setPlaybackQuality(qualityToSet); // not work now

         console.log('set realy quality to: %s', vid.getPlaybackQuality());
      });
   },
   export_opt: (function (data) {
      return {
         select: {
            name: 'player_quality',
            label: 'Quality',
            options: [
               /* beautify preserve:start */
               { label: '4320p (8k/QUHD)', value: 'highres' },
               { label: '2880p (5k/UHD+)', value: 'hd2880' },
               { label: '2160p (4k/UHD)', value: 'hd2160' },
               { label: '1440p (UHD)', value: 'hd1440' },
               { label: '1080p (FHD)', value: 'hd1080' },
               { label: '720p (HD)', value: 'hd720' },
               { label: '480p', value: 'large' },
               { label: '360p', value: 'medium' },
               { label: '240p', value: 'small' },
               { label: '144p', value: 'tiny' },
               { label: 'Auto', value: 'auto', selected: true }
               /* beautify preserve:end */
            ]
         },
      };
   }()),
});
