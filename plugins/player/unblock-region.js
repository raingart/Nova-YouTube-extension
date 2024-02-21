// for test
// https://www.youtube.com/watch?v=bTm3kwroEyw - https://watannetwork.com/tools/blocked/#url=bTm3kwroEyw
// https://www.youtube.com/watch?v=3U2UGM0ldGg - https://watannetwork.com/tools/blocked/#url=3U2UGM0ldGg
// https://www.youtube.com/watch?v=OztVDJXEfpo - https://watannetwork.com/tools/blocked/#url=OztVDJXEfpo
// https://www.youtube.com/watch?v=bJ9r8LMU9bQ - https://watannetwork.com/tools/blocked/#url=bJ9r8LMU9bQ
// https://www.youtube.com/watch?v=6pX93dXfH9s - https://watannetwork.com/tools/blocked/#url=6pX93dXfH9s
// https://www.youtube.com/watch?v=c8mJrbYdMWw - https://watannetwork.com/tools/blocked/#url=c8mJrbYdMWw
// https://www.youtube.com/watch?v=Ea6JCPUfito - https://watannetwork.com/tools/blocked/#url=Ea6JCPUfito
// https://www.youtube.com/watch?v=0HlYIx1LDmU - https://watannetwork.com/tools/blocked/#url=0HlYIx1LDmU
// https://www.youtube.com/watch?v=HCq5y6CcaxE - https://watannetwork.com/tools/blocked/#url=HCq5y6CcaxE
// https://www.youtube.com/watch?v=IvZOmE36PLc - https://watannetwork.com/tools/blocked/#url=IvZOmE36PLc
// https://www.youtube.com/watch?v=de9FGmm-Wg0 - https://watannetwork.com/tools/blocked/#url=de9FGmm-Wg0

