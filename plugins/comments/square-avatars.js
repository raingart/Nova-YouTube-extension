window.nova_plugins.push({
   id: 'square-avatars',
   title: 'Square avatars',
   run_on_pages: 'all',
   section: 'comments',
   desc: 'Make user images squared',
   _runtime: user_settings => {

      NOVA.css.push('yt-img-shadow { border-radius: 0 !important; }');

   },
});
