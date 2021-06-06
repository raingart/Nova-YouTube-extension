console.debug("init optionsView.js");

// plugins conteiner
let _plugins_conteiner = [];
Plugins.load();

const Opt = {
   // DEBUG: true,

   pluginValidCheck(plugin) {
      const isValid = plugin?.id // required
         && plugin.depends_on_pages?.split(',').length
         && plugin._runtime && typeof plugin._runtime === 'function'
         // optional
         && (!plugin.opt_section || plugin.opt_section?.split(' ').length === 1)
         && (!plugin.restart_on_transition || 'boolean' === typeof plugin.restart_on_transition)
         && (!plugin.opt_api_key_warn || 'boolean' === typeof plugin.opt_api_key_warn)
         && (!plugin.opt_export || 'object' === typeof plugin.opt_export)
         && (!plugin.desc || 'string' === typeof plugin.desc);

      if (!isValid) {
         console.error('plugin invalid:\n', {
            id: plugin.id,
            depends_on_pages: plugin.depends_on_pages?.split(',').length,
            opt_section: plugin.opt_section?.split(' ').length === 1 || undefined,
            restart_on_transition: 'boolean' === typeof plugin.restart_on_transition || undefined,
            opt_api_key_warn: 'boolean' === typeof plugin.opt_api_key_warn || undefined,
            desc: 'string' === typeof plugin.desc || undefined,
            opt_export: 'object' === typeof plugin.opt_export || undefined,
            _runtime: 'function' === typeof plugin._runtime,
         });
      }
      return isValid;
   },

   generate: {

      list() {
         Opt.log('list _plugins_conteiner:', _plugins_conteiner);

         _plugins_conteiner.forEach(plugin => {
            try {
               if (!Opt.pluginValidCheck(plugin)) throw new Error('pluginInvalid!');

               Opt.log('plugin load:', plugin.id);

               let li = document.createElement("li");
               li.className = "item";

               li.innerHTML = '<div class="info"' +
                  (plugin.desc ? ' tooltip="' + plugin.desc + '" flow="up"' : '') + '>' +
                  `<label for="${plugin.id}">${plugin.name}</label>` +
                  `<a href="https://github.com/raingart/Nova-YouTube-extension/wiki/plugin-specifications#${plugin.id}" target=”_blank” title="More info">?</a>` +
                  (plugin.opt_api_key_warn ?
                     ' <b tooltip="use your [API key] for stable work" flow="left"><span style="font-size: initial;">⚠️</span></b> ' : '') +
                  // ' <b tooltip="use your [API key] for stable work" flow="left"><span style="font-size: initial;">&#128273;</span></b> ' : '') +
                  `</div><div class="opt"><input type="checkbox" name="${plugin.id}" id="${plugin.id}" /></div>`;

               if (plugin.opt_export) {
                  li.appendChild(
                     document.createElement("li")
                        .appendChild(this.options(plugin.opt_export, plugin.id))
                  );
               }

               const pl_selector = '>#' + plugin?.opt_section?.toString().toLowerCase();
               let p = Opt.UI.parentSelector;

               p += plugin.opt_section && document.querySelector(p + pl_selector) ? pl_selector : '>#other';

               document.querySelector(p).appendChild(li);

            } catch (error) {
               console.error('Error plugin generate:\n', error.stack + '\n', plugin);
               alert('Error plugin generate\n' + plugin?.id);
            }
         });
      },

      options(obj, id) {
         let exportHTML = document.createElement('ul');
         exportHTML.setAttribute('data-dependent', `{"${id}":[true]}`);

         for (const key in obj) {
            Opt.log('obj[name]', obj[key]);
            let property = obj[key];

            if (!property._tagName) {
               console.error('_tagName is missing in', property);
               continue;
            }

            let exportContainer = document.createElement('li');
            let exportProperty = document.createElement(property._tagName);

            property.name = key;
            property.id = key;
            delete property._tagName;

            if (property['data-dependent']) {
               // exportContainer.setAttribute('data-dependent', '{\"'+ id +'\":[true]}');
               exportContainer.setAttribute("data-dependent", property['data-dependent']);
               delete property['data-dependent'];
            }

            if (property.title) {
               exportContainer.setAttribute("tooltip", property.title);
               delete property.title;
            }

            Object.entries(property)
               .filter(([attr, value]) => {
                  Opt.log('property [%s=%s]', attr, JSON.stringify(value));
                  switch (attr) {
                     case 'options':
                        value.forEach(option => {
                           let tagOption = document.createElement('option');
                           tagOption.setAttribute('value', option.value);
                           tagOption.textContent = option.label;
                           if (option.hasOwnProperty('selected')) tagOption.setAttribute('selected', true);
                           exportProperty.appendChild(tagOption);
                        });
                        break;

                     case 'label':
                        let label = document.createElement(attr);
                        label.innerHTML = '<font>↪</font>' + value;
                        label.htmlFor = property.name;
                        exportContainer.appendChild(label);
                        // exportContainer.insertAdjacentHTML("beforeend", '<label>' + value + '</label>');
                        break;

                     case 'type':
                        if (value == 'number') exportProperty.setAttribute('required', true);
                     // break; <-- need remove!

                     default:
                        exportProperty.setAttribute(attr, value);
                  };
               });

            exportHTML
               .appendChild(exportContainer)
               .appendChild(exportProperty);
         }
         return exportHTML;
      },

   },

   UI: {
      parentSelector: '#plugins',

      toggleListView({ selector_hide, selector_show, active_class = required() }) {
         // console.debug('toggleListView:', ...arguments);
         // hide all
         if (selector_hide) document.querySelectorAll(selector_hide).forEach(i => i.classList.remove(active_class));
         // target show
         if (selector_show) document.querySelectorAll(selector_show).forEach(i => i.classList.add(active_class));
      },

      // outerHTML: node => node.outerHTML || new XMLSerializer().serializeToString(node),
   },

   eventListener() {
      const transferStorageMethod = 'sync';

      // appearance map
      document.querySelectorAll(".appearance > *")
         .forEach(el => {
            // group is empty
            if (document.querySelector(this.UI.parentSelector + `>#${el.id}:empty`)) {
               el.classList.add('empty');

            } else {
               // add click event
               el.addEventListener('click', event => {
                  // event.preventDefault();
                  this.UI.toggleListView({
                     'selector_hide': `${this.UI.parentSelector} > *`,
                     'selector_show': `${this.UI.parentSelector} > #${el.id}`, //event.target.id <- error
                     'active_class': 'active'
                  });
                  this.UI.toggleListView({
                     'selector_hide': `${this.UI.parentSelector} > *`,
                     'active_class': 'collapse'
                  });
                  this.UI.toggleListView({
                     'selector_hide': `${this.UI.parentSelector} li.item`,
                     'active_class': 'hide'
                  });
                  document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
               });
            }
         });

      // link show_all_plugins
      document.getElementById("show_all_plugins")
         .addEventListener('click', event => {
            event.preventDefault();
            this.UI.toggleListView({
               'selector_hide': `${this.UI.parentSelector} > *`,
               'selector_show': `${this.UI.parentSelector} > *`,
               'active_class': 'active'
            });
            // unset collapse state
            this.UI.toggleListView({
               'selector_hide': `${this.UI.parentSelector} > *`,
               'active_class': 'collapse'
            });
            this.UI.toggleListView({
               'selector_hide': `${this.UI.parentSelector} li.item`,
               'active_class': 'hide'
            });
            document.querySelector('.tabbed>input[type="radio"]:nth-child(3)').checked = true;
         });

      // group spoiler
      if (document.body.clientWidth < 350) { // in popup
         document.querySelectorAll(this.UI.parentSelector + '> ul')
            .forEach(ul => ul.addEventListener('click', event => {
               // event.preventDefault();
               event.target.classList.toggle("collapse")
               event.target.querySelectorAll("li.item").forEach(li => li.classList.toggle("hide"));
            }));
      }

      // export setting
      document.getElementById('settings_export')
         .addEventListener('click', () => {
            Storage.getParams(user_settings => {
               let d = document.createElement('a');
               d.style.display = 'none';
               d.setAttribute('download', 'nova-settings.json');
               d.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings)));
               document.body.appendChild(d);
               d.click();
               console.debug('Settings file exported:', d.download);
               document.body.removeChild(d);
            }, transferStorageMethod);
         });

      // import setting
      document.getElementById('settings_import')
         .addEventListener('click', () => {
            let f = document.createElement('input');
            f.type = 'file';
            f.accept = 'application/JSON';
            f.style.display = 'none';
            f.addEventListener('change', () => {
               if (f.files.length !== 1) return;
               let rdr = new FileReader();
               rdr.addEventListener('load', () => {
                  try {
                     Storage.setParams(JSON.parse(rdr.result), transferStorageMethod);
                     alert('Settings imported successfully');
                     document.location.reload();
                  }
                  catch (ex) { alert('Error parsing settings\n' + ex); }
               });
               rdr.addEventListener('error', () => alert('Error loading file\n' + rdr.error));
               rdr.readAsText(f.files[0]);
            });
            document.body.appendChild(f);
            f.click();
            document.body.removeChild(f);
         });
   },

   init() {
      this.generate.list();
      this.eventListener();
   },

   log(...args) {
      if (this.DEBUG && args?.length) {
         console.groupCollapsed(...args);
         console.trace();
         console.groupEnd();
      }
   }
}


