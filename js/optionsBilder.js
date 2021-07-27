console.debug("init optionsView.js");

window.nova_plugins = [];
Plugins.load();

const Opt = {
   // DEBUG: true,

   storageMethod: 'sync',

   UI: {
      pluginsContainer: '#plugins',

      // outerHTML: node => node.outerHTML || new XMLSerializer().serializeToString(node),
   },

   pluginChecker(plugin) {
      const isValid = plugin?.id // required
         && plugin.run_on_pages?.split(',').length
         && plugin._runtime && typeof plugin._runtime === 'function'
         // optional
         && (!plugin.section || plugin.section?.split(' ').length === 1)
         && (!plugin.restart_on_transition || 'boolean' === typeof plugin.restart_on_transition)
         && (!plugin.opt_api_key_warn || 'boolean' === typeof plugin.opt_api_key_warn)
         && (!plugin.options || 'object' === typeof plugin.options)
         && (!plugin.desc || 'string' === typeof plugin.desc);

      if (!isValid) {
         console.error('plugin invalid:\n', {
            id: plugin.id,
            run_on_pages: plugin.run_on_pages?.split(',').length,
            section: plugin.section?.split(' ').length === 1 || undefined,
            restart_on_transition: 'boolean' === typeof plugin.restart_on_transition || undefined,
            opt_api_key_warn: 'boolean' === typeof plugin.opt_api_key_warn || undefined,
            desc: 'string' === typeof plugin.desc || undefined,
            options: 'object' === typeof plugin.options || undefined,
            _runtime: 'function' === typeof plugin._runtime,
         });
      }
      return isValid;
   },

   generate: {

      list(plugins_list) {
         this.log('list nova_plugins:', plugins_list);

         plugins_list.forEach(plugin => {
            try {
               if (!this.pluginChecker(plugin)) throw new Error('pluginInvalid!');
               this.log('plugin load:', plugin.id);

               const li = document.createElement('li');
               li.className = 'item';
               li.innerHTML =
                  `<div class="info" ${plugin.desc ? ` tooltip="${plugin.desc}" flow="up"` : ''}>
                     <label for="${plugin.id}">${plugin.title}</label>
                     <a href="https://github.com/raingart/Nova-YouTube-extension/wiki/plugins#${plugin.id}" target=”_blank” title="${i18n('opt_title_help_link')}">?</a>
                     ${plugin.opt_api_key_warn ? `<b tooltip="${i18n('opt_api_key_warn')}" flow="left"><span style="font-size: initial;">⚠️</span></b>` : ''}
                  </div>
                  <div class="opt">
                     <input type="checkbox" name="${plugin.id}" id="${plugin.id}" />
                  </div>`;
               // ⚠️

               if (plugin.options) {
                  li.appendChild(
                     document.createElement('li')
                        .appendChild(this.generate.options.apply(this, [plugin.options, plugin.id]))
                  );
               }

               let p = this.UI.pluginsContainer;
               if (targetSection = '>#' + plugin?.section?.toString().toLowerCase()) {
                  p += (plugin.section && document.querySelector(p + targetSection)) ? targetSection : '>#other';
               }

               document.querySelector(p)
                  .appendChild(li); // append to section tab

            } catch (error) {
               console.error('Error plugin generate:\n', error.stack + '\n', plugin);
               alert('Error plugin generate\n' + plugin?.id);
            }
         });
      },

      options(obj, id) {
         const exportHTML = document.createElement('ul');
         exportHTML.setAttribute('data-dependent', `{"${id}":[true]}`);

         for (const key in obj) {
            const property = obj[key];
            this.log('property', property);

            if (!property._tagName) {
               console.error('_tagName is missing in', property);
               continue;
            }

            const exportContainer = document.createElement('li');
            const exportProperty = document.createElement(property._tagName);

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
               .forEach(([attr, value]) => {
                  this.log('property [%s=%s]', attr, JSON.stringify(value));
                  switch (attr) {
                     case 'options':
                        value.forEach(option => {
                           const tagOption = document.createElement('option');
                           switch (typeof option) {
                              case 'object':
                                 tagOption.setAttribute('value', option.value);
                                 tagOption.textContent = option.label;
                                 if (option.hasOwnProperty('selected')) tagOption.setAttribute('selected', true);
                                 break;

                              case 'string':
                                 tagOption.setAttribute('value', option);
                                 tagOption.textContent = option.toLocaleUpperCase();
                                 break;
                           }
                           exportProperty.appendChild(tagOption);
                        });
                        break;

                     case 'label':
                        const label = document.createElement(attr);
                        label.innerHTML = '<font>↪</font>' + value;
                        label.htmlFor = property.name;
                        exportContainer.appendChild(label);
                        // exportContainer.insertAdjacentHTML("beforeend", '<label>' + value + '</label>');
                        break;

                     case 'type':
                        if (value === 'number') exportProperty.setAttribute('required', true);
                     // break; <-- need remove!

                     default:
                        exportProperty.setAttribute(attr, value); // value:string. For safe
                        // exportProperty[attr] = value; // apply value:function. Like - onchange: function () {
                  };
               });

            exportHTML
               .appendChild(exportContainer)
               .appendChild(exportProperty);
         }
         return exportHTML;
      },

   },

   // tab selector
   openTab(tabId, reset_page) {
      // console.debug('openTab', ...arguments);
      if (reset_page) {
         document.location = location.pathname + '?tabs=' + tabId;
      } else {
         document.getElementById(tabId).checked = true;
      }
   },

   eventListener() {
      // appearance map
      document.querySelectorAll(".appearance > *")
         .forEach(mapZone => {
            // group is empty
            if (document.querySelector(this.UI.pluginsContainer + `>#${mapZone.id}:empty`)) {
               mapZone.classList.add('empty');

            } else {
               // add click event
               mapZone.addEventListener('click', ({ target }) => {
                  // show target , hide other section
                  switchClass({
                     'remove_to_selector': `${this.UI.pluginsContainer} > *`,
                     'add_to_selector': `${this.UI.pluginsContainer} > #${mapZone.id}`,
                     'class_name': 'active',
                  });
                  // unset collapse state in all section title
                  switchClass({
                     'remove_to_selector': `${this.UI.pluginsContainer} > *`,
                     'class_name': 'collapse',
                  });
                  // expand collapsed section
                  switchClass({
                     'remove_to_selector': `${this.UI.pluginsContainer} li.item`,
                     'class_name': 'hide',
                  });
                  this.openTab('tab-plugins');
               });
            }
         });

      // link show_all_plugins
      document.getElementById("show_all_plugins")
         .addEventListener('click', () => {
            // show all section
            switchClass({
               'remove_to_selector': `${this.UI.pluginsContainer} > *`,
               'add_to_selector': `${this.UI.pluginsContainer} > *`,
               'class_name': 'active'
            });
            // unset collapse state in all section title
            switchClass({
               'remove_to_selector': `${this.UI.pluginsContainer} > *`,
               'class_name': 'collapse'
            });
            // expand collapsed section
            switchClass({
               'remove_to_selector': `${this.UI.pluginsContainer} li.item`,
               'class_name': 'hide'
            });
            this.openTab('tab-plugins');
         });

      // group spoiler
      if (document.body.clientWidth < 350) { // in popup
         document.querySelectorAll(this.UI.pluginsContainer + '> ul')
            .forEach(ul => ul.addEventListener('click', ({ target }) => {
               target.classList.toggle("collapse")
               target.querySelectorAll("li.item").forEach(li => li.classList.toggle("hide"));
            }));
      }

      // export setting
      document.getElementById('settings_export')
         ?.addEventListener('click', () => {
            Storage.getParams(user_settings => {
               let d = document.createElement('a');
               d.style.display = 'none';
               d.setAttribute('download', 'nova-settings.json');
               d.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(user_settings)));
               document.body.appendChild(d);
               d.click();
               console.debug('Settings file exported:', d.download);
               document.body.removeChild(d);
            }, this.storageMethod);
         });

      // import setting
      document.getElementById('settings_import')
         ?.addEventListener('click', () => {
            if (document.body.clientWidth < 350) { // in popup
               // if (confirm(i18n('opt_import_popup'))) chrome.runtime.openOptionsPage();
               if (confirm(i18n('opt_prompt_import_settings'))) {
                  // chrome.runtime.openOptionsPage();
                  const urlOptionsPage = new URL(chrome.extension.getURL(chrome.runtime.getManifest().options_page));
                  urlOptionsPage.searchParams.set('tabs', 'tab-other');
                  window.open(urlOptionsPage.href);
               }
               return;
            }
            let f = document.createElement('input');
            f.type = 'file';
            f.accept = 'application/JSON';
            f.style.display = 'none';
            f.addEventListener('change', ({ target }) => {
               if (f.files.length !== 1) return;
               let rdr = new FileReader();
               rdr.addEventListener('load', () => {
                  try {
                     Storage.setParams(JSON.parse(rdr.result), this.storageMethod);
                     alert(i18n('opt_alert_import_successfully'));
                     // document.location.reload();
                     this.openTab('tab-plugins', 'reset_page');
                  }
                  catch (err) { alert('Error parsing settings\n' + err.name + ": " + err.message); }
               });
               rdr.addEventListener('error', error => alert('Error loading file\n' + rdr.error));
               rdr.readAsText(target.files[0]);
            });
            document.body.appendChild(f);
            f.click();
            document.body.removeChild(f);
         });

      // reset setting
      document.getElementById('settings_reset')
         ?.addEventListener('click', () => {
            if (confirm(i18n('opt_prompt_reset_settings'))) {
               Storage.setParams(null, this.storageMethod);
               // document.location.reload();
               this.openTab('tab-plugins', 'reset_page');
            }
         });

      function switchClass({ remove_to_selector, add_to_selector, class_name = required() }) {
         // console.debug('switchClass:', ...arguments);
         // hide all
         if (remove_to_selector) document.querySelectorAll(remove_to_selector).forEach(i => i.classList.remove(class_name));
         // target show
         if (add_to_selector) document.querySelectorAll(add_to_selector).forEach(i => i.classList.add(class_name));
      }
   },

   init() {
      this.generate.list.apply(this, [window.nova_plugins]);
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


window.addEventListener('load', () => {
   // search bar
   ["change", "keyup"].forEach(evt => {
      document.querySelector('[type="search"]')
         .addEventListener(evt, function () {
            const generatelist = document.querySelector(Opt.UI.pluginsContainer);
            searchFilter({
               'keyword': this.value,
               // 'container': generatelist.children,
               // https://stackoverflow.com/questions/18247289/what-is-the-difference-between-queryselectorall-and-getelementsbytagname
               'container': generatelist.getElementsByTagName('li'),
               // 'container': generatelist.querySelectorAll('li.item'),
               'filter_el': 'label'
            });
         });
   });

   Opt.init();

   Storage.getParams(store => {
      // tab selector
      if (tabId = new URLSearchParams(location.search).get('tabs')) Opt.openTab(tabId);
      // remove api warn if has api
      if (store && store['custom-api-key']) {
         document.querySelectorAll('.info b').forEach(el => el.parentNode.removeChild(el));
      }
   }, Opt.storageMethod);

   function searchFilter({ keyword, container, filter_el }) {
      // console.debug('searchFilter:', ...arguments);
      for (const item of container) {
         const
            text = item.textContent,
            found = text.toLowerCase().includes(keyword.toLowerCase()),
            highlight = el => {
               el.innerHTML = el.innerHTML.replace(/<\/?mark[^>]*>/g, ''); // clear highlight tags
               if (found && keyword.toString().trim()) {
                  highlightSearchTerm({
                     'target': el,
                     'keyword': keyword,
                     // 'highlightClass':,
                  });
               }
            };

         // hide el in which are not present
         item.style.display = found ? '' : 'none';
         filter_el && item.querySelectorAll(filter_el).forEach(highlight);
      }

      function highlightSearchTerm({ target, keyword = required(), highlightClass }) {
         const
            content = target.innerHTML,
            pattern = new RegExp('(>[^<.]*)?(' + keyword + ')([^<.]*)?', 'gi'),
            replaceWith = '$1<mark ' + (highlightClass ? 'class="' + highlightClass + '"' : 'style="background-color:#afafaf"') + '>$2</mark>$3',
            marked = content.replace(pattern, replaceWith);

         return (target.innerHTML = marked) !== content;
      }
   }
});
