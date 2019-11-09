_plugins.push({
   name: 'Hide annotations/cards',
   id: 'hide-annotations',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Force hide annotations elements in player',
   _runtime: user_settings => {

      const css = [
         // "[class*=annotation]",
         // "[class^=ytp-cards-teaser],
         ".ytp-cards-teaser",
         ".ytp-paid-content-overlay-text",
         // ".iv-drawer",
         // ".ima-container",
         // "[class*=ytp-ad]"
      ].join(',\n');

      YDOM.injectStyle({ display: 'none' }, css, 'important');

   },
});
