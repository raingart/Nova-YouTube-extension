window.nova_plugins.push({
   id: 'player-indicator',
   title: 'Replace default indicator',
   run_on_pages: 'watch, embed',
   section: 'player',
   desc: 'bezel',
   _runtime: user_settings => {

      const
         SELECTOR_ID = 'player-indicator-info',
         COLOR_HUD = user_settings.player_indicator_color || '#ff0000';

      YDOM.waitElement('video')
         .then(video => {
            const player = document.getElementById('movie_player');
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
            // volume
            video.addEventListener('volumechange', function () {
               // console.debug('volumechange', player.getVolume(), this.volume); // there is a difference
               HUD.set(Math.round(player.getVolume()), '%');
            });
            // rate
            video.addEventListener('ratechange', function () {
               // console.debug('ratechange', this.playbackRate);
               HUD.set(this.playbackRate, 'x');
            });
         });

      // Listener default indicator
      YDOM.waitElement('.ytp-bezel-text')
         .then(target => {
            new MutationObserver(mutations => {
               for (const mutation of mutations) {
                  // console.log('bezel mutation detected', mutation.type, target.textContent);
                  if (target.textContent) HUD.set(target.textContent);
               }
            })
               .observe(target, { childList: true }); // watch for textContent
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
            YDOM.css.push(
               `#${SELECTOR_ID} {
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
            // template
            document.getElementById('movie_player')
               .insertAdjacentHTML('beforeend', `<div id="${SELECTOR_ID}"><span></span></div>`);

            this.conteiner = document.getElementById(SELECTOR_ID);
            this.hudSpan = this.conteiner.querySelector('span'); // export el

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
                  Object.assign(this.hudSpan.style, {
                     'background-color': COLOR_HUD,
                     transition: 'width 100ms ease-out 0s',
                     display: 'inline-block',
                  });
                  // if (span_align == 'left') {
                  //    Object.assign(this.hudSpan.style, {
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

         set(pt = 100, rate_suffix = '') {
            // console.debug('HUD set', ...arguments);
            if (typeof fateNovaHUD === 'number') clearTimeout(fateNovaHUD);

            let hudConteiner = this.get();
            const text = pt + rate_suffix;

            if (rate_suffix == 'x') { // rate to pt
               const maxPercent = (+user_settings.rate_step % .25) === 0 ? 2 : 3;
               pt = (+pt / maxPercent) * 100;
            }
            pt = Math.round(pt);

            switch (user_settings.player_indicator_type) {
               case 'bar-center':
                  this.hudSpan.style.width = pt + '%';
                  this.hudSpan.textContent = text;
                  break;

               // case 'bar-left':
               //    hudConteiner.style.background = `linear-gradient(to right, ${COLOR_HUD}50 ${pt}%, rgba(0,0,0,0.3) ${pt}%)`;
               //    this.hudSpan.style.width = pt + '%';
               //    this.hudSpan.textContent = text;
               //    break;

               // case 'text-top':
               default:
                  this.hudSpan.textContent = text;
            }

            hudConteiner.style.transition = 'none';
            hudConteiner.style.opacity = 1;
            // hudConteiner.style.visibility = 'visible';

            fateNovaHUD = setTimeout(() => {
               hudConteiner.style.transition = 'opacity 200ms ease-in';
               hudConteiner.style.opacity = null;
               // hudConteiner.style.visibility = 'hidden';
            }, 800); //total 1s = 800ms + 200ms(hudConteiner.style.transition)
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
            // { label: 'bar+center', value: 'bar-left' },
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