window.nova_plugins.push({
   id: 'video-unblock-region',
   title: 'Try unblock if video not available in your country',
   'title:zh': '尝试解锁您所在地区的视频',
   'title:ja': 'お住まいの地域の動画のブロックを解除してみてください',
   // 'title:ko': '해당 지역의 동영상 차단을 해제해 보세요',
   // 'title:vi': '',
   // 'title:id': 'Coba buka blokir jika video tidak tersedia di negara Anda',
   // 'title:es': 'Intenta desbloquear videos para tu región',
   'title:pt': 'Tente desbloquear vídeos para sua região',
   'title:fr': 'Débloquer la vidéo de la région',
   // 'title:it': 'Prova a sbloccare se il video non è disponibile nel tuo paese',
   // 'title:tr': 'Bölgeniz için videoların engellemesini kaldırmayı deneyin',
   'title:de': 'Versuchen Sie, Videos für Ihre Region zu entsperren',
   'title:pl': 'Spróbuj odblokować, jeśli film nie jest dostępny w Twoim kraju',
   'title:ua': 'Спробувати розблокувати якщо відео не доступне у країні',
   // run_on_pages: 'watch, embed, -mobile',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Attempt fix "is not available in your country"',
   'desc:zh': '尝试修复“在您的国家不可用”',
   'desc:ja': '「お住まいの国では利用できません」という修正を試みる',
   // 'desc:ko': '수정 시도 "해당 국가에서는 사용할 수 없습니다"',
   // 'desc:vi': '',
   // 'desc:id': 'Coba perbaiki "tidak tersedia di negara Anda"',
   // 'desc:es': 'Intento de corrección "no está disponible en su país"',
   'desc:pt': 'Tentativa de correção "não está disponível em seu país"',
   'desc:fr': 'Tentative de correction "n\'est pas disponible dans votre pays"',
   // 'desc:it': 'Tentativo di correzione "non è disponibile nel tuo paese"',
   // 'desc:tr': '',
   'desc:de': 'Versuchen Sie, "ist in Ihrem Land nicht verfügbar" zu beheben',
   'desc:pl': 'Próba naprawienia nie jest dostępna w Twoim kraju',
   'desc:ua': 'Спроба розблокувати доступ до відео',
   // 'plugins-conflict': 'video-unavailable',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/9062-youtube-unblocker
      // alt2 - https://chrome.google.com/webstore/detail/gpnebajhkedajplkepiafghcfoljbgmk
      // alt3 - https://greasyfork.org/en/scripts/24163-youtube-unblocker
      // alt4 - https://freetubeapp.io/
      // alt5 - https://greasyfork.org/en/scripts/466944-youtube-country-restriction-forwarder
      // alt5 - https://greasyfork.org/en/scripts/476133-youtube-lite-melhor-experi%C3%AAncia

      // Doesn't work
      // NOVA.waitSelector('ytd-watch-flexy[player-unavailable] video')
      //    .then(video => {
      //       video.addEventListener('emptied', () => {
      //          switch (key) {
      //             case 'watch':
      //             case 'embed':
      //                // redirect();
      //                alert(1111)
      //                break;
      //          }
      //       });
      //    });

      const SELECTOR = 'ytd-watch-flexy[player-unavailable] #player-error-message-container #info';

      NOVA.waitSelector(SELECTOR, { destroy_after_page_leaving: true })
         .then(async container => {
            // if (container.querySelector('yt-player-error-message-renderer #button.yt-player-error-message-renderer button')) return;
            if (container.querySelector('button')) return;

            const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;

            insertLinks(container, videoId);

            function insertLinks(container = required(), video_id = required()) {
               if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

               NOVA.css.push(
                  `${SELECTOR} ul {
                     border-radius: 12px;
                     background-color: var(--yt-spec-badge-chip-background);
                     font-size: 1.4rem;
                     line-height: 2rem;
                     padding: 10px;
                  }
                  ${SELECTOR} li {
                     color: var(--yt-spec-text-primary);
                  }
                  ${SELECTOR} a:not(:hover) {
                     color: var(--yt-spec-text-primary);
                     text-decoration: none;
                  }`);

               const ul = document.createElement('ul');
               // ul.className = '';
               [
                  { label: 'hooktube.com', value: 'hooktube.com' },
                  { label: 'clipzag.com', value: 'clipzag.com' },
                  { label: 'piped.video', value: 'piped.video' },
                  { label: 'yewtu.be', value: 'yewtu.be' },
                  { label: 'nsfwyoutube.com', value: 'nsfwyoutube.com' },
                  { label: 'yout-ube.com', value: 'yout-ube.com' },
                  { label: 'riservato-xyz.frama.io', value: 'riservato-xyz.frama.io' },
               ]
                  .forEach(domain => {
                     const li = document.createElement('li');

                     const a = document.createElement('a');
                     a.href = `${location.protocol}//${domain.value}${location.port ? ':' + location.port : ''}/watch?v=${video_id}`;
                     a.target = '_blank';
                     a.textContent = '→ Open with ' + domain.label;
                     a.title = 'Open with ' + domain.label;

                     li.append(a); // append
                     ul.append(li); // append
                  });

               ul.insertAdjacentHTML('beforeend',
                  `<li class="bold style-scope yt-formatted-string">Based on the data on the map, select an allowed country in the VPN</li>`);

               container.append(ul); // append
            }
         });


      // '#movie_player .ytp-error'
      // '#movie_player .ytp-error .ytp-error-content-wrap-reason'
      NOVA.waitSelector('ytd-watch-flexy[player-unavailable]', { destroy_after_page_leaving: true })
         // To above v105 https://developer.mozilla.org/en-US/docs/Web/CSS/:has
         // NOVA.waitSelector('ytd-watch-flexy[player-unavailable] yt-player-error-message-renderer #button.yt-player-error-message-renderer:not(:has(button))')
         .then(el => {
            if (user_settings.video_unblock_region_domain
               && el.querySelector('yt-player-error-message-renderer #button.yt-player-error-message-renderer button')
               && confirm('Nova [video-unblock-region]\nThe video is not available in your region, open a in mirror?')
            ) {
               redirect();
            }

            // open map
            if (user_settings.video_unblock_region_open_map) {
               // iframe
               // c = document.body.querySelector('ytd-watch-flexy[player-unavailable] #error-screen > *');
               // const iframe = document.createElement('iframe');
               // iframe.src = ;
               // // iframe.style.width = '100%';
               // // iframe.style.height = '100%';
               // // c.style = "width: 600px; height: 400px";
               // c.append(iframe);

               // iframe.addEventListener('load', function () {

               // });

               // `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${key}`
               NOVA.request.API({
                  request: 'videos',
                  params: {
                     'id': NOVA.queryURL.get('v') || movie_player.getVideoData().video_id,
                     'part': 'contentDetails',
                  },
                  api_key: user_settings['user-api-key'],
               })
                  .then(res => {
                     // alert message
                     if (res?.error) return alert(`Error [${res.code}]: ${res?.message}`);

                     res?.items?.forEach(item => {
                        if (data = item.contentDetails?.regionRestriction) {
                           // ex: https://raingart.github.io/region_map/?allowed=AG%2CAI%2CAR%2CAW%2CBB%2CBL%2CBM%2CBO%2CBQ%2CBR%2CBS%2CBZ%2CCL%2CCO%2CCR%2CCU%2CCW%2CDM%2CDO%2CEC%2CFK%2CGD%2CGF%2CGP%2CGT%2CGY%2CHN%2CHT%2CJM%2CKN%2CKY%2CLC%2CMF%2CMQ%2CMS%2CMX%2CNI%2CPA%2CPE%2CPR%2CPY%2CSH%2CSR%2CSV%2CSX%2CTC%2CTT%2CUS%2CUY%2CVC%2CVE%2CVG%2CVI
                           const mapLink = NOVA.queryURL.set(data, 'https://raingart.github.io/region_map/');
                           // const mapLink = `https://watannetwork.com/tools/blocked/#url=${videoId}:~:text=Allowed%20countries`;
                           NOVA.openPopup({ url: mapLink, width: '1200px', height: '600px' });
                           // window.open(mapLink); // new tab and focus
                        }
                     });
                  });
            }
         });

      function redirect(new_tab) {
         const videoId = NOVA.queryURL.get('v') || movie_player.getVideoData().video_id;

         if (new_tab) {
            window.open(`${location.protocol}//${user_settings.video_unblock_region_domain || 'hooktube.com'}${location.port ? ':' + location.port : ''}/watch?v=${videoId}`);
         }
         else {
            location.hostname = user_settings.video_unblock_region_domain || 'hooktube.com';
            // or
            // location.assign(`${location.protocol}//${user_settings.video_unblock_region_domain || 'hooktube.com'}/watch` + location.search); // currect tab
         }
      }

   },
   options: {
      // Strategy 1 (input + datalist)
      video_unblock_region_domain: {
         _tagName: 'input',
         label: 'Redirect to URL',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:vi': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         // 'label:ua': '',
         // type: 'url',
         type: 'text',
         list: 'video_unblock_region_domain_help_list',
         pattern: "^[a-zA-Z0-9-]{2,20}\.[a-zA-Z]{2,5}$",
         title: 'without "https://"',
         'title:zh': '没有“https://”',
         'title:ja': '「https://」なし',
         // 'title:ko': '"https://" 없이',
         // 'title:vi': '',
         // 'title:id': 'tanpa "https://"',
         // 'title:es': 'sin "https://"',
         'title:pt': 'sem "https://"',
         'title:fr': 'sans "https://"',
         // 'title:it': 'senza "https://"',
         // 'title:tr': '',
         'title:de': 'ohne "https://"',
         'title:pl': 'bez „https://”',
         'title:ua': 'без "https://"',
         placeholder: 'domain.com',
         // placeholder: 'hooktube.com',
         minlength: 5,
         maxlength: 20,
         // value: 'hooktube.com',
         // required: true,
         // 'data-dependent': { 'video_unblock_region_redirect': true },
      },
      video_unblock_region_domain_help_list: {
         _tagName: 'datalist',
         options: [
            { label: 'hooktube.com', value: 'hooktube.com' },
            { label: 'clipzag.com', value: 'clipzag.com' },
            { label: 'piped.video', value: 'piped.video' },
            { label: 'yewtu.be', value: 'yewtu.be' },
            { label: 'nsfwyoutube.com', value: 'nsfwyoutube.com' },
            { label: 'yout-ube.com', value: 'yout-ube.com' },
            { label: 'riservato-xyz.frama.io', value: 'riservato-xyz.frama.io' },
            // { label: 'piped.kavin.rocks', value: 'piped.kavin.rocks' },
            // is shut down
            // { label: 'tubeunblock.com', value: 'tubeunblock.com' },
            // { label: 'cinemaphile.com', value: 'cinemaphile.com' },
         ],
      },
      // Strategy 2 (list + input)
      // video_unblock_region_domain: {
      //    _tagName: 'select',
      //    label: 'choose a mirror',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': '',
      //    options: [
      //       { label: 'hooktube.com', value: 'hooktube.com' },
      //       { label: 'clipzag.com', value: 'clipzag.com' },
      //       { label: 'piped.video', value: 'piped.video' },
      //       { label: 'yewtu.be', value: 'yewtu.be' },
      //       { label: 'nsfwyoutube.com', value: 'nsfwyoutube.com' },
      //       { label: 'yout-ube.com', value: 'yout-ube.com' },
      //       { label: 'riservato-xyz.frama.io', value: 'riservato-xyz.frama.io' },
      //       // { label: 'piped.kavin.rocks', value: 'piped.kavin.rocks' },
      //       // is shut down
      //       // { label: 'tubeunblock.com', value: 'tubeunblock.com' },
      //       // { label: 'cinemaphile.com', value: 'cinemaphile.com' },
      //    ],
      // },
      // video_unblock_region_domain_custom: {
      //    _tagName: 'input',
      //    // label: 'domain',
      //    label: 'domain',
      //    // 'label:zh': '',
      //    // 'label:ja': '',
      //    // 'label:ko': '',
      //    // 'label:vi': '',
      //    // 'label:id': '',
      //    // 'label:es': '',
      //    // 'label:pt': '',
      //    // 'label:fr': '',
      //    // 'label:it': '',
      //    // 'label:tr': '',
      //    // 'label:de': '',
      //    // 'label:pl': '',
      //    // 'label:ua': '',
      //    type: 'url',
      //    // pattern: "https://.*",
      //    // title: '',
      //    // placeholder: '',
      //    minlength: 5,
      //    maxlength: 20,
      //    // value: '',
      //    'data-dependent': { 'video_unblock_region_domain': ['false'] },
      // },
      video_unblock_region_open_map: {
         _tagName: 'input',
         label: 'Open the map in which regions is available',
         'label:zh': '打开可用区域的地图',
         'label:ja': '利用可能な地域の地図を開く',
         // 'label:ko': '이용 가능한 지역의 지도를 엽니다.',
         // 'label:vi': '',
         // 'label:id': 'Buka peta dengan ketersediaan di wilayah',
         // 'label:es': 'Abrir mapa con disponibilidad en regiones',
         'label:pt': 'Abrir mapa com disponibilidade nas regiões',
         'label:fr': 'Carte ouverte avec disponibilité dans les régions',
         // 'label:it': 'Apri la mappa con la disponibilità nelle regioni',
         // 'label:tr': '',
         'label:de': 'Karte mit Verfügbarkeit in Regionen öffnen',
         'label:pl': 'Otwórz mapę z dostępnością w regionach',
         'label:ua': 'Відкрити карту з доступністю в регіонах',
         type: 'checkbox',
         // title: '',
         // 'data-dependent': { 'video_unblock_region_redirect': true },
      },
   }
});
