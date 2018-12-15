_plugins.push({
   name: 'Player Timeline Progress color',
   id: 'player-progress-color',
   section: 'player',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitFor('.ytp-swatch-background-color', timeline => timeline.style.backgroundColor = user_settings['player_progress_color']);

   },
   export_opt: (function () {
      return {
         'player_progress_color': {
            _elementType: 'input',
            label: 'Color',
            type: 'color',
            value: '#ff0000', // red
         },
      };
   }()),
});
