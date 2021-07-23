window.nova_plugins.push({
   id: 'thumbnails-watched',
   title: 'Mark watched',
   run_on_pages: 'all',
   section: 'other',
   desc: 'For thumbnails',
   // desc: 'Need to Turn on [YouTube History]',
   _runtime: user_settings => {

      // Only the outline/border works. Other selection methods do not work!

      YDOM.css.push(
         `a#thumbnail {
            outline: 1px solid var(--yt-spec-general-background-a);
         }

         a#thumbnail:visited {
            outline: 1px solid ${user_settings.thumbnails_watched_frame_color || 'red'} !important;
         }`)

      // YDOM.css.push(
      //    `a.ytp-videowall-still.ytp-suggestion-set:visited, #thumbnail:visited {
      //       transition: all 200ms ease-in-out;
      //       opacity: .4 !important;
      //       mix-blend-mode: luminosity;
      //       filter: blur(2.2px);
      //    }

      //    .watched #thumbnail:hover, #thumbnail:visited:hover {
      //       transition: ease-out;
      //       opacity: 1 !important;
      //       mix-blend-mode: normal;
      //       filter: blur(0px);
      //    }`);

   },
   options: {
      thumbnails_watched_frame_color: {
         _tagName: 'input',
         label: 'Frame color',
         type: 'color',
         value: '#FF0000',
      },
   },
});