window.addEventListener('load', event => {
   // search bar
   ["change", "keyup"]
      .forEach(event => {
         document.querySelector('[type="search"]')
            .addEventListener(event, function () {
               const generatelist = document.querySelector(Opt.UI.parentSelector);
               searchFilter({
                  'keyword': this.value,
                  // 'container': generatelist.children,
                  // 'container':  generatelist.getElementsByTagName('li'),
                  'container': generatelist.querySelectorAll('li.item'),
                  'filterChildTagName': 'label'
               });
            });
      });

   Opt.init();

   Storage.getParams(store => {
      if (!store || !store['custom-api-key']) return;
      document.querySelectorAll('.info b').forEach(el => el.parentNode.removeChild(el));
   }, 'sync');
});


function searchFilter({ keyword, container, filterChildTagName }) {
   // console.debug('searchFilter:', ...arguments);
   for (const item of container) {
      let text = item.textContent;
      let found = text.toLowerCase().includes(keyword.toLowerCase());
      let highlight = el => {
         el.innerHTML = el.innerHTML.replace(/<\/?mark[^>]*>/g, ''); // clear highlight tags
         if (found && keyword.toString().trim()) highlightSearchTerm(el, keyword);
      };

      // vision
      item.style.display = found ? '' : 'none';

      if (filterChildTagName) { // fix reset input status
         item.querySelectorAll(filterChildTagName).forEach(highlight);
      }
   }

   function highlightSearchTerm(target, keyword = required(), highlightClass) {
      // fix
      let content = target.innerHTML,
         pattern = new RegExp('(>[^<.]*)?(' + keyword + ')([^<.]*)?', 'gi'),
         replaceWith = '$1<mark ' + (highlightClass ? 'class="' + highlightClass + '"' : 'style="background-color:#afafaf"') + '>$2</mark>$3',
         marked = content.replace(pattern, replaceWith);

      return (target.innerHTML = marked) !== content;
   }
}
