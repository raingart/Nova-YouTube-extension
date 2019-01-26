_plugins.push({
   name: 'Show channel videos count',
   id: 'show-channel-video-count',
   section: 'details',
   depends_page: 'watch',
   desc: 'Total number of videos on channel',
   _runtime: user_settings => {

      YDOM.waitFor('#owner-name > a[href]', el => {
         const channel_id = el.getAttribute("href").split('/').pop();

         if (!channel_id.match(/UC([a-z0-9-_]{22})/i)) {
            return console.error('channel_id is not valid');
         }

         const url = 'channels' +
            '?id=' + channel_id +
            '&key=' + user_settings.api_key +
            '&part=statistics';

         RequestFetch(url, {}, 'json', res => {
            // console.log('res', JSON.stringify(res));
            const videoCount = res.items.map(item => item.statistics.videoCount).join();

            if (document.getElementById('video_count')) {
               document.getElementById('video_count').textContent = videoCount;

            } else {
               el.parentElement.insertAdjacentHTML("beforeend", '<span class="date style-scope ytd-video-secondary-info-renderer"> - <span id="video_count">' + videoCount + '</span> videos</span>');
            }

         });

      });

   }
});
