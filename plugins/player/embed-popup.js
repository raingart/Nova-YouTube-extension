// for test
// https://www.youtube.com/embed/u3JP5UzZbiI?enablejsapi=1&playerapiid=pljs_yt_YouTube10069&html5=1&start=0&disablekb=1&autohide=1&playsinline=1&iv_load_policy=3&controls=0&showinfo=0&modestbranding=1&rel=0&autoplay=0&loop=0&origin=https%3A%2F%2Fsmall-games.info&widgetid=1

window.nova_plugins.push({
   // id: 'embed-redirect-watch',
   id: 'embed-popup',
   title: 'Redirect embedded to popup',
   'title:zh': '将嵌入式视频重定向到弹出窗口',
   'title:ja': '埋め込まれたビデオをポップアップにリダイレクトします',
   'title:ko': '포함된 비디오를 팝업으로 리디렉션',
   'title:id': '포함된 비디오를 팝업으로 리디렉션',
   'title:es': 'Redirigir video incrustado a ventana emergente',
   'title:pt': 'Redirecionar vídeo incorporado para pop-up',
   'title:fr': 'Rediriger la vidéo intégrée vers une fenêtre contextuelle',
   'title:it': 'Reindirizza il video incorporato al popup',
   // 'title:tr': '',
   'title:de': 'Leiten Sie eingebettete Videos zum Popup um',
   'title:pl': 'Przekieruj osadzone wideo do wyskakującego okienka',
   'title:ua': 'Переспрямувати вбудоване відео у спливаюче вікно',
   run_on_pages: 'embed, -mobile',
   section: 'player',
   desc: 'if iframe width is less than 720p',
   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   // 'desc:ua': '',
   'data-conflict': 'player-fullscreen-mode',
   _runtime: user_settings => {

      // alt - https://greasyfork.org/en/scripts/466414-youtube-embed-to-watch-redirector

      // enable only in iframe
      if (window.top === window.self // not iframe
         || location.hostname.includes('googleapis.com') // exclude Gdrive
         || NOVA.queryURL.has('popup') // self
      ) {
         return;
      }

      // fix conflict with [theater-mode] plugin (some options)
      if (user_settings.player_full_viewport_mode == 'redirect_watch_to_embed') return;
      // fix conflict with [player-fullscreen-mode]
      if (user_settings['player-fullscreen-mode']) return;

      // get iframe size
      // alert(window.innerWidth)
      // alert(document.documentElement.clientWidth)
      // add emdeb popup only for small frame size
      if (window.innerWidth > 720) return;

      NOVA.waitSelector('#movie_player video')
         .then(video => {
            video.addEventListener('loadeddata', createPopup.bind(video));
         });

      function createPopup() {
         // stop playing in parent tab
         // location.assign(NOVA.queryURL.set({ 'autoplay': false }));
         movie_player.stopVideo();

         // this == NOVA.videoElement
         const { width, height } = NOVA.aspectRatio.sizeToFit({
            // 'srcWidth': NOVA.videoElement.videoWidth,
            // 'srcHeight': NOVA.videoElement.videoHeight,
            'srcWidth': this.videoWidth,
            'srcHeight': this.videoHeight,
            'maxWidth': screen.width / (+user_settings.player_buttons_custom_popup_width || 4),
            // 'maxHeight': window.innerHeight,
         });

         const url = new URL(
            document.querySelector('link[itemprop="embedUrl"][href]')?.href
            || (location.origin + '/embed/' + movie_player.getVideoData().video_id)
         );
         // list param ex.
         // https://www.youtube.com/embed/PBlOi5OVcKs?start=0&amp;playsinline=1&amp;controls=0&amp;fs=20&amp;disablekb=1&amp;rel=0&amp;origin=https%3A%2F%2Ftyping-tube.net&amp;enablejsapi=1&amp;widgetid=1

         url.searchParams.set('autoplay', 1);
         url.searchParams.set('popup', true); // deactivate popup-button for used window

         openPopup({ 'url': url.href, 'title': document.title, 'width': width, 'height': height });

         function openPopup({ url, title, width, height }) {
            // center screen
            const left = (screen.width / 2) - (width / 2);
            const top = (screen.height / 2) - (height / 2);
            // bottom right corner
            // left = window.innerWidth;
            // top = window.innerHeight;
            const newWindow = window.open(url, '_blank', `popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`);
            newWindow.document.title = title;
         }
      }

   },
});
