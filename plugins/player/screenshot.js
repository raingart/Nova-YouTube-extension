// https://www.youtube.com/watch?v=Km7dcyixGRM - normal
// https://www.youtube.com/watch?v=K2tVueJM8OQ - narrow
// https://www.youtube.com/watch?v=U9mUwZ47z3E - ultra-wide

_plugins_conteiner.push({
   id: 'video-screenshot',
   title: 'Take video screenshot',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      const
         // bar
         SELECTOR_BAR_ID = 'screenshot-result',
         SELECTOR_BAR = '#' + SELECTOR_BAR_ID, // for css
         // btn
         SELECTOR_BTN_ID = 'btn-screenshot',
         SELECTOR_BTN = '#' + SELECTOR_BTN_ID; // for css

      YDOM.waitElement('video')
         .then(video => {
            YDOM.css.push(
               SELECTOR_BAR + `{
                  --width: 400px;
                  --height: 400px;

                  position: fixed;
                  top: 0;
                  right: 0;
                  overflow: hidden;
                  margin: 30px;
                  box-shadow: 0 0 15px #000;
                  max-width: var(--width);
                  max-height: var(--height);
                  z-index: 300;
               }
               ${SELECTOR_BAR} canvas {
                  max-width: var(--width);
                  max-height: var(--height);
                  /* object-fit: contain; */
               }
               ${SELECTOR_BAR} a {
                  bottom: 0;
                  right: 0;
                  background: rgba(0, 0, 0, .5);
                  color: #FFF;
                  cursor: pointer;
                  font-size: 12px;
                  padding: 5px;
                  position: absolute;
               }
               ${SELECTOR_BAR} a:hover{ background: rgba(0, 0, 0, .8); }
               ${SELECTOR_BTN} { padding: 0 7px; }
               ${SELECTOR_BTN} svg { fill: white; }
               ${SELECTOR_BTN} svg:hover { fill: red; }`);

            addBtn();
         });

      function createScreenshot() {
         const
            video = document.querySelector('video'),
            container = document.getElementById(SELECTOR_BAR_ID) || document.createElement('a'),
            canvas = container.querySelector('canvas') || document.createElement('canvas'),
            context = canvas.getContext('2d'),
            aspectRatio = video.videoWidth / video.videoHeight,
            width = video.videoWidth,
            height = parseInt(width / aspectRatio, 10);

         canvas.width = width;
         canvas.height = height;
         context.drawImage(video, 0, 0, width, height);
         // container.href = canvas.toDataURL('image/png'); // does not work
         canvas.toBlob(blob => container.href = URL.createObjectURL(blob));
         // create
         if (!container.id) {
            container.id = SELECTOR_BAR_ID;
            container.target = '_blank'; // useful link
            container.title = 'Click to save';
            canvas.addEventListener('click', evt => {
               evt.preventDefault();
               // document.location.href = target.toDataURL('image/png').replace('image/png', 'image/octet-stream');
               downloadCanvasAsImage(evt.target);
               evt.target.parentNode.remove();
            });
            container.appendChild(canvas);
            const close = document.createElement('a');
            // close.id =
            // close.className =
            close.textContent = 'CLOSE';
            close.addEventListener('click', evt => {
               evt.preventDefault();
               evt.target.parentNode.remove();
            });
            container.appendChild(close);
            document.body.appendChild(container);
         }
      }

      function downloadCanvasAsImage(canvas) {
         const downloadLink = document.createElement('a');
         downloadLink.setAttribute('download', (+new Date()) + '.png');
         const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
         downloadLink.href = image;
         downloadLink.click();
      }

      function addBtn() {
         // YDOM.waitElement('.ytp-settings-button').then(el => {});
         document.querySelector('.ytp-settings-button')
            ?.insertAdjacentHTML('beforebegin',
               `<button id="${SELECTOR_BTN_ID}" class="ytp-screenshot-button ytp-button" title="Take screenshot">
                  <svg viewBox="0 0 512 512" height="100%" width="100%" version="1.1">
                     <g>
                        <circle cx="255.811" cy="285.309" r="75.217"/>
                        <path d="M477,137H352.718L349,108c0-16.568-13.432-30-30-30H191c-16.568,0-30,13.432-30,30l-3.718,29H34
                           c-11.046,0-20,8.454-20,19.5v258c0,11.046,8.954,20.5,20,20.5h443c11.046,0,20-9.454,20-20.5v-258C497,145.454,488.046,137,477,137
                           z M255.595,408.562c-67.928,0-122.994-55.066-122.994-122.993c0-67.928,55.066-122.994,122.994-122.994
                           c67.928,0,122.994,55.066,122.994,122.994C378.589,353.495,323.523,408.562,255.595,408.562z M474,190H369v-31h105V190z"/>
                     </g>
                  </svg>
               </button>`)
         document.getElementById(SELECTOR_BTN_ID)
            ?.addEventListener('click', createScreenshot);
      }

   },
});
