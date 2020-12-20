_plugins_conteiner.push({
   name: 'Volume indicator',
   id: 'volume-indicator',
   depends_on_pages: 'watch, embed',
   opt_section: 'player',
   // desc: '',
   _runtime: user_settings => {

      YDOM.HTMLElement.wait('.html5-video-player') // replace "#movie_player" for embed page
         .then(videoPlayer => {
            // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
            videoPlayer.querySelector('video')
               .addEventListener("volumechange", () => updateHUD(videoPlayer.getVolume()));
         });

      // hide default indicator
      [...document.querySelectorAll('[class^="ytp-bezel"]')] // also hide ytp-bezel-icon
         .forEach(bezel => bezel.style.display = 'none');

      function getHUD() {
         const SELECTOR_ID = 'volume-player-info';
         return document.getElementById(SELECTOR_ID) || (function () {
            const div = document.createElement("div");
            div.id = SELECTOR_ID;
            Object.assign(div.style, {
               'background-color': 'rgba(0,0,0,0.3)',
               color: '#fff',
               opacity: 0,
               position: 'absolute',
               left: 0,
               right: 0,
               margin: '0 auto',
               'text-align': 'center',
               'line-height': '1.5em',
               'z-index': '19',
            });
            document.getElementById('movie_player').appendChild(div);
            return div;
         })();
      }

      function updateHUD(pt) {
         if (typeof fateVolumeHUD !== "undefined") clearTimeout(fateVolumeHUD);

         const hud = getHUD();

         switch (user_settings.volume_indicator) {
            case 'bar-smooth':
               Object.assign(hud.style, {
                  bottom: '20%',
                  width: '30%',
               });

               const progressBar = hud.querySelector('span') || (function () {
                  const span = document.createElement("span");
                  Object.assign(span.style, {
                     'background-color': user_settings.volume_indicator_color,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                     float: 'left',
                  });
                  hud.appendChild(span);
                  return span;
               })();
               progressBar.style.width = pt + '%';
               // progressBar.textContent = Math.round(pt) + '%';
               progressBar.innerHTML = '&nbsp;';
               break;

            case 'bar-pt':
               const color = user_settings.volume_indicator_color;
               // hud.style.background = `linear-gradient(to right, ${color}d0 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`;
               Object.assign(hud.style, {
                  'background': `linear-gradient(to right, ${color}d0 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`,
                  bottom: '20%',
                  width: '30%',
                  'font-size': '1.2em',
               });
               hud.textContent = Math.round(pt) + '%';
               break;

            // case 'text':
            default:
               Object.assign(hud.style, {
                  top: '0',
                  width: '100%',
                  'font-size': '1.5em',
                  'line-height': '2em',
               });
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
