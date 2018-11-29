_plugins.push({
   name: 'Channel Video Time',
   id: 'show-video-age',
   section: 'details',
   depends_page: 'watch',
   // depends_request: {videos:["snippet"]},
   // sandbox: true,
   desc: 'How long ago video was uploaded',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#upload-info .date', function (element) {
         let video_id = PolymerYoutube.getUrlVars()['v'];

         // console.log('video_id ' + video_id);

         let url = 'videos' +
            '?id=' + video_id +
            '&key=' + user_settings.api_key +
            '&part=snippet';
         // '&part=snippet,contentDetails,statistics,status';

         let _callback = res => {
            // console.log('res %s', JSON.stringify(res));
            let publishedAt = res.items[0].snippet.publishedAt;
            // console.log('publishedAt: %s', publishedAt);

            var between_time = new Date().getTime() - new Date(publishedAt);
            let how_long = timeFormat_short(between_time);
            // console.log('how_long '+ how_long);
            // console.log('publishedAt '+ publishedAt);

            if (document.getElementById('how_long')) {
               document.getElementById('how_long').innerHTML = how_long;

            } else {
               element.insertAdjacentHTML("beforeEnd", '<span class="date style-scope ytd-video-secondary-info-renderer">&nbsp/&nbsp<i id="how_long">' + how_long + ' ago</i></span>');
            }
         };

         // RequestFetch(soundUrl, payload, type, _callback);
         RequestFetch(url, {}, 'json', _callback);

      });

      function timeFormat_short(ms) {
         let day, min, sec;
         return sec = Math.floor(ms / 1e3), 0 >= sec ? "0 secs" : (years = Math.floor(sec / 31536000), years > 0 ? years + " years" : (day = Math.floor(sec / 86400), day > 0 ? day + " days" : (min = Math.floor(Math.log(sec) / Math.log(60)), Math.floor(sec / Math.pow(60, min)) + " " + ["sec", "mins", "hours", "years"][min])))
      }

   },
});
