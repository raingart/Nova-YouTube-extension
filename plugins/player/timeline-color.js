_plugins.push({
   name: 'Color timeline player',
   id: 'player-timeline-color',
   section: 'player',
   depends_page: 'watch',
   // desc: '',	
   _runtime: user_settings => {

      YDOM.waitFor('.ytp-swatch-background-color', progress =>
         progress.style.backgroundColor = user_settings.player_timeline_color);

   },
   export_opt: (function () {
      return {
         'player_timeline_color': {
            _elementType: 'input',
            label: 'Color',
            type: 'color',
            value: '#0089ff',
         },
      };
   }()),
});
