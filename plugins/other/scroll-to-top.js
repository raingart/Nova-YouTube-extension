window.nova_plugins.push({
   id: 'scroll-to-top',
   title: 'Scroll to top button',
   'title:zh': '滚动到顶部按钮',
   'title:ja': 'トップボタンまでスクロール',
   'title:ko': '맨 위로 스크롤 버튼',
   'title:es': 'Desplazarse al botón superior',
   'title:pt': 'Role para o botão superior',
   'title:fr': 'Faites défiler vers le haut',
   // 'title:tr': 'Üst düğmeye kaydır',
   'title:de': 'Nach oben scrollen',
   run_on_pages: 'all, -embed, -mobile',
   section: 'other',
   desc: 'Displayed on long pages',
   'desc:zh': '出现在长页面上',
   'desc:ja': '長いページに表示されます',
   'desc:ko': '긴 페이지에 표시됨',
   'desc:es': 'Mostrado en páginas largas',
   'desc:pt': 'Exibido em páginas longas',
   // 'desc:fr': 'Affiché sur de longues pages',
   'desc:tr': 'Uzun sayfalarda görüntüleniyor',
   'desc:de': 'Wird auf langen Seiten angezeigt',
   _runtime: user_settings => {

      document.addEventListener('scroll', createBtn, { capture: true, once: true });

      function createBtn() {
         const SELECTOR_ID = 'nova-scrollTop-btn';

         const btn = document.createElement('button');
         btn.id = SELECTOR_ID;
         Object.assign(btn.style, {
            position: 'fixed',
            cursor: 'pointer',
            bottom: 0,
            left: '20%',
            // display: 'none',
            visibility: 'hidden',
            opacity: .5,
            width: '40%',
            height: '40px',
            border: 'none',
            // transition: 'opacity 200ms ease-in',
            outline: 'none',
            'z-index': 1,
            'border-radius': '100% 100% 0 0',
            'font-size': '16px',
            'background-color': 'rgba(0,0,0,.3)',
            'box-shadow': '0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .4)',
         });
         btn.addEventListener('click', () => {
            window.scrollTo({
               top: 0,
               // left: window.pageXOffset,
               behavior: user_settings.scroll_to_top_smooth ? 'smooth' : 'instant',
            });
            if (user_settings.scroll_to_top_autoplay && NOVA.currentPage == 'watch'
               // && NOVA.videoElement?.paused // restart ENDED
               && ['UNSTARTED', 'PAUSED'].includes(NOVA.getPlayerState())
            ) {
               movie_player.playVideo();
               // NOVA.videoElement?.play();
            }
         });

         // create arrow
         const arrow = document.createElement('span');
         Object.assign(arrow.style, {
            border: 'solid white',
            'border-width': '0 3px 3px 0',
            display: 'inline-block',
            padding: '4px',
            'vertical-align': 'middle',
            transform: 'rotate(-135deg)',
         });
         btn.append(arrow);
         document.body.append(btn);

         // btn hover style
         NOVA.css.push(
            `#${SELECTOR_ID}:hover {
               opacity: 1 !important;
               background-color: rgba(0,0,0,.6) !important;
            }`);

         // scroll event
         const scrollTop_btn = document.getElementById(SELECTOR_ID);
         let sOld;
         window.addEventListener('scroll', () => {
            const sCurr = document.documentElement.scrollTop > (window.innerHeight / 2);
            if (sCurr == sOld) return;
            sOld = sCurr;
            scrollTop_btn.style.visibility = sCurr ? 'visible' : 'hidden';
            // console.debug('visibility:', scrollTop_btn.style.visibility);
         });
      }

   },
   options: {
      scroll_to_top_smooth: {
         _tagName: 'input',
         label: 'Smooth',
         'label:zh': '光滑的',
         'label:ja': 'スムーズ',
         'label:ko': '매끄러운',
         'label:es': 'Suave',
         'label:pt': 'Suave',
         'label:fr': 'Lisse',
         // 'label:tr': 'Düz',
         'label:de': 'Glatt',
         type: 'checkbox',
      },
      scroll_to_top_autoplay: {
         _tagName: 'input',
         label: 'Video unPause',
         'label:zh': '视频取消暂停',
         'label:ja': 'ビデオの一時停止解除',
         'label:ko': '비디오 일시 중지 해제',
         'label:es': 'Reanudar video',
         'label:pt': 'Retomar vídeo',
         'label:fr': 'Annuler la pause de la vidéo',
         // 'label:tr': 'Videoyu Duraklat',
         'label:de': 'Video wieder anhalten',
         type: 'checkbox',
      },
   }
});
