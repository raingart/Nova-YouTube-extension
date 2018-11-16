_plugins.push({
   name: 'Volume with MouseWheel',
   id: 'volume-mousewheel',
   group: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   // desc: '',
   version: '0.1',
   runtime: function (settings) {

      PolymerYoutube.waitFor('.html5-video-player', function (vid) {
         // PolymerYoutube.waitFor('#movie_player', function (vid) {
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", MouseWheelHandler, false); //mousewheel

         function MouseWheelHandler(e) {
            // console.log(event.target);
            e.preventDefault();

            let step = settings.volume_step || 10;
            const delta = Math.sign(e.wheelDelta) * step;

            displayVolumeBar(this, videoVolume(delta));
         }

         function videoVolume(delta) {
            // let vid = document.getElementById('movie_player');

            vid.unMute();
            let level = parseInt(vid.getVolume()) + delta;

            if (level > 100 && delta > 0) level = 100;
            else if (level < 0 && delta < 0) level = 0;

            // console.log('level', level);
            vid.setVolume(level);
            return level;
         }

         function displayVolumeBar(player_container, volume) {
            let divVolumeBar = () => {
               return document.getElementById('volume-player-info')
            };

            if (divVolumeBar()) {
               // divVolumeBar().innerHTML = volume;
               divVolumeBar().textContent = volume;

               if (divVolumeBar().style.opacity == 0) {
                  divVolumeBar().style.transition = 'none';
                  divVolumeBar().style.opacity = 1;

                  setTimeout(() => {
                     divVolumeBar().style.transition = 'opacity 200ms ease-in';
                     divVolumeBar().style.opacity = 0;
                  }, 1000);
               }

            } else {
               // document.querySelector('.ytp-chrome-bottom')
               player_container.insertAdjacentHTML("afterend", '<div id="volume-player-info">' + volume + '</div>');

               Object.assign(divVolumeBar().style, {
                  'background-color': 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  opacity: 0,
                  // transition: 'opacity 200ms ease-in',
                  'font-size': '1.6em',
                  left: 0,
                  padding: '.4em 0',
                  position: 'absolute',
                  'text-align': 'center',
                  top: 'auto',
                  width: '100%',
                  'z-index': '35',
               });
            }
         }
      });

   },
   export_opt: (function (data) {
      return {
         input: {
            name: 'volume_step',
            label: 'volume step',
            type: 'number',
            placeholder: '1-50',
            step: 5,
            min: 0,
            max: 50,
            value: 10,
         },
      };
   }()),
});
