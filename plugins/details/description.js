window.nova_plugins.push({
   id: 'video-description-expand',
   title: 'Expands video description',
   'title:zh': '展开视频说明',
   'title:ja': 'ビデオの説明を展開します',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'details',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('#meta [collapsed] #more')
         .then(el => el.click());

   }
});
