// To connect the plugin, you need to add the path to the file "js/plugins.js" to the array "list: []"

_plugins_conteiner.push({
   name: 'Plugin Name', // optional. Only displayed in the settings file
   id: 'time-jump', // unique identifier for the plugin. Used to store settings

   // List of pages where the plugin can be launched
   // eg:
   // https://www.youtube.com/***/ <-- all pages
   // https://www.youtube.com/channel/UC**** <-- channel
   // https://www.youtube.com/watch?v=*** <-- watch

   // minus in front denotes an exception
   // exclude page from launch:
   // https://www.youtube.com/embed/*** <-- -embed
   depends_on_pages: 'all, watch, channel, -embed',

    // deactivate if use YDOM.HTMLElement.watch
   restart_on_transition: true, // optional. Restart plugin on every url change

   /* optional GIU in options page: start */
   opt_section: 'player', // optional. Visual section in settings where the plugin belongs
   opt_api_key_warn: true, // optional. Graphical indicator in the settings depending on the api key
   desc: 'Title description', // optional. Title description in settings. Don't use double quotes inside the text!
   /* optional GIU in options page: end */


   _runtime: (user_settings, current_page) => {
      // user_settings - all extension settings. There is no division of settings into separate plugins
      // current_page - optional. The current name page. One of the specified arguments "depends_on_pages"

      // we wait for the effect on the page of the nuked object
      // after finding at least one element, the search will be stopped
      YDOM.HTMLElement.wait('.html5-video-player') // use css selector. Like document.querySelector
         // wait, run the code
         .then(node => { // returns the specified selector above
            // do stuff
         });

      // If you want the search to not be stopped, use this construction
      YDOM.HTMLElement.watch({
         selector: 'a#thumbnail img[src]', // use css selector. Like document.querySelectorAll
         // The attribute with which the already found elements will be marked
         attr_mark: 'timestamps-updated', // delete if you want to constantly watch
         callback: element => { // returns the specified selector above
            // do stuff
         },
      });

      // A complete list of available functions can be found in the file "/plugins/ytc_lib.js"
      // And examples of their use in other plugins.
      // I'm too lazy to describe them. Perhaps no one will even read what is written here.
   },

   // Form element template for display in settings
   opt_export: {
      // Attention! Object name must be unique and must not overlap with other plugins
      'jump_step': { // Unique name for the storage.
         _tagName: 'input', // item tag name
         // Option Attribute List:
         label: 'Step',
         type: 'number',
         title: 'sec',
         placeholder: 'sec',
         step: 1,
         min: 1,
         max: 300,
         value: 30,
      },

      // example of generating an option of the "select" type
      'jump_hotkey': { // Unique name for the storage.
         _tagName: 'select', // item tag name
         // Option Attribute List:
         label: 'select',
         options: [
            { label: 'alt', value: 18 },
            { label: 'shift', value: 16 },
            { label: 'ctrl', value: 17, selected: true },
         ],
      },
   },
});
