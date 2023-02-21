// for test
// https://www.youtube.com/embed/u3JP5UzZbiI?enablejsapi=1&playerapiid=pljs_yt_YouTube10069&html5=1&start=0&disablekb=1&autohide=1&playsinline=1&iv_load_policy=3&controls=0&showinfo=0&modestbranding=1&rel=0&autoplay=0&loop=0&origin=https%3A%2F%2Fsmall-games.info&widgetid=1

window.nova_plugins.push({
   id: 'embed-show-control-force',
   title: 'Force show control panel in embed',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'embed',
   section: 'player',
   _runtime: user_settings => {

      // if (NOVA.queryURL.has('controls'))
      if (['0', 'false'].includes(NOVA.queryURL.get('controls'))) {
         const changeUrl = (new_url = required()) => window.history.replaceState(null, null, new_url);
         // clear
         changeUrl(NOVA.queryURL.remove('controls'));
      }

   },
});
