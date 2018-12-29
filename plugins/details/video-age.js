_plugins.push({
   name: 'Show video age',
   id: 'show-video-age',
   section: 'details',
   depends_page: 'watch',
   desc: 'How long ago video was uploaded',
   _runtime: user_settings => {

      YDOM.waitFor('#upload-info > .date', el => {
         let _callback = res => {
            // console.log('res %s', JSON.stringify(res));
            let publishedAt = res.items[0].snippet.publishedAt;
            let video_age = timeSince(new Date(publishedAt));

            if (document.getElementById('video_age')) {
               document.getElementById('video_age').textContent = video_age;

            } else {
               el.insertAdjacentHTML("beforeEnd", '<i class="date style-scope ytd-video-secondary-info-renderer"> / <span id="video_age">' + video_age + '</span> ago</i>');
            }
         };
         
         let videos_id = YDOM.getUrlVars()['v'];

         if (!videos_id.match(/([a-z0-9-_])/i)) {
            return console.warn('videos_id is not valid');
         }

         let url = 'videos' +
            '?id=' + videos_id +
            '&key=' + user_settings.api_key +
            '&part=snippet';

         RequestFetch(url, {}, 'json', _callback);

      });

      function timeSince(ts) {
         var sec = Math.floor((new Date - ts) / 1e3),
            d = Math.floor(sec / 31536e3);
         return d > 1 ? d + " years" : (d = Math.floor(sec / 2592e3), d > 1 ? d + " months" : (d = Math.floor(sec / 86400), d > 1 ? d + " days" : (d = Math.floor(sec / 3600), d > 1 ? d + " hours" : (d = Math.floor(sec / 60), d > 1 ? d + " minutes" : Math.floor(sec) + " seconds"))))
      }

   },
});
