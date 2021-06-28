_plugins_conteiner.push({
   id: 'square-avatars',
   title: 'Square avatars',
   run_on_pages: 'watch, channel',
   section: 'comments',
   desc: 'Make user images squared',
   _runtime: user_settings => {

      YDOM.css.push('yt-img-shadow { border-radius: 0 !important; }');

   },
});
