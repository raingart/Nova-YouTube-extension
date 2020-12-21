_plugins_conteiner.push({
   name: 'Volume indicator',
   id: 'volume-indicator',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'volume-player-info',
         COLOR_HUD = user_settings.volume_indicator_color || '#ddd';

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(videoPlayer => {
            // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
            videoPlayer.querySelector('video')
               .addEventListener("volumechange", () => HUD.set(videoPlayer.getVolume()));
         });

      // hide default indicator and ytp-bezel-icon
      YDOM.HTMLElement.addStyle('[class^="ytp-bezel"] { display:none !important }');

      const HUD = {
         create() {
            const div = document.createElement("div");
            div.id = SELECTOR_ID;
            // init common css
            YDOM.HTMLElement.addStyle({
               'background-color': 'rgba(0,0,0,0.3)',
               color: '#fff',
               opacity: 0,
               position: 'absolute',
               left: 0,
               right: 0,
               margin: '0 auto',
               'text-align': 'center',
               'z-index': '19',
            }, '#' + SELECTOR_ID);

            switch (user_settings.volume_indicator) {
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

               case 'text':
                  Object.assign(div.style, {
                     top: '0',
                     width: '100%',
                     'font-size': '1.5em',
                     'line-height': '2em',
                  });
            }
            document.getElementById('movie_player').appendChild(div);
            return div;
         },

         set(pt) {
            // console.debug('pt', pt);
            if (typeof fateVolumeHUD !== "undefined") clearTimeout(fateVolumeHUD);

            const hud = document.getElementById(SELECTOR_ID) || this.create();

            switch (user_settings.volume_indicator) {
               case 'bar-smooth':
                  hud.querySelector('span').style.width = Math.round(pt) + '%';
                  break;

               case 'bar-pt':
                  hud.style.background = `linear-gradient(to right, ${COLOR_HUD}d0 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`;
                  hud.textContent = Math.round(pt) + '%';
                  break;

               case 'text':
                  hud.textContent = Math.round(pt) + '%';
            }

            // hud.textContent = Math.round(pt) + '%';
            hud.style.transition = 'none';
            hud.style.opacity = 1;
            // hud.style.visibility = 'visibility';

            fateVolumeHUD = setTimeout(() => {
               hud.style.transition = 'opacity 200ms ease-in';
               hud.style.opacity = 0;
               // hud.style.visibility = 'hidden';
            }, 800); //200ms(hud.style.transition) + 800ms = 1s
         }
      };

   },
   opt_export: {
      'volume_indicator': {
         _tagName: 'select',
         label: 'Indicator type',
         options: [
            { label: 'text-top', value: 'text', selected: true },
            { label: 'bar+smooth', value: 'bar-smooth' },
            { label: 'bar+%', value: 'bar-pt' },
         ]
      },
      'volume_indicator_color': {
         _tagName: 'input',
         label: 'Color',
         type: 'color',
         value: '#ff0000', // red
         'data-dependent': '{"volume_indicator":["bar-smooth","bar-pt"]}',
      },
   },
});
