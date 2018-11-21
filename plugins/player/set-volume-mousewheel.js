_plugins.push({
   name: 'Volume with MouseWheel',
   id: 'set-volume-mousewheel',
   section: 'player',
   depends_page: 'watch, embed',
   // sandbox: false,
   desc: 'Use mouse wheel to change volume',
   // version: '0.1',
   _runtime: function (user_settings) {

      const _this = this;

      // PolymerYoutube.waitFor('.html5-video-player', function (playerId) {
      PolymerYoutube.waitFor('#movie_player', function (playerId) {
         document.getElementsByClassName("html5-video-container")[0]
            .addEventListener("wheel", MouseWheelHandler, false); //mousewheel

         function MouseWheelHandler(event) {
            // console.log(event.target);
            event.preventDefault();

            let step = user_settings['volume_step'] || _this.export_opt['volume_step'] || 10;
            const delta = Math.sign(event.wheelDelta) * step;

            const level = videoVolume(delta);
            if (user_settings['show_volume_indicator']) displayVolumeBar(level, this);
         }

         function videoVolume(delta) {
            // let playerId = document.getElementById('movie_player');
            playerId.isMuted() && playerId.unMute();

            let limiter = d => (d > 100 ? 100 : d < 0 ? 0 : d);
            let level = limiter(parseInt(playerId.getVolume()) + delta);

            // console.log('playerId.getVolume()', playerId.getVolume());
            // console.log('delta', delta);
            // console.log('parseInt(playerId.getVolume()) + delta', parseInt(playerId.getVolume()) + delta);
            // console.log('level', level);
            playerId.setVolume(level); // 0 - 100
            saveVolume(level);
            return level;

            // function getVolume() {
            //    var playerId = document.getElementById("movie_player");
            //    var volume = null;
            //    if (playerId) {
            //       if (playerId.hasOwnProperty('getVolume')) volume = parseInt(playerId.getVolume());
            //    }
            //    return volume;
            // }

            function saveVolume(level) {
               // console.log('sessionStorage["yt-player-volume"] %s', JSON.stringify(sessionStorage["yt-player-volume"]));
               let now = (new Date).getTime();
               let muted = level ? "false" : "true";
               // localStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
               //    '}","expiration":' + (now + 2592E6) + ',"creation":' + c + "}";
               sessionStorage["yt-player-volume"] = '{"data":"{\\"volume\\":' + level + ',\\"muted\\":' + muted +
                  '}","creation":' + now + "}";
            }
         }

         function displayVolumeBar(level, display_container) {
            let divVolumeBarId = "volume-player-info";
            let divVolumeBar = document.getElementById(divVolumeBarId);

            let showVolumeBar = text => {
               if (typeof fateVolumeBar !== "undefined") clearTimeout(fateVolumeBar);
               divVolumeBar.textContent = text;

               divVolumeBar.style.transition = 'none';
               divVolumeBar.style.opacity = 1;

               fateVolumeBar = setTimeout(() => {
                  divVolumeBar.style.transition = 'opacity 200ms ease-in';
                  divVolumeBar.style.opacity = 0;
               }, 1300); //200ms + 1300ms = 1.5s
            };

            if (divVolumeBar) {
               showVolumeBar(level);

            } else if (display_container) {
               display_container.insertAdjacentHTML("afterend", '<div id="' + divVolumeBarId + '">' + level + '</div>');
               divVolumeBar = document.getElementById(divVolumeBarId);

               Object.assign(divVolumeBar.style, {
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
               showVolumeBar(level);
            }
         }
      });

   },
   export_opt: (function (data) {
      return {
         'volume_step': {
            _elementType: 'input',
            label: 'volume step',
            type: 'number',
            placeholder: '1-50',
            step: 5,
            min: 0,
            max: 50,
            value: 10,
            title: 'switch option to show you volume percentage on screen',
         },
         'show_volume_indicator': {
            _elementType: 'input',
            label: 'show indicator',
            type: 'checkbox',
         },
      };
   }()),
});
