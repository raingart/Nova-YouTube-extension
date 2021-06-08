_plugins_conteiner.push({
   id: 'square-avatars',
   title: 'Square avatars',
   run_on_pages: 'watch, channel',
   section: 'comments',
   desc: 'Make user images squared',
   _runtime: user_settings => {

      YDOM.css.push(`
         #thumbnail.ytd-profile-column-user-info-renderer,
         yt-img-shadow.ytd-topbar-menu-button-renderer,
         #avatar.ytd-active-account-header-renderer,
         #avatar.ytd-video-owner-renderer,
         #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer,
         #author-thumbnail.ytd-comment-simplebox-renderer,
         #avatar.ytd-c4-tabbed-header-renderer,
         yt-img-shadow.ytd-channel-avatar-editor,
         yt-img-shadow.ytd-guide-entry-renderer,
         #author-thumbnail.ytd-commentbox,
         ytd-commentbox[is-reply][is-backstage-comment] #author-thumbnail.ytd-commentbox {
            border-radius: 0 !important;
         }`);

   },
});
