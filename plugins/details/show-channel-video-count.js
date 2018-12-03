_plugins.push({
   name: 'Channel Video Count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch',
   // depends_request: {videos: ["statistics", "snippet"]},
   // sandbox: true,
   desc: 'Total number of videos no channel',
   // version: '0.1',
   _runtime: function (user_settings) {

      PolymerYoutube.waitFor('#owner-container a', function (element) {

         let _callback = res => {
            // console.log('res %s', JSON.stringify(res));
            let videoCount = res.items.map(item => item.statistics.videoCount).join();

            if (document.getElementById('video_count')) {
               document.getElementById('video_count').textContent = videoCount;

            } else {
               element.parentElement.insertAdjacentHTML("beforeend", '<span class="date style-scope ytd-video-secondary-info-renderer">&nbsp-&nbsp<span id="video_count">' + videoCount + '</span> videos</span>');
            }

         };

         // let channel_id = element.getElementsByTagName("a")[0].getAttribute("href").split('/').pop();
         let channel_id = element.getAttribute("href").split('/').pop();

         if (!channel_id.match(/UC([a-z0-9-_]{22})/i)) {
            return console.error('channel_id is not valid');;
         }

         let url = 'channels' +
            '?id=' + channel_id +
            '&key=' + user_settings.api_key +
            '&part=statistics';

         RequestFetch(url, {}, 'json', _callback);

      });
      
   }
});
