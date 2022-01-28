// test - https://www.youtube.com/results?search_query=Blackmill+ft.+Veela+-+Let+It+Be

window.nova_plugins.push({
   id: 'thumbnails-mix-hide',
   title: "Hide 'Mix' thumbnails",
   'title:zh': '隐藏[混合]缩略图',
   'title:ja': '「Mix」サムネイルを非表示',
   'title:ko': '"믹스" 썸네일 숨기기',
   'title:es': "Ocultar miniaturas de 'Mix'",
   'title:pt': "Ocultar miniaturas de 'Mix'",
   'title:fr': 'Masquer les vignettes "Mix"',
   'title:de': '„Mix“-Thumbnails ausblenden',
   run_on_pages: 'watch, results, home',
   section: 'sidebar',
   desc: '[Mix] offers to rewatch what has already saw',
   'desc:zh': '[混合]提供重新观看已经看过的内容',
   'desc:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
   'desc:ko': '[Mix]는 이미 본 것을 다시 볼 것을 제안합니다',
   'desc:es': '[Mix] ofrece volver a ver lo que ya vio',
   'desc:pt': '[Mix] se oferece para rever o que já viu',
   // 'desc:de': '[Mix] bietet an, bereits Gesehenes noch einmal anzuschauen',
   _runtime: user_settings => {

      const cssSelectors = [
         'ytd-radio-renderer',
         'ytd-compact-radio-renderer',
         '.use-ellipsis',
         // 'a.ytp-videowall-still.ytp-suggestion-set[data-is-mix=true]',
         'a.ytp-videowall-still[data-is-mix=true]',
         'ytm-radio-renderer'
      ]
         .join(',');

      NOVA.css.push(cssSelectors + '{ display: none !important; }');

   },
});
