window.nova_plugins.push({
   id: 'page-logo',
   title: 'YouTube logo',
   run_on_pages: 'all',
   section: 'header',
   // desc: '',
   _runtime: user_settings => {

      YDOM.waitElement('#masthead a#logo')
         .then(a => a.href = new URL(user_settings.page_logo_url_mode)?.href);

   },
   options: {
      page_logo_url_mode: {
         _tagName: 'input',
         label: 'URL',
         type: 'url',
         pattern: "https://.*",
         // title: '',
         placeholder: 'https://youtube.com/...',
         value: 'https://youtube.com/feed/subscriptions',
      },
   },
});
