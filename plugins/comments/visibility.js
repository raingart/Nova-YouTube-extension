window.nova_plugins.push({
   id: 'comments-visibility',
   title: 'Hide comments',
   run_on_pages: 'watch',
   restart_on_transition: true,
   section: 'comments',
   // desc: 'Remove comments section',
   _runtime: user_settings => {

      const SELECTOR_BTN_ID = 'comments-load-btn';

      switch (user_settings.comments_visibility_mode) {
         case 'remove':
            NOVA.waitElement('#comments')
               .then(comments => comments.remove());
            break;

         // case 'hide':
         default:
            if (document.getElementById(SELECTOR_BTN_ID)) return;

            // https://stackoverflow.com/a/68202306
            NOVA.waitElement('#comments')
               .then(comments => {
                  // stop load
                  comments.style.visibility = 'hidden';
                  // create button
                  const btn = document.createElement('a');
                  btn.textContent = 'Load Comments';
                  btn.id = SELECTOR_BTN_ID;
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
                     comments.style.visibility = 'visible';
                     window.dispatchEvent(new Event("scroll"));
                  });
                  // append button
                  comments.before(btn);
               });
      }

   },
   options: {
      comments_visibility_mode: {
         _tagName: 'select',
         label: 'Mode',
         options: [
            { label: 'Hide', value: 'hide', selected: true },
            { label: 'Remove', value: 'remove' },
         ],
      },
   },
});
