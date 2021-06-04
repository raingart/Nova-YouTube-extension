_plugins_conteiner.push({
   name: 'Mark watched',
   id: 'mark-watched',
   depends_on_pages: 'all',
   opt_section: 'other',
   desc: 'Need to Turn on [YouTube History]',
   _runtime: user_settings => {

      YDOM.css.push(
         `.watched #thumbnail,
         #thumbnail:visited {
            transition: all 200ms ease-in-out;
            opacity: .4 !important;
            mix-blend-mode: luminosity;
            filter: blur(2.2px);
         }
         .watched #thumbnail:hover,
         #thumbnail:visited:hover {
            transition: ease-out;
            opacity: 1 !important;
            mix-blend-mode: normal;
            filter: blur(0px);
         }`);

   },
});
