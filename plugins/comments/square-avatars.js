window.nova_plugins.push({
   id: 'square-avatars',
   title: 'Square avatars',
   'title:zh': '方形头像',
   'title:ja': '正方形のアバター',
   run_on_pages: 'all',
   section: 'comments',
   desc: 'Make user images squared',
   'desc:zh': '方形用户形象',
   'desc:ja': 'ユーザー画像を二乗する',
   _runtime: user_settings => {

      NOVA.css.push('yt-img-shadow { border-radius: 0 !important; }');

   },
});
