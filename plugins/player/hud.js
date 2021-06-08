_plugins_conteiner.push({
   id: 'player-indicator',
   title: 'Player indicator',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'Replace default indicator',
   _runtime: user_settings => {

      if (!user_settings.player_indicator_type) {
         // hide default indicator
         return YDOM.css.push('.ytp-bezel-text-wrapper { display:none !important }');
      }

      const
         SELECTOR_ID = 'player-indicator-info',
         COLOR_HUD = user_settings.player_indicator_color || '#ddd';

      YDOM.waitElement('video')
         .then(player => {
            // show indicator
            // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events

            // volume
            player.addEventListener('volumechange', function () {
               // console.debug('volumechange', player.getVolume(), this.volume);
               const videoPlayer = document.querySelector('.html5-video-player');
               HUD.set(Math.round(videoPlayer.getVolume()), '%');
            });
            // rate
            player.addEventListener('ratechange', function () {
               // console.debug('ratechange', player.getPlaybackRate(), this.playbackRate);
               HUD.set(this.playbackRate, 'x');
            });
         });

      const HUD = {
         get() {
            return this.conteiner || this.create();
         },
         // TODO The idea of ​​copying the progress bar. To display segments of time markers
         // a = el.cloneNode(true)
         // document.getElementById(SELECTOR_ID).innerHTML = a.innerHTML

         create() {
            // hide default indicator
            YDOM.css.push('.ytp-bezel-text-wrapper { display:none !important }');
            // init common css
            YDOM.css.push(`
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

            this.conteiner = document.getElementById(SELECTOR_ID);
            this.el = this.conteiner.querySelector('span'); // export el

            // add to div user_settings.player_indicator_type style
            // const [indicator_type, span_align] = user_settings.player_indicator_type.split('=', 2); // 2 = max param;
            // switch (indicator_type) {
            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  Object.assign(this.conteiner.style, {
                     bottom: '20%',
                     width: '30%',
                     'font-size': '1.2em',
                  });
                  Object.assign(this.el.style, {
                     'background-color': COLOR_HUD,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                  });
                  // if (span_align === 'left') {
                  //    Object.assign(this.el.style, {
                  //       float: 'left',
                  //    });
                  // }
                  break;

               // case 'text-top':
               default:
                  Object.assign(this.conteiner.style, {
                     top: '0',
                     width: '100%',
                     padding: '.2em',
                     'font-size': '1.55em',
                  });
            }
            return this.conteiner;
         },

         set(pt = 0, rate_suffix = '') {
            // console.debug('HUD set', ...arguments);
            if (typeof fateHUD === 'number') clearTimeout(fateHUD);

            const hud = this.get();
            const text = pt + rate_suffix;

            if (rate_suffix === 'x') { // rate to pt
               const maxPercent = (+user_settings.rate_step % 0.25) === 0 ? 2 : 3;
               pt = (+pt / maxPercent) * 100;
            }
            pt = Math.round(pt);

            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  this.el.style.width = pt + '%';
                  this.el.textContent = text;
                  break;

               // case 'bar-center-left':
               //    hud.style.background = `linear-gradient(to right, ${COLOR_HUD}d0 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`;
               //    this.el.style.width = pt + '%';
               //    this.el.textContent = text;
               //    break;

               default:
                  this.el.textContent = text;
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
   options: {
      player_indicator_type: {
         _tagName: 'select',
         label: 'Indicator type',
         options: [
            { label: 'text-top', value: 'text-top', selected: true },
            { label: 'bar+center', value: 'bar-center' },
            // { label: 'bar+center+left', value: 'bar-center=left' },
            { label: 'hide default', value: false },
         ],
      },
      player_indicator_color: {
         _tagName: 'input',
         label: 'Color',
         type: 'color',
         value: '#ff0000', // red
         'data-dependent': '{"player_indicator_type":["bar-center"]}',
      },
   },
});
