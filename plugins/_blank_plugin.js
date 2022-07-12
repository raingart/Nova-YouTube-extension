// To connect the plugin, you need to add the path to the file "js/plugins.js" to the array "list: []"

window.nova_plugins.push({
   id: 'time-jump', // unique identifier for the plugin. Used to store settings
   title: 'Plugin Name', // optional. Only displayed in the settings file

   // List of pages where the plugin can be launched
   // eg:
   // https://www.youtube.com/***/ <-- all pages
   // https://www.youtube.com/channel/UC**** <-- channel
   // https://www.youtube.com/watch?v=*** <-- watch

   // minus in front denotes an exception
   // exclude page from launch:
   // https://www.youtube.com/embed/*** <-- -embed
   run_on_pages: 'all, home, results, feed, channel, watch, -embed',

   // deactivate if use NOVA.HTMLElement.watch
   restart_on_transition: true, // optional. Restart plugin on every url change

   /* optional GIU in options page: start */
   section: 'player', // optional. Visual section in settings where the plugin belongs. Available list of values: header, player, details, comments, sidebar, other, channel
   opt_api_key_warn: true, // optional. Graphical indicator in the settings depending on the api key
   desc: 'Title description', // optional. Title description in settings. Don't use double quotes inside the text!

   // localization
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',

   // 'desc:zh': '',
   // 'desc:ja': '',
   // 'desc:ko': '',
   // 'desc:id': '',
   // 'desc:es': '',
   // 'desc:pt': '',
   // 'desc:fr': '',
   // 'desc:it': '',
   // 'desc:tr': '',
   // 'desc:de': '',
   // 'desc:pl': '',
   /* optional GIU in options page: end */


   _runtime: user_settings => {
      // user_settings - all extension settings. There is no division of settings into separate plugins

      // YT API manual fuctions for player
      // https://gist.github.com/Araxeus/fc574d0f31ba71d62215c0873a7b048e

      // we wait for the effect on the page of the nuked object
      // after finding at least one element, the search will be stopped
      NOVA.waitElement('#movie_player') // use css selector. Like document.body.querySelector
         // wait, run the code
         .then(node => { // returns the specified selector above
            // do stuff
         });

      // If you want the search to not be stopped, use this construction
      NOVA.watchElements({
         selectors: 'a#thumbnail img[src]', // use css selector (array, srting). Like document.body.querySelectorAll('a#thumbnail img[src])
         // The attribute with which the already found elements will be marked
         attr_mark: 'timestamps-updated', // delete if you want to constantly watch
         callback: element => { // returns the specified selector above
            // do stuff
         },
      });

      // A complete list of available functions can be found in the file "/plugins/common-lib.js"
      // And examples of their use in other plugins.
      // I'm too lazy to describe them. Perhaps no one will even read what is written here.

      // NOTE
      // window.ytInitialData === document.body.querySelector('ytd-app')?.data?.response

      // get YT experimental FLAGS
      // let cfg = window.ytcfg.get("EXPERIMENT_FLAGS");
      // cfg.kevlar_flexy_watch_new_dom = false;
      // window.ytcfg.set("EXPERIMENT_FLAGS", cfg);
      // movie_player.getVideoData()
      //    .video_id
      //    .isLive
      //    .title
      //     ...

      // movie_player != document.body.querySelector('ytd-player')?.player_

      // d(ocument.body.querySelector('ytd-player')?.player_
      //    .isFullscreen()
      //     ...
      // movie_player
      //    .isFullscreen()

      // mails are equal. Similar behavior
      // window.addEventListener('transitionend' == 'yt-page-data-updated')

   },

   // Form element template for display in settings
   options: {
      // Attention! Object name must be unique and must not overlap with other plugins
      'jump_step': { // Unique name for the storage.
         _tagName: 'input', // item tag name
         // Option Attribute List:
         // attr: 'param',
         label: 'Step',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         type: 'number',
         title: 'sec',
         // 'title:zh': '',
         // 'title:ja': '',
         // 'title:ko': '',
         // 'title:id': '',
         // 'title:es': '',
         // 'title:pt': '',
         // 'title:fr': '',
         // 'title:it': '',
         // 'title:tr': '',
         // 'title:de': '',
         // 'title:pl': '',
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
      'jump_smooth': {
         _tagName: 'input',
         label: 'Smooth',
         type: 'checkbox',
         title: 'Help info',
         'data-dependent': { 'jump_step': true },
      },
   }
});
