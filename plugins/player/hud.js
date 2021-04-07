_plugins_conteiner.push({
   name: 'Player indicator',
   id: 'player-indicator',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   desc: 'Replace default indicator',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'player-indicator-info',
         COLOR_HUD = user_settings.player_indicator_color || '#ddd';

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(videoPlayer => {
            // show indicator
            // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
            // volume
            videoPlayer.querySelector('video')
               .addEventListener('volumechange', function (event) {
                  // console.debug('volumechange', videoPlayer.getVolume(), this.volume);
                  HUD.set(videoPlayer.getVolume(), '%');
               });
            // rate
            videoPlayer.querySelector('video')
               .addEventListener('ratechange', function (event) {
                  // console.debug('ratechange', videoPlayer.getPlaybackRate(), this.playbackRate);
                  HUD.set(this.playbackRate, 'x');
               });
         });

      const HUD = {
         create() {
            const div = document.createElement("div");
            div.id = SELECTOR_ID;
            // hide default indicator
            YDOM.HTMLElement.addStyle('.ytp-bezel-text-wrapper { display:none !important }');
            // init common css
            YDOM.HTMLElement.addStyle({
               position: 'absolute',
               left: 0,
               right: 0,
               opacity: 0,
               'background-color': 'rgba(0,0,0,0.3)',
               color: '#fff',
               margin: '0 auto',
               'text-align': 'center',
               'z-index': '19',
            }, '#' + SELECTOR_ID);

            switch (user_settings.player_indicator_type) {
               case 'bar-smooth':
                  Object.assign(div.style, {
                     bottom: '20%',
                     width: '30%',
                     'font-size': '1.2em',
                  });
                  // div.innerHTML = '<span></span>';
                  const span = document.createElement("span");
                  span.innerHTML = '&nbsp;';
                  Object.assign(span.style, {
                     'background-color': COLOR_HUD,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                     float: 'left',
                  });
                  div.appendChild(span);
                  break;

               case 'bar-pt':
                  Object.assign(div.style, {
                     bottom: '20%',
                     width: '30%',
                     'font-size': '1.2em',
                  });
                  break;

               default:
                  Object.assign(div.style, {
                     top: '0',
                     width: '100%',
                     'font-size': '1.6em',
                     padding: '.2em 0',
                  });
            }
            document.getElementById('movie_player').appendChild(div);
            return div;
         },

         set(pt, rate_suffix = '') {
            // console.debug('HUD set', ...arguments);
            if (typeof fateHUD === 'number') clearTimeout(fateHUD);

            const hud = document.getElementById(SELECTOR_ID) || this.create();
            const text = pt + rate_suffix;

            if (rate_suffix === 'x') { // rate to pt
               const maxPt = (+user_settings.player_rate_step % 0.25) === 0 ? 2 : 3;
               pt = (+pt / maxPt) * 100;
            }
            pt = Math.round(pt);

            switch (user_settings.player_indicator_type) {
               case 'bar-smooth':
                  hud.querySelector('span').style.width = pt + '%';
                  break;

               case 'bar-pt':
                  hud.style.background = `linear-gradient(to right, ${COLOR_HUD}d0 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`;
                  hud.textContent = text;
                  break;

               default:
                  hud.textContent = text;
            }

            hud.style.transition = 'none';
            hud.style.opacity = 1;
            // hud.style.visibility = 'visibility';

            fateHUD = setTimeout(() => {
               hud.style.transition = 'opacity 200ms ease-in';
               hud.style.opacity = null;
               // hud.style.visibility = 'hidden';
            }, 800); //total 1s = 800ms + 200ms(hud.style.transition)
         }
      };

   },
   opt_export: {
      'player_indicator_type': {
         _tagName: 'select',
         label: 'Indicator type',
         options: [
            { label: 'text-top', value: 'default', selected: true },
            { label: 'bar+smooth', value: 'bar-smooth' },
            { label: 'bar+%', value: 'bar-pt' },
         ],
      },
      'player_indicator_color': {
         _tagName: 'input',
         label: 'Color',
         type: 'color',
         value: '#ff0000', // red
         'data-dependent': '{"player_indicator_type":["bar-smooth","bar-pt"]}',
      },
   },
});
