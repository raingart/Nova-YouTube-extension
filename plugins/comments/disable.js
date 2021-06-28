_plugins_conteiner.push({
   id: 'comments-disable',
   title: 'Disable comments',
   run_on_pages: 'watch',
   section: 'comments',
   desc: 'Remove comments section',
   _runtime: user_settings => {

      switch (user_settings.comments_visibility_mode) {
         case 'remove':
            YDOM.waitElement('#comments')
               .then(comments => comments.remove());
            break;

         // case 'hide':
         default:
            YDOM.waitElement('#comments yt-next-continuation')
               .then(continuation => {
                  if (!continuation.onShow) return console.warn('empty original fn.onShow', continuation.onShow);
                  const backup_onShow = continuation.onShow;
                  continuation.onShow = function () {
                     // console.debug('onShow', ...arguments);
                  };

                  // create button
                  const btn = document.createElement('a');
                  btn.textContent = 'Load Comments';
                  // btn.id = 'more';
                  btn.className = 'more-button style-scope ytd-video-secondary-info-renderer';
                  // btn.className = 'ytd-vertical-list-renderer';
                  Object.assign(btn.style, {
                     'cursor': 'pointer',
                     'text-align': 'center',
                     'text-transform': 'uppercase',
                     'display': 'block',
                     'color': 'var(--yt-spec-text-secondary)',
                  });
                  btn.addEventListener('click', ({ target }) => {
                     target.remove();
                     continuation.onShow = backup_onShow;
                     continuation.onShow(true);
                  });
                  // append button
                  if (comments = document.getElementById('contents')) {
                     comments.insertBefore(btn, comments.firstChild);
                  }

               });
      }

   },
   options: {
      comments_disable_mode: {
         _tagName: 'select',
         label: 'Mode',
         options: [
            { label: 'Hide', value: 'hide', selected: true },
            { label: 'Remove', value: 'remove' },
         ],
      },
   },
});
