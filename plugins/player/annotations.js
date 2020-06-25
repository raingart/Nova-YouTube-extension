_plugins.push({
   name: 'Hide annotations/cards',
   id: 'hide-annotations',
   section: 'player',
   depends_page: 'watch, embed',
   desc: 'Force hide annotations elements in player',
   _runtime: user_settings => {

      const cssSelector = [
         '[class^=ytp-pause-overlay]',
         '[class^=ytp-ce-element]',
         '.ytp-ce-element',
         '.ytp-cards-teaser',
         '.ytp-paid-content-overlay-text',
      ].join(',\n');

      YDOM.injectStyle({ display: 'none' }, cssSelector, 'important');

   },
});
