_plugins.push({
   name: 'Channel Video Count',
   id: 'channel-video-count',
   group: 'details',
   depends_page: 'watch',
   // depends_request: {videos: ["statistics", "snippet"]},
   // sandbox: true,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {

      PolymerYoutube.waitFor('#owner-container a', function (element) {
         // console.log('this %s', JSON.stringify(this));
         // console.log('this.selector %s', JSON.stringify(this.selector));

         let channel_url = element.getAttribute("href").split('/');
         let channel_id = channel_url[channel_url.length - 1];

         if (!channel_id.match(/UC([a-z0-9-_]{22})/i)) {
            return console.error('channel_id is not valid');;
         }

         let url = 'channels' +
            '?id=' + channel_id +
            '&key=' + settings.api_key +
            '&part=statistics';

         // let payload = request.payload || {
         //    /*
         //       'method': 'GET',
         //       mode: 'no-cors', 
         //       'payload': {
         //          'client': 'gtx', // official Google Translate extension
         //       }*/
         // };

         let _callback = (res) => {
            // console.log('res %s', JSON.stringify(res));
            let videoCount = res
               // .items[0].statistics.videoCount
               .items.map((item) => {
                  return item.statistics.videoCount;
               }).join();

            // console.log('videoCount: %s', videoCount);

            if (document.getElementById('video_count')) {
               document.getElementById('video_count').innerHTML = videoCount;

            } else {
               element.parentElement.insertAdjacentHTML("beforeend", '<span class="date style-scope ytd-video-secondary-info-renderer">&nbsp-&nbsp<span id="video_count">' + videoCount + '</span> videos</span>');
               // div.textContent = "div text";
            }

         };

         // RequestFetch(soundUrl, payload, type, _callback);
         RequestFetch(PolymerYoutube.api_url + url, {}, 'json', _callback);
      });
   }
});
