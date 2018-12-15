_plugins.push({
   name: 'Hide annotations/cards',
   id: 'hide-annotations',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Force hide annotations elements in player',
   _runtime: user_settings => {

      let css = [
         "[class*=annotation]",
         "[class*=ytp-cards]",
         ".iv-drawer",
         ".ima-container",
         "[class*=ytp-ad]"
      ].map(selector => '.html5-video-player ' + selector).join(',\n');

      YDOM.injectStyle({
         display: 'none'
      }, css, 'important');

   },
});
