_plugins.push({
   name: 'Channel Video Age',
   id: 'show-video-age',
   section: 'details',
   depends_page: 'watch',
   // depends_request: {videos:["snippet"]},
   // sandbox: true,
   desc: 'How long ago video was uploaded',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#upload-info .date', function (element) {

         let _callback = res => {
            // console.log('res %s', JSON.stringify(res));
            let publishedAt = res.items[0].snippet.publishedAt;
            let between_time = new Date().getTime() - new Date(publishedAt);
            let video_age = timeFormat_short(between_time);

            if (document.getElementById('video_age')) {
               document.getElementById('video_age').textContent = video_age;

            } else {
               element.insertAdjacentHTML("beforeEnd", '<span class="date style-scope ytd-video-secondary-info-renderer">&nbsp/&nbsp<i id="video_age">' + video_age + ' ago</i></span>');
            }
         };

         let url = 'videos' +
            '?id=' + PolymerYoutube.getUrlVars()['v'] +
            '&key=' + user_settings.api_key +
            '&part=snippet';

         RequestFetch(url, {}, 'json', _callback);

      });

      function timeFormat_short(ms) {
         let day, min, sec;
         return sec = Math.floor(ms / 1e3), 0 >= sec ? "0 secs" : (years = Math.floor(sec / 31536000), years > 0 ? years + " years" : (day = Math.floor(sec / 86400), day > 0 ? day + " days" : (min = Math.floor(Math.log(sec) / Math.log(60)), Math.floor(sec / Math.pow(60, min)) + " " + ["sec", "mins", "hours", "years"][min])))
      }

   },
});
