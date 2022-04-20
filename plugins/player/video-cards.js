window.nova_plugins.push({
   id: 'disable-video-cards',
   title: "Hide in-video info cards",
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:tr': '',
   // 'title:de': '',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: "turn off 'card' in https://www.youtube.com/account_playback",
   _runtime: user_settings => {

      NOVA.css.push('body [class^="ytp-ce-"] { display: none !important; }');
   },
});
