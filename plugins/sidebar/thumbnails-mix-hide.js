window.nova_plugins.push({
   id: 'thumbnails-mix-hide',
   title: 'Hide Mix" thumbnails',
   'title:zh': '隐藏[混合]缩略图',
   'title:ja': '「Mix」サムネイルを非表示',
   run_on_pages: 'watch',
   section: 'sidebar',
   desc: '[Mix] offers to rewatch what has already saw',
   'desc:zh': '[混合]提供重新观看已经看过的内容',
   'desc:ja': '「Mix」は、すでに見たものを再視聴することを提案します',
   _runtime: user_settings => {

      NOVA.css.push(
         `ytd-compact-radio-renderer, .use-ellipsis {
            display: none; !important;
         }`);

   },
});
