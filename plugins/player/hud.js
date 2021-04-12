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

      YDOM.HTMLElement.wait('video')
         .then(player => {
            // show indicator
            // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events

            // volume
            player.addEventListener('volumechange', function () {
               // console.debug('volumechange', player.getVolume(), this.volume);
               const videoPlayer = document.querySelector('.html5-video-player');
               HUD.set(videoPlayer.getVolume(), '%');
            });
            // rate
            player.addEventListener('ratechange', function () {
               // console.debug('ratechange', player.getPlaybackRate(), this.playbackRate);
               HUD.set(this.playbackRate, 'x');
            });
         });

      const HUD = {
         get() {
            return this.div || this.create();
         },

         create() {
            // hide default indicator
            YDOM.css.add('.ytp-bezel-text-wrapper { display:none !important }');
            // init common css
            YDOM.css.add(`
                  #${SELECTOR_ID} {
                     --color: #fff;
                     --bg-color: rgba(0,0,0,0.3);
                     --zindex: ${YDOM.css.getValue({ selector: '.ytp-chrome-top', property: 'z-index' }) || 60};

                     position: absolute;
                     left: 0;
                     right: 0;
                     z-index: calc(var(--zindex) + 1);
                     margin: 0 auto;
                     text-align: center;
                     opacity: 0;
                     background-color: var(--bg-color);
                     color: var(--color);
                  }`);

            document.getElementById('movie_player')
               .insertAdjacentHTML("beforeend", `<div id="${SELECTOR_ID}"><span></span></div>`);
            this.div = document.getElementById(SELECTOR_ID);
            this.span = this.div.querySelector('span');

            // add to div user_settings.player_indicator_type style
            // const [indicator_type, span_align] = user_settings.player_indicator_type.split('=', 2); // 2 = max param;
            // switch (indicator_type) {
            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  Object.assign(this.div.style, {
                     bottom: '20%',
                     width: '30%',
                     'font-size': '1.2em',
                  });
                  Object.assign(this.span.style, {
                     'background-color': COLOR_HUD,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                  });
                  // if (span_align === 'left') {
                  //    Object.assign(this.span.style, {
                  //       float: 'left',
                  //    });
                  // }
                  break;

               // case 'text-top':
               default:
                  Object.assign(this.div.style, {
                     top: '0',
                     width: '100%',
                     padding: '.2em',
                     'font-size': '1.55em',
                  });
            }
            return this.div;
         },

         set(pt = 0, rate_suffix = '') {
            // console.debug('HUD set', ...arguments);
            if (typeof fateHUD === 'number') clearTimeout(fateHUD);

            const hud = this.get();
            const text = pt + rate_suffix;

            if (rate_suffix === 'x') { // rate to pt
               const maxPercent = (+user_settings.player_rate_step % 0.25) === 0 ? 2 : 3;
               pt = (+pt / maxPercent) * 100;
            }
            pt = Math.round(pt);

            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  this.span.style.width = pt + '%';
                  this.span.textContent = text;
                  break;

               // case 'bar-center-left':
               //    hud.style.background = `linear-gradient(to right, ${COLOR_HUD}d0 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`;
               //    this.span.style.width = pt + '%';
               //    this.span.textContent = text;
               //    break;

               default:
                  this.span.textContent = text;
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
            { label: 'text-top', value: 'text-top', selected: true },
            { label: 'bar+center', value: 'bar-center' },
            // { label: 'bar+center+left', value: 'bar-center=left' },
         ],
      },
      'player_indicator_color': {
         _tagName: 'input',
         label: 'Color',
         type: 'color',
         value: '#ff0000', // red
         'data-dependent': '{"player_indicator_type":["bar-center"]}',
      },
   },
});
