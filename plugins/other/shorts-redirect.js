window.nova_plugins.push({
   id: 'shorts-disable',
   title: 'Disable shorts',
   'title:zh': '禁用短裤',
   'title:ja': 'ショートパンツを無効にする',
   'title:ko': '반바지 비활성화',
   'title:es': 'Deshabilitar pantalones cortos',
   'title:pt': 'Desativar shorts',
   'title:fr': 'Désactiver les shorts',
   'title:tr': 'Şortları devre dışı bırak',
   'title:de': 'Kurzschlüsse deaktivieren',
   run_on_pages: 'feed, shorts, -mobile',
   restart_on_transition: true,
   section: 'channel',
   // desc: 'Redirect shorts video to normal URL',
   // 'desc:zh': '将短片视频重定向到正常 URL',
   // 'desc:ja': 'ショートパンツの動画を通常のURLにリダイレクトする',
   // 'desc:ko': '짧은 비디오를 일반 URL로 리디렉션',
   // 'desc:es': 'Redirigir video corto a URL normal',
   // 'desc:pt': 'Redirecionar vídeo curto para URL normal',
   // 'desc:fr': 'Rediriger la vidéo courte vers une URL normale',
   // 'desc:tr': "Kısa videoyu normal URL'ye yönlendir",
   // 'desc:de': 'Kurzvideos auf normale URL umleiten',
   _runtime: user_settings => {

      switch (NOVA.currentPageName()) {
         case 'shorts': location.href = location.href.replace('shorts/', 'watch?v='); break;

         case 'feed':
            // check
            const interval = setInterval(hideShorts, 150);
            // clear
            document.addEventListener('yt-navigate-start', () => clearInterval(interval)); // on feed transition
            setTimeout(() => clearInterval(interval), 1000 * 5); // after 5s. Fallback if nothing is found

            function hideShorts() {
               document.body.querySelectorAll('ytd-grid-video-renderer:not([hidden])')
                  .forEach(thumb => {
                     if (link = thumb.querySelector('a[href*="shorts/"]')) {
                        // console.debug('has #shorts:', link, link.textContent);
                        thumb.style.display = 'none';
                     }
                  });
            }

            // There is a init delay. Not an optimized way
            // NOVA.watchElement({
            //    selector: 'ytd-grid-video-renderer:not([hidden])',
            //    attr_mark: 'shorts-cleared',
            //    callback: thumb => {
            //       if ((link = thumb.querySelector('a#video-title, a[href*="shorts/"]'))
            //          && link.textContent.includes('#shorts')
            //       ) {
            //          // console.debug('has #shorts:', link, link.textContent);
            //          thumb.style.display = 'none';
            //          cleared = true;
            //       }
            //    },
            // });
            break;
      }
   },
});
