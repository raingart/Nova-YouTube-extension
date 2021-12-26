// test - https://www.youtube.com/results?search_query=Blackmill+ft.+Veela+-+Let+It+Be

window.nova_plugins.push({
   id: 'thumbnails-mix-hide',
   title: "Hide 'Mix' thumbnails",
   'title:zh': '隐藏[混合]缩略图',
   'title:ja': '「Mix」サムネイルを非表示',
   'title:es': "Ocultar miniaturas de 'Mix'",
   run_on_pages: 'watch, results',
   section: 'sidebar',
   desc: '[Mix] offers to rewatch what has already saw',
   'desc:zh': '[混合]提供重新观看已经看过的内容',
   'desc:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
   'desc:ja': '[Mix] ofrece volver a ver lo que ya vio',
   _runtime: user_settings => {

      NOVA.css.push(
         `ytd-radio-renderer,
         ytd-compact-radio-renderer,
         .use-ellipsis {
            display: none; !important;
         }`);

   },
});
