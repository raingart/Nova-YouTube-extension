_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch',
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      YDOM.waitFor('#owner-name > a[href]', el => {
         // console.log('#owner-container a', el);

         let _callback = res => {
            // console.log('res', JSON.stringify(res));
            let videoCount = res.items.map(item => item.statistics.videoCount).join();

            if (document.getElementById('video_count')) {
               document.getElementById('video_count').textContent = videoCount;

            } else {
               el.parentElement.insertAdjacentHTML("beforeend", '<span class="date style-scope ytd-video-secondary-info-renderer"> - <span id="video_count">' + videoCount + '</span> videos</span>');
            }

         };

         // let channel_id = el.getElementsByTagName("a")[0].getAttribute("href").split('/').pop();
         let channel_id = el.getAttribute("href").split('/').pop();
         // console.log('channel_id', channel_id);

         if (!channel_id.match(/UC([a-z0-9-_]{22})/i)) {
            return console.error('channel_id is not valid');
         }

         let url = 'channels' +
            '?id=' + channel_id +
            '&key=' + user_settings.api_key +
            '&part=statistics';

         RequestFetch(url, {}, 'json', _callback);

      });

   }
});
